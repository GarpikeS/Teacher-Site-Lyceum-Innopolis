import Docker from 'dockerode';
import { Readable } from 'stream';
import { config } from '../config/environment';
import { logger } from '../utils/logger';

export interface SandboxResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime: number;
  memoryUsed: number;
  timedOut: boolean;
}

const docker = new Docker();

/**
 * Collects output from a Docker container stream
 */
async function collectOutput(stream: NodeJS.ReadableStream): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    // Docker demux: the stream contains multiplexed stdout/stderr
    // Each frame: [type(1), 0(3), size(4), payload(size)]
    const chunks: Buffer[] = [];

    stream.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    stream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      let offset = 0;

      while (offset < buffer.length) {
        if (offset + 8 > buffer.length) break;

        const type = buffer.readUInt8(offset);
        const size = buffer.readUInt32BE(offset + 4);

        if (offset + 8 + size > buffer.length) break;

        const payload = buffer.slice(offset + 8, offset + 8 + size).toString('utf-8');

        if (type === 1) {
          stdout += payload;
        } else if (type === 2) {
          stderr += payload;
        }

        offset += 8 + size;
      }

      resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
    });

    stream.on('error', reject);
  });
}

/**
 * Execute code in a Docker sandbox container
 */
export async function runInSandbox(
  image: string,
  command: string[],
  input: string | undefined,
  timeoutMs: number,
  memoryMb: number
): Promise<SandboxResult> {
  const startTime = Date.now();
  let container: Docker.Container | null = null;
  let timedOut = false;

  try {
    container = await docker.createContainer({
      Image: image,
      Cmd: command,
      WorkingDir: '/sandbox',
      NetworkDisabled: config.docker.networkDisabled,
      HostConfig: {
        Memory: memoryMb * 1024 * 1024,
        MemorySwap: memoryMb * 1024 * 1024, // no swap
        CpuPeriod: 100000,
        CpuQuota: config.sandbox.cpuPercent * 1000,
        PidsLimit: 50,
        ReadonlyRootfs: false, // need /tmp for compilation
        SecurityOpt: ['no-new-privileges'],
      },
      AttachStdin: !!input,
      AttachStdout: true,
      AttachStderr: true,
      OpenStdin: !!input,
      StdinOnce: true,
      Tty: false,
    });

    const stream = await container.attach({
      stream: true,
      stdout: true,
      stderr: true,
      stdin: !!input,
    });

    // Send stdin if provided
    if (input && stream) {
      const stdinStream = stream as NodeJS.WritableStream;
      stdinStream.write(input);
      stdinStream.end();
    }

    await container.start();

    // Set up timeout
    const timeoutPromise = new Promise<{ StatusCode: number }>((resolve) => {
      setTimeout(async () => {
        timedOut = true;
        try {
          if (container) {
            await container.kill();
          }
        } catch {
          // Container may already be stopped
        }
        resolve({ StatusCode: 124 }); // 124 = timeout exit code
      }, timeoutMs);
    });

    const waitPromise = container.wait();
    const result = await Promise.race([waitPromise, timeoutPromise]);

    const output = await collectOutput(stream);
    const executionTime = Date.now() - startTime;

    // Get memory stats
    let memoryUsed = 0;
    try {
      const stats = await container.stats({ stream: false }) as any;
      memoryUsed = Math.round((stats?.memory_stats?.max_usage || 0) / (1024 * 1024));
    } catch {
      // Stats may not be available after container stops
    }

    return {
      stdout: output.stdout.substring(0, 50000), // limit output size
      stderr: output.stderr.substring(0, 10000),
      exitCode: result.StatusCode,
      executionTime,
      memoryUsed,
      timedOut,
    };
  } catch (error: any) {
    const executionTime = Date.now() - startTime;
    logger.error('Sandbox execution error:', error);

    return {
      stdout: '',
      stderr: error.message || 'Internal sandbox error',
      exitCode: 1,
      executionTime,
      memoryUsed: 0,
      timedOut: false,
    };
  } finally {
    if (container) {
      try {
        await container.remove({ force: true });
      } catch {
        // Ignore cleanup errors
      }
    }
  }
}

/**
 * Execute Python code in sandbox
 */
export async function executePython(
  code: string,
  input?: string
): Promise<SandboxResult> {
  const { timeoutMs, memoryMb } = config.sandbox.python;

  return runInSandbox(
    config.docker.pythonImage,
    ['python3', '-c', code],
    input,
    timeoutMs,
    memoryMb
  );
}

/**
 * Compile and execute C++ code in sandbox
 */
export async function executeCpp(
  code: string,
  input?: string
): Promise<SandboxResult> {
  const { compileTimeoutMs, executeTimeoutMs, memoryMb } = config.sandbox.cpp;

  // Step 1: Compile
  const compileResult = await runInSandbox(
    config.docker.cppImage,
    ['sh', '-c', `echo '${code.replace(/'/g, "'\\''")}' > /tmp/main.cpp && g++ -o /tmp/main /tmp/main.cpp -std=c++17 -O2 2>&1`],
    undefined,
    compileTimeoutMs,
    memoryMb
  );

  if (compileResult.exitCode !== 0) {
    return {
      stdout: '',
      stderr: compileResult.stdout || compileResult.stderr || 'Compilation failed',
      exitCode: compileResult.exitCode,
      executionTime: compileResult.executionTime,
      memoryUsed: compileResult.memoryUsed,
      timedOut: compileResult.timedOut,
    };
  }

  // Step 2: Execute
  // We need to use a single container for compile + run
  const fullCommand = [
    'sh', '-c',
    `cat > /tmp/main.cpp << 'CPPEOF'\n${code}\nCPPEOF\ng++ -o /tmp/main /tmp/main.cpp -std=c++17 -O2 2>&1 && /tmp/main`
  ];

  return runInSandbox(
    config.docker.cppImage,
    fullCommand,
    input,
    compileTimeoutMs + executeTimeoutMs,
    memoryMb
  );
}

/**
 * Check if Docker is available and sandbox images exist
 */
export async function checkDockerHealth(): Promise<{ available: boolean; images: string[] }> {
  try {
    await docker.ping();
    const images = await docker.listImages();
    const imageNames = images
      .flatMap(img => img.RepoTags || [])
      .filter(tag =>
        tag.includes('python-sandbox') || tag.includes('cpp-sandbox')
      );

    return { available: true, images: imageNames };
  } catch (error: any) {
    logger.error('Docker health check failed:', error.message);
    return { available: false, images: [] };
  }
}
