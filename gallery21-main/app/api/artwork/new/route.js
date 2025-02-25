import Artwork from "@models/Artwork";
import { connectToDB } from "@utils/database";
import { NextResponse } from "next/server";
import { uploadToCloudinary }  from "@utils/cloudinary";

const handleImageUploads = async (objectArray, folder) => {
  try {
    const uploadPromises = objectArray.map(async (object) => {
      let result;

      // Check if the object is an existing Cloudinary URL
      if (typeof object === 'string' && object.includes('res.cloudinary.com')) {
        result = object; // Return the existing URL
      } else {
        try {
          // Convert the image to a buffer
          const bytes = await object.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Upload to Cloudinary
          result = await uploadToCloudinary(buffer, {
            folder,
            publicId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Ensure unique public ID
          });

          // Get the secure URL from the response
          result = result.secure_url;
        } catch (uploadError) {
          console.error('Error uploading to Cloudinary:', uploadError);
          throw new Error('Failed to upload image'); // Re-throw to handle in the calling function
        }
      }
      
      return result; // Return the URL
    });

    // Wait for all uploads to complete
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error in handleImageUploads:', error);
    throw error; // Propagate the error to the calling function
  }
};

export async function POST(req) {
  try {
    // Connect to the database
    await connectToDB();
    const data = await req.formData();

    // Extract data from the form
    const creator = data.get("creator");
    const category = data.get("category");
    const title = data.get("title");
    const description = data.get("description");
    const price = data.get("price");

    // Validate required fields
    if (!creator || !category || !title || !description || !price) {
      return NextResponse.json(
        {
          message: "All fields are required.",
        },
        {
          status: 400,
        }
      );
    }

    // Check if the price is a valid number and greater than or equal to zero
    if (isNaN(price) || parseFloat(price) < 0) {
      return NextResponse.json(
        {
          message: "Price must be a non-negative number.",
        },
        {
          status: 400,
        }
      );
    }

    // Get photos array
    const photos = data.getAll("workPhotoPaths");
    if (photos.length === 0) {
      return NextResponse.json(
        {
          message: "At least one image is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Handle image uploads
    const workPhotoPaths = await handleImageUploads(photos, "artworks");

    // Check if the upload was successful
    if (!workPhotoPaths || workPhotoPaths.length === 0) {
      return NextResponse.json(
        {
          message: "Failed to upload images.",
        },
        {
          status: 500,
        }
      );
    }

    // Create new work
    const newArtwork = new Artwork({
      creator,
      category,
      title,
      description,
      price: parseFloat(price), // Ensure price is a number
      workPhotoPaths,
    });
    await newArtwork.save();

    return NextResponse.json(
      {
        message: "Artwork created successfully!",
        work: newArtwork,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating artwork:", error);
    return NextResponse.json(
      {
        message: "Work creation failed!",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
