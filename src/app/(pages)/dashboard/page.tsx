"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  UserPlus,
  Calendar,
  Award,
  Plus,
  Droplets,
  MapPin,
  Phone,
  Clock,
  Users,
  Activity,
} from "lucide-react";
import ProfileHeader from "./components/ProfileHeader";
import ProfileStats from "./components/ProfileStats";
import Achievements from "./components/Achievements";
import Notifications from "./components/Notifications";
import Swal from "sweetalert2";

interface DonorProfile {
  _id: string;
  id?: string;
  bloodGroup: string;
  lastDonation: Date | null;
  isActive: boolean;
  province: string;
  district?: string;
  contact?: string;
  country: string;
}

const DashboardPage = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [donorProfiles, setDonorProfiles] = useState<DonorProfile[]>([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDonorId, setSelectedDonorId] = useState("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");

        // Fetch donor profiles
        const donorRes = await fetch("/api/donors/me");
        if (!donorRes.ok) {
          throw new Error("Failed to fetch donor profiles");
        }
        const donorData = await donorRes.json();
        if (donorData.success) {
          setDonorProfiles(donorData.donors);
        }

        // Fetch notifications
        const notificationRes = await fetch("/api/notifications");
        if (!notificationRes.ok) {
          throw new Error("Failed to fetch notifications");
        } else {
          const notificationData = await notificationRes.json();
          if (notificationData.notifications) {
            setNotifications(notificationData.notifications);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load dashboard data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchData();
    }
  }, [session]);

  const handleEditDonor = (donorId: string) => {
    setSelectedDonorId(donorId);
    setEditModalOpen(true);
  };

  const handleEditProfile = () => {
    setProfileModalOpen(true);
  };

  const handleDeleteDonor = async (donorId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete this donor profile.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      setError("");
      const res = await fetch(`/api/donors/${donorId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete donor");
      // Refresh donor data
      const donorRes = await fetch("/api/donors/me");
      if (!donorRes.ok) throw new Error("Failed to fetch donor profiles");
      const donorData = await donorRes.json();
      if (donorData.success) setDonorProfiles(donorData.donors);
      await Swal.fire(
        "Deleted!",
        "The donor profile has been deleted.",
        "success"
      );
    } catch (err) {
      setError("Failed to delete donor. Please try again.");
      await Swal.fire(
        "Error",
        "Failed to delete donor. Please try again.",
        "error"
      );
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--normalRed)] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push("/authentication/login");
    return null;
  }

  const activeDonors = donorProfiles.filter((donor) => donor.isActive);
  const totalDonations = donorProfiles.length;
  const recentDonations = donorProfiles.filter(
    (donor) =>
      donor.lastDonation &&
      new Date(donor.lastDonation) >
        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  ).length;

  // Generate dynamic achievements based on user data
  const generateAchievements = () => {
    const achievements = [];

    if (totalDonations > 0) achievements.push("First Donation");
    if (totalDonations >= 3) achievements.push("Regular Donor");
    if (activeDonors.length > 0) achievements.push("Active Donor");
    if (recentDonations > 0) achievements.push("Recent Donor");
    if (totalDonations >= 5) achievements.push("Community Hero");
    if (totalDonations >= 10) achievements.push("Lifesaver");

    return achievements;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-lightRed border border-[color:var(--normalRed)] rounded-lg">
          <p className="text-normalRed">{error}</p>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your blood donation profiles and track your impact
          </p>
        </div>
        <Button
          onClick={() => router.push("/register")}
          className="flex items-center gap-2 bg-normalRed hover:bg-darkRed"
        >
          <Plus className="w-4 h-4" />
          Register as Donor
        </Button>
      </div>

      {/* Profile Header */}
      <ProfileHeader
        name={`${session.user.name} ${session.user.lastName || ""}`}
        email={session.user.email || ""}
        onEditProfile={handleEditProfile}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-8 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-[color:var(--normalRed)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Registrations
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalDonations}
                </p>
              </div>
              <Droplets className="h-8 w-8 text-normalRed" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Donors
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeDonors.length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Recent Donations
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {recentDonations}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-normalBlue" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Locations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    new Set(
                      donorProfiles.map((d) => `${d.province}, ${d.district}`)
                    ).size
                  }
                </p>
              </div>
              <MapPin className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      {donorProfiles.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-lightRed to-pink-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-normalRed" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Start Your Blood Donation Journey
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              You haven&apos;t registered as a blood donor yet. Join our
              community of lifesavers and make a difference in someone&apos;s
              life today.
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => router.push("/register")}
                className="bg-normalRed hover:bg-darkRed px-8 py-3 text-lg"
                size="lg"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Register as Donor
              </Button>
              <div className="text-sm text-gray-500">
                <p>✓ Quick and easy registration</p>
                <p>✓ Help save lives in your community</p>
                <p>✓ Track your donation impact</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Donor Profiles Grid */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Your Donor Profiles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donorProfiles.map((donor) => (
                <ProfileStats
                  key={donor._id || donor.id}
                  _id={donor._id}
                  id={donor.id}
                  bloodGroup={donor.bloodGroup}
                  lastDonation={donor.lastDonation}
                  location={`${donor.district}, ${donor.province}`}
                  contact={donor.contact}
                  isActive={donor.isActive}
                  onDelete={handleDeleteDonor}
                />
              ))}
            </div>
          </div>

          {/* Achievements and Notifications */}
          <div className="grid grid-cols-1 gap-6 items-start">
            <Achievements badges={generateAchievements()} />
            <Notifications notifications={notifications} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
