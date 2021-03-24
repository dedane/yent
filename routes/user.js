
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORTMAIL,
    secure: false,
    auth: {
        user: process.env.USERCRED,
        pass: process.env.USERKEY,
    }
})

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then( user => {
        if (user.length >= 1){
            return res.status(409).json({
                message: 'Mail Exists'
            });
        } /* else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err){
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                        });
                        user
                        .save()
                        .then( result => {
                            res.status(200).json({
                                _id: result._id,
                                email: result.email,
                                password: result.password,
                                message: 'User Created'

                            });
                        })
                        .catch( err => {
                            res.status(500).json({
                                error: err
                            });
                        });
                }
            
            });
        } */
        const email = req.body.email;
        const password = req.body.password;

        const hash = await bcrypt.hash(password, 12)

        crypto.randomBytes(32, async (err,buffer) => {
            try {
                let tokenEmailVerify =bufer.toString("hex");
                console.log('verify token', tokenEmailVerify);
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: email,
                    emailToken: tokenEmailVerify,
                    emailVerification: false,
                    password: hash
                })
                const saveUser = await user.save();

                const data = {
                    from: 'info@yents.com',
                    to: email,
                    Subject: "Account Activation Link",
                    html: `
                    <h2>Please click on given link to activate account</h2>
                    <p>${process.env.CLIENT_URL}/authentication/activate/${token}</p>`
                };
                const finalSaveUser = await saveUser.save();
                transporter.sendMail(mailOptions, function (err, data) {
                  if (err) {
                    console.log(err);
                  }
                });
                const token = jwt.sign(
                    {
                      email: email,
                      userId: saveUser._id,
                    },
                    process.env.SECRET,
                    { expiresIn: "48h" }
                  );
                  res.status(201).json({token: token,id: saveUser._id.toString(), message:"user created!"});
            }
            catch (error) {
                if(!error.statusCode) {
                    error.statusCode = 500;
                }
                next(error);
            }
        })
        
        /* mg.message().send(data, function (error, body) {
            if (error){
                return res.json({
                    message: err.message
                })
            }
            return res.json({ message: 'Activate account in your email'});
        }); */
    });
    
});

router.get("/", (req, res, next) =>{
 User.find()
 .select('email password _id')
 .exec()
 .then( docs => {
     res.status(200).json({
         count: docs.length,
         user: docs.map(doc =>{
             return{
                 id: doc._id,
                 email: doc.email,
                 password: doc.password,
                 request:{
                    type: "GET",
                    url: "http://localhost:3000/user/" + doc._id
                }
             };
         })
     });
 })
 .catch(err =>{
     console.log(err);
     res.status(500).json({
         error: err
     });
 });

});

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email})
    .exec()
    .then( user => {
        if (user.length < 1){
            return res.status(401).json({
                message: 'Mail not found, user doesn\'t exist'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            //tOKEN CONVERSION FOR LOGIN
            if(result){
                const token = jwt.sign(
                {
                    email: user[0].email,
                    userId: user[0]._id
                }, 
                'SECRET',
                {
                    expiresIn: '1h'
                });
                return res.status(200).json({
                    message: 'Auth Successful',
                    token: token
                });
            }
            res.status(401).json({
                message: 'Auth Failed'
            });
        });
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.put('./forgot-password', (req,res,next) => {
    User.find({ email: req.body.email}, (err, user) => {
        if(err || user){
            return res.status(400).json({
                error: "User with this email does not exist"
            });
        }

        const token = jwt.sign({email, password}, process.env.JWT_KEY, {expiresIn: '20m'});

        const data = {
            from: 'info@yents.com',
            to: email,
            Subject: "Account Activation Link",
            html: `
            <h2>Please click on given link to activate account</h2>
            <p>${process.env.CLIENT_URL}/authentication/activate/${token}</p>`
        };
        mg.message().send(data, function (error, body) {
            if (error){
                return res.json({
                    message: err.message
                })
            }
            return res.json({ message: 'Activate account in your email'});
        });
    })
})


router.delete('/:userId', (req, res ,next) =>{
    User.remove({
        _id: req.params.userId
    })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'user Deleted',
            
        });

    })
    .catch( result => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

});


router.patch('/signup/:userId', ( req, res ,next) => {
    const id = req.params.userId;
    User.updateOne({ _id: id},
    { $set: { phonenumber: req.body.phonenumber }}
    )
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: "successfull Updated"});
    })
    .catch(error => {
        console.log(error);
        res.status(500).send({
            error: error
        }); 
    });
})

module.exports = router;