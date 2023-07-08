import 'dotenv/config';
import PushRuleError from './push-rule-error';

describe('PushRuleError', () => {
  it('should construct with default cause description when no cause is provided', () => {
    const error = new PushRuleError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.cause.description).toBe('');
  });

  it('should construct with provided cause description when cause is provided', () => {
    const error = new PushRuleError('Test error', { description: 'Test cause' });
    expect(error.message).toBe('Test error');
    expect(error.cause.description).toBe('Test cause');
  });

  it('should preserve the prototype chain', () => {
    const error = new PushRuleError('Test error');
    expect(error).toBeInstanceOf(Error);
  });
});
