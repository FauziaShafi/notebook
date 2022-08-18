const jwt = require("jsonwebtoken");

const jwt_secret = process.env.SECRET_KEY;
const fetchuser = (req, res, next) => {
  // Get the token from header
  const token = req.token("auth-token");
  if (!token) {
    res.send(401).send({ error: "Please authenticate using valid token" });
  }
  // Verify the token
  const data = jwt.verify(token, jwt_secret);
  req.user = data.user;

  // Execute next()
  next();
};

module.exports = fetchuser;
