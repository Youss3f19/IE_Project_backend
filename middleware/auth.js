const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Retrieve the Authorization header
  const authHeader = req.header('Authorization');
  

  // Check if the Authorization header is present
  if (!authHeader) {
    return res.status(401).send({ message: 'Access Denied. No token provided.' });
  
  }

  // Remove 'Bearer ' from the token string
  const token = authHeader.replace('Bearer ', '');
  
  try {
    // Verify the token
    const verified = jwt.verify(token, '123456789'); 
    req.user = verified; // Attach the verified token payload to req.user
    next(); // Proceed to the next middleware
  } catch (err) {
    // If token verification fails, return an error
    res.status(400).send({ message: 'Invalid Token' + err });
  }
};
