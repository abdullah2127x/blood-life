import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import bloodGroupData from "@/data/bloodGroups.json";
import ChangeStep from "./ChangeStep";
import PersonalInfoSelectField from "./selectFields/PersonalInfoSelectField";
import { RenderPersonalInfoStepProps } from "../types/renderPersonalInfoStepTypes";

const bloodGroups: string[] = bloodGroupData;

const RenderPersonalInfoStep: React.FC<RenderPersonalInfoStepProps> = ({
  formData,
  handleLocationChange,
  step,
  setStep,
  loading,
  setLoading,
  setError,
  setSuccess,
  clearMessages,
}) => {
  const isActive =
    formData.bloodGroup !== "" &&
    formData.lastDonation instanceof Date;

  const handleFieldChange = (field: string, value: any) => {
    handleLocationChange(field, value);
  };

  return (
    <div className="space-y-4">
      <PersonalInfoSelectField
        label="Blood Group"
        value={formData.bloodGroup}
        onChange={(value) => handleFieldChange("bloodGroup", value)}
        placeholder="Select Blood Group"
        isSelect={true}
        options={bloodGroups}
      />

      <FormField
        name="lastDonation"
        render={() => (
          <FormItem>
            <FormLabel>Last Donation Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.lastDonation ? (
                    format(formData.lastDonation, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.lastDonation || undefined}
                  onSelect={(date) => {
                    handleFieldChange("lastDonation", date || null);
                  }}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FormItem>
        )}
      />

      <ChangeStep
        formData={formData}
        isActive={isActive}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setError={setError}
        setSuccess={setSuccess}
        clearMessages={clearMessages}
      />
    </div>
  );
};

export default RenderPersonalInfoStep;
