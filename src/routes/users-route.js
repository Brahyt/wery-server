const express = require('express');
const usersRoute  = express.Router();

usersRoute
  .get('/', (req, res) => {
    res.status(200).send('users')
  })

module.exports = usersRoute;
