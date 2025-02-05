const request = require('supertest');
const app = require('../index');
const { sequelize } = require('../config/database');

describe('GET /api/recipes/search', () => {
  it('should return recipes when valid ingredients are provided', async () => {
    const response = await request(app).get('/api/recipes/search?ingredients=chicken');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should return an error when no ingredients are provided', async () => {
    const response = await request(app).get('/api/recipes/search');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Please provide ingredients');
  });
});

// Close DB connection & server after all tests
afterAll(async () => {
  await sequelize.close();
  if (app.server) app.server.close();
});
