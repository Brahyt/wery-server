const UserService = {
  getAllUsers() {

  },
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
        console.log(result.length === 0)
        if(result == 0) {
          return db
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(user => {
              console.log(user[0])
              return user[0]
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

  }
};

module.exports = UserService;
