import { NextResponse } from "next/server";
import { sendOTPEmail } from "@/lib/mail";
import { connectDB } from "@/lib/connectDB";
import Otp from "@/models/Otp";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const RATE_LIMIT_WINDOW = 60 * 1000; // 60 seconds in milliseconds

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  try {
    await connectDB();
    const cleanEmail = email.trim().toLowerCase();

    // Check rate limit
    const existingOtp = await Otp.findOne({ email: cleanEmail });
    if (existingOtp) {
      const timeSinceLastOTP = Date.now() - existingOtp.createdAt.getTime();
      if (timeSinceLastOTP < RATE_LIMIT_WINDOW) {
        const remainingTime = Math.ceil((RATE_LIMIT_WINDOW - timeSinceLastOTP) / 1000);
        return NextResponse.json({ 
          error: `Please wait ${remainingTime} seconds before requesting another OTP`,
          remainingTime 
        }, { status: 429 });
      }
    }

    // Generate and save new OTP
    const code = generateOTP();
    await Otp.findOneAndUpdate(
      { email: cleanEmail },
      { otp: code, verified: false, createdAt: new Date() },
      { upsert: true, new: true }
    );
    await sendOTPEmail(cleanEmail, code); // Uncomment when email is configured
    // console.log("OTP generated for:", cleanEmail, "Code:", code);
    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("Send OTP API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 