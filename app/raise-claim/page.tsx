"use client";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useState } from "react";
import { InputWithLabel, TextareaWithLabel, SelectWithLabel, DatePickerField } from "@/components/insurance-form/FormFields";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import dayjs from "dayjs";

// --- Schema ---
const claimSchema = Joi.object({
  policy_number: Joi.string().required().messages({
    "any.required": "Policy number is required",
    "string.empty": "Policy number is required",
  }),
  claimant_name: Joi.string().required().messages({
    "any.required": "Claimant name is required",
    "string.empty": "Claimant name is required",
  }),
  claimant_email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    "any.required": "Email is required",
    "string.empty": "Email is required",
    "string.email": "Invalid email address",
  }),
  claimant_phone: Joi.string().required().messages({
    "any.required": "Phone number is required",
    "string.empty": "Phone number is required",
  }),
  incident_date: Joi.string().required().messages({
    "any.required": "Incident date is required",
    "string.empty": "Incident date is required",
  }),
  incident_type: Joi.string().required().messages({
    "any.required": "Incident type is required",
    "string.empty": "Incident type is required",
  }),
  incident_description: Joi.string().required().messages({
    "any.required": "Incident description is required",
    "string.empty": "Incident description is required",
  }),
  supporting_documents: Joi.any().optional(),
});

type ClaimFormValues = {
  policy_number: string;
  claimant_name: string;
  claimant_email: string;
  claimant_phone: string;
  incident_date: string;
  incident_type: string;
  incident_description: string;
  supporting_documents?: FileList;
};

const incidentTypeOptions = [
  { value: "medical", label: "Medical" },
  { value: "accident", label: "Accident" },
  { value: "theft", label: "Theft" },
  { value: "loss", label: "Loss" },
  { value: "other", label: "Other" },
];

export default function RaiseClaimPage() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ClaimFormValues>({
    resolver: joiResolver(claimSchema, { abortEarly: false }),
    defaultValues: {
      policy_number: "",
      claimant_name: "",
      claimant_email: "",
      claimant_phone: "",
      incident_date: "",
      incident_type: "",
      incident_description: "",
      supporting_documents: undefined,
    },
    mode: "onChange",
  });

  const { register, handleSubmit, control, formState } = form;

  const onSubmit = (data: ClaimFormValues) => {
    // You can handle file uploads here as needed
    setSubmitted(true);
    console.log("Claim Submitted:", data);
  };

  return (
    <div className="flex justify-center px-4 py-10 bg-gray-50 min-h-screen">
      <div className="w-full max-w-2xl">
        <div className="bg-white/90 p-6 md:p-8 shadow-lg rounded-md">
          <h2 className="text-2xl font-semibold mb-6 text-[#1A2C50]">
            {t("raiseClaim.title") || "Raise a Claim"}
          </h2>
          {submitted ? (
            <div className="text-green-600 font-semibold text-lg">
              {t("raiseClaim.success") || "Your claim has been submitted successfully!"}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <InputWithLabel
                label={t("raiseClaim.policyNumber") || "Policy Number"}
                name="policy_number"
                register={register}
                error={formState.errors.policy_number}
              />
              <InputWithLabel
                label={t("raiseClaim.claimantName") || "Your Name"}
                name="claimant_name"
                register={register}
                error={formState.errors.claimant_name}
              />
              <InputWithLabel
                label={t("raiseClaim.claimantEmail") || "Your Email"}
                name="claimant_email"
                type="email"
                register={register}
                error={formState.errors.claimant_email}
              />
              <InputWithLabel
                label={t("raiseClaim.claimantPhone") || "Your Phone"}
                name="claimant_phone"
                register={register}
                error={formState.errors.claimant_phone}
              />
              <DatePickerField
                label={t("raiseClaim.incidentDate") || "Incident Date"}
                name="incident_date"
                control={control}
                error={formState.errors.incident_date}
                maxDate={dayjs().toDate()}
              />
              <SelectWithLabel
                label={t("raiseClaim.incidentType") || "Incident Type"}
                name="incident_type"
                control={control}
                options={incidentTypeOptions}
                placeholder={t("raiseClaim.selectIncidentType") || "Select Incident Type"}
                error={formState.errors.incident_type}
              />
              <TextareaWithLabel
                label={t("raiseClaim.incidentDescription") || "Incident Description"}
                name="incident_description"
                register={register}
                error={formState.errors.incident_description}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("raiseClaim.supportingDocuments") || "Supporting Documents"}
                </label>
                <input
                  type="file"
                  multiple
                  {...register("supporting_documents")}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
              </div>
              <Button type="submit" className="w-full bg-[#1A2C50] hover:bg-[#2c3e6b] text-white py-3 text-base">
                {t("raiseClaim.submit") || "Submit Claim"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}