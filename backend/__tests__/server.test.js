const request = require('supertest');
const { app, startServer } = require('../server');

describe('Server', () => {
  let server;

  beforeAll(async () => {
    server = await startServer(0); // Use port 0 to let the OS assign a free port
  });

  afterAll((done) => {
    server.close(done);
  });

  it('responds with json', async () => {
    const response = await request(app)
      .get('/api')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body).toEqual({ message: 'WebForge API' });
  });
});
