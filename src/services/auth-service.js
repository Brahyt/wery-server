const bcrypt = require('bcryptjs')

const AuthService = {
  getUserWithUserName(db, user_email) {
    return db('users')
      .where({ user_email })
      .first
  },
  comparePasswords(user_password, hash) {
    resturn bcrypt.compare(password, hash)
  },
  parseBasicToken(token)
}
