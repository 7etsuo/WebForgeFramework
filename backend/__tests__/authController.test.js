const request = require('supertest');
const { app, startServer } = require('../server');
const jwt = require('jsonwebtoken');
const config = require('../src/config/config');

describe('Authentication', () => {
  let server;
  let refreshToken;

  beforeAll(async () => {
    server = await startServer(0);
  });

  afterAll((done) => {
    server.close(done);
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
