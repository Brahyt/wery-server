const app = require('../src/app');
const knex = require('knex');
const fixtures = require('./fixtures.js');

const dummyUsers = fixtures.makeUsersArray();
const dummyParties = fixtures.makePartyArray();
const dummyCharacters = fixtures.makeCharactersArray();
const dummyEquip = fixtures.makeEquipPack();

describe('App', () => {
  let db;
  before('Connect to db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });
  after('Destroy connection to db', () => {
    return db.destroy();
  });
  before('Clear data from db', () => {
    fixtures.cleanTables(db);
  });
  describe('Routes', () => {
    beforeEach('Add users to db', () => {
      return db.into('users').insert(dummyUsers);
    });
    beforeEach('Add parties to db', () => {
      return db.into('party').insert(dummyParties);
    });
    beforeEach('Add equipPack to db', () => {
      return db.into('equipment_pack').insert(dummyEquip);
    });
    beforeEach('Add Characters to db', () => {
      return db.into('characters').insert(dummyCharacters);
    });
    afterEach('Clear data from db', () => {
      fixtures.cleanTables(db);
    });
    describe('/api/characters', () => {
      it('/GET /characters responds with 200', () => {
        return supertest(app)
          .get('/api/characters')
          .expect(200);
      });
      it.only('/GET /characters/:char_id responds with 200', () => {
        return supertest(app)
          .get('/api/characters/1')
          .then(result => {
            console.log(result.body)
            expect(200)
          })
      });
    });
    describe('/api/parties', () => {
      it('/GET parties responds with 200', () => {
        return supertest(app)
          .get('/api/parties')
          .expect(200);
      });
    });
    describe('/api/users', () => {
      it('/GET /users responds with 200', () => {
        return supertest(app)
          .get('/api/users')
          .expect(200);
      });
      it('/GET /user/:user_id responds with a user', () => {
        return supertest(app)
          .get('/api/users/1')
          .expect({
            user_id: 1,
            user_email: 'user_1@gmail.com',
            user_password: '123456',
          });
      });
      it('/POST /user adds user', function() {
        this.retries(3);
        const newUser = {
          user_email: 'new_user@gmail.com',
          user_password: '123456',
        };
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .then(result => {
            expect(result.body).to.contain(newUser);
          });
      });
      it('/DELETE /user/id deletes user', () => {
        return supertest(app)
          .delete('/api/users/1')
          .expect(200);
      });
    });
  });
});
