import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import User from "@/models/User";
import { hashPassword } from "@/lib/hash";
import Otp from "@/models/Otp";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, newPassword } = await req.json();
    const cleanEmail = email.trim().toLowerCase();
    
    if (!cleanEmail || !newPassword) {
      return NextResponse.json({ 
        success: false,
        error: "Email and new password are required" 
      }, { status: 400 });
    }

    // Check OTP verification in MongoDB
    const entry = await Otp.findOne({ email: cleanEmail });
    if (!entry || !entry.verified) {
      return NextResponse.json({ success: false, error: "Email not verified by OTP" }, { status: 403 });
    }

    // Find the user
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return NextResponse.json({ 
        success: false,
        error: "User not found" 
      }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Remove OTP entry after reset
    await Otp.deleteOne({ email: cleanEmail });

    return NextResponse.json({ 
      success: true,
      message: "Password reset successfully"
    });

  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json({ 
      success: false,
      error: "Failed to reset password. Please try again." 
    }, { status: 500 });
  }
}
