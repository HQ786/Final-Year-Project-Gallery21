import { connectToDB } from "@utils/database";
import Artwork from "@models/Artwork";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const category = params.category;
    let workList;
    if (category !== "All") {
      workList = await Artwork.find({ category }).populate("creator");
    } else {
      workList = await Artwork.find().populate("creator");
    }
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
