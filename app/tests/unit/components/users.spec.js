const uuid = require('uuid');

const helper = require('../../common/helper');
const users = require('../../../src/components/users');
const { userService } = require('../../../src/services');

helper.logHelper();

const zeroUuid = '00000000-0000-0000-0000-000000000000';
const randUuid = uuid();

describe('getUserAcronyms', () => {
  const findSpy = jest.spyOn(userService, 'find');
  const userAcronymListSpy = jest.spyOn(userService, 'userAcronymList');

  beforeEach(() => {
    findSpy.mockReset();
    userAcronymListSpy.mockClear();
  });

  it('should return null when user is not found', async () => {
    findSpy.mockResolvedValue(null);

    const result = await users.getUserAcronyms(zeroUuid);

    expect(result).toBeNull();
    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(findSpy).toHaveBeenCalledWith(zeroUuid);
    expect(userAcronymListSpy).toHaveBeenCalledTimes(0);
  });

  it('should return empty array when no acronyms are found', async () => {
    findSpy.mockResolvedValue({});
    userAcronymListSpy.mockResolvedValue(null);

    const result = await users.getUserAcronyms(randUuid);

    expect(result).toBeTruthy();
    expect(result).toEqual(expect.any(Array));
    expect(result).toHaveLength(0);
    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(findSpy).toHaveBeenCalledWith(randUuid);
    expect(userAcronymListSpy).toHaveBeenCalledTimes(1);
    expect(userAcronymListSpy).toHaveBeenCalledWith(randUuid);
  });

  it('should return an array of acronyms', async () => {
    findSpy.mockResolvedValue({});
    userAcronymListSpy.mockResolvedValue([{ acronym: 'TEST', owner: false }]);

    const result = await users.getUserAcronyms(randUuid);

    expect(result).toBeTruthy();
    expect(result).toEqual(expect.any(Array));
    expect(result).toHaveLength(1);
    expect(result[0].acronym).toBe('TEST');
    expect(result[0].owner).toBeFalsy();
    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(findSpy).toHaveBeenCalledWith(randUuid);
    expect(userAcronymListSpy).toHaveBeenCalledTimes(1);
    expect(userAcronymListSpy).toHaveBeenCalledWith(randUuid);
  });
});
