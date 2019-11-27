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
    console.log(newUser)
    UserService.createUser(req.app.get('db'), newUser)
      .then(user => {
        res.json(user);
      })
    .catch(next)
  });
usersRoute
  .route('/:user_id')
  .get((req, res) => {
    const user_id = req.params.user_id;
    UserService.getUserById(req.app.get('db'), user_id)
      .then(user => {
        res.send(user).status(200);
      });
  })
  .delete((req, res) => {
    const user_id = req.params.user_id;
    UserService.deleteUserById(req.app.get('db'), user_id)
      .then(result => res.send(result));
  });
module.exports = usersRoute;
