import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import User from "@/models/User";
import { sendOTPEmail } from "@/lib/mail";
import Otp from "@/models/Otp";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  await connectDB();
  const { email } = await req.json();
  const cleanEmail = email.trim().toLowerCase();
  
  if (!cleanEmail) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  
  const user = await User.findOne({ email: cleanEmail });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  
  try {
    const code = generateOTP();
    await Otp.findOneAndUpdate(
      { email: cleanEmail },
      { otp: code, verified: false, createdAt: new Date() },
      { upsert: true, new: true }
    );
    
    await sendOTPEmail(cleanEmail, code); // Uncomment when email is configured
    // console.log("[FORGOT PASSWORD] OTP generated for:", cleanEmail, "Code:", code);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[FORGOT PASSWORD] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
