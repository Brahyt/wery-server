const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const config = require('../config');

const AuthService = {
  getUserWithUserName(db, user_email) {
    return db('users')
      .where({ user_email })
      .first()
  },
  comparePasswords(user_password, hash) {
    return bcrypt.compare(user_password, hash)
  },
  createJwt(subject, payload) {
    const token = jwt.sign(payload, config.JWT_SECRET, {
      subject: subject,
      algorithm: 'HS256'
    })
    return `Bearer ${token}`
  },
  verifyJwt(token){
    return jwt.verify(token, config.JWT_SECRET, {
      algorithm: 'HS256',
    })
  },
}
module.exports = AuthService;
