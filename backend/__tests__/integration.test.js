const request = require('supertest');
const { app, startServer, stopServer } = require('../server');
const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const WebAssemblyModule = require('../src/models/WebAssemblyModule');

describe('Integration Tests', () => {
  let server;
  let authToken;

  beforeAll(async () => {
    server = await startServer(0);
    await mongoose.connect(process.env.MONGO_URI_TEST);
  });

  afterAll(async () => {
    await stopServer(server);
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await WebAssemblyModule.deleteMany({});
    
    await User.create({
      username: 'testuser',
      password: 'password',
      role: 'user'
    });

    // Create a sample WebAssembly module
    const sampleWasmPath = path.join(__dirname, 'dummy.wasm');
    const sampleWasmContent = await fs.readFile(sampleWasmPath);
    await WebAssemblyModule.create({
      name: 'sample',
      description: 'A sample WebAssembly module',
      version: '1.0.0',
      author: 'Test',
      filePath: sampleWasmPath
    });
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
    expect(modulesResponse.body).toContain('sample');

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
