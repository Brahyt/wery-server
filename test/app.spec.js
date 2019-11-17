const app = require('../src/app');

describe('App', () => {
  describe('Routes', () => {
    describe('/api/characters', () => {
      it('/GET /characters responds with 200', () => {
        return supertest(app)
          .get('/api/characters')
          .expect(200)
      })
    })
    describe('/api/parties', () => {
      it('/GET parties responds with 200', () => {
        return supertest(app)
          .get('/api/parties')
          .expect(200)
      })
    })
    describe('/api/users', () => {
      it('/GET /users responds with 200', () => {
        return supertest(app)
          .get('/api/users')
          .expect(200)
      })
    })
  });
});
