const app = require('../src/app');
const knex = require('knex');
const fixtures = require('./fixtures.js');
const jwt = require('jsonwebtoken');

const dummyUsers = fixtures.makeUsersArray();
const dummyParties = fixtures.makePartyArray();
const dummyCharacters = fixtures.makeCharactersArray();
const dummyEquip = fixtures.makeEquipPack();
const {makeAuthHeader} = fixtures;

const testUser = {
  user_email: "test1@test.com",
  user_password: "password"
};
describe('App', () => {
  let db;
  before('Connect to db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });
  after('Destroy connection to db', () => {
    return db.destroy();
  });
  describe('Routes', () => {
    beforeEach('Clear data from db', () => {
      return fixtures.cleanTables(db);
    });
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
      context('SAD PATH', () => {
        context('INVALID ENDPOINTS', () => {
          it('/GET /characters/:char_id wrong char_id responds with 404', () => {
            return supertest(app)
              .get('/api/characters/111')
              .set('Authorization', makeAuthHeader(testUser))
              .expect(404, {error: "No Character with that id"})
          })
          it('/GET /characters Missing auth token', () => {
            return supertest(app)
              .get('/api/characters')
              .expect(401, {error: "Missing auth token"})
          })
          it('/PATCH /characters/:char_id wrong char_id responds with 404', () => {
            return supertest(app)
              .patch('/api/characters/111')
              .set('Authorization', makeAuthHeader(testUser))
              .expect(404, {error: "No Character with that id"})
          })
          it('/GET /characters/:char_id Missing auth token', () => {
            return supertest(app)
              .get('/api/characters/1')
              .expect(401, {error: "Missing auth token"})
          })
        })
        context('INVALID PAYLOAD', () => {
          it('/POST /characters/ invalid data', () => {
            return supertest(app)
              .post('/api/characters')
              .set('Authorization', makeAuthHeader(testUser))
              .send(fixtures.failTestCharacter())
              .expect({error: "You are missing values"})
          })
          it('/POST /users missing username on signup', () => {
            return supertest(app)
              .post('/api/users')
              .send({user_email: "", user_password: 'newpass'})
              .expect(400)
          })
        })
      })
      context('HAPPY PATH', () => {
        it('/GET /characters responds with 200', () => {
          return supertest(app)
            .get('/api/characters')
            .set('Authorization', makeAuthHeader(testUser))
            .then(result => {
              expect(result.body).to.be.an('array').to.have.lengthOf(4)
            })
        });
        it('/GET /characters/:char_id responds with 200', () => {
          return supertest(app)
            .get('/api/characters/1').set('Authorization', makeAuthHeader(testUser))
            .then(result => {
              expect(200)
              expect(result.body.char_id).to.equal(1)
              expect(result.body.stickers).to.be.an('array')
              expect(result.body.equipment).to.be.an('object')
            })
        });
        it('/PATCH /characters/:char_id responds with 200', () => {
          return supertest(app)
            .patch('/api/characters/1')
            .set('Authorization', makeAuthHeader(testUser))
            .send(fixtures.testCharacter())
            .then(result => {
              expect(result.body.xp).to.equal(88)
            })
        })
        it('/POST /characters/ posts successfully', () => {
          return supertest(app)
            .post('/api/characters')
            .set('Authorization', makeAuthHeader(testUser))
            .send(fixtures.fullTestCharacter())
            .then(response => {
              expect(response.body).to.be.an('object')
              expect(response.body.equipment_pack_id).to.equal(5)
              expect(response.body.char_id).to.equal(9)
            })
        })
        it('/DELETE /characters/:char_id should delete a character', () => {
          return supertest(app)
            .delete('/api/characters/1')
            .set('Authorization', makeAuthHeader(testUser))
            .expect(200)
        })
      })
    });
    describe('/api/parties', () => {
      context('SAD PATH', () => {
        it('/GET /api/parties/:party_id responds when choosing a party not there', () => {
          return supertest(app)
            .get('/api/parties/111')
            .set('Authorization', makeAuthHeader(testUser))
            .expect(404, {error:  "No party with that id"})
        })
      })
      context('HAPPY PATH', () => {
        it('/GET /api/parties responds with 200', () => {
          return supertest(app)
            .get('/api/parties')
            .set('Authorization', makeAuthHeader(testUser))
            .then(result => {
              expect(result.body).to.be.an('array').with.lengthOf(3)
              expect(result.body[0]).to.eql({party_id:1, name: 'Coolest Test Party'})
            })
        });
        it('/GET /api/parties/:party_id responds with object containing party 1', () => {
          return supertest(app)
            .get('/api/parties/1')
            .set('Authorization', makeAuthHeader(testUser))
            .then(result => {
              expect(result.body).to.deep.include({party_id: 1})
            })
        })
        it('/POST /api/parties creates a party and returns the party created', () => {
          return supertest(app)
            .post('/api/parties')
            .set('Authorization', makeAuthHeader(testUser))
            .send({name: "New Test Party"})
            .expect(200, {
              party_id: 4,
              name: "New Test Party"
            });
        });
      })
    });
    describe('/api/users', () => {
      it('/GET /users responds with 200', () => {
        return supertest(app)
          .get('/api/users')
          .set('Authorization', makeAuthHeader(testUser))
          .expect(200);
      });
      it('/GET /user/:user_id responds with a user', () => {
        return supertest(app)
          .get('/api/users/1')
          .set('Authorization', makeAuthHeader(testUser))
          .expect({
            user_id: 1,
            user_email: 'user_1@gmail.com',
            user_password: '$2a$10$z9zGUGXFwprpOk4MMXjiHeHifNu/O9coO6qkaLOYrCX8hqjNdXi9m',
          });
      });
      it('/POST /user adds user', function() {
        const newUser = {
          user_email: 'new_user@gmail.com',
          user_password: 'password',
        };
        return supertest(app)
          .post('/api/users')
          .set('Authorization', makeAuthHeader(testUser))
          .send(newUser)
          .then(result => {
            expect(result.body).to.contain({user_email: 'new_user@gmail.com'});
          });
      });
      it('/POST /user without password responds with 400', () => {
        return supertest(app)
          .post('/api/users')
          .send({user_email: "foo"})
          .expect(400)
      })
    });
    describe('/api/stickers' , () => {
      it('/GET /stickers returns all the stickers', () => {
        return supertest(app)
          .get('/api/stickers')
          .set('Authorization', makeAuthHeader(testUser))
          .then(result => {
            expect(result.body).to.be.an('array')
            expect(result.body[0]).to.contain({sticker_id: 1})
            expect(result.body[51]).to.contain({sticker_id: 52})
          })
      })
    })
    describe('/api/auth/login', () => {
      it('/POST /auth/login return 403 when using wrong username', () => {
        return supertest(app)
          .post('/api/auth/login')
          .send({
            user_email: "bad@email.com",
            user_password: "password"
          })
          .expect(403)
      })
      it('/POST /auth/login returns 200 when logging in correctly', () => {
        return supertest(app)
          .post('/api/auth/login')
          .send({
            user_email: "user_1@gmail.com",
            user_password: "password"
          })
          .expect(200)
      })
      it('/POST /auth/login returns 400 when loggin in incorrctly', () => {
        return supertest(app)
          .post('/api/auth/login')
          .send({
            user_email: "user_1@gmail.com",
            user_password: "bAdPaSsSsS"
          })
          .expect(403)
      })
      it('/POST /auth/login returns with a JWT', function() {
        this.retries(3)
        const validUser = {
          user_email: "user_1@gmail.com",
          user_password: "password"
        }
        const expectedToken = "Bearer " + jwt.sign(
          {user_id: 1},
          process.env.JWT_SECRET,
          {
            subject: "user_1@gmail.com",
            algorithm: 'HS256',
          }
        );
        return supertest(app)
          .post('/api/auth/login')
          .send(validUser)
          .expect(200, {
            authToken: expectedToken,
          });
      });
    });
  });
});
