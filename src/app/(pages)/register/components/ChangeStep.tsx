import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
interface ChangeStepProps {
  loading: true | false;
  setLoading: any;
  step: number;
  setStep: any;
  isActive: boolean;
  formData?: any; // this should be the state of the form inputs
  setError?: (message: string) => void;
  setSuccess?: (message: string) => void;
  clearMessages?: () => void;
}
const ChangeStep = ({
  loading,
  setLoading,
  step,
  setStep,
  isActive,
  formData,
  setError,
  setSuccess,
  clearMessages,
}: ChangeStepProps) => {
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    clearMessages?.();

    if (step == 1) {
      setStep(step + 1);
      setLoading(false);
    } else if (step === 2) {
      // Register the donor
      try {
        const res = await fetch("/api/donors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          const result = await res.json();

          setSuccess?.("Registration completed successfully! Redirecting...");

          // Keep loading state active during navigation
          // Don't set loading to false here - let the redirect happen
          // The loading state will be cleared when the component unmounts

          // Small delay to show success message before redirect
          setTimeout(() => {
            router.replace("/dashboard");
          }, 1500);
        } else {
          const errorData = await res.json();
          setError?.(
            `Registration failed: ${errorData.error || "Unknown error"}`
          );
          setLoading(false); // Only reset loading on error
        }
      } catch (e) {
        console.error("❌ [CHANGE STEP] Network error during registration:", e);
        setError?.("Registration failed. Please try again.");
        setLoading(false); // Only reset loading on error
      }
    }
  };

  return (
    <div className="flex justify-between pt-4">
      {step > 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setStep(step - 1);
          }}
          disabled={loading}
        >
          Previous
        </Button>
      )}
      <Button
        type="button"
        className="bg-red-600 hover:bg-red-700 ml-auto"
        onClick={handleSubmit}
        disabled={!isActive || loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : step === 2 ? (
          "Complete Registration"
        ) : (
          "Next"
        )}
      </Button>
    </div>
  );
};

export default ChangeStep;
