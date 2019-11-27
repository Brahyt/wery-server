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
    console.log(subject, payload)
    const token = jwt.sign(payload, config.JWT_SECRET, {
      subject: subject,
      algorithm: 'HS256'
    })
    console.log("TOKEN HERE", token)
    return `Bearer ${token}`
  },
  verifyJwt(token){
    console.log(token)
    return jwt.verify(token, config.JWT_SECRET, {
      algorithm: 'HS256',
    })
  },
}
module.exports = AuthService;
