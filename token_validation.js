const jwt = require("jsonwebtoken");

module.exports = {
  checkToken: (req, res, next) => {
    let token = req.cookies.authToken;
    if (token) {
    //key is qwe1234
      jwt.verify(token, "qwe1234", (err, decoded) => {
        if (err) {
              res.render('login-page', {
                message: 'You are unauthorized, please sign in again.',
              });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.render('login-page', {
        message: 'You are unauthorized, please sign in again.',
      });
    }
  }
};