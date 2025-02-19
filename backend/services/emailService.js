const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465, // SSL port (use 587 for TLS)
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // Zoho email
    pass: process.env.EMAIL_PASS, // Zoho App Password
  },
});

/**
 * Send verification email
 */
const sendVerificationEmail = async (to, code) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: "Verify Your UniNest Account",
      html: `
        <h2>Welcome to UniNest!</h2>
        <p>Your verification code is: <b>${code}</b></p>
        <p>Please enter this code in the app to verify your email.</p>
        <br/>
        <p>Best Regards,<br/>The UniNest Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", to);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

/**
 * Send welcome email after successful verification
 */
const sendWelcomeEmail = async (to, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: "Welcome to UniNest!",
      html: `
        <h2>Hello, ${name}!</h2>
        <p>Thank you for verifying your email. Welcome to UniNest!</p>
        <p>We’re excited to help you find your perfect boarding house.</p>
        <br/>
        <p>Best Regards,<br/>The UniNest Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent to:", to);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

module.exports = { sendVerificationEmail, sendWelcomeEmail };
