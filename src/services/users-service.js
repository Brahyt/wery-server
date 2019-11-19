const UserService = {
  getAllUsers() {

  },
  getUserById(db, id) {
    return db('users')
      .select('*')
      .where('user_id', id)
      .then(user => user[0])
  },
  createUser(db, newUser) {
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(user => user[0])
  },
  deleteUserById(db, user_id){
    return db('users')
      .delete('user_id', user_id)
  },
  updateUserById(){

  }
};

module.exports = UserService;
