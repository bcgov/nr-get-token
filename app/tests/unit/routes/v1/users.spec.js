const request = require('supertest');
const { v4: uuidv4 } = require('uuid');

const helper = require('../../../common/helper');

const router = require('../../../../src/routes/v1/users');
const users = require('../../../../src/components/users');

// Simple Express Server
const basePath = '/api/v1/users';
const app = helper.expressHelper(basePath, router);
helper.logHelper();

describe(`GET ${basePath}/:keycloakId/acronyms`, () => {
  const zeroUuid = '00000000-0000-0000-0000-000000000000';
  const randUuid = uuidv4();

  const getUserAcronymsSpy = jest.spyOn(users, 'getUserAcronyms');

  beforeEach(() => {
    getUserAcronymsSpy.mockReset();
  });

  it('should yield a validation failure', async () => {
    const response = await request(app).get(`${basePath}/BAD/acronyms`);

    expect(response.statusCode).toBe(422);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toMatch('Validation failed');
    expect(getUserAcronymsSpy).toHaveBeenCalledTimes(0);
  });

  it('should yield a not found', async () => {
    getUserAcronymsSpy.mockResolvedValue(null);

    const response = await request(app).get(`${basePath}/${zeroUuid}/acronyms`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toBeTruthy();
    expect(getUserAcronymsSpy).toHaveBeenCalledTimes(1);
    expect(getUserAcronymsSpy).toHaveBeenCalledWith(zeroUuid);
  });

  it('should yield a response', async () => {
    const out = [{ acronym: 'TEST', owner: false }];
    getUserAcronymsSpy.mockResolvedValue(out);

    const response = await request(app).get(`${basePath}/${randUuid}/acronyms`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body).toEqual(out);
    expect(getUserAcronymsSpy).toHaveBeenCalledTimes(1);
    expect(getUserAcronymsSpy).toHaveBeenCalledWith(randUuid);
  });
});

describe(`GET ${basePath}/:keycloakId/acronyms/clients`, () => {
  const zeroUuid = '00000000-0000-0000-0000-000000000000';
  const randUuid = uuidv4();

  const getUserAcronymClientsSpy = jest.spyOn(users, 'getUserAcronymClients');

  beforeEach(() => {
    getUserAcronymClientsSpy.mockReset();
  });

  it('should yield a validation failure', async () => {
    const response = await request(app).get(`${basePath}/BAD/acronyms/clients`);

    expect(response.statusCode).toBe(422);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toMatch('Validation failed');
    expect(getUserAcronymClientsSpy).toHaveBeenCalledTimes(0);
  });

  it('should yield a not found', async () => {
    getUserAcronymClientsSpy.mockResolvedValue(null);

    const response = await request(app).get(`${basePath}/${zeroUuid}/acronyms/clients`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toBeTruthy();
    expect(getUserAcronymClientsSpy).toHaveBeenCalledTimes(1);
    expect(getUserAcronymClientsSpy).toHaveBeenCalledWith(zeroUuid);
  });

  it('should yield a response', async () => {
    const out = [{ acronym: 'TEST', owner: false }];
    getUserAcronymClientsSpy.mockResolvedValue(out);

    const response = await request(app).get(`${basePath}/${randUuid}/acronyms/clients`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body).toEqual(out);
    expect(getUserAcronymClientsSpy).toHaveBeenCalledTimes(1);
    expect(getUserAcronymClientsSpy).toHaveBeenCalledWith(randUuid);
  });
});
