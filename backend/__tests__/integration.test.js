const request = require('supertest');
const { app, startServer } = require('../server');
const fs = require('fs').promises;
const path = require('path');

describe('Integration Tests', () => {
  let server;
  let authToken;

  beforeAll(async () => {
    server = await startServer(0);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should login, fetch WebAssembly modules, and logout', async () => {
    // Login
    const loginResponse = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: 'password' });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body).toHaveProperty('accessToken');
    authToken = loginResponse.body.accessToken;

    // Fetch WebAssembly modules
    const modulesResponse = await request(app)
      .get('/api/wasm/modules')
      .set('Authorization', `Bearer ${authToken}`);

    expect(modulesResponse.statusCode).toBe(200);
    expect(Array.isArray(modulesResponse.body)).toBeTruthy();
    expect(modulesResponse.body).toContain('sample.wasm');

    // Logout
    const logoutResponse = await request(app)
      .delete('/api/logout')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ token: loginResponse.body.refreshToken });

    expect(logoutResponse.statusCode).toBe(204);
  });

  it('should retrieve a WebAssembly module', async () => {
    // Login first
    const loginResponse = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: 'password' });

    authToken = loginResponse.body.accessToken;

    // Retrieve the module
    const retrieveResponse = await request(app)
      .get('/api/wasm/modules/sample')
      .set('Authorization', `Bearer ${authToken}`);

    expect(retrieveResponse.statusCode).toBe(200);
    expect(retrieveResponse.headers['content-type']).toBe('application/wasm');
    expect(retrieveResponse.body).toBeDefined();
  });
});
