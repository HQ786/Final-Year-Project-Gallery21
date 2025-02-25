import nodemailer from 'nodemailer';

// Create a nodemailer transporter with your SMTP credentials
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your_smtp_username',
    pass: 'your_smtp_password',
  },
});

// Function to send verification email
const sendVerificationEmail = async (email, verificationToken) => {
  try {
    // Send email
    await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <p>Thank you for signing up. Please click the following link to verify your email address:</p>
        <a href="http://yourwebsite.com/verify?token=${verificationToken}">Verify Email</a>
      `,
    });

    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Error sending verification email');
  }
};

export { sendVerificationEmail };
