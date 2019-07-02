const utils = require('../../../src/components/utils');

describe('prettyStringify', () => {
  it('should return a formatted json string with 2 space indent', () => {
    const obj = { foo: 'bar' };
    const result = utils.prettyStringify(obj);

    expect(result).toBeTruthy();
    expect(result).toEqual(`{
  "foo": "bar"
}`);
  });
});

describe('toPascalCase', () => {
  it('should return a string', () => {
    const string = 'test';
    const result = utils.toPascalCase(string);

    expect(result).toBeTruthy();
    expect(result).toMatch('Test');
  });
});
