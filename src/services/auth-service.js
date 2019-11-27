const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const config = require('../config');

const AuthService = {
  getUserWithUserName(db, user_email) {
    return db('users')
      .where({ user_email })
      .first()
      .then(result => {
        return result
      })
  },
  comparePasswords(user_password, hash) {
    return bcrypt.compare(user_password, hash)
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: 'HS256',
    })
  }
}
module.exports = AuthService;
