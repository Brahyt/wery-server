const express = require('express');
const charactersRoute  = express.Router();

charactersRoute
  .get('/', (req, res) => {
    res.status(200).send('characters')
  })

module.exports = charactersRoute;
