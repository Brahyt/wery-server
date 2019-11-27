const express = require('express');
const authRoute  = express.Router();
const jsonParse = express.json()

authRoute
  .route('/login')
  .post(jsonParse, (req, res, next) => {
    const token = req.body
    console.log(token)
    //    for (const [key, value] of Object.entries(loginUser))
    //      if (value == null)
    //        return res.status(400).json({
    //          error: `Missing ${key} in request body`
    //        })
    res.send('ok')
  });
module.exports = authRoute;
