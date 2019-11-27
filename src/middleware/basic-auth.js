const bcrypt = require('bcryptjs');
const AuthService = require('../services/auth-service')

function requireAuth(req, res, next) {
  let bearerToken;
  const authToken = req.get('Authorization') || '';
  if (!authToken.toLowerCase().startsWith('bearer ')){
    return res.status(401).json({error: "Missing auth token"})
  }
  else {
    console.log(authToken)
    console.log('SLICE!')
    bearerToken = authToken.slice(7, authToken.length)
    console.log("BEAERER TOKEN", bearerToken)
  }
  try {
    AuthService.verifyJwt(bearerToken)
    next()
  } catch(error){
    res.status(401).json({error: 'Unauthorized request'})
  }
}



module.exports = {requireAuth};
