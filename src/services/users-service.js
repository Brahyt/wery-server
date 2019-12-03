const bcrypt = require('bcryptjs');

const UserService = {
  getUserById(db, id) {
    return db('users')
      .select('*')
      .where('user_id', id)
      .then(user => user[0]);
  },
  createUser(db, newUser) {
    return db('users')
      .select('*')
      .where('user_email', newUser.user_email)
      .then(result => {
        if(result == 0) {
          return bcrypt.hash(newUser.user_password, 10)
            .then(hash => {
              return db
                .insert({
                  user_email: newUser.user_email,
                  user_password: `${hash}`
                })
                .into('users')
                .returning('*')
                .then(user => {
                  return user[0]
                })
            })
        } else {
          return "User Exists"
        }
      });
  },
  deleteUserById(db, user_id){
    return db('users')
      .delete('user_id', user_id);
  },
  updateUserById(){

  },
  validateNewUser(newUser){
    const {user_email, user_password} = newUser
    if(!user_email) return false
    if(!user_password) return false
  }
};

module.exports = UserService;
