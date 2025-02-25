import Artwork from "@models/Artwork";
import { connectToDB } from "@utils/database";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteOldPostImages = async( images ) => {
  // Extract public IDs from the image URLs
  const publicIds = images.map(image => {
      console.log(image);
      const urlParts = image.split('/');
      const folderPath = urlParts.slice(-2, -1).join('/');
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExtension.split('.')[0];
    return `${folderPath}/${publicId}`;
    });
 console.log('publicIds',publicIds)

  // Delete images from Cloudinary
  const deletePromises = publicIds.map(async publicId => {
    try {
      const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
      console.log(`Deletion result for ${publicId}:`, result);
      return result;
    } catch (error) {
      console.error(`Failed to delete ${publicId}:`, error);
      throw error;
    }
  });

  // Wait for all deletions to complete
  await Promise.all(deletePromises);

}

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const work = await Artwork.findById(params.id).populate("creator");
    if (!work) {
      return NextResponse.json({
        status: 404,
        body: {
          message: "Artwork not found!",
        },
      });
    }

    return NextResponse.json(work , { status: 200 });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      body: {
        message: "Artwork fetch failed!",
      },
    });
  }
};

export const PATCH = async (req, { params }) => {
  try {
    await connectToDB();
    const data = await req.formData();
    // extract data from form
    const creator = data.get("creator");
    const category = data.get("category");
    const title = data.get("title");
    const description = data.get("description");
    const price = data.get("price");

    // get photos array
    const photos = data.getAll("workPhotoPaths");
    const workPhotoPaths = [];
    // loop through photos array
    for (let photo of photos) {
      if (photo instanceof Object) {
        const bytes = await photo.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const photoPath = `/Users/lighthouse/artify/publicds/${photo.name}`;
        await writeFile(photoPath, buffer);
        workPhotoPaths.push(`uploads/${photo.name}`);
      } else {
        workPhotoPaths.push(photo);
      }
    }
    // find the existing work
    const existingWork = await Artwork.findById(params.id);
    if (!existingWork) {
      return NextResponse.json({
        status: 404,
        body: {
          message: "Artwork not found!",
        },
      });
    }
    // update the work
    // existingWork.creator = creator;
    existingWork.category = category;
    existingWork.title = title;
    existingWork.description = description;
    existingWork.price = price;
    existingWork.workPhotoPaths = workPhotoPaths;

    await existingWork.save();
    return NextResponse.json(
      {
        message: "Artwork updated successfully!",
        work: existingWork,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Artwork update failed!",
      },
      {
        status: 500,
      }
    );
  }
};

export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();
    const artwork = await Artwork.findById(params.id);

    if (!artwork) {
      return NextResponse.json({
        status: 404,
        body: {
          message: "Artwork not found!",
        },
      });
    }

    if (artwork.onAuction) {
      return NextResponse.json({
        status: 400,
        body: {
          message: "Artwork cannot be deleted while it is on auction!",
        },
      });
    }

    const deletedArtwork = await Artwork.findByIdAndDelete(params.id);
    await deleteOldPostImages(artwork.workPhotoPaths);

    return NextResponse.json({
      status: 200,
      body: {
        artwork: deletedArtwork,
        message: "Artwork deleted successfully!",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      body: {
        message: "Artwork deletion failed!",
      },
    });
  }
};
