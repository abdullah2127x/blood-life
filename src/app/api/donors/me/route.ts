import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import User from "@/models/User";
export const dynamic = "force-dynamic";


export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      donors: (user.donors || []).map((donor: any) => ({
        _id: donor._id.toString(),
        id: donor._id.toString(),
        bloodGroup: donor.bloodGroup,
        lastDonation: donor.lastDonation,
        isActive: donor.isActive,
        province: donor.province,
        district: donor.district,
        contact: donor.contact || user.phone,
        country: donor.country,
      })),
    });
  } catch (error) {
    console.error("Error fetching donor profiles:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch donor profiles" },
      { status: 500 }
    );
  }
}
