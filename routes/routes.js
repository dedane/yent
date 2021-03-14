// routes/router.js
router.get("/verify/:userID/:token", (req, res, next) => {
    let userID = req.params.userID;
    let token = req.params.token;
    db.query(
      `SELECT * FROM users WHERE id = ${db.escape(userID)}`,
      (err, result) => {
        // user does not exists
        if (err) {
          throw err;
          return res.status(400).send({
            msg: err,
          });
        }
        // no result from database
        if (!result.length) {
          return res.status(409).send({
            msg: "The requested parameters are incorrect!",
          });
        }
        // already activated
        if (result[0]["active"]) {
          return res.status(409).send({
            msg: "Account is already activated!",
          });
        }
        // wrong activation token
        if (result[0]["token"] !== token) {
          return res.status(401).send({
            msg: "The requested parameters are incorrect!",
          });
        }
        // set account active
        db.query(
          `UPDATE users SET active = 1 WHERE id = '${userID}'`,
          (err, result) => {
            if (err) {
              throw err;
              return res.status(400).send({
                msg: err,
              });
            }
            return res.status(200).send({
              msg: "Account activated",
            });
          }
        );
      }
    );
  });