const config = require('config');
const log = require('npmlog');

const permissionHelpers = require('../../../src/components/permissionHelpers');

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
  it('should return no error when user has permission for acronym', async () => {
    // Token has a WORG scope
    const result = permissionHelpers.checkAcronymPermission(sampleToken, 'WORG');
    expect(result).toBeUndefined();
  });

  it('should return an error when user does not have permission for acronym', async () => {
    // oken has no scope for ABCD
    const result = permissionHelpers.checkAcronymPermission(sampleToken, 'ABCD');
    expect(result).toEqual('User lacks permission for \'ABCD\' acronym');
  });

  it('should return an error when user has no acronym permissions', async () => {
    // Token has no roles
    const tokenCopy = JSON.parse(JSON.stringify(sampleToken));
    tokenCopy.realm_access.roles = [];
    const result = permissionHelpers.checkAcronymPermission(tokenCopy, 'WORG');
    expect(result).toEqual('User lacks permission for \'WORG\' acronym');
  });

  it('should return an error when the token has a non-array roles', async () => {
    // Token has no roles
    const tokenCopy = JSON.parse(JSON.stringify(sampleToken));
    tokenCopy.realm_access.roles = 'SOMETHING_WRONG';
    const result = permissionHelpers.checkAcronymPermission(tokenCopy, 'WORG');
    expect(result).toEqual('User lacks permission for \'WORG\' acronym');
  });
});

describe('checkWebAdePostPermissions', () => {
  it('should return no error when user has permission for acrony and acronym is allowed', async () => {
    // ConfigForm is for WORG, and token has a WORG scope, acronym WORG has true for webade
    const result = permissionHelpers.checkWebAdePostPermissions(sampleToken, configForm, acronymDetail);
    expect(result).toBeUndefined();
  });

  it('should return no error when user has both special scopes', async () => {
    // ConfigForm is for WORG, and token has a WORG scope, acronym WORG has true for webade
    const tokenCopy = JSON.parse(JSON.stringify(sampleToken));
    tokenCopy.realm_access.roles.push(...['WEBADE_PERMISSION', 'WEBADE_PERMISSION_NROS_DMS']);
    const result = permissionHelpers.checkWebAdePostPermissions(tokenCopy, configForm, acronymDetail, ['WEBADE_PERMISSION', 'WEBADE_PERMISSION_NROS_DMS']);
    expect(result).toBeUndefined();
  });

  it('should return an error when user does not have permission for acronym', async () => {
    // ConfigForm is for ABCD, and token has no scope for that
    const cfgCopy = JSON.parse(JSON.stringify(configForm));
    cfgCopy.applicationAcronym = 'ABCD';
    const result = permissionHelpers.checkWebAdePostPermissions(sampleToken, cfgCopy, acronymDetail);
    expect(result).toEqual('User lacks permission for \'ABCD\' acronym');
  });

  it('should return an error when user has no acronym permissions', async () => {
    // ConfigForm is for ABCD, and token has no scope for that
    const tokenCopy = JSON.parse(JSON.stringify(sampleToken));
    tokenCopy.realm_access.roles = [];
    const result = permissionHelpers.checkWebAdePostPermissions(tokenCopy, configForm, acronymDetail);
    expect(result).toEqual('User lacks permission for \'WORG\' acronym');
  });

  it('should return no error when user lacks a desired scope', async () => {
    // Token is missing WEBADE_PERMISSION_NROS_DMS, and that is required for this operation
    const tokenCopy = JSON.parse(JSON.stringify(sampleToken));
    tokenCopy.realm_access.roles.push('WEBADE_PERMISSION');
    const result = permissionHelpers.checkWebAdePostPermissions(tokenCopy, configForm, acronymDetail, ['WEBADE_PERMISSION', 'WEBADE_PERMISSION_NROS_DMS']);
    expect(result).toEqual('User is not permitted to submit WebADE config, missing role WEBADE_PERMISSION_NROS_DMS');
  });

  it('should return an error when acronym is not allowed to use webADE', async () => {
    // Set acronym detail to not allow webade
    const adCopy = JSON.parse(JSON.stringify(acronymDetail));
    adCopy.permissionWebade = false;
    const result = permissionHelpers.checkWebAdePostPermissions(sampleToken, configForm, adCopy);
    expect(result).toEqual('Acronym \'WORG\' is not permitted to submit WebADE configs');
  });

  it('should return an error when acronym is not allowed to do special NROS DMS', () => {
    // Set acronym detail to not allow webade
    const tokenCopy = JSON.parse(JSON.stringify(sampleToken));
    tokenCopy.realm_access.roles.push(...['WEBADE_PERMISSION', 'WEBADE_PERMISSION_NROS_DMS']);
    const adCopy = JSON.parse(JSON.stringify(acronymDetail));
    adCopy.permissionWebadeNrosDms = false;
    const result = permissionHelpers.checkWebAdePostPermissions(tokenCopy, configForm, adCopy, ['WEBADE_PERMISSION', 'WEBADE_PERMISSION_NROS_DMS']);
    expect(result).toEqual('Acronym \'WORG\' is not permitted special access to NROS DMS');
  });

  it('should return a generic error when an error occurs checking', async () => {
    const result = permissionHelpers.checkWebAdePostPermissions(sampleToken, configForm, undefined);
    expect(result).toEqual('Failed to determine permission for WebADE access');
  });
});
