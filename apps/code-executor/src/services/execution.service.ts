import { validateCode, SecurityCheckResult } from '../utils/security';
import { executePython, executeCpp, SandboxResult } from './docker-sandbox';
import { logger } from '../utils/logger';

export interface ExecutionRequest {
  code: string;
  language: 'python' | 'cpp';
  input?: string;
  testCases?: TestCase[];
}

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
}

export interface TestCaseResult {
  testId: number;
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  executionTime: number;
  error?: string;
}

export interface ExecutionResponse {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime: number;
  memoryUsed: number;
  error?: string;
}

export interface TestExecutionResponse {
  passedTests: number;
  totalTests: number;
  details: TestCaseResult[];
  totalExecutionTime: number;
  error?: string;
}

/**
 * Execute code without test cases (simple run)
 */
export async function executeCode(request: ExecutionRequest): Promise<ExecutionResponse> {
  const { code, language, input } = request;

  // Security validation
  const securityCheck: SecurityCheckResult = validateCode(code, language);
  if (!securityCheck.safe) {
    return {
      stdout: '',
      stderr: `Security violation: ${securityCheck.violations.join(', ')}`,
      exitCode: 1,
      executionTime: 0,
      memoryUsed: 0,
      error: 'SECURITY_VIOLATION',
    };
  }

  logger.info(`Executing ${language} code (${code.length} chars)`);

  let result: SandboxResult;

  if (language === 'python') {
    result = await executePython(code, input);
  } else {
    result = await executeCpp(code, input);
  }

  if (result.timedOut) {
    return {
      stdout: result.stdout,
      stderr: 'Time limit exceeded',
      exitCode: 124,
      executionTime: result.executionTime,
      memoryUsed: result.memoryUsed,
      error: 'TIME_LIMIT_EXCEEDED',
    };
  }

  return {
    stdout: result.stdout,
    stderr: result.stderr,
    exitCode: result.exitCode,
    executionTime: result.executionTime,
    memoryUsed: result.memoryUsed,
  };
}

/**
 * Execute code against test cases
 */
export async function executeWithTests(request: ExecutionRequest): Promise<TestExecutionResponse> {
  const { code, language, testCases } = request;

  if (!testCases || testCases.length === 0) {
    return {
      passedTests: 0,
      totalTests: 0,
      details: [],
      totalExecutionTime: 0,
      error: 'No test cases provided',
    };
  }

  // Security validation
  const securityCheck: SecurityCheckResult = validateCode(code, language);
  if (!securityCheck.safe) {
    return {
      passedTests: 0,
      totalTests: testCases.length,
      details: testCases.map(tc => ({
        testId: tc.id,
        passed: false,
        actualOutput: '',
        expectedOutput: tc.expectedOutput,
        executionTime: 0,
        error: `Security violation: ${securityCheck.violations.join(', ')}`,
      })),
      totalExecutionTime: 0,
      error: 'SECURITY_VIOLATION',
    };
  }

  logger.info(`Executing ${language} code against ${testCases.length} test cases`);

  const details: TestCaseResult[] = [];
  let totalExecutionTime = 0;

  for (const testCase of testCases) {
    let result: SandboxResult;

    if (language === 'python') {
      result = await executePython(code, testCase.input);
    } else {
      result = await executeCpp(code, testCase.input);
    }

    totalExecutionTime += result.executionTime;

    const actualOutput = result.stdout.trim();
    const expectedOutput = testCase.expectedOutput.trim();
    const passed = !result.timedOut && result.exitCode === 0 && actualOutput === expectedOutput;

    let error: string | undefined;
    if (result.timedOut) {
      error = 'Time limit exceeded';
    } else if (result.exitCode !== 0) {
      error = result.stderr || 'Runtime error';
    }

    details.push({
      testId: testCase.id,
      passed,
      actualOutput,
      expectedOutput,
      executionTime: result.executionTime,
      error,
    });
  }

  const passedTests = details.filter(d => d.passed).length;

  return {
    passedTests,
    totalTests: testCases.length,
    details,
    totalExecutionTime,
  };
}
