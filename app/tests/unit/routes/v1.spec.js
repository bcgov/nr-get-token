const request = require('supertest');

const helper = require('../../common/helper');
const router = require('../../../src/routes/v1');

// Simple Express Server
const basePath = '/api/v1';
const app = helper.expressHelper(basePath, router);

describe(`GET ${basePath}`, () => {
  it('should return all available endpoints', async () => {
    const response = await request(app).get(`${basePath}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
    expect(Array.isArray(response.body.endpoints)).toBeTruthy();
    expect(response.body.endpoints).toHaveLength(6);
    expect(response.body.endpoints).toEqual(
      expect.arrayContaining([
        '/acronyms',
        '/checks',
        '/docs',
        '/email',
        '/keycloak',
        '/users',
      ])
    );
  });
});

describe(`GET ${basePath}/docs`, () => {
  it('should return a redoc html page', async () => {
    const response = await request(app).get(`${basePath}/docs`);

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('<title>GetOK API - Documentation');
  });
});

describe(`GET ${basePath}/api-spec.yaml`, () => {
  it('should return the OpenAPI spec in yaml', async () => {
    const response = await request(app).get(`${basePath}/api-spec.yaml`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.headers['content-type']).toBeTruthy();
    expect(response.headers['content-type']).toMatch(
      'application/yaml; charset=utf-8'
    );
    expect(response.text).toContain('openapi: 3.0.3');
    expect(response.text).toContain('title: GetOK API');
  });
});

describe(`GET ${basePath}/api-spec.json`, () => {
  it('should return the OpenAPI spec in json', async () => {
    const response = await request(app).get(`${basePath}/api-spec.json`);

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBeTruthy();
    expect(response.headers['content-type']).toMatch(
      'application/json; charset=utf-8'
    );
    expect(response.body).toBeTruthy();
    expect(response.body.openapi).toMatch('3.0.3');
    expect(response.body.info.title).toMatch('GetOK API');
  });
});
