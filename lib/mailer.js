// lib/mailer.js

const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = {
    async sendOptInMail(email, userID, token) {
      let activationLink = `${process.env.BASE_URL}api/verify/${userID}/${token}`;
      let mail = {
        from: process.env.SENDER_MAIL,
        to: email,
        subject: "Please active your account",
        text: `To activate your account, please click this link: ${activationLink}`,
        html: `<p>To activate your account, please click this link: <a href="${activationLink}">${activationLink}</a></p>`,
      };
      await transporter.sendMail(mail);
    },
  };