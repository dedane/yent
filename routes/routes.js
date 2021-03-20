// routes/router.js
router.get("/verify/:userID/:token", (req, res, next) => {
    let userID = req.params.userID;
    let token = req.params.token;

        User.find({ _id: req.body._id })
        .select('_id')
        .exec()
        // user does not exists
        .then(docs => {
            if (docs._id) {
                throw err;
                return res.status(400).send({
                  msg: err,
                });
              }
        })
        
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
        router.post('/signup', (req,res,err,result) => {
            User.find({ _id: req.body._id })
            .exec()
            // user does not exists
            .then(err => {
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