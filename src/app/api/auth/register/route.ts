import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import User from "@/models/User";
import { hashPassword } from "@/lib/hash";
import Otp from "@/models/Otp";

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();
  const { email, password, name, lastName, phone } = data;
  const cleanEmail = email.trim().toLowerCase();
  
  if (!cleanEmail || !password || !name || !lastName) {
    return NextResponse.json({ error: "Email, password, name, and last name are required" }, { status: 400 });
  }

  // Check OTP verification in MongoDB
  const entry = await Otp.findOne({ email: cleanEmail });
  if (!entry || !entry.verified) {
    return NextResponse.json({ error: "Email not verified by OTP" }, { status: 403 });
  }
  
  const existing = await User.findOne({ email: cleanEmail });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }
  
  const hashedPassword = await hashPassword(password);
  const user = await User.create({ 
    email: cleanEmail, 
    password: hashedPassword, 
    name,
    lastName,
    phone,
    provider: 'credentials'
  });

  // Remove OTP entry after registration
  await Otp.deleteOne({ email: cleanEmail });
  
  return NextResponse.json({ success: true, user: { id: user._id, email: user.email, name: user.name, lastName: user.lastName } });
}
