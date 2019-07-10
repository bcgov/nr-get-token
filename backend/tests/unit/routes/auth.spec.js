const request = require('supertest');

const auth = require('../../../src/components/auth');
const app = require('../../../app');

const endlessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjB9.JWKPB-5Q8rTYzl-MfhRGpP9WpDpQxC7JkIAGFMDZnpg';
const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.Vg30C57s3l90JNap_VgMhKZjfc-p7SoBXaSAy8c28HA';

describe('/api/auth', () => {
  it('should return all available endpoints', async () => {
    const response = await request(app).get('/api/auth');

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body).toEqual({
      endpoints: [
        '/callback',
        '/login',
        '/logout',
        '/refresh',
        '/token'
      ]
    });
  });
});

describe('/api/auth/callback', () => {
  it('should have a response', async () => {
    const response = await request(app).get('/api/auth/callback');
    expect(response).toBeTruthy();
  });
});

describe('/api/auth/error', () => {
  it('should return the OpenAPI yaml spec', async () => {
    const response = await request(app).get('/api/auth/error');

    expect(response.statusCode).toBe(401);
    expect(response.body).toBeTruthy();
    expect(response.body).toEqual({
      message: 'Error: Unable to authenticate'
    });
  });
});

describe('/api/auth/login', () => {
  it('should have a response', async () => {
    const response = await request(app).get('/api/auth/login');
    expect(response).toBeTruthy();
  });
});

describe('/api/auth/logout', () => {
  it('should have a response', async () => {
    const response = await request(app).get('/api/auth/logout');
    expect(response).toBeTruthy();
    expect(response.statusCode).toBe(302);
  });
});

describe('/api/auth/refresh', () => {
  it('should have a 200 response', async () => {
    auth.renew = jest.fn().mockResolvedValue({
      access_token: validToken,
      refresh_token: endlessToken
    });

    const response = await request(app)
      .post('/api/auth/refresh')
      .send({
        refreshToken: endlessToken
      });

    expect(response).toBeTruthy();
    expect(response.statusCode).toBe(200);
  });

  it('should have a 400 response', async () => {
    const response = await request(app).post('/api/auth/refresh');
    expect(response).toBeTruthy();
    expect(response.statusCode).toBe(400);
  });
});

describe('/api/auth/token', () => {
  it('should have a response', async () => {
    const response = await request(app).get('/api/auth/token');
    expect(response).toBeTruthy();
    expect(response.statusCode).toBe(401);
  });
});
