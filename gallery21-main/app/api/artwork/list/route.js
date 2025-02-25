import { connectToDB } from "@utils/database";
import Artwork from "@models/Artwork";
import User from "@models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async (req) => {
  
  const url = new URL(req.url);
  const urlParams = new URLSearchParams(url.search);

  const username = urlParams.get('username') || ''; 

  try {
    await connectToDB();
    if (username === '') {
        return NextResponse.json({
            status: 404,
            body: {
            message: "No such user!",
            },
        });
    }
    const userId = await User.findOne(
        { username: username },
        { _id: 1 }
      );
    if (!userId) {
        return NextResponse.json({
            status: 404,
            body: {
            message: "No such user!",
            },
        });
    }
    const  workList = await Artwork.find({ creator: userId });
    
    if (!workList) {
      return NextResponse.json({
        status: 404,
        body: {
          message: "Work List not found!",
        },
      });
    }

    return NextResponse.json({
      status: 200,
      body: workList,
    });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      body: {
        message: "Work List fetch failed!",
      },
    });
  }
};

export const POST = async (req) => {
  const { id } = (await req.json()) || null;

  try {
    await connectToDB();
    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({
            status: 404,
            body: {
            message: "No such user!",
            },
        });
    }
    const userId = await User.findById(id);

    if (!userId) {
        return NextResponse.json({
            status: 404,
            body: {
            message: "No such user!",
            },
        });
    }

    const workList = await Artwork.find(
      { creator: userId },
      { title: 1, workPhotoPaths: { $slice: 1 } }
    ).sort({ createdAt: -1 });

        
    if (!workList) {
      return NextResponse.json({
        status: 404,
        body: {
          message: "Work List not found!",
        },
      });
    }

    return NextResponse.json({
      status: 200,
      body: workList,
    });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      body: {
        message: "Work List fetch failed!",
      },
    });
  }
};
