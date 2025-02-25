import { connectToDB } from "@utils/database";
import User from "@models/User";
import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@utils/cloudinary";

export const PATCH = async (request, { params }) => {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: "Invalid user" }, { status: 400 });
  }

  const data = await request.formData();
  const photo = data.get("profileImagePath");

  if (!photo) {
    return NextResponse.json(
      { message: "No image provided" },
      { status: 400 }
    );
  }

  try {
    await connectToDB();
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Convert the file to a Buffer
    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using the utility
    const uploadResult = await uploadToCloudinary(buffer, {
      folder: "user-profiles", // Organize files in this folder
      publicId: `profile_${id}`, // Optional: Create a meaningful public ID
    });

    // Update the user's profile image in the database
    await User.findByIdAndUpdate(id, {
      $set: { profileImagePath: uploadResult.secure_url },
    });

    return NextResponse.json(
      {
        message: "Profile Image changed successfully!",
        profileImagePath: uploadResult.secure_url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Profile Image change failed", error: error.message },
      { status: 500 }
    );
  }
};
