const express = require('express');
const charactersRoute = express.Router();
const parseJson = express.json();
const CharactersService = require('../services/characters-service');

charactersRoute.route('/').get((req, res, next) => {
  const auth_key = req.app.get('Authorization');
  CharactersService.getAllCharacters(req.app.get('db'), 1)
    .then(result => res.status(200).send(result))
    .catch(next);
});

charactersRoute
  .route('/:char_id')
  .get((req, res, next) => {
    const char_id = req.params.char_id;
    CharactersService.getCharacterById(req.app.get('db'), char_id)
      .then(result => {
        if (!result) {
          return res.status(404).json({error: 'No Character with that id'});
        }
        return res.json(CharactersService.SerializeCharacter(result));
      })
      .catch(next);
  })
  .patch(parseJson, (req, res, next) => {
    const char_id = req.params.char_id;
    const updatedChar = req.body;
    CharactersService.checkCharacterExists(req.app.get('db'), char_id)
      .then(result => {
        if (!result) {
          return res.status(404).json({error: 'No Character with that id'});
        } else {
          return CharactersService.updateCharacter(
            req.app.get('db'),
            char_id,
            updatedChar
          )
            .then(result => {
              return res.send(result);
            });
        }
      })
      .catch(next);
  })
  .delete((req, res) => {
    const char_id = req.params.char_id;
    CharactersService.deleteCharacter(req.app.get('db'), char_id).then(
      result => {
        if (!result) {
          res.json({error: 'no character with that ID'});
        }
        res.json({message: 'character deleted'});
      }
    );
  });

module.exports = charactersRoute;
