"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Phone, Calendar, Mail, AlertCircle, ArrowLeft, User, Droplets } from "lucide-react";
import PageContainer from "@/components/PageContainer";
import { IDonor } from "@/models/Donor";

export default function DonorDetailPage() {
  const params = useParams();
  const [donor, setDonor] = useState<IDonor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonorDetails = async () => {
      try {
        const res = await fetch(`/api/donors/${params?.id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch donor details');
        }
        const data = await res.json();
        setDonor(data.donor);
      } catch (err) {
        setError('Failed to load donor details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchDonorDetails();
    }
  }, [params?.id]);

  if (loading) {
    return (
      <PageContainer title="Loading..." description="Please wait while we fetch the donor details.">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading donor details...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error || !donor) {
    return (
      <PageContainer title="Error" description="We couldn't load the donor details.">
        <div className="max-w-md mx-auto text-center mt-12">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-red-800">Something went wrong</h2>
          <p className="text-red-600 mb-6">{error || 'Donor not found'}</p>
          <Button 
            variant="outline" 
            className="border-red-300 text-red-700 hover:bg-red-100"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </PageContainer>
    );
  }

  // Format dates to be more readable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format location
  const location = [
    donor.district,
    donor.province,
    donor.country
  ].filter(Boolean).join(", ");

  return (
    <PageContainer 
      title={`${donor.name} ${donor.lastName}`} 
      description="Donor Profile Details"
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="outline"
          className="mb-8 flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 hover:border-red-400 transition-colors shadow-sm rounded-lg"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="font-medium">Back to Search</span>
        </Button>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
                <User className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-3">
                  {donor.name} {donor.lastName}
                </h1>
                <div className="flex items-center space-x-4">
                  <Badge 
                    variant="secondary" 
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm px-3 py-1"
                  >
                    {donor.isActive ? '🟢 Active Donor' : '🔴 Currently Unavailable'}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-5 h-5 text-white/80" />
                    <span className="text-white/80">Blood Group</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/30">
                <p className="text-sm text-white/80 mb-2">Blood Type</p>
                <span className="text-5xl font-bold text-white">
                  {donor.bloodGroup}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Phone className="w-6 h-6 mr-3 text-red-600" />
            Contact Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Phone className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Phone Number</h3>
                  <p className="text-gray-600">Primary contact method</p>
                </div>
              </div>
              <p className=" font-medium text-gray-900 ml-16">
                {donor.contact || 'Not provided'}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Email Address</h3>
                  <p className="text-gray-600">Alternative contact method</p>
                </div>
              </div>
              <p className=" font-medium break-words text-gray-900 ml-16">
                {donor.email}
              </p>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <MapPin className="w-6 h-6 mr-3 text-green-600" />
            Location
          </h2>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Current Location</h3>
                <p className="text-gray-600">Where the donor is based</p>
              </div>
            </div>
            <p className="text-xl font-medium text-gray-900 ml-16">
              {location}
            </p>
          </div>
        </section>

        {/* Donation History Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-3 text-purple-600" />
            Donation History
          </h2>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Last Donation</h3>
                <p className="text-gray-600">Most recent blood donation</p>
              </div>
            </div>
            <p className="text-xl font-medium text-gray-900 ml-16">
              {donor.lastDonation 
                ? formatDate(donor.lastDonation.toString())
                : "Never donated"
              }
            </p>
          </div>
        </section>

        {/* Status Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Heart className="w-6 h-6 mr-3 text-pink-600" />
            Current Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl border-2 ${
              donor.isActive 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  donor.isActive ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Heart className={`w-5 h-5 ${
                    donor.isActive ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Availability</h3>
              </div>
              <p className={`text-lg font-medium ${
                donor.isActive ? 'text-green-700' : 'text-red-700'
              }`}>
                {donor.isActive 
                  ? "Available for donation requests"
                  : "Currently unavailable"
                }
              </p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Ready to Help</h3>
              </div>
              <p className="text-lg font-medium text-blue-700">
                Contact directly for blood donation requests
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Need Blood? Contact This Donor
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            This donor is ready to help save lives. Use the contact information above to reach out directly.
          </p>
          <div className="flex justify-center space-x-4">
            {donor.contact && (
              <Button className="bg-green-600 hover:bg-green-700">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
            )}
            <Button variant="outline" className="border-gray-300">
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
          </div>
        </section>
      </div>
    </PageContainer>
  );
} 