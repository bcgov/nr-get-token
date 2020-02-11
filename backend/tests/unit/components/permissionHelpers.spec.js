const config = require('config');
const log = require('npmlog');

const permissionHelpers = require('../../../src/components/permissionHelpers');
const { userService } = require('../../../src/services');

const acronymDetail = require('./fixtures/acronymDetail.json');
const configForm = require('./fixtures/configForm.json');
const sampleToken = require('./fixtures/token.json');

log.level = config.get('server.logLevel');

describe('filterAppAcronymRoles', () => {
  it('should return the filtered acronym list', () => {
    const roles = ['offline_access', 'uma_authorization', 'WEBADE_CFG_READ', 'WEBADE_CFG_READ_ALL', 'DOMO', 'MSSC'];
    const result = permissionHelpers.filterAppAcronymRoles(roles);

    expect(result).toBeTruthy();
    expect(result).toHaveLength(2);
  });

  it('should handle an empty array', () => {
    const roles = [];
    const result = permissionHelpers.filterAppAcronymRoles(roles);
    expect(result).toBeTruthy();
    expect(result).toHaveLength(0);
  });
});

describe('checkAcronymPermission', () => {
  const spy = jest.fn();

  beforeAll(() => {
    userService.getUserAcronymList = spy;
  });

  afterEach(() => {
    spy.mockReset();
  });

  it('should return undefined when user has permission for acronym', () => {
    spy.mockResolvedValue(['MSSC', 'WORG']);
    const result = permissionHelpers.checkAcronymPermission(sampleToken, 'WORG');
    expect(result).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should return an error string when user does not have permission for acronym', () => {
    spy.mockResolvedValue(['MSSC', 'WORG']);
    const result = permissionHelpers.checkAcronymPermission(sampleToken, 'ABCD');
    expect(result).resolves.toEqual('User lacks permission for \'ABCD\' acronym');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should return an error string when user has no acronym permissions', () => {
    spy.mockResolvedValue([]);
    const result = permissionHelpers.checkAcronymPermission(sampleToken, 'WORG');
    expect(result).resolves.toEqual('User lacks permission for \'WORG\' acronym');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('checkWebAdePostPermissions', () => {
  const spy = jest.spyOn(permissionHelpers, 'checkAcronymPermission');

  beforeEach(() => {
    spy.mockReset();
  });

  afterAll(() => {
    spy.mockRestore();
  });

  it('should return undefined when user has permission for acronym and acronym is allowed', () => {
    // ConfigForm is for WORG, and token has a WORG scope, acronym WORG has true for webade
    spy.mockResolvedValue(undefined);

    const result = permissionHelpers.checkWebAdePostPermissions(sampleToken, configForm, acronymDetail);

    expect(result).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should return no error when user has both special scopes', () => {
    // ConfigForm is for WORG, and token has a WORG scope, acronym WORG has true for webade
    spy.mockResolvedValue(undefined);
    const tokenCopy = JSON.parse(JSON.stringify(sampleToken));
    tokenCopy.realm_access.roles.push(...['WEBADE_PERMISSION', 'WEBADE_PERMISSION_NROS_DMS']);

    const result = permissionHelpers.checkWebAdePostPermissions(tokenCopy, configForm, acronymDetail, ['WEBADE_PERMISSION', 'WEBADE_PERMISSION_NROS_DMS']);
    expect(result).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should return an error when user does not have permission for acronym', () => {
    // ConfigForm is for ABCD, and token has no scope for that
    spy.mockResolvedValue('User lacks permission for \'ABCD\' acronym');
    const cfgCopy = JSON.parse(JSON.stringify(configForm));
    cfgCopy.applicationAcronym = 'ABCD';

    const result = permissionHelpers.checkWebAdePostPermissions(sampleToken, cfgCopy, acronymDetail);

    expect(result).resolves.toEqual('User lacks permission for \'ABCD\' acronym');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should return an error when user has no acronym permissions', () => {
    // ConfigForm is for ABCD, and token has no scope for that
    spy.mockResolvedValue('User lacks permission for \'WORG\' acronym');
    const tokenCopy = JSON.parse(JSON.stringify(sampleToken));
    tokenCopy.realm_access.roles = [];

    const result = permissionHelpers.checkWebAdePostPermissions(tokenCopy, configForm, acronymDetail);

    expect(result).resolves.toEqual('User lacks permission for \'WORG\' acronym');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should return no error when user lacks a desired scope', () => {
    // Token is missing WEBADE_PERMISSION_NROS_DMS, and that is required for this operation
    spy.mockResolvedValue(undefined);
    const tokenCopy = JSON.parse(JSON.stringify(sampleToken));
    tokenCopy.realm_access.roles.push('WEBADE_PERMISSION');

    const result = permissionHelpers.checkWebAdePostPermissions(tokenCopy, configForm, acronymDetail, ['WEBADE_PERMISSION', 'WEBADE_PERMISSION_NROS_DMS']);

    expect(result).resolves.toEqual('User is not permitted to submit WebADE config, missing role WEBADE_PERMISSION_NROS_DMS');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should return an error when acronym is not allowed to use webADE', () => {
    // Set acronym detail to not allow webade
    spy.mockResolvedValue(undefined);
    const adCopy = JSON.parse(JSON.stringify(acronymDetail));
    adCopy.permissionWebade = false;

    const result = permissionHelpers.checkWebAdePostPermissions(sampleToken, configForm, adCopy);

    expect(result).resolves.toEqual('Acronym \'WORG\' is not permitted to submit WebADE configs');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should return an error when acronym is not allowed to do special NROS DMS', () => {
    // Set acronym detail to not allow webade
    spy.mockResolvedValue(undefined);
    const tokenCopy = JSON.parse(JSON.stringify(sampleToken));
    tokenCopy.realm_access.roles.push(...['WEBADE_PERMISSION', 'WEBADE_PERMISSION_NROS_DMS']);
    const adCopy = JSON.parse(JSON.stringify(acronymDetail));
    adCopy.permissionWebadeNrosDms = false;

    const result = permissionHelpers.checkWebAdePostPermissions(tokenCopy, configForm, adCopy, ['WEBADE_PERMISSION', 'WEBADE_PERMISSION_NROS_DMS']);

    expect(result).resolves.toEqual('Acronym \'WORG\' is not permitted special access to NROS DMS');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should return a generic error when an error occurs during checking', () => {
    spy.mockImplementation(() => { throw new Error('bad'); });

    const result = permissionHelpers.checkWebAdePostPermissions(sampleToken, configForm, undefined);

    expect(result).resolves.toEqual('Failed to determine permission for WebADE access');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
