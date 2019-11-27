const express = require('express');
const authRoute  = express.Router();
const jsonParse = express.json();
const AuthService = require('../services/auth-service');

authRoute
  .route('/login')
  .post(jsonParse, (req, res, next) => {
    let grabUser;
    let token = req.body
    return AuthService.getUserWithUserName(req.app.get('db'), token.user_email)
      .then(userInfo => {
        let grabUser = userInfo
        return AuthService.comparePasswords(token.user_password, userInfo.user_password)
          .then(result => {
            if(!result){
              res.status(403).json({error: "Incorrect username or password"})
            } else {
              const subject = grabUser.user_email;
              const payload = {user_id: grabUser.user_id}
              return res.send({
                authToken: AuthService.createJwt(subject, payload)
              })
            }
          })
          .catch(next);
      });
    //    for (const [key, value] of Object.entries(loginUser))
    //      if (value == null)
    //        return res.status(400).json({
    //          error: `Missing ${key} in request body`
    //        })
  });
module.exports = authRoute;
