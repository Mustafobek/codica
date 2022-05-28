import { green, blue, yellow, red } from 'chalk';

class Logger {
  constructor() {}

  errorLog(...args: unknown[]): void {
    console.log(red(`[ERROR] ${args}`));
  }

  warningLog(...args: unknown[]): void {
    console.log(yellow(`[WARNING] ${args}`))
  }

  successLog(...args: unknown[]): void {
    console.log(green(`[SUCCESS] ${args}`))
  }

  infoLog(...args: unknown[]): void {
    console.log(blue(`[INFO] ${args}`))
  }
}

export default new Logger()