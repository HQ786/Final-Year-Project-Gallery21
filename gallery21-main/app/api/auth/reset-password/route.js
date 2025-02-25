// pages/api/auth/reset-password.js
import User from '@models/User';
import { connectToDB } from '@utils/database';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const POST = async (req) => {
    const { token, newPassword } = await req.json();

    try {
        await connectToDB();

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Check if the token has expired
        if (Date.now() > user.passwordResetExpires) {
            return NextResponse.json(
                { message: "Reset token has expired" },
                { status: 400 }
            );
        }

        user.password = newPassword; 
        console.log(newPassword)
        user.passwordResetToken = null; // Clear the token
        user.passwordResetExpires = null; // Clear the expiration
        await user.save();

        return NextResponse.json(
            { message: "Password reset successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to reset password" },
            { status: 500 }
        );
    }
};
