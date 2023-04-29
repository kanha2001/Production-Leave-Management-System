const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(200).send({
          message: "Auth Failled",
          success: false,
        });
      } else {
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: "Auth Failed",
      success: false,
    });
  }
};

// const JWT = require("jsonwebtoken");

// module.exports = async (req, res, next) => {
//   try {
//     const authHeader = req.headers["authorization"];
//     if (!authHeader) {
//       return res.status(401).send({
//         message: "Authorization header missing",
//         success: false,
//       });
//     }
//     const token = authHeader.split(" ")[1] || "";
//     JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
//       if (err) {
//         return res.status(200).send({
//           message: "Auth Failed",
//           success: false,
//         });
//       } else {
//         req.body.userId = decode.id;
//         next();
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(401).send({
//       message: "Auth Failed",
//       success: false,
//     });
//   }
// };
