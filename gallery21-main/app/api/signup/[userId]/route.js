// app/api/signup/[userId]/route.js
import { NextResponse } from 'next/server';
import { connectToDB } from "@utils/database";
import User from "@models/User";


export async function POST(req, { params }) {
  const { userId } = params; // Extract userId from the dynamic route
  const { userRoles } = await req.json(); // Extract userRoles from the request body

  console.log(`User ${userId} has roles:`, userRoles);

  try {
    await connectToDB();

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json({
        message: 'User not found',
        status: 404
      });
    }

    // Append roles to the user's existing roles
    existingUser.roles = [...new Set([...existingUser.roles, ...userRoles])]; // Prevent duplicates
    await existingUser.save(); // Save the updated user document

    // Check if the userRoles include "artist"     
    return NextResponse.json({
      success: true, message: "Registration successful", user: existingUser,
      status: 200
    });
  } catch (error) {
    console.error("Error updating user roles:", error);
    return NextResponse.json({ success: false, error: 'Failed to register' }, { status: 500 });
  }
}



// import { connectToDB } from "@utils/database";
// import User from "@models/User";

// export async function POST(req) {
//   const { data } = await req.json();
//   const userId = data.userId; // Assuming userId is part of your data payload
//   const userRoles = data.userRoles; // Get user roles from the data
//   console.log('Payload received',userId, userRoles);
//   try {
//     await connectToDB();

//     const existingUser = await User.findById(userId);
//     if (!existingUser) {
//       return new Response(JSON.stringify({ message: 'User not found' }), {
//         status: 404,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//     }

//     // Append roles to the user's existing roles
//     existingUser.roles = [...new Set([...existingUser.roles, ...userRoles])]; // Prevent duplicates
//     await existingUser.save(); // Save the updated user document

//     return new Response(JSON.stringify({ message: 'User roles updated successfully', user: existingUser }), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     console.error("Error updating user roles:", error);
//     return new Response(JSON.stringify({ message: 'Internal Server Error', error }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
// }
