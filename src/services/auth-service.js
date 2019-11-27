const bcrypt = require('bcryptjs')

const AuthService = {
  getUserWithUserName(db, user_email) {
    console.log("TIS", user_email)
    return db('users')
      .where({ user_email })
      .first()
      .then(result => result)
  },
  comparePasswords(user_password, hash) {
    return bcrypt.compare(user_password, hash)
  },
}
module.exports = AuthService;
