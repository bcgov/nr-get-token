const request = require('supertest');

const helper = require('../../../common/helper');

const router = require('../../../../src/routes/v1/checks');
const checks = require('../../../../src/components/checks');

// Simple Express Server
const basePath = '/api/v1/checks';
const app = helper.expressHelper(basePath, router);
helper.logHelper();

describe(`GET ${basePath}/status`, () => {
  const getStatusSpy = jest.spyOn(checks, 'getStatus');

  beforeEach(() => {
    getStatusSpy.mockReset();
  });

  it('should yield a problem response', async () => {
    getStatusSpy.mockResolvedValue();

    const response = await request(app).get(`${basePath}/status`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toMatch('Unable to get api status list');
    expect(getStatusSpy).toHaveBeenCalledTimes(1);
  });

  it('should yield a valid response', async () => {
    const out = [];
    getStatusSpy.mockResolvedValue(out);

    const response = await request(app).get(`${basePath}/status`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body).toEqual({ endpoints: out });
    expect(getStatusSpy).toHaveBeenCalledTimes(1);
  });
});
