const request = require('supertest');
const mongoose = require('mongoose');
const { app, startServer, stopServer } = require('../server');
const User = require('../src/models/User');
const RefreshToken = require('../src/models/RefreshToken');

let server;

beforeAll(async () => {
  server = await startServer(0); // Use port 0 to let the OS assign a free port
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterAll(async () => {
  await stopServer(server);
  await mongoose.disconnect();
});

beforeEach(async () => {
  await User.deleteMany({});
  await RefreshToken.deleteMany({});

  await User.create({
    username: 'testuser',
    password: 'password',
    role: 'user'
  });

  await User.create({
    username: 'adminuser',
    password: 'adminpassword',
    role: 'admin'
  });
});

describe('Authentication', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        username: 'testuser',
        password: 'password123',
        role: 'user'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  it('should login a user', async () => {
    await User.create({
      username: 'testuser',
      password: 'password123',
      role: 'user'
    });

    const res = await request(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('should refresh the token', async () => {
    const user = await User.create({
      username: 'testuser',
      password: 'password123',
      role: 'user'
    });

    const loginRes = await request(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    const refreshRes = await request(app)
      .post('/api/token')
      .send({
        token: loginRes.body.refreshToken
      });
    expect(refreshRes.statusCode).toEqual(200);
    expect(refreshRes.body).toHaveProperty('accessToken');
    expect(refreshRes.body).toHaveProperty('refreshToken');
  });

  it('should logout a user', async () => {
    const user = await User.create({
      username: 'testuser',
      password: 'password123',
      role: 'user'
    });

    const loginRes = await request(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    const logoutRes = await request(app)
      .delete('/api/logout')
      .send({
        token: loginRes.body.refreshToken
      });
    expect(logoutRes.statusCode).toEqual(204);
  });
});

describe('Authorization', () => {
  let adminToken, userToken;

  beforeEach(async () => {
    await User.create({
      username: 'admin',
      password: 'adminpass',
      role: 'admin'
    });

    await User.create({
      username: 'user',
      password: 'userpass',
      role: 'user'
    });

    const adminLogin = await request(app)
      .post('/api/login')
      .send({
        username: 'admin',
        password: 'adminpass'
      });
    adminToken = adminLogin.body.accessToken;

    const userLogin = await request(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'userpass'
      });
    userToken = userLogin.body.accessToken;
  });

  it('should allow admin to create a module', async () => {
    const res = await request(app)
      .post('/api/wasm/modules')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'testmodule',
        content: 'test content'
      });
    expect(res.statusCode).toEqual(201);
  });

  it('should not allow user to create a module', async () => {
    const res = await request(app)
      .post('/api/wasm/modules')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'testmodule',
        content: 'test content'
      });
    expect(res.statusCode).toEqual(403);
  });

  it('should allow both admin and user to view modules', async () => {
    const adminRes = await request(app)
      .get('/api/wasm/modules')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(adminRes.statusCode).toEqual(200);

    const userRes = await request(app)
      .get('/api/wasm/modules')
      .set('Authorization', `Bearer ${userToken}`);
    expect(userRes.statusCode).toEqual(200);
  });
});
