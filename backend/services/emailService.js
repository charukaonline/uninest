const nodemailer = require("nodemailer");
require("dotenv").config();

const User = require("../models/User");
const Subscription = require("../models/Subscription");

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
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #006845; padding: 20px; text-align: center; }
            .header h1 { color: white; margin: 0; }
            .content { padding: 30px; background-color: #f9f9f9; border-radius: 4px; margin: 20px 0; }
            .code { display: inline-block; padding: 10px 20px; background-color: #006845; color: white; font-weight: bold; font-size: 20px; border-radius: 4px; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { background-color: #006845; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>UniNest</h1>
            </div>
            <div class="content">
              <h2>Welcome to UniNest!</h2>
              <p>Thank you for joining our community. To complete your registration, please verify your email address with the code below:</p>
              <div class="code">${code}</div>
              <p>Please enter this code in the app to verify your email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} UniNest. All rights reserved.</p>
              <p>If you did not create an account, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
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
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #006845; padding: 20px; text-align: center; }
            .header h1 { color: white; margin: 0; }
            .content { padding: 30px; background-color: #f9f9f9; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .name { color: #006845; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>UniNest</h1>
            </div>
            <div class="content">
              <h2>Hello, <span class="name">${name}</span>!</h2>
              <p>Thank you for verifying your email. Welcome to UniNest!</p>
              <p>We're excited to help you find your perfect boarding house. Our platform connects students with quality accommodation options near your university.</p>
              <p>Feel free to explore listings and reach out if you need any assistance.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} UniNest. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
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
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #006845; padding: 20px; text-align: center; }
            .header h1 { color: white; margin: 0; }
            .content { padding: 30px; background-color: #f9f9f9; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .label { font-weight: bold; color: #006845; }
            .message { background-color: white; padding: 15px; border-left: 4px solid #006845; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>UniNest Inquiry</h1>
            </div>
            <div class="content">
              <h2>New Inquiry from Website</h2>
              <p><span class="label">From:</span> ${name} (${email})</p>
              <p><span class="label">Phone:</span> ${
                phone || "Not provided"
              }</p>
              <p><span class="label">Inquiry Type:</span> ${inquiryType}</p>
              <p><span class="label">Message:</span></p>
              <div class="message">${message}</div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} UniNest. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
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
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #006845; padding: 20px; text-align: center; }
            .header h1 { color: white; margin: 0; }
            .content { padding: 30px; background-color: #f9f9f9; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>UniNest</h1>
            </div>
            <div class="content">
              <h2>Hello, ${name}!</h2>
              <p>Your account has been verified</p>
              <p>Now you can log into your dashboard and add listings</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} UniNest. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to landlord:", email);
  } catch (error) {
    console.error("Error sending verification email to landlord:", error);
  }
};

