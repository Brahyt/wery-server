const express = require('express');
const charactersRoute = express.Router();
const parseJson = express.json();
const CharactersService = require('../services/characters-service');
const {requireAuth} = require('../middleware/basic-auth')

function validateCharacter(req, res, next) {
  const error = {error: 'You are missing values'};
  const char = req.body;
  if (!req.body) return res.json(error).status(400);
  if (!char.name) return res.json(error).status(400);
  if (!char.race) return res.json(error).status(400);
  if (!char.char_class) return res.json(error).status(400);
  if (!char.sub_class) return res.json(error).status(400);
  if (!char.xp) return res.json(error).status(400);
  if (!char.hand_size) return res.json(error).status(400);
  if (!char.health) return res.json(error).status(400);
  if (!char.arcane) return res.json(error).status(400);
  if (!char.deception) return res.json(error).status(400);
  if (!char.martial) return res.json(error).status(400);
  if (!char.devotion) return res.json(error).status(400);
  if (!char.party_id) return res.json(error).status(400);
  if (!char.user_id) return res.json(error).status(400);
  if (!char.sticker_1_id) return res.json(error).status(400);
  if (!char.sticker_2_id) return res.json(error).status(400);
  if (!char.sticker_3_id) return res.json(error).status(400);
  if (!char.sticker_4_id) return res.json(error).status(400);
  if (!char.sticker_5_id) return res.json(error).status(400);
  if (!char.sticker_6_id) return res.json(error).status(400);
  next();
}

charactersRoute
  .route('/')
//  .all(requireAuth)
  .get((req, res, next) => {
    CharactersService.getAllCharacters(req.app.get('db'), 1)
      .then(result => res.status(200).send(result))
      .catch(next);
  })
  .post(parseJson, validateCharacter, (req, res, next) => {
    CharactersService.addCharacter(req.app.get('db'), req.body)
      .then(result => res.status(200).send(result))
      .catch(next);
  });

charactersRoute
  .route('/:char_id')
//  .all(requireAuth)
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
          ).then(result => {
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
