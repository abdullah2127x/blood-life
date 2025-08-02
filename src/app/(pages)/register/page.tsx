"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import RenderLocationStep from "./components/RenderLocationStep";
import RenderPersonalInfoStep from "./components/RenderPersonalInfoStep";
import { RenderPersonalInfoStepProps } from "./types/renderPersonalInfoStepTypes";
import { RenderLocationStepProps } from "./types/renderLocationStepTypes";
import { DonorFormData } from "./types/donorFormData";

export default function DonorRegistration() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const form = useForm();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/authentication/login?callbackUrl=/register");
    }
  }, [session, status, router]);

  const [formData, setFormData] = useState<DonorFormData>({
    country: "Pakistan",
    province: "",
    district: "",
    // tehsil: "",
    // unionCouncil: "",
    // village: "",
    name: "",
    bloodGroup: "",
    lastDonation: null,
  });

  const handleLocationChange = (field: string, value: any) => {
    setFormData((prev: DonorFormData) => {
      const newData = { ...prev, [field]: value };
      return newData;
    });
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleError = (message: string) => {
    setError(message);
  };

  const handleSuccess = (message: string) => {
    setSuccess(message);
  };

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <PageContainer
        title="Become a Blood Donor"
        description="Register as a blood donor and help save lives by connecting with those in need."
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Don't render the form if not authenticated
  if (!session) {
    return null;
  }

  return (
    <PageContainer
      title="Become a Blood Donor"
      description="Register as a blood donor and help save lives by connecting with those in need."
    >
      <Card>
        <CardHeader>
          <CardTitle>Donor Registration</CardTitle>
          <p className="text-sm text-gray-600">
            Welcome, {session.user?.name}! Complete your donor profile below.
          </p>
        </CardHeader>
        <CardContent>
          {/* Progress Steps */}
          <div className="flex justify-between mb-8 gap-4">
            {["Personal Info", "Location Info"].map((item, idx) => (
              <div
                key={item}
                className={`w-full h-10  rounded-md  flex items-center justify-center ${
                  step === idx + 1 ? "bg-normalRed text-white" : "bg-gray-200"
                }`}
              >
                {item}
              </div>
            ))}
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md mb-4">
              {success}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {step === 1 && (
                <RenderPersonalInfoStep
                  formData={formData}
                  handleLocationChange={handleLocationChange}
                  step={step}
                  setStep={setStep}
                  loading={loading}
                  setLoading={setLoading}
                  setError={handleError}
                  setSuccess={handleSuccess}
                  clearMessages={clearMessages}
                />
              )}
              {step === 2 && (
                <RenderLocationStep
                  formData={formData}
                  handleLocationChange={handleLocationChange}
                  step={step}
                  setStep={setStep}
                  loading={loading}
                  setLoading={setLoading}
                  setError={handleError}
                  setSuccess={handleSuccess}
                  clearMessages={clearMessages}
                />
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
