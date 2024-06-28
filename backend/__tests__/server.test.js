const request = require('supertest');
const { app, startServer, stopServer } = require('../server');
const mongoose = require('mongoose');

describe('Server', () => {
  let server;

  beforeAll(async () => {
    server = await startServer(0);
    await mongoose.connect(process.env.MONGO_URI_TEST);
  });

  afterAll(async () => {
    await stopServer(server);
    await mongoose.disconnect();
  });

  it('responds with json', async () => {
    const response = await request(app)
      .get('/api')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body).toEqual({ message: 'WebForge API' });
  });
});
