const express = require('express');
const partiesRoute  = express.Router();
const jsonParse = express.json();
const PartiesService = require('../services/parties-service');

partiesRoute
  .route('/')
  .get((req, res) => {
    PartiesService.getAllParties(req.app.get('db'))
      .then(result => {
        res.json(PartiesService.serializeAllPartyReturn(result))
      })
  })
  .post(jsonParse, (req, res) => {
    const newParty = req.body
    PartiesService.createNewParty(req.app.get('db'), newParty)
      .then(result => {
        res.json(PartiesService.serializePartyReturn(result))
      })
  })

partiesRoute
  .route('/:party_id')
  .get((req, res, next) => {
    const party_id = req.params.party_id
    PartiesService.getPartyById(req.app.get('db'), party_id)
      .then(result => {
        if(!result.body) {
          res.send(404)
        } else {
          res.json(PartiesService.serializeParty(result))
        }
      })
      .catch(next)
  })


module.exports = partiesRoute;
