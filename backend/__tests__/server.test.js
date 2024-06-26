const request = require('supertest');
const app = require('../server');

describe('GET /', () => {
  it('responds with json', async () => {
    const response = await request(app)
      .get('/api')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({ message: 'WebForge API' });
  });
});

// Add more tests for WebAssembly routes
