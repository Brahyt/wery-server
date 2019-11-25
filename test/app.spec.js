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
              .expect(404, {error: "No Character with that id"})
          })
          it('/PATCH /characters/:char_id wrong char_id responds with 404', () => {
            return supertest(app)
              .patch('/api/characters/111')
              .expect(404, {error: "No Character with that id"})
          })
        })
        context('INVALID PAYLOAD', () => {
          it('/POST /characters/ invalid data', () => {
            return supertest(app)
              .post('/api/characters')
              .send(fixtures.failTestCharacter())
              .expect({error: "You are missing values"})
          })
        })
      })
      context('HAPPY PATH', () => {
        it('/GET /characters responds with 200', () => {
          return supertest(app)
            .get('/api/characters')
            .then(result => {
              expect(result.body).to.be.an('array').to.have.lengthOf(4)
            })
        });
        it('/GET /characters/:char_id responds with 200', () => {
          return supertest(app)
            .get('/api/characters/1')
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
            .send(fixtures.testCharacter())
            .then(result => {
              expect(result.body.name).to.equal('updated')
              expect(result.body.xp).to.equal(88)
            })
        })
        it('/POST /characters/ posts successfully', () => {
          return supertest(app)
            .post('/api/characters')
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
            .expect(200)
        })
      })
    });
    describe('/api/parties', () => {
      context('SAD PATH', () => {
        it('/GET /api/parties/:party_id responds when choosing a party not there', () => {
          return supertest(app)
            .get('/api/parties/111')
            .expect(404, {error:  "No party with that id"})
        })
      })
      context('HAPPY PATH', () => {
        it('/GET /api/parties responds with 200', () => {
          return supertest(app)
            .get('/api/parties')
            .then(result => {
              expect(result.body).to.be.an('array').with.lengthOf(3)
              expect(result.body[0]).to.eql({party_id:1, name: 'Coolest Test Party'})
            })
        });
        it('/GET /api/parties/:party_id responds with object containing party 1', () => {
          return supertest(app)
            .get('/api/parties/1')
            .then(result => {
              expect(result.body).to.deep.include({party_id: 1})
            })
        })
        it('/POST /api/parties creates a party and returns the party created', () => {
          return supertest(app)
            .post('/api/parties')
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
    describe('/api/stickers' ,() => {
      it('/GET /stickers returns all the stickers', () => {
        return supertest(app)
          .get('/api/stickers')
          .then(result => {
            expect(result.body).to.be.an('array')
            expect(result.body[0]).to.contain({sticker_id: 1})
            expect(result.body[50]).to.contain({sticker_id: 51})
          })
      })
    })
  });
});
