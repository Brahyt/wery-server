const express = require('express');
const charactersRoute  = express.Router();
const parseJson = express.json();
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
  .patch(parseJson, (req, res) => {
    const char_id = req.params.char_id
    const updatedChar = req.body
    CharactersService.updateCharacter(req.app.get('db'), char_id, updatedChar)
      .then(result => {
        res.json(result)
      })
  })
  .delete((req, res) => {
    const char_id = req.params.char_id
    CharactersService.deleteCharacter(req.app.get('db'), char_id)
      .then(result => {
        if(!result) {
          res.json({error: "no character with that ID"})
        }
        res.json({message: "character deleted"})
      })
  })

module.exports = charactersRoute;
