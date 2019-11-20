const express = require('express');
const partiesRoute  = express.Router();
const PartiesService = require('../services/parties-service')

partiesRoute
  .get('/', (req, res) => {
    res.send(200)
  })

partiesRoute
  .get('/:party_id', (req, res) => {
    const party_id = req.params.party_id
    PartiesService.getPartyById(req.app.get('db'), party_id)
      .then(result => {
        res.json(PartiesService.serializeParty(result))
      })
  })

module.exports = partiesRoute;
