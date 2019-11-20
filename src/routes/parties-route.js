const express = require('express');
const partiesRoute  = express.Router();
const jsonParse = express.json();
const PartiesService = require('../services/parties-service');

partiesRoute
  .route('/')
  .get((req, res) => {
    res.send(200)
  })
  .post(jsonParse, (req, res) => {
    const newParty = req.body
    console.log('create party')
    PartiesService.createNewParty(req.app.get('db'), newParty)
      .then(result => {
        console.log('RESULT', result)
        res.json(PartiesService.serializePartyReturn(result))
      })
  })

partiesRoute
  .route('/:party_id')
  .get((req, res) => {
    const party_id = req.params.party_id
    PartiesService.getPartyById(req.app.get('db'), party_id)
      .then(result => {
        res.json(PartiesService.serializeParty(result))
      })
  })

module.exports = partiesRoute;
