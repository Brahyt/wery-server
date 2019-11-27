const express = require('express');
const authRoute  = express.Router();
const jsonParse = express.json()
const AuthService = require('../services/auth-service')

authRoute
  .route('/login')
  .post(jsonParse, (req, res, next) => {
    const token = req.body
    console.log("TOKEN", token)
    AuthService.getUserWithUserName(req.app.get('db'), token.user_email)
      .then(result => {
        AuthService.comparePasswords(token.user_password, result.user_password) 
          .then(result => {
            if(!result){
              res.send(403)
            } else {
              res.send('ok')
            }
          })
      })
    //    for (const [key, value] of Object.entries(loginUser))
    //      if (value == null)
    //        return res.status(400).json({
    //          error: `Missing ${key} in request body`
    //        })
  });
module.exports = authRoute;
