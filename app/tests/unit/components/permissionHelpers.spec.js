const helper = require('../../common/helper');
const permissionHelpers = require('../../../src/components/permissionHelpers');
const { userService } = require('../../../src/services');

helper.logHelper();

describe('checkAcronymPermission', () => {
  const userAcronymListSpy = jest.spyOn(userService, 'userAcronymList');
  const mapHelper = arr => arr.map(a => ({ acronym: a }));

  beforeEach(() => {
    userAcronymListSpy.mockReset();
  });

  it('should return undefined when user has permission for acronym', async () => {
    userAcronymListSpy.mockResolvedValue(mapHelper(['MSSC', 'WORG']));
    const result = await permissionHelpers.checkAcronymPermission('333604a0-b527-4afb-a04e-5e4ebf06ce9c', 'WORG');
    expect(result).toBeUndefined();
    expect(userAcronymListSpy).toHaveBeenCalledTimes(1);
  });

  it('should return an error string when user does not have permission for acronym', async () => {
    userAcronymListSpy.mockResolvedValue(mapHelper(['MSSC', 'WORG']));
    const result = await permissionHelpers.checkAcronymPermission('333604a0-b527-4afb-a04e-5e4ebf06ce9c', 'ABCD');
    expect(result).toEqual('User lacks permission for \'ABCD\' acronym');
    expect(userAcronymListSpy).toHaveBeenCalledTimes(1);
  });

  it('should return an error string when user has no acronym permissions', async () => {
    userAcronymListSpy.mockResolvedValue([]);
    const result = await permissionHelpers.checkAcronymPermission('333604a0-b527-4afb-a04e-5e4ebf06ce9c', 'WORG');
    expect(result).toEqual('User lacks permission for \'WORG\' acronym');
    expect(userAcronymListSpy).toHaveBeenCalledTimes(1);
  });
});
