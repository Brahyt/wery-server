const express = require('express');
const charactersRoute  = express.Router();
const CharactersService = require('../services/characters-service');

// ADDED THIS LAST
charactersRoute
  .get('/', (req, res) => {
    CharactersService.getAllCharacters(req.app.get('db'))
      .then(resi => res.send(resi)); // <<<<<<<< LEFT OFF HERE
  });

module.exports = charactersRoute;
