import Artwork from "@models/Artwork";
import { connectToDB } from "@utils/database";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    console.log(`Search params: ${JSON.stringify(params)}`);
    const { query } = params;
    await connectToDB();
    let works = [];
    if (query === "all") {
      works = await Artwork.find().populate("creator");
    } else {
      works = await Artwork.find({
        $or: [
          { category: { $regex: query, $options: "i" } },
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      }).populate("creator");
    }
    if (!works) {
      return NextResponse.json({
        status: 404,
        body: { message: "No artwork found" },
      });
    }
    // return NextResponse.json({
    //   status: 200,
    //   body: { works },
    // });
    return new Response(JSON.stringify(works), { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      status: 500,
      body: { message: "Internal server error" },
    });
  }
};
