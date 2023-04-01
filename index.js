const express = require("express");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");

const app = express();
const port = 3000;

app.use(express.json());

app.post("/sendEmail", (req, res) => {
  const { toEmail, subject, message, deliveryDate } = req.body;

  // Set up the email data with unicode symbols
  const mailOptions = {
    from: "your-email@gmail.com", // sender address
    to: toEmail, // list of receivers
    subject: subject, // Subject line
    text: message, // plain text body
  };

  // Create a transporter object to connect to SMTP server
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "your-email@gmail.com", // your email address
      pass: "your-email-password", // your email password
    },
  });

  // Schedule the email to be sent at the specified delivery date
  const job = schedule.scheduleJob(new Date(deliveryDate), async () => {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent: ${info.messageId}`);
    } catch (err) {
      console.error(err);
    }
  });

  // Send a response back to the client
  res.json({
    message: `Future letter scheduled successfully to ${toEmail} on ${deliveryDate}!`,
    jobId: job.name,
  });
});

app.listen(port, () => {
  console.log(`SMTP server running at http://localhost:${port}`);
});
