// app/api/search/route.ts (API to Search Donors)
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const data = await req.json();
    
    // Build the filter for the aggregation pipeline
    const filter: any = {};
    if (data.bloodGroup) filter["donors.bloodGroup"] = data.bloodGroup;
    if (data.district) filter["donors.district"] = data.district;
    if (data.activeOnly) filter["donors.isActive"] = true;
    if (data.province) filter["donors.province"] = data.province;
    
    // Find users with matching donor profiles
    const users = await User.find({
      donors: { $exists: true, $not: { $size: 0 } },
      ...filter
    });

    // Transform and flatten donor data
    const formattedDonors = users.flatMap(user => 
      user.donors
        .filter((donor:any) => {
          // Apply filters at the donor level
          if (data.bloodGroup && donor.bloodGroup !== data.bloodGroup) return false;
          if (data.district && donor.district !== data.district) return false;
          if (data.province && donor.province !== data.province) return false;
          if (data.activeOnly && !donor.isActive) return false;
          return true;
        })
        .map((donor:any) => ({
          id: donor._id.toString(),
          name: `${user.name} ${user.lastName || ''}`.trim(),
          bloodGroup: donor.bloodGroup,
          province: donor.province,
          district: donor.district,
          lastDonation: donor.lastDonation,
          isActive: donor.isActive,
          contact: donor.contact || user.phone
        }))
    ).sort((a, b) => b.lastDonation - a.lastDonation);

    return NextResponse.json({ 
      success: true,
      donors: formattedDonors,
      count: formattedDonors.length 
    });
    
  } catch (error: any) {
    console.error('Search API Error:', error);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid search parameters',
        details: error.message 
      }, { status: 400 });
    }
    
    if (error.name === 'CastError') {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid data format',
        details: error.message 
      }, { status: 400 });
    }
    
    // Generic server error
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to search donors. Please try again later.'
    }, { status: 500 });
  }
}
