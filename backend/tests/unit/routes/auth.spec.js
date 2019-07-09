const request = require('supertest');

const app = require('../../../app');

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
  it('should have a response', async () => {
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
