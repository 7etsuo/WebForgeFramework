const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { app, startServer, stopServer } = require('../server');
const User = require('../src/models/User');
const config = require('../src/config/config');

let server;

beforeAll(async () => {
  server = await startServer(0); // Use port 0 to let the OS assign a free port
  await mongoose.connect(config.mongoUri);
});

afterAll(async () => {
  await stopServer(server);
  await mongoose.disconnect();
});

describe('Authentication', () => {
  let refreshToken;

  beforeEach(async () => {
    await User.deleteMany({});
    await User.create({
      username: 'testuser',
      password: 'password',
      role: 'user'
    });
  });

  it('should login successfully', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'password'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    refreshToken = res.body.refreshToken;
  });

  it('should fail login with incorrect credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(401);
  });

  it('should refresh token successfully', async () => {
    const res = await request(app)
      .post('/api/token')
      .send({
        token: refreshToken
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('should fail to refresh with invalid token', async () => {
    const res = await request(app)
      .post('/api/token')
      .send({
        token: 'invalidtoken'
      });
    expect(res.statusCode).toEqual(403);
  });

  it('should logout successfully', async () => {
    const res = await request(app)
      .delete('/api/logout')
      .send({
        token: refreshToken
      });
    expect(res.statusCode).toEqual(204);
  });
});
