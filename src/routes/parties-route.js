const express = require('express');
const partiesRoute  = express.Router();
const jsonParse = express.json();
const PartiesService = require('../services/parties-service');
const {requireAuth} = require('../middleware/basic-auth');

partiesRoute
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    PartiesService.getAllParties(req.app.get('db'))
      .then(result => {
        res.json(PartiesService.serializeAllPartyReturn(result));
      })
      .catch(next);
  })
  .post(jsonParse, (req, res, next) => {
    const newParty = req.body;
    PartiesService.createNewParty(req.app.get('db'), newParty)
      .then(result => {
        res.json(PartiesService.serializePartyReturn(result));
      })
      .catch(next);
  });

partiesRoute
  .route('/:party_id')
  .all(requireAuth)
  .get((req, res, next) => {
    PartiesService.getPartyById(req.app.get('db'), req.params.party_id)
      .then(result => {
        if(result.length === 0) {
          res.status(404).json({error:  "No party with that id"});
        } else {
          res.json(PartiesService.serializeParty(result));
        }
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    console.log("ACTIVATE DELETE")
    PartiesService.deletePartyById(req.app.get('db'), req.params.party_id)
      .then(() => {
        return res.json({"message": "party delteted"});
      });
  });


module.exports = partiesRoute;
