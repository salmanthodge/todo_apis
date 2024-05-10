require("dotenv").config()
const jwt = require("jsonwebtoken");

const jwt_key = process.env.JWT_SECRET_KEY

const authMiddleware = (req, res, next) => {
    // const { user_id, token } = req.headers;
    if (req.headers  && req.headers.token) {
      try {
        const token = req.headers.token;
        // const decodedtoken = jwt.verify(token, "test");
        const decodedtoken = jwt.verify(token, jwt_key);
        // console.log(decodedtoken);
      } catch (err) {
        // console.log(err);
        res.status(400).send({
          message: "Invalid Token",
        });
      }
      next();
      return;
    }
    res.status(400).send({
      message: "Token required",
    });
  };

  module.exports = authMiddleware