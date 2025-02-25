import Work from "@models/Artwork";
import User from "@models/User";
import { connectToDB } from "@utils/database";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const user = await User.findById(params.id);
    const workList = await Work.find({ creator: params.id }).populate(
      "creator"
    );

    user.works = workList;
    await user.save();

    return NextResponse.json(
      {
        user,
        workList,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Failed to get user's works!",
      },
      {
        status: 500,
      }
    );
  }
};
