const express = require('express');
const partiesRoute  = express.Router();

partiesRoute
  .get('/', (req, res) => {
    res.status(200).send('parties')
  })

module.exports = partiesRoute;
