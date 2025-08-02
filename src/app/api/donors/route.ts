// app/api/donors/route.ts (API to Register Donors)
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connectDB();
    console.log("connected to db successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }

  // Check if user is authenticated
  const session = await getServerSession(authOptions);

  // if there is no login
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  let data;
  try {
    data = await req.json();
  } catch (e) {
    console.error("❌ [DONORS API] Failed to parse JSON body:", e);
    return NextResponse.json(
      { error: "Invalid or empty request body" },
      { status: 400 }
    );
  }

  try {
    // Check if lastDonation is older than 3 months
    const lastDonationDate = new Date(data.lastDonation);
    const today = new Date();
    const threeMonthsAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 3,
      today.getDate()
    );

    // Generate a new ObjectId for the donor profile
    const donorProfileId = new mongoose.Types.ObjectId();
    const donorProfile = {
      _id: donorProfileId,
      bloodGroup: data.bloodGroup,
      country: data.country || "Pakistan",
      province: data.province,
      district: data.district,
      lastDonation: data.lastDonation,
      isActive: lastDonationDate > threeMonthsAgo,
      contact: session.user.phone,
    };

    // Find user and check if donor profile already exists
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure the donors array exists for this user
    if (!user.donors) {
      user.donors = [];
    }

    // Check if donor already exists with same blood group and location
    const existingDonor = (user.donors || []).find(
      (donor: any) =>
        donor.bloodGroup === data.bloodGroup &&
        donor.province === data.province &&
        donor.district === data.district
    );

    if (existingDonor) {
      return NextResponse.json(
        {
          error:
            "You have already registered as a donor with this blood group in this location. Please choose a different location or blood group.",
        },
        { status: 400 }
      );
    }

    // Add new donor profile
    user.donors.push(donorProfile);
    await user.save();

    // No need to re-fetch, we already have the donorProfileId
    await Notification.create({
      message: `New donor registered: ${user.name} ${
        user.lastName || ""
      }`.trim(),
      userId: user._id,
      donorProfileId: donorProfileId,
    });
    return NextResponse.json({
      message: "Donor registered successfully",
      donor: {
        id: donorProfileId,
        name: user.name,
        bloodGroup: donorProfile.bloodGroup,
        isActive: donorProfile.isActive,
        contact: donorProfile.contact,
      },
    });
  } catch (error: any) {
    console.error("❌ [DONORS API] Error during donor creation:", {
      error: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name,
    });

    // Handle duplicate key error (same user, blood group, and location)
    if (error.code === 11000) {
      return NextResponse.json(
        {
          error:
            "You have already registered as a donor with this blood group in this location. Please choose a different location or blood group, or contact support if you need to update your existing registration.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  const users = await User.find({
    donors: { $exists: true, $not: { $size: 0 } },
  });

  // Transform the data to match the expected format
  const donors = users
    .flatMap((user) =>
      user.donors.map((donor: any) => ({
        _id: donor._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        contact: donor.contact || user.phone,
        bloodGroup: donor.bloodGroup,
        country: donor.country,
        province: donor.province,
        district: donor.district,
        lastDonation: donor.lastDonation,
        isActive: donor.isActive,
        createdAt: donor.createdAt,
        updatedAt: donor.updatedAt,
      }))
    )
    .sort((a, b) => b.createdAt - a.createdAt);

  return NextResponse.json({ donors });
}
