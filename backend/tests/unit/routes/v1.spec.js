const request = require('supertest');

const app = require('../../../app');

describe('/api/v1', () => {
  it('should return all available endpoints', async () => {
    const response = await request(app).get('/api/v1');

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body).toEqual({
      endpoints: [
        '/appConfigForm',
        '/checks',
        '/docs',
        '/kcClientForm'
      ]
    });
  });
});

describe('/api/v1/docs', () => {
  it('should return a redoc html page', async () => {
    const response = await request(app).get('/api/v1/docs');

    expect(response.statusCode).toBe(200);
    expect(response.text).toMatch(/<title>GetOK API - Documentation/);
  });
});

describe('/api/v1/api-spec.yaml', () => {
  it('should return the OpenAPI yaml spec', async () => {
    const response = await request(app).get('/api/v1/api-spec.yaml');

    expect(response.statusCode).toBe(200);
    expect(response.text).toMatch(/openapi: 3.0.0/);
    expect(response.text).toMatch(/title: GetOK API/);
  });
});
