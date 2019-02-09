const { getFilePath, getDate, chunk } = require('../src/utils');


describe('Utils', () => {
  test('should return correct path on getFilePath function', () => {
    const result = getFilePath('/', 'test');
    expect(result).toBe('/test.json');
  });

  test('should return correct date on getDate function', () => {
    const date = new Date('01-01-1970 07:14:56');
    const result = getDate(date);
    expect(typeof result).toBe('string');
    expect(result).toBe('01-01-1970-0714');
  });

  test('should return a new chunked array, and dont modify passed array.', () => {
    const expectedArrayAfterChunk = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0]];
    const emptyArray = Array(13).fill(0);
    const result = chunk(emptyArray, 2);
    expect(result.length).toBe(7);
    expect(result).toEqual(expectedArrayAfterChunk);
    expect(emptyArray).toEqual(Array(13).fill(0));
  });
});
