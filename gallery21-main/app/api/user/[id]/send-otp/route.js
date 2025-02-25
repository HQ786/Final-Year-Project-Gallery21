// pages/api/send-otp.js
import nodemailer from 'nodemailer';
import { generateOtp } from '@utils/generateOtp';
import { setOtpInDatabase } from '@utils/setOtpInDatabase'; // Implement to store OTP in your database

export const POST = async(req, { params }) =>{
  const { id } = params;
  const { email } = await req.json();
  
  const otp = generateOtp();

  // Save the OTP and expiration time in the database (hashed if needed)
  await setOtpInDatabase(otp, id);

  // Set up NodeMailer transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports like 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`, // Plain text body
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ message: 'OTP sent successfully' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: 'Failed to send OTP' }),{ status: 500 });
  }
}