const sendScheduleNotification = async (
  studentEmail,
  studentName,
  landlordEmail,
  landlordName,
  listingName,
  date,
  time
) => {
  try {
    // Email to student
    const studentMailOptions = {
      from: process.env.EMAIL_USER,
      to: studentEmail,
      subject: "Visit Schedule Confirmation - UniNest",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #006845; padding: 20px; text-align: center; }
            .header h1 { color: white; margin: 0; }
            .content { padding: 30px; background-color: #f9f9f9; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>UniNest</h1>
            </div>
            <div class="content">
              <h2>Hello, ${studentName}!</h2>
              <p>Your visit to <b>${listingName}</b> has been scheduled successfully.</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${time}</p>
              <p>The landlord has been notified of your visit. Please make sure to arrive on time.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} UniNest. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Email to landlord
    const landlordMailOptions = {
      from: process.env.EMAIL_USER,
      to: landlordEmail,
      subject: "New Visit Schedule - UniNest",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #006845; padding: 20px; text-align: center; }
            .header h1 { color: white; margin: 0; }
            .content { padding: 30px; background-color: #f9f9f9; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>UniNest</h1>
            </div>
            <div class="content">
              <h2>Hello, ${landlordName}!</h2>
              <p>A student has scheduled a visit to your property <b>${listingName}</b>.</p>
              <p><strong>Student:</strong> ${studentName}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${time}</p>
              <p>Please ensure you or your representative is available at the specified time.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} UniNest. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
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

/**
 * Send schedule status update email to student when landlord accepts or rejects
 */
const sendScheduleStatusEmail = async (
  studentEmail,
  studentName,
  landlordName,
  listingName,
  date,
  time,
  status
) => {
  try {
    // Email content will differ based on whether the schedule was accepted or rejected
    const subject =
      status === "confirmed"
        ? "Visit Schedule Confirmed - UniNest"
        : "Visit Schedule Rejected - UniNest";

    const statusMessage =
      status === "confirmed"
        ? `<p>Your scheduled visit to <b>${listingName}</b> has been <span style="color: green; font-weight: bold;">CONFIRMED</span> by the landlord.</p>
         <p>Please make sure to arrive at the property on time.</p>`
        : `<p>We regret to inform you that your scheduled visit to <b>${listingName}</b> has been <span style="color: red; font-weight: bold;">REJECTED</span> by the landlord.</p>
         <p>This could be due to schedule conflicts or other reasons. You may want to contact the landlord directly for more information or schedule a different time.</p>`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: studentEmail,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #006845; padding: 20px; text-align: center; }
            .header h1 { color: white; margin: 0; }
            .content { padding: 30px; background-color: #f9f9f9; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>UniNest</h1>
            </div>
            <div class="content">
              <h2>Hello, ${studentName}!</h2>
              ${statusMessage}
              <p><strong>Property:</strong> ${listingName}</p>
              <p><strong>Landlord:</strong> ${landlordName}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${time}</p>
              <p>If you have any questions, please contact us or the landlord directly.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} UniNest. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(
      `Schedule ${status} notification sent to student:`,
      studentEmail
    );
    return true;
  } catch (error) {
    console.error(
      `Error sending schedule ${status} notification email:`,
      error
    );
    throw error;
  }
};

const sendReportEmail = async (
  reporterName,
  reporterEmail,
  listingName,
  reportType,
  description
) => {
  try {
    // Confirmation email to reporter
    const reporterMailOptions = {
      from: process.env.EMAIL_USER,
      to: reporterEmail,
      subject: "Your Report Has Been Received - UniNest",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #006845; padding: 20px; text-align: center; }
            .header h1 { color: white; margin: 0; }
            .content { padding: 30px; background-color: #f9f9f9; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>UniNest</h1>
            </div>
            <div class="content">
              <h2>Hello, ${reporterName}!</h2>
              <p>Thank you for submitting a report. Your report regarding <b>${listingName}</b> has been received.</p>
              <p><strong>Report Type:</strong> ${reportType}</p>
              <p>Our administrative team will review your report and take appropriate action. You may be contacted if we need additional information.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} UniNest. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(reporterMailOptions);
    console.log("Report confirmation sent to reporter:", reporterEmail);

    return true;
  } catch (error) {
    console.error("Error sending report notification emails:", error);
    throw error;
  }
};

/**
 * Send password reset email with verification code
 */
const sendPasswordResetEmail = async (to, code) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: "Reset Your UniNest Password",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #006845; padding: 20px; text-align: center; }
            .header h1 { color: white; margin: 0; }
            .content { padding: 30px; background-color: #f9f9f9; border-radius: 4px; margin: 20px 0; }
            .code { display: inline-block; padding: 10px 20px; background-color: #006845; color: white; font-weight: bold; font-size: 20px; border-radius: 4px; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { background-color: #006845; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>UniNest</h1>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>You requested to reset your password for your UniNest account.</p>
              <div class="code">${code}</div>
              <p>This code will expire in 1 hour.</p>
              <p>If you didn't request this, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} UniNest. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to:", to);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

// Add this function to your email service

exports.sendPasswordResetEmail = async (to, code) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: "Reset Your UniNest Password",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #006845; padding: 20px; text-align: center; }
            .header h1 { color: white; margin: 0; }
            .content { padding: 30px; background-color: #f9f9f9; border-radius: 4px; margin: 20px 0; }
            .code { display: inline-block; padding: 10px 20px; background-color: #006845; color: white; font-weight: bold; font-size: 20px; border-radius: 4px; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { background-color: #006845; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>UniNest</h1>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>You requested to reset your password for your UniNest landlord account.</p>
              <div class="code">${code}</div>
              <p>This code will expire in 1 hour.</p>
              <p>If you didn't request this, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} UniNest. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to:", to);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

/**
 * Send subscription confirmation email
 */
const sendSubscriptionConfirmationEmail = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "UniNest Premium Subscription Confirmation",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #006845; padding: 20px; text-align: center; }
            .header h1 { color: white; margin: 0; }
            .content { padding: 30px; background-color: #f9f9f9; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .name { color: #006845; font-weight: bold; }
            .button { background-color: #006845; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>UniNest</h1>
            </div>
            <div class="content">
              <h2>Thank you for subscribing to UniNest Premium!</h2>
              <p>Dear ${user.username},</p>
              <p>Your premium subscription has been activated successfully. You now have access to unlimited property listings and all premium features.</p>
              <p>Your subscription will expire in 30 days. We will send you a reminder 3 days before expiration.</p>
              <p>Thank you for choosing UniNest.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} UniNest. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Subscription confirmation email sent to:", user.email);
    return true;
  } catch (error) {
    console.error("Error sending subscription confirmation email:", error);
    return false;
  }
};

/**
 * Send subscription expiration reminder email
 */
const sendSubscriptionExpirationReminder = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return false;

    const subscription = await Subscription.findOne({ userId });
    if (!subscription) return false;

    const expirationDate = new Date(subscription.nextBillingDate);
    const formattedDate = expirationDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your UniNest Premium Subscription is Expiring Soon",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #006845; padding: 20px; text-align: center; }
            .header h1 { color: white; margin: 0; }
            .content { padding: 30px; background-color: #f9f9f9; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { background-color: #006845; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; font-weight: bold; }
            .date { font-weight: bold; color: #006845; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>UniNest</h1>
            </div>
            <div class="content">
              <h2>Your Premium Subscription is Expiring Soon</h2>
              <p>Dear ${user.username},</p>
              <p>Your UniNest premium subscription will expire on <span class="date">${formattedDate}</span>.</p>
              <p>To continue enjoying unlimited property listings and all premium features, please log in to your dashboard and renew your subscription.</p>
              <a href="${
                process.env.FRONTEND_URL
              }/landlord/pricing" class="button">Renew Now</a>
              <p>If you choose not to renew, your account will be downgraded to the free plan with limited features.</p>
              <p>Thank you for choosing UniNest.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} UniNest. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Subscription expiration reminder sent to:", user.email);
    return true;
  } catch (error) {
    console.error("Error sending subscription expiration reminder:", error);
    return false;
  }
};

/**
 * Send subscription expired notification email
 */
const sendSubscriptionExpiredEmail = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return false;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your UniNest Premium Subscription Has Expired",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #006845; padding: 20px; text-align: center; }
            .header h1 { color: white; margin: 0; }
            .content { padding: 30px; background-color: #f9f9f9; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { background-color: #006845; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; font-weight: bold; }
            ul { padding-left: 20px; }
            li { margin-bottom: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>UniNest</h1>
            </div>
            <div class="content">
              <h2>Your Premium Subscription Has Expired</h2>
              <p>Dear ${user.username},</p>
              <p>Your UniNest premium subscription has expired. Your account has been downgraded to the free plan.</p>
              <p>What this means:</p>
              <ul>
                <li>Your oldest property listing remains active</li>
                <li>Additional listings are now on hold and not visible to students</li>
                <li>You no longer have access to premium features</li>
              </ul>
              <p>To restore all your listings and premium features, please renew your subscription.</p>
              <a href="${
                process.env.FRONTEND_URL
              }/landlord/pricing" class="button">Renew Now</a>
              <p>Thank you for choosing UniNest.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} UniNest. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Subscription expired email sent to:", user.email);
    return true;
  } catch (error) {
    console.error("Error sending subscription expired email:", error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendInquiryEmail,
  informLandlordVerify,
  sendScheduleNotification,
  sendScheduleStatusEmail,
  sendReportEmail,
  sendPasswordResetEmail,
  sendSubscriptionConfirmationEmail,
  sendSubscriptionExpirationReminder,
  sendSubscriptionExpiredEmail,
};
