const bcrypt = require('bcryptjs');

function requireAuth(req, res, next) {
  let basicToken;
  //  const authToken = req.get('Authorization') || '';
  //
  //  if(!authToken.toLowerCase().startsWith('basic ')){
  //    return res.status(401).json({error: "Missing auth token"});
  //  } else {
  //    basicToken = authToken.slice('basic '.length, authToken.length);
  //  }
  //      req.user_id = user.user_id
      next();
  //    })
  //    .catch(next);
}

module.exports = {requireAuth};
