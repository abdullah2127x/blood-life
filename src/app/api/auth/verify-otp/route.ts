import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Otp from "@/models/Otp";

export async function POST(req: Request) {
  const { email, otp } = await req.json();
  if (!email || !otp) {
    return NextResponse.json(
      { error: "Email and OTP are required" },
      { status: 400 }
    );
  }
  try {
    await connectDB();
    const cleanEmail = email.trim().toLowerCase();
    const entry = await Otp.findOne({ email: cleanEmail });

    if (entry && entry.otp === otp) {
      entry.verified = true;
      await entry.save();
      return NextResponse.json({
        success: true,
        message: "OTP verified successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid OTP" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Verify OTP API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
