import Otp from '@models/Otp'; // Import the OTP model


export async function setOtpInDatabase( otp, userId) {
  // Find the user by email to get their ID

  if (!userId) {
    throw new Error('User not found');
  }

  // Set expiration time (e.g., 60 minutes from now)
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); 

  // Create a new OTP document
  const otpEntry = new Otp({
    userId: userId, // Store the user's ID
    otp, // Store the generated OTP
    expiresAt, // Set the expiration time
  });

  // Save the OTP to the database
  await otpEntry.save();
}
