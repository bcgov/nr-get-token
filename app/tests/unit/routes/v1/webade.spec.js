const request = require('supertest');

const helper = require('../../../common/helper');

const router = require('../../../../src/routes/v1/webade');
const permissionHelpers = require('../../../../src/components/permissionHelpers');
const utils = require('../../../../src/components/utils');
const webade = require('../../../../src/components/webade');

// Simple Express Server
const basePath = '/api/v1/webade';
const keycloakAuthMock = require('../fixtures/kauth.json');
const app = helper.expressHelper(basePath, router, keycloakAuthMock);
helper.logHelper();

describe(`GET ${basePath}/:webAdeEnv/:appAcronym/appConfig`, () => {
  const webadeSpy = jest.spyOn(webade, 'getAppConfig');
  const permissionSpy = jest.spyOn(permissionHelpers, 'checkAcronymPermission');

  beforeEach(() => {
    webadeSpy.mockReset();
    permissionSpy.mockReset();
  });

  it('should yield a 422 if param validation fails', async () => {
    permissionSpy.mockResolvedValue('error');

    const response = await request(app).get(`${basePath}/DEV/XXX/appConfig`);

    expect(response.statusCode).toBe(422);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toMatch('Validation failed');
    expect(permissionSpy).toHaveBeenCalledTimes(0);
    expect(webadeSpy).toHaveBeenCalledTimes(0);
  });

  it('should yield a 403 if user has no WEBADE_CFG_READ_ALL and the permission check fails', async () => {
    const clone = JSON.parse(JSON.stringify(keycloakAuthMock));
    clone.grant.access_token.content.realm_access.roles = ['SOME_ROLE'];
    const overrideApp = helper.expressHelper(basePath, router, clone);

    permissionSpy.mockResolvedValue('error');

    const response = await request(overrideApp).get(`${basePath}/INT/XXX/appConfig`);

    expect(response.statusCode).toBe(403);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toMatch('error');
    expect(permissionSpy).toHaveBeenCalledTimes(1);
    expect(webadeSpy).toHaveBeenCalledTimes(0);
  });

  it('should return a valid response if user has no WEBADE_CFG_READ_ALL and the permission check passes', async () => {
    const clone = JSON.parse(JSON.stringify(keycloakAuthMock));
    clone.grant.access_token.content.realm_access.roles = ['SOME_ROLE'];
    const overrideApp = helper.expressHelper(basePath, router, clone);

    permissionSpy.mockResolvedValue();
    webadeSpy.mockResolvedValue({ test: '123' });

    const response = await request(overrideApp).get(`${basePath}/INT/XXX/appConfig`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body).toEqual({ test: '123' });
    expect(permissionSpy).toHaveBeenCalledTimes(1);
    expect(webadeSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a valid response if user has WEBADE_CFG_READ_ALL', async () => {
    webadeSpy.mockResolvedValue({ test: '123' });

    const response = await request(app).get(`${basePath}/INT/XXX/appConfig`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body).toEqual({ test: '123' });
    expect(permissionSpy).toHaveBeenCalledTimes(0);
    expect(webadeSpy).toHaveBeenCalledTimes(1);
  });

  it('should yield a 404 if config is not found', async () => {
    webadeSpy.mockResolvedValue(undefined);

    const response = await request(app).get(`${basePath}/INT/XXX/appConfig`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toBeTruthy();
    expect(permissionSpy).toHaveBeenCalledTimes(0);
    expect(webadeSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a 500 if the config fetch throws', async () => {
    webadeSpy.mockImplementation(() => {
      throw new Error();
    });

    const response = await request(app).get(`${basePath}/INT/XXX/appConfig`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeTruthy();
    expect(response.body.title).toEqual('Internal Server Error');
    expect(permissionSpy).toHaveBeenCalledTimes(0);
    expect(webadeSpy).toHaveBeenCalledTimes(1);
  });
});

describe(`GET ${basePath}/:webAdeEnv/appConfigs`, () => {
  const webadeSpy = jest.spyOn(webade, 'getAppConfigs');

  beforeEach(() => {
    webadeSpy.mockReset();
  });

  it('should yield a 422 if param validation fails', async () => {
    const response = await request(app).get(`${basePath}/DEV/appConfigs`);

    expect(response.statusCode).toBe(422);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toMatch('Validation failed');
    expect(webadeSpy).toHaveBeenCalledTimes(0);
  });

  it('should yield a 403 if user has no WEBADE_CFG_READ_ALL', async () => {
    const clone = JSON.parse(JSON.stringify(keycloakAuthMock));
    clone.grant.access_token.content.realm_access.roles = ['SOME_ROLE'];
    const overrideApp = helper.expressHelper(basePath, router, clone);

    const response = await request(overrideApp).get(`${basePath}/INT/appConfigs`);

    expect(response.statusCode).toBe(403);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toMatch('User lacks permission to get all app configs');
    expect(webadeSpy).toHaveBeenCalledTimes(0);
  });

  it('should yield a 403 if user has malformed roles', async () => {
    const clone = JSON.parse(JSON.stringify(keycloakAuthMock));
    clone.grant.access_token.content.realm_access.roles = 1234;
    const overrideApp = helper.expressHelper(basePath, router, clone);

    const response = await request(overrideApp).get(`${basePath}/INT/appConfigs`);

    expect(response.statusCode).toBe(403);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toMatch('User lacks permission to get all app configs');
    expect(webadeSpy).toHaveBeenCalledTimes(0);
  });

  it('should return a valid response if user has WEBADE_CFG_READ_ALL', async () => {
    webadeSpy.mockResolvedValue({ test: '123' });

    const response = await request(app).get(`${basePath}/INT/appConfigs`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body).toEqual({ test: '123' });
    expect(webadeSpy).toHaveBeenCalledTimes(1);
  });

  it('should yield a 404 if configs are not found', async () => {
    webadeSpy.mockResolvedValue(undefined);

    const response = await request(app).get(`${basePath}/INT/appConfigs`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toBeTruthy();
    expect(webadeSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a 500 if the config fetch throws', async () => {
    webadeSpy.mockImplementation(() => {
      throw new Error();
    });

    const response = await request(app).get(`${basePath}/INT/appConfigs`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeTruthy();
    expect(response.body.title).toEqual('Internal Server Error');
    expect(webadeSpy).toHaveBeenCalledTimes(1);
  });
});

describe(`POST ${basePath}/configForm`, () => {
  const permissionSpy = jest.spyOn(webade, 'getPermissionError');
  const webadeSpy = jest.spyOn(webade, 'postAppConfig');
  let body;

  beforeEach(() => {
    body = {
      passwordPublicKey: 'ABC123',
      configForm: {
        applicationAcronym: 'XXX',
        applicationName: 'X',
        applicationDescription: 'test',
        commonServices: ['cmsg', 'dms'],
        clientEnvironment: 'INT',
      }
    };
    permissionSpy.mockReset();
    webadeSpy.mockReset();
  });

  it('should yield a 422 if body validation fails', async () => {
    const clone = JSON.parse(JSON.stringify(keycloakAuthMock));
    clone.commonServices = 'wrong';
    const response = await request(app).post(`${basePath}/configForm`).send(clone);

    expect(response.statusCode).toBe(422);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toMatch('Validation failed');
    expect(permissionSpy).toHaveBeenCalledTimes(0);
    expect(webadeSpy).toHaveBeenCalledTimes(0);
  });

  it('should yield a 403 if permission validation fails', async () => {
    permissionSpy.mockResolvedValue('Validation failed');

    const response = await request(app).post(`${basePath}/configForm`).send(body);

    expect(response.statusCode).toBe(403);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toMatch('Validation failed');
    expect(permissionSpy).toHaveBeenCalledTimes(1);
    expect(webadeSpy).toHaveBeenCalledTimes(0);
  });


  it('should yield a 200 and response on success', async () => {
    permissionSpy.mockResolvedValue();
    webadeSpy.mockResolvedValue({ object: 'here' });

    const response = await request(app).post(`${basePath}/configForm`).send(body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body).toEqual({ object: 'here' });
    expect(permissionSpy).toHaveBeenCalledTimes(1);
    expect(permissionSpy).toHaveBeenCalledWith(keycloakAuthMock.grant.access_token.content, body.configForm);
    expect(webadeSpy).toHaveBeenCalledTimes(1);
    expect(webadeSpy).toHaveBeenCalledWith(body.configForm, body.passwordPublicKey, keycloakAuthMock.grant.access_token.content.sub);
  });

  it('should yield a 500 if the webade component fails', async () => {
    const errMsg = 'bad';
    permissionSpy.mockResolvedValue();
    webadeSpy.mockImplementation(() => {
      throw new Error(errMsg);
    });

    const response = await request(app).post(`${basePath}/configForm`).send(body);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toBe(errMsg);
    expect(webadeSpy).toHaveBeenCalledTimes(1);
    expect(webadeSpy).toHaveBeenCalledWith(body.configForm, body.passwordPublicKey, keycloakAuthMock.grant.access_token.content.sub);
  });
});


describe(`GET ${basePath}/:webAdeEnv/:appAcronym/dependencies`, () => {
  const permissionSpy = jest.spyOn(permissionHelpers, 'checkAcronymPermission');
  const utilsSpy = jest.spyOn(utils, 'filterWebAdeDependencies');
  const webadeSpy = jest.spyOn(webade, 'getAppConfigs');

  beforeEach(() => {
    permissionSpy.mockReset();
    utilsSpy.mockReset();
    webadeSpy.mockReset();
  });

  it('should yield a 422 if param validation fails', async () => {
    const response = await request(app).get(`${basePath}/DEV/XXX/dependencies`);

    expect(response.statusCode).toBe(422);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toMatch('Validation failed');
    expect(webadeSpy).toHaveBeenCalledTimes(0);
  });

  it('should yield a 403 if user has no WEBADE_CFG_READ_ALL and the permission check fails', async () => {
    const clone = JSON.parse(JSON.stringify(keycloakAuthMock));
    clone.grant.access_token.content.realm_access.roles = ['SOME_ROLE'];
    const overrideApp = helper.expressHelper(basePath, router, clone);

    permissionSpy.mockResolvedValue('error');

    const response = await request(overrideApp).get(`${basePath}/INT/XXX/dependencies`);

    expect(response.statusCode).toBe(403);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toMatch('error');
    expect(permissionSpy).toHaveBeenCalledTimes(1);
    expect(webadeSpy).toHaveBeenCalledTimes(0);
  });

  it('should return a valid response if user has no WEBADE_CFG_READ_ALL and the permission check passes', async () => {
    const clone = JSON.parse(JSON.stringify(keycloakAuthMock));
    clone.grant.access_token.content.realm_access.roles = ['SOME_ROLE'];
    const overrideApp = helper.expressHelper(basePath, router, clone);

    permissionSpy.mockResolvedValue();
    utilsSpy.mockReturnValue({ test: '123' });
    webadeSpy.mockResolvedValue({ test: '123', more: 567 });

    const response = await request(overrideApp).get(`${basePath}/INT/XXX/dependencies`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body).toEqual({ test: '123' });
    expect(permissionSpy).toHaveBeenCalledTimes(1);
    expect(utilsSpy).toHaveBeenCalledTimes(1);
    expect(webadeSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a valid response if user has WEBADE_CFG_READ_ALL', async () => {
    utilsSpy.mockReturnValue({ test: '123' });
    webadeSpy.mockResolvedValue({ test: '123' });

    const response = await request(app).get(`${basePath}/INT/XXX/dependencies`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body).toEqual({ test: '123' });
    expect(permissionSpy).toHaveBeenCalledTimes(0);
    expect(utilsSpy).toHaveBeenCalledTimes(1);
    expect(webadeSpy).toHaveBeenCalledTimes(1);
  });

  it('should yield a 404 if configs are not found', async () => {
    webadeSpy.mockResolvedValue(undefined);

    const response = await request(app).get(`${basePath}/INT/XXX/dependencies`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toBeTruthy();
    expect(permissionSpy).toHaveBeenCalledTimes(0);
    expect(utilsSpy).toHaveBeenCalledTimes(0);
    expect(webadeSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a 500 if the config fetch throws', async () => {
    webadeSpy.mockImplementation(() => {
      throw new Error();
    });

    const response = await request(app).get(`${basePath}/INT/XXX/dependencies`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeTruthy();
    expect(response.body.title).toEqual('Internal Server Error');
    expect(webadeSpy).toHaveBeenCalledTimes(1);
  });
});

describe(`GET ${basePath}/:webAdeEnv/preferences/insecurePrefs`, () => {
  const utilsSpy = jest.spyOn(utils, 'filterForInsecurePrefs');
  const webadeSpy = jest.spyOn(webade, 'getAppConfigs');

  beforeEach(() => {
    utilsSpy.mockReset();
    webadeSpy.mockReset();
  });

  it('should yield a 422 if param validation fails', async () => {
    const response = await request(app).get(`${basePath}/DEV/preferences/insecurePrefs`);

    expect(response.statusCode).toBe(422);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toMatch('Validation failed');
    expect(webadeSpy).toHaveBeenCalledTimes(0);
  });

  it('should yield a 403 if user has no WEBADE_CFG_READ_ALL', async () => {
    const clone = JSON.parse(JSON.stringify(keycloakAuthMock));
    clone.grant.access_token.content.realm_access.roles = ['SOME_ROLE'];
    const overrideApp = helper.expressHelper(basePath, router, clone);

    const response = await request(overrideApp).get(`${basePath}/INT/preferences/insecurePrefs`);

    expect(response.statusCode).toBe(403);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toMatch('User lacks permission to get all app configs');
    expect(webadeSpy).toHaveBeenCalledTimes(0);
  });

  it('should yield a 403 if user has malformed roles', async () => {
    const clone = JSON.parse(JSON.stringify(keycloakAuthMock));
    clone.grant.access_token.content.realm_access.roles = 1234;
    const overrideApp = helper.expressHelper(basePath, router, clone);

    const response = await request(overrideApp).get(`${basePath}/INT/preferences/insecurePrefs`);

    expect(response.statusCode).toBe(403);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toMatch('User lacks permission to get all app configs');
    expect(webadeSpy).toHaveBeenCalledTimes(0);
  });

  it('should return a valid response if user has WEBADE_CFG_READ_ALL', async () => {
    utilsSpy.mockReturnValue({ test: '123' });
    webadeSpy.mockResolvedValue({ test: '123', more: 567 });

    const response = await request(app).get(`${basePath}/INT/preferences/insecurePrefs`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body).toEqual({ test: '123' });
    expect(webadeSpy).toHaveBeenCalledTimes(1);
  });

  it('should yield a 404 if configs are not found', async () => {
    webadeSpy.mockResolvedValue(undefined);

    const response = await request(app).get(`${basePath}/INT/preferences/insecurePrefs`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toBeTruthy();
    expect(webadeSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a 500 if the config fetch throws', async () => {
    webadeSpy.mockImplementation(() => {
      throw new Error();
    });

    const response = await request(app).get(`${basePath}/INT/preferences/insecurePrefs`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeTruthy();
    expect(response.body.title).toEqual('Internal Server Error');
    expect(webadeSpy).toHaveBeenCalledTimes(1);
  });
});
