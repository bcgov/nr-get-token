const helper = require('../../common/helper');
const permissionHelpers = require('../../../src/components/permissionHelpers');
const { userService } = require('../../../src/services');

helper.logHelper();

describe('checkAcronymPermission', () => {
  const spy = jest.fn();

  beforeAll(() => {
    userService.userAcronymList = spy;
  });

  beforeEach(() => {
    spy.mockReset();
  });

  it('should return undefined when user has permission for acronym', async () => {
    spy.mockResolvedValue(['MSSC', 'WORG']);
    const result = permissionHelpers.checkAcronymPermission('333604a0-b527-4afb-a04e-5e4ebf06ce9c', 'WORG');
    expect(result).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should return an error string when user does not have permission for acronym', async () => {
    spy.mockResolvedValue(['MSSC', 'WORG']);
    const result = permissionHelpers.checkAcronymPermission('333604a0-b527-4afb-a04e-5e4ebf06ce9c', 'ABCD');
    expect(result).resolves.toEqual('User lacks permission for \'ABCD\' acronym');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should return an error string when user has no acronym permissions', async () => {
    spy.mockResolvedValue([]);
    const result = permissionHelpers.checkAcronymPermission('333604a0-b527-4afb-a04e-5e4ebf06ce9c', 'WORG');
    expect(result).resolves.toEqual('User lacks permission for \'WORG\' acronym');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
