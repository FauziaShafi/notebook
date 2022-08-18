const jwt = require("jsonwebtoken");
const jwt_secret = "secretkey";
const fetchuser = (req, res, next) => {
  // Get the token from header
  const token = req.header("auth-token");
  if (!token) {
    res.send(401).send({ error: "Please authenticate using valid token" });
  }
  try {
    // Verify the token
    const data = jwt.verify(token, jwt_secret);
    req.user = data.user;

    // Execute next()
    next();
  } catch (error) {
    res.send(401).send({ error: "Please authenticate using valid token" });
  }
};

module.exports = fetchuser;
