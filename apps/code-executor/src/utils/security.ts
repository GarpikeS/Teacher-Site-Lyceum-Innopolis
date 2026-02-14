/**
 * Security patterns to block dangerous code execution
 */

const PYTHON_FORBIDDEN_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /import\s+os\b/, reason: 'os module is forbidden' },
  { pattern: /from\s+os\s+import/, reason: 'os module is forbidden' },
  { pattern: /import\s+subprocess/, reason: 'subprocess module is forbidden' },
  { pattern: /from\s+subprocess\s+import/, reason: 'subprocess module is forbidden' },
  { pattern: /import\s+shutil/, reason: 'shutil module is forbidden' },
  { pattern: /import\s+socket/, reason: 'socket module is forbidden' },
  { pattern: /import\s+http/, reason: 'http module is forbidden' },
  { pattern: /import\s+urllib/, reason: 'urllib module is forbidden' },
  { pattern: /import\s+requests/, reason: 'requests module is forbidden' },
  { pattern: /import\s+ctypes/, reason: 'ctypes module is forbidden' },
  { pattern: /import\s+signal/, reason: 'signal module is forbidden' },
  { pattern: /\beval\s*\(/, reason: 'eval() is forbidden' },
  { pattern: /\bexec\s*\(/, reason: 'exec() is forbidden' },
  { pattern: /\bcompile\s*\(/, reason: 'compile() is forbidden' },
  { pattern: /\b__import__\s*\(/, reason: '__import__() is forbidden' },
  { pattern: /\bopen\s*\(/, reason: 'open() is forbidden for file operations' },
  { pattern: /\bglobals\s*\(/, reason: 'globals() is forbidden' },
  { pattern: /\bgetattr\s*\(/, reason: 'getattr() is forbidden' },
];

const CPP_FORBIDDEN_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /#include\s*<fstream>/, reason: 'fstream is forbidden' },
  { pattern: /#include\s*<filesystem>/, reason: 'filesystem is forbidden' },
  { pattern: /\bsystem\s*\(/, reason: 'system() is forbidden' },
  { pattern: /\bpopen\s*\(/, reason: 'popen() is forbidden' },
  { pattern: /\bexecl?\s*\(/, reason: 'exec() is forbidden' },
  { pattern: /\bfork\s*\(/, reason: 'fork() is forbidden' },
  { pattern: /#include\s*<sys\/socket\.h>/, reason: 'sockets are forbidden' },
  { pattern: /#include\s*<netinet/, reason: 'network includes are forbidden' },
  { pattern: /#include\s*<arpa/, reason: 'network includes are forbidden' },
  { pattern: /\basm\s*\(/, reason: 'inline assembly is forbidden' },
  { pattern: /__asm__/, reason: 'inline assembly is forbidden' },
];

export interface SecurityCheckResult {
  safe: boolean;
  violations: string[];
}

export function validatePythonCode(code: string): SecurityCheckResult {
  const violations: string[] = [];

  for (const { pattern, reason } of PYTHON_FORBIDDEN_PATTERNS) {
    if (pattern.test(code)) {
      violations.push(reason);
    }
  }

  return {
    safe: violations.length === 0,
    violations,
  };
}

export function validateCppCode(code: string): SecurityCheckResult {
  const violations: string[] = [];

  for (const { pattern, reason } of CPP_FORBIDDEN_PATTERNS) {
    if (pattern.test(code)) {
      violations.push(reason);
    }
  }

  return {
    safe: violations.length === 0,
    violations,
  };
}

export function validateCode(code: string, language: 'python' | 'cpp'): SecurityCheckResult {
  if (language === 'python') {
    return validatePythonCode(code);
  }
  return validateCppCode(code);
}
