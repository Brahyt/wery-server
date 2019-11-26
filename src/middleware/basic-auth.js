const bcrypt = require('bcryptjs');

function requireAuth(req, res, next) {
  let basicToken;
  const authToken = req.get('Authorization') || '';

  if(!authToken.toLowerCase().startsWith('basic ')){
    return res.status(401).json({error: "Missing auth token"});
  } else {
    basicToken = authToken.slice('basic '.length, authToken.length);
  }
  const [user_email, user_password] = Buffer
    .from(basicToken, 'base64')
    .toString()
    .split(':');
  if (!user_email || !user_password) {
    return res.status(401).json({error: "Unauthorized request"});
  }

  req.app.get('db')('users')
    .where({user_email: user_email})
    .first()
    .then(user => {
      if (!user) {
        return res.status(401).json({error: 'Unauthorized request'});
      }
      return bcrypt.compare(tokenPassword, user_password)
    })
    .catch(next);
}

module.exports = {requireAuth};
