/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');
  // const token = req.cookies.jwt for backend test

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({msg: 'No token, authorization denied'});
  }

  try {
    const tokenValue = token.split(' ')[1];
    const decoded = jwt.verify(tokenValue, secretKey);
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({msg: 'Token is not valid', error: err});
  }
};

module.exports = authenticateJWT;
