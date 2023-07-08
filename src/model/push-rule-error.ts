/**
 * The PushRuleError class extends the built-in Error class, and creates a new error object that represents push rule related errors.
 */
export default class PushRuleError extends Error {
  override cause: { description: string };

  /**
   * Creates a new PushRuleError.
   * @param message - The human-readable description of the error.
   * @param cause - The object detailing the cause of the push rule error.
   * @param cause.description - The description of the error cause.
   */
  constructor(message?: string, cause?: { description: string }) {
    super(message);
    this.cause = cause || { description: '' };
  }
}
