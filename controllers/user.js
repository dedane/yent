
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
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
    tls: { 
        rejectUnauthorized: false 
    }
})
const { validationResult } = require('express-validator');
const User = require('../models/user');
const { getMaxListeners } = require('../models/user');

exports.registerUser =  (req, res, next) => {
    /* try {
        const errors = validationResult(req);

        if (!errors.isEmpty()){
            const error = new Error("Validation failed.");
            error.statusCode = 422;
            error.data = errors.array();

            throw error;
        }
        const email = req.body.email;
        const password = req.body.password;

        const hash =  bcrypt.hash(password, 12)

    crypto.randomBytes(32, async (err,buffer) => {
        try {
            let tokenEmailVerify = buffer.toString("hex");
            console.log('verify token', tokenEmailVerify);
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: email,
                emailToken: tokenEmailVerify,
                emailVerification: false,
                password: hash
            })
            const saveUser = await user.save();

            const mailOptions = {
                from: 'info@yenafrica.net',
                to: email,
                Subject: "EMAIL VERIFICATION LINK",
                html: `
                <h2>Please click on given link to activate account</h2>
                <p>${process.env.CLIENT_URL}/authentication/activate/${token}</p>`
            };
            const finalSaveUser = await saveUser.save();
            transporter.sendMail(mailOptions, function (err) {
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
    
    }
    catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    } */
    const email = req.body.email;
    const password = req.body.password;
    User.find({email: req.body.email})
    .exec((err, user) => {
       
            if (user){
                return res.status(409).json({
                    error: err
                });
            }
            
        const token = jwt.sign({email, password}, process.env.JWT_KEY, {expiresIn: '20m'})   
        const mailOptions = {
            from: 'info@yenafrica.net',
            to: email,
            subject: "EMAIL VERIFICATION LINK",
            html: `
            <h2>Please click on given link to activate account</h2>
            <p>${process.env.CLIENT_URL}/authentication/activate/${token}</p>`
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                return console.log(error) 
            }
            console.log('Message sent: %s', info.messageId);   
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))

            return res.json({message: 'Email has been sent click to verify'})
        })
    })
}

exports.verification = async (req, res, next) => {
    try {
      const token = req.params.token;
  
      let findUser = await User.findOne({
        emailToken: token,
      });
      if (!findUser) {
        const error = new Error("No Match/ Expired");
        error.statusCode = 500;
        throw error;
      }
  
      findUser.emailToken = undefined;
      findUser.emailVerification = true;
  
      const saveUser = await findUser.save();
  
      res.status(200).json("Email Verified");
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  };

