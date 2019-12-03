const express = require('express');
const usersRoute  = express.Router();
const jsonParse = express.json();
const UserService = require('../services/users-service');

usersRoute
  .route('/')
  .get((req, res) => {
    return res.status(200).send('users');
  })
  .post(jsonParse, (req, res, next) => {
    const newUser = req.body;
    const { user_email, user_password } = newUser
    if(!user_email) return res
      .status(400)
      .json({error: "No Username"})
    if(!user_password) return res
      .status(400)
      .json({error: "No Password"})
    UserService.createUser(req.app.get('db'), newUser)
      .then(user => {
        return res.json(user);
      })
      .catch(next);
  });
usersRoute
  .route('/:user_id')
  .get((req, res, next) => {
    const user_id = req.params.user_id;
    UserService.getUserById(req.app.get('db'), user_id)
      .then(user => {
        return res.send(user).status(200);
      })
  })
  .delete((req, res, next) => {
    const user_id = req.params.user_id;
    UserService.deleteUserById(req.app.get('db'), user_id)
      .then(result => res.send(result))
      .catch(next)
  })
module.exports = usersRoute;
