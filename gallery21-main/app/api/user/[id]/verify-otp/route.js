// api/verify-otp.js
import { connectToDB } from '@utils/database';
import User from '@models/User';
import Otp from '@models/Otp';

export const POST = async (req, { params }) => {

  await connectToDB();
  const { otpValue:otp } = await req.json();
  const { id } = params;
  console.log(otp)
  const isValid = await validateOTP(id, otp);
  if (isValid) {
    const user = await User.findById(id);
    if (!user) {
      return new Response(JSON.stringify({ message: 'No valid user with this id' }), { status: 404 });
    }

    // Update the user, setting isVerified to true
    await User.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true, upsert: true }
    );

    return new Response(JSON.stringify({ message: 'User verified successfully' }), { status: 200 });
  }
  else {
    console.log("isValid", isValid)
    return new Response(JSON.stringify({ message: 'Invalid OTP' }), { status: 400 });
  }
}

export async function validateOTP(userId, enteredOtp) {
  // Find the OTP document for the user
  const otpRecord = await Otp.findOne({ userId });
console.log(enteredOtp, typeof enteredOtp)
  // Check if the OTP exists and hasn't expired
  if (!otpRecord || otpRecord.expiresAt < new Date()) {
    return false; // OTP does not exist or has expired
  }

console.log(otpRecord.otp, otpRecord.otp )
  // Check if the entered OTP matches the stored OTP
  const isValid = otpRecord.otp === enteredOtp;

  if (isValid) {
    // Optionally, delete the OTP record after validation to prevent reuse
    await Otp.deleteOne({ userId });
  }

  return isValid;

}
