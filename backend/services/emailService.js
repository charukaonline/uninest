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

const sendInquiryEmail = async (inquiryType, email, name, phone, message) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "nkcharuka1@gmail.com",
      subject: `New Inquiry: ${inquiryType}`,
      replyTo: email,
      html: `
        <h2>New Inquiry from Website</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending inquiry email:", error);
    throw error; // Re-throw the error to be handled by the controller
  }
};

const informLandlordVerify = async (email, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "UniNest Account Verification",
      html: `
        <h2>Hello, ${name}!</h2>
        <p>Your account has been verified</p>
        <p>Now you can log into your dashboard and add listings</p>
        <br/>
        <p>Best Regards,<br/>The UniNest Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to landlord:", email);
  } catch (error) {
    console.error("Error sending verification email to landlord:", error);
  }
};

const sendScheduleNotification = async (studentEmail, studentName, landlordEmail, landlordName, listingName, date, time) => {
  try {
    // Email to student
    const studentMailOptions = {
      from: process.env.EMAIL_USER,
      to: studentEmail,
      subject: "Visit Schedule Confirmation - UniNest",
      html: `
        <h2>Hello, ${studentName}!</h2>
        <p>Your visit to <b>${listingName}</b> has been scheduled successfully.</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p>The landlord has been notified of your visit. Please make sure to arrive on time.</p>
        <br/>
        <p>Best Regards,<br/>The UniNest Team</p>
      `,
    };

    // Email to landlord
    const landlordMailOptions = {
      from: process.env.EMAIL_USER,
      to: landlordEmail,
      subject: "New Visit Schedule - UniNest",
      html: `
        <h2>Hello, ${landlordName}!</h2>
        <p>A student has scheduled a visit to your property <b>${listingName}</b>.</p>
        <p><strong>Student:</strong> ${studentName}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p>Please ensure you or your representative is available at the specified time.</p>
        <br/>
        <p>Best Regards,<br/>The UniNest Team</p>
      `,
    };

    // Send both emails
    await transporter.sendMail(studentMailOptions);
    console.log("Schedule notification sent to student:", studentEmail);

    await transporter.sendMail(landlordMailOptions);
    console.log("Schedule notification sent to landlord:", landlordEmail);

    return true;
  } catch (error) {
    console.error("Error sending schedule notification emails:", error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendInquiryEmail,
  informLandlordVerify,
  sendScheduleNotification
};
