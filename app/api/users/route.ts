import startDB from "@lib/db";
import userModel from "@models/usermodel";
import { NewUserRequest } from "@/app/types";
import { NextResponse } from "next/server";
import { createTransport } from "nodemailer";
import crypto from "crypto";
import EmailVerificationToken from "@models/emailVerificationToken";

export const POST = async (req: Request) => {
  const body = (await req.json()) as NewUserRequest;
  await startDB();
  const newUser = await userModel.create({
    ...body,
  });

  const token = crypto.randomBytes(36).toString("hex");
  await EmailVerificationToken.create({
    user: newUser._id,
    token,
  });

  const transport = createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "26e13efd53aadf",
      pass: "7291420a7d367f",
    },
  });

  const verificationUrl = `http://localhost:3000/verify?token=${token}&userId=${newUser._id}`;

  await transport.sendMail({
    from: "verification@nextecom.com",
    to: newUser.email,
    html: `<h1>Please verify your email by clicking the link below <a href=${verificationUrl}>This Link </a></h1>`,
  });

  return NextResponse.json({
    message: "Please check your email!",
  });
};
