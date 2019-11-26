const bcrypt = require('bcryptjs')

const AuthService = {
  getUserWithUserName(db, user_email) {
    return db('users')
      .where({ user_email })
      .first
  }
}
