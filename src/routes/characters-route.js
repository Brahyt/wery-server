const express = require('express');
const charactersRoute  = express.Router();
const CharactersService = require('../services/characters-service');

charactersRoute
  .route('/')
  .get((req, res) => {
    const auth_key = req.app.get('Authorization')
    CharactersService.getAllCharacters(req.app.get('db'), 1)
      .then(()=> res.status(200).send('characters'))
  });

charactersRoute
  .route('/:char_id')
  .get((req, res) => {
    const char_id = req.params.char_id
    CharactersService.getCharacterById(req.app.get('db'), char_id)
      .then(result => {
        res.json(CharactersService.SerializeCharacter(result))
      })
  })

module.exports = charactersRoute;
