import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Notification from "@/models/Notification";
import User, { IDonorProfile } from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    
    // First, fetch notifications without population
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    // Then, fetch all unique users in one query
    const userIds = Array.from(new Set(notifications.map(n => n.userId)));
    const users = await User.find({ _id: { $in: userIds } }).lean();

    // Create a map of users for quick lookup
    const userMap = new Map(users.map(user => [(user as { _id: any })._id.toString(), user]));

    // Transform notifications to include user and donor profile data
    const transformedNotifications = notifications.map(notification => {
      const user = userMap.get(notification.userId.toString());
      
      if (!user) {
        return notification;
      }

      // If this is a donor-related notification
      if (notification.donorProfileId) {
        const donorProfile = user.donors?.find(
          (d: any) => d._id.toString() === notification.donorProfileId.toString()
        );

        if (donorProfile) {
          return {
            ...notification,
            user: {
              name: user.name,
              lastName: user.lastName,
              email: user.email
            },
            donor: {
              id: donorProfile._id,
              name: user.name,
              lastName: user.lastName,
              bloodGroup: donorProfile.bloodGroup,
              province: donorProfile.province,
              district: donorProfile.district,
              isActive: donorProfile.isActive,
              contact: donorProfile.contact || user.phone
            }
          };
        }
      }

      // For non-donor notifications
      return {
        ...notification,
        user: {
          name: user.name,
          lastName: user.lastName,
          email: user.email
        }
      };
    });

    return NextResponse.json({ notifications: transformedNotifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();
    
    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!updatedNotification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Notification marked as read",
      notification: updatedNotification
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
} 