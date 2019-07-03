const crypto = require('crypto');
const cryptico = require('cryptico-js');
const utils = require('../../../src/components/utils');

describe('generateEncryptPassword', () => {
  const uniqueSeed = crypto.randomBytes(20).toString('hex');
  const pubKey = cryptico.generateRSAKey(uniqueSeed, 1024);
  const pubKeyString = cryptico.publicKeyString(pubKey);

  it('should generate a password of a specified length', () => {
    const result = utils.generateEncryptPassword(pubKeyString, 15);

    expect(result.password).toBeTruthy();
    expect(result.password).toHaveLength(15);
  });

  it('should yield a valid value encrypted by a key', () => {
    const result = utils.generateEncryptPassword(pubKeyString);
    const decrypted = cryptico.decrypt(result.encryptedPassword, pubKey);

    expect(result.password).toBeTruthy();
    expect(result.encryptedPassword).toBeTruthy();
    expect(decrypted.plaintext).toEqual(result.password);
  });
});

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
    const string = 'test foo bar';
    const result = utils.toPascalCase(string);

    expect(result).toBeTruthy();
    expect(result).toMatch(/[A-Z][a-z]+(?:[A-Z][a-z]+)*/);
  });
});
