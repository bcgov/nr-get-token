const request = require('supertest');

const helper = require('../../common/helper');
const router = require('../../../src/routes/v1');

// Simple Express Server
const basePath = '/api/v1';
const app = helper.expressHelper(basePath, router);
helper.logHelper();

describe(`GET ${basePath}`, () => {
  it('should return all available endpoints', async () => {
    const response = await request(app).get(`${basePath}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
    expect(Array.isArray(response.body.endpoints)).toBeTruthy();
    expect(response.body.endpoints).toHaveLength(1);
    expect(response.body.endpoints).toContain('/hello');
  });
});
