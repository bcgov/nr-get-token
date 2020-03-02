const helper = require('../../common/helper');
const hello = require('../../../src/components/hello');

helper.logHelper();

describe('getHello', () => {
  it('should return a string', () => {
    const result = hello.getHello();

    expect(result).toBeTruthy();
    expect(result).toMatch('Hello World!');
  });
});
