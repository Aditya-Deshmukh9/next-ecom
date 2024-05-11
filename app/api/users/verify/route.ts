import EmailVerificationToken from "@/app/models/emailVerificationToken";
import userModel from "@/app/models/usermodel";
import { EmailVerifyRequest } from "@/app/types";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { token, userId } = (await req.json()) as EmailVerifyRequest;

    if (!isValidObjectId(userId) || !token) {
      return NextResponse.json(
        { error: "Invalid request, userId and token is required" },
        { status: 401 }
      );
    }

    const verifyToken = await EmailVerificationToken.findOne({ user: userId });
    if (!verifyToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const isMatch = await verifyToken.compareToken(token);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid token, token does not match!" },
        { status: 401 }
      );
    }

    await userModel.findByIdAndUpdate(userId, { verified: true });
    await EmailVerificationToken.findByIdAndDelete(verifyToken._id);

    return NextResponse.json({ message: "Your email has Verified" });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not verify your email, Something went wrong" },
      { status: 500 }
    );
  }
};
