// pages/api/auth/forgot-password.js

import  User from '@models/User';
import nodemailer from 'nodemailer';
import {connectToDB} from '@utils/database';
import { NextResponse } from 'next/server';

export const POST = async(req, res) =>{
    const { email } = await req.json();

    try {
        await connectToDB();
        console.log(email);
        const user = await User.findOne({ email });
        if (!user) {
            console.log('No user')
            return NextResponse.json(
                {
                    message: "User not found",
                },
                {
                    status: 404,
                }
            );
        }

        // Generate a password reset token and save it to the user
        const resetToken = user.generatePasswordResetToken(); // Implement this method
        await user.save();

        // Send the reset email
        const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports like 587
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            to: email,
            subject: 'Password Reset Request',
            text: `Click the link to reset your password: \n\n${resetLink}`,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        return NextResponse.json(
            {
                message: "Password reset email sent",
            },
            {
                status: 200,
            }
            );

    }
    catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                message: "Failed to send password reset email",
            },
            {
                status: 500,
            }
            );

    }

}
    