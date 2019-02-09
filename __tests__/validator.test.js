const ValidationError = require('../src/validator');

describe('Validator', () => {
  test('should correctly validate url', () => {
    const url = 'https://www.google.es';
    const result = ValidationError.validateUrl(url);
    expect(result).toBe(url);
  });
  test('should throw an error on invalid url', () => {
    const url = 'https:// www.google.es';
    const result = () => ValidationError.validateUrl(url);
    expect(result).toThrow();
  });
});
