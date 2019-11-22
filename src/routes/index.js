const express = require('express');
const apiRoute = express.Router();
const usersRoute = require('./users-route')
const partiesRoute = require('./parties-route')
const charactersRoute = require('./characters-route')
const stickersRoute = require('./stickers-route')

apiRoute.use('/users', usersRoute)
apiRoute.use('/parties', partiesRoute)
apiRoute.use('/characters', charactersRoute)
apiRoute.use('/stickers', stickersRoute)
module.exports = apiRoute;
