const request = require('supertest');

const helper = require('../../../common/helper');

const router = require('../../../../src/routes/v1/acronyms');
const acronyms = require('../../../../src/components/acronyms');
const permissionHelpers = require('../../../../src/components/permissionHelpers');

// Simple Express Server
const basePath = '/api/v1/acronyms';
const keycloakAuthMock = require('../fixtures/kauth.json');
const app = helper.expressHelper(basePath, router, keycloakAuthMock);
helper.logHelper();

describe(`GET ${basePath}/:appAcronym`, () => {
  const acronymSpy = jest.spyOn(acronyms, 'getAcronym');
  const permissionSpy = jest.spyOn(permissionHelpers, 'checkAcronymPermission');

  beforeEach(() => {
    acronymSpy.mockReset();
    permissionSpy.mockReset();
  });

  it('should yield a 403 if permission check fails', async () => {
    permissionSpy.mockResolvedValue('error');

    const response = await request(app).get(`${basePath}/XXX`);

    expect(response.statusCode).toBe(403);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toMatch('error');
    expect(permissionSpy).toHaveBeenCalledTimes(1);
    expect(permissionSpy).toHaveBeenCalledWith('0000-0000', 'XXX');
    expect(acronymSpy).toHaveBeenCalledTimes(0);
  });

  it('should yield a 404 if acronym is not found', async () => {
    permissionSpy.mockResolvedValue();
    acronymSpy.mockResolvedValue(undefined);

    const response = await request(app).get(`${basePath}/XXX`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toBeTruthy();
    expect(permissionSpy).toHaveBeenCalledTimes(1);
    expect(acronymSpy).toHaveBeenCalledTimes(1);
  });

  it('should yield a valid response', async () => {
    permissionSpy.mockResolvedValue();
    acronymSpy.mockResolvedValue({ acronym: 'xxx' });

    const response = await request(app).get(`${basePath}/XXX`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body).toEqual({ acronym: 'xxx' });
    expect(permissionSpy).toHaveBeenCalledTimes(1);
    expect(acronymSpy).toHaveBeenCalledTimes(1);
    expect(acronymSpy).toHaveBeenCalledWith('XXX');
  });

  it('should return a 500 if the acronym fetch throws', async () => {
    permissionSpy.mockResolvedValue();
    acronymSpy.mockImplementation(() => {
      throw new Error();
    });

    const response = await request(app).get(`${basePath}/XXX`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeTruthy();
    expect(response.body.title).toEqual('Internal Server Error');
    expect(permissionSpy).toHaveBeenCalledTimes(1);
    expect(acronymSpy).toHaveBeenCalledTimes(1);
  });
});


describe(`GET ${basePath}/:acronym/clients`, () => {
  const acronymSpy = jest.spyOn(acronyms, 'getAcronymClients');
  const permissionSpy = jest.spyOn(permissionHelpers, 'checkAcronymPermission');

  beforeEach(() => {
    acronymSpy.mockReset();
    permissionSpy.mockReset();
  });

  it('should yield a 403 if permission check fails', async () => {
    permissionSpy.mockResolvedValue('error');

    const response = await request(app).get(`${basePath}/XXX/clients`);

    expect(response.statusCode).toBe(403);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toMatch('error');
    expect(permissionSpy).toHaveBeenCalledTimes(1);
    expect(permissionSpy).toHaveBeenCalledWith('0000-0000', 'XXX');
    expect(acronymSpy).toHaveBeenCalledTimes(0);
  });

  it('should yield a 404 if no clients found', async () => {
    permissionSpy.mockResolvedValue();
    acronymSpy.mockResolvedValue(null);

    const response = await request(app).get(`${basePath}/XXX/clients`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toBeTruthy();
    expect(permissionSpy).toHaveBeenCalledTimes(1);
    expect(acronymSpy).toHaveBeenCalledTimes(1);
  });

  it('should yield a valid response', async () => {
    permissionSpy.mockResolvedValue();
    acronymSpy.mockResolvedValue({ acronym: 'xxx' });

    const response = await request(app).get(`${basePath}/XXX/clients`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body).toEqual({ acronym: 'xxx' });
    expect(permissionSpy).toHaveBeenCalledTimes(1);
    expect(acronymSpy).toHaveBeenCalledTimes(1);
    expect(acronymSpy).toHaveBeenCalledWith('XXX');
  });

  it('should return a 500 if the acronym fetch throws', async () => {
    permissionSpy.mockResolvedValue();
    acronymSpy.mockImplementation(() => {
      throw new Error();
    });

    const response = await request(app).get(`${basePath}/XXX/clients`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeTruthy();
    expect(response.body.title).toEqual('Internal Server Error');
    expect(permissionSpy).toHaveBeenCalledTimes(1);
    expect(acronymSpy).toHaveBeenCalledTimes(1);
  });
});

describe(`GET ${basePath}/:acronym/users`, () => {
  const acronymSpy = jest.spyOn(acronyms, 'getUsers');
  const permissionSpy = jest.spyOn(permissionHelpers, 'checkAcronymPermission');

  beforeEach(() => {
    acronymSpy.mockReset();
    permissionSpy.mockReset();
  });

  it('should yield a 403 if permission check fails', async () => {
    permissionSpy.mockResolvedValue('error');

    const response = await request(app).get(`${basePath}/XXX/users`);

    expect(response.statusCode).toBe(403);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toMatch('error');
    expect(permissionSpy).toHaveBeenCalledTimes(1);
    expect(permissionSpy).toHaveBeenCalledWith('0000-0000', 'XXX');
    expect(acronymSpy).toHaveBeenCalledTimes(0);
  });

  it('should yield a 404 if no users found', async () => {
    permissionSpy.mockResolvedValue();
    acronymSpy.mockResolvedValue(null);

    const response = await request(app).get(`${basePath}/XXX/users`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toBeTruthy();
    expect(permissionSpy).toHaveBeenCalledTimes(1);
    expect(acronymSpy).toHaveBeenCalledTimes(1);
  });

  it('should yield a valid response', async () => {
    permissionSpy.mockResolvedValue();
    acronymSpy.mockResolvedValue({ acronym: 'xxx', users: [] });

    const response = await request(app).get(`${basePath}/XXX/users`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body).toEqual({ acronym: 'xxx', users: [] });
    expect(permissionSpy).toHaveBeenCalledTimes(1);
    expect(acronymSpy).toHaveBeenCalledTimes(1);
    expect(acronymSpy).toHaveBeenCalledWith('XXX');
  });

  it('should return a 500 if the users fetch throws', async () => {
    permissionSpy.mockResolvedValue();
    acronymSpy.mockImplementation(() => {
      throw new Error();
    });

    const response = await request(app).get(`${basePath}/XXX/users`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeTruthy();
    expect(response.body.title).toEqual('Internal Server Error');
    expect(permissionSpy).toHaveBeenCalledTimes(1);
    expect(acronymSpy).toHaveBeenCalledTimes(1);
  });
});
