// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { useForm, Controller, FieldError, Path, useFieldArray, get } from "react-hook-form";
// import { joiResolver } from "@hookform/resolvers/joi";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import {
//   getPurchaseWithoutLoginSchema,
//   type InsuranceFormValues,
//   fieldsByStep,
//   getTripPurposes,
//   getEmergencyMedicalCoverageOptions,
//   getPersonalAccidentCoverageOptions,
//   getCountryCodeOptions,
//   getNationalityOptions,
//   getCountryOptions,
//   getCountryTravellingToOptions,
//   primaryCitiesUkraineOptions
// } from "@/lib/insuranceFormSchema";
// import {
//   InputWithLabel,
//   SelectWithLabel,
//   DatePickerField
// } from "./FormFields";
// import { format as formatDateFn } from "date-fns";
// import BirthDateField from "../form/BirthDateField";
// import { useTranslation } from "@/hooks/useTranslation";
// import { useValidationMessages } from "@/lib/useValidationMessages";
// import dayjs from 'dayjs';
// import { Tooltip, TooltipContent, TooltipProvider } from "../ui/tooltip";
// import { TooltipTrigger } from "@radix-ui/react-tooltip";
// import { Info } from "lucide-react";
// import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
// import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

// type Integer = number & { __brand: 'integer' };

// interface FlywireError {
//   msg?: string;
//   code?: string;
//   field?: string;
// }

// interface GenerateQuotePayload {
//   trip_start_date: Date;
//   trip_end_date: Date;
//   trip_country: string;
//   country_of_residence: string;
//   travellers_count: Integer;
//   medical_coverage: "0" | "25000" | "50000" | "100000" | "150000" | "250000";
//   pa_coverage: "0" | "25000" | "50000" | "100000" | "150000" | "250000";
//   transit_coverage: boolean;
//   green_zone_days: Integer;
//   amber_zone_days: Integer;
//   red_zone_days: Integer;
//   black_zone_days: Integer;
// }

// interface PricingMatrix {
//   matrix: {
//     [key: string]: {
//       greenME: number;
//       amberME: number;
//       redME: number;
//       blackME: number;
//       greenPA: number;
//       amberPA: number;
//       redPA: number;
//       blackPA: number;
//     };
//   };
//   transitCost: number;
//   germanyGreenMERates: Partial<Record<GenerateQuotePayload['medical_coverage'], number>>;
// }

// interface QuoteResult {
//   ok: boolean;
//   message: string;
//   warnings: string[];
//   currency?: string;
//   data?: {
//     totalAmount: number;
//     medicalCoverAmount: number;
//     paCoverAmount: number;
//     travellersCount: Integer;
//     totalDays: number;
//   };
// }

// const defaultPricing: PricingMatrix = {
//   matrix: {
//     "25000": { "greenME": 19.00, "amberME": 23.75, "redME": 0.0, "blackME": 0.0, "greenPA": 12.38, "amberPA": 13.61, "redPA": 0.0, "blackPA": 0.0 },
//     "50000": { "greenME": 22.00, "amberME": 27.50, "redME": 30.25, "blackME": 0.0, "greenPA": 24.75, "amberPA": 29.25, "redPA": 31.73, "blackPA": 0.0 },
//     "100000": { "greenME": 26.00, "amberME": 32.50, "redME": 35.75, "blackME": 0.0, "greenPA": 49.50, "amberPA": 54.00, "redPA": 58.95, "blackPA": 0.0 },
//     "150000": { "greenME": 30.00, "amberME": 37.50, "redME": 40.25, "blackME": 0.0, "greenPA": 74.25, "amberPA": 81.68, "redPA": 89.84, "blackPA": 0.0 },
//     "250000": { "greenME": 36.00, "amberME": 45.00, "redME": 49.50, "blackME": 0.0, "greenPA": 123.75, "amberPA": 136.13, "redPA": 149.74, "blackPA": 0.0 }
//   },
//   transitCost: 25.00,
//   germanyGreenMERates: {
//     "25000": 19.68,
//     "50000": 22.95,
//     "100000": 27.64,
//     "150000": 32.25,
//     "250000": 39.17,
//   }
// };

// // async function fetchQuoteFromApi(payload: GenerateQuotePayload): Promise<QuoteResult> {
// //   try {
// //     const response = await fetch('https://cpa-node-439821101939.europe-west1.run.app/api/quote', {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify(payload),
// //     });
// //     if (!response.ok) {
// //       const errorText = await response.text();
// //       console.error("Quote API error:", response.status, response.statusText, errorText);
// //       return {
// //         ok: false,
// //         message: `API error: ${response.statusText}`,
// //         warnings: [errorText],
// //       };
// //     }
// //     return await response.json();

// //   } catch (error) {
// //     return {
// //       ok: false,
// //       message: 'Network error while fetching quote.',
// //       warnings: [],
// //     };
// //   }
// // }

// // async function fetchQuoteFromApi(payload: GenerateQuotePayload): Promise<QuoteResult> {
// //   try {
// //     const response = await fetch('https://cpa-node-439821101939.europe-west1.run.app/api/quote', {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify(payload),
// //     });
// //     if (!response.ok) {
// //       // Log status and response body for debugging
// //       const errorText = await response.text();
// //       console.error("Quote API error:", response.status, response.statusText, errorText);
// //       return {
// //         ok: false,
// //         message: `API error: ${response.statusText} (${response.status})`,
// //         warnings: [errorText],
// //       };
// //     }
// //     return await response.json();
// //   } catch (error) {
// //     console.error("Network error while fetching quote:", error);
// //     return {
// //       ok: false,
// //       message: 'Network error while fetching quote.',
// //       warnings: [],
// //     };
// //   }
// // }

// // async function fetchQuoteFromApi(payload: GenerateQuotePayload, formValues: InsuranceFormValues): Promise<QuoteResult> {
// //   try {
// //     // Build the correct travellers array for the API
// //     const travellers = (formValues.travellers || []).map(t => ({
// //       dateOfBirth: t.birthdate, // or t.dateOfBirth if that's your field
// //       residence: formValues.city_of_residence // or t.nationality or t.residence if per-traveller
// //     }));

// //     // Build the API payload
// //     const apiPayload = {
// //       trip_start_date: payload.trip_start_date.toISOString(),
// //       trip_end_date: payload.trip_end_date.toISOString(),
// //       travellers,
// //       trip_country: payload.trip_country,
// //       medical_coverage: payload.medical_coverage,
// //       pa_coverage: payload.pa_coverage,
// //       transit_coverage: payload.transit_coverage,
// //       green_zone_days: payload.green_zone_days,
// //       amber_zone_days: payload.amber_zone_days,
// //       red_zone_days: payload.red_zone_days
// //     };

// //     const response = await fetch('https://cpa-node-439821101939.europe-west1.run.app/api/quote', {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'x-api-key': 'your_app_api_key_here', // <-- Replace with your actual API key
// //       },
// //       body: JSON.stringify(apiPayload),
// //     });

// //     if (!response.ok) {
// //       const errorText = await response.text();
// //       console.error("Quote API error:", response.status, response.statusText, errorText);
// //       return {
// //         ok: false,
// //         message: `API error: ${response.statusText} (${response.status})`,
// //         warnings: [errorText],
// //       };
// //     }
// //     return await response.json();
// //   } catch (error) {
// //     console.error("Network error while fetching quote:", error);
// //     return {
// //       ok: false,
// //       message: 'Network error while fetching quote.',
// //       warnings: [],
// //     };
// //   }
// // }

// // async function fetchQuoteFromApi(payload: GenerateQuotePayload, formValues: InsuranceFormValues): Promise<QuoteResult> {
// //   try {
// //     // Build the correct travellers array for the API
// //     const travellers = (formValues.travellers || []).map(t => ({
// //       dateOfBirth: t.birthdate,
// //       residence: t.nationality || formValues.city_of_residence
// //     }));

// //     // Validate all travellers
// //     if (!travellers.length || travellers.some(t => !t.dateOfBirth || !t.residence)) {
// //       return {
// //         ok: false,
// //         message: "All travellers must have a date of birth and country.",
// //         warnings: [],
// //       };
// //     }

// //     // Build the API payload
// //     const apiPayload = {
// //       trip_start_date: payload.trip_start_date.toISOString(),
// //       trip_end_date: payload.trip_end_date.toISOString(),
// //       travellers,
// //       trip_country: payload.trip_country,
// //       medical_coverage: payload.medical_coverage,
// //       pa_coverage: payload.pa_coverage,
// //       transit_coverage: payload.transit_coverage,
// //       green_zone_days: payload.green_zone_days,
// //       amber_zone_days: payload.amber_zone_days,
// //       red_zone_days: payload.red_zone_days
// //     };

// //     const response = await fetch('https://cpa-node-439821101939.europe-west1.run.app/api/quote', {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'x-api-key': 'your_app_api_key_here', // <-- Replace with your actual API key
// //       },
// //       body: JSON.stringify(apiPayload),
// //     });

// //     if (!response.ok) {
// //       const errorText = await response.text();
// //       console.error("Quote API error:", response.status, response.statusText, errorText);
// //       return {
// //         ok: false,
// //         message: `API error: ${response.statusText} (${response.status})`,
// //         warnings: [errorText],
// //       };
// //     }
// //     return await response.json();
// //   } catch (error) {
// //     console.error("Network error while fetching quote:", error);
// //     return {
// //       ok: false,
// //       message: 'Network error while fetching quote.',
// //       warnings: [],
// //     };
// //   }
// // }



// async function fetchQuoteFromApi(
//   payload: GenerateQuotePayload,
//   travellers: { dateOfBirth: string; residence: string }[]
// ): Promise<QuoteResult> {
//   try {
//     // Build the API payload
//     const apiPayload = {
//       trip_start_date: payload.trip_start_date.toISOString(),
//       trip_end_date: payload.trip_end_date.toISOString(),
//       travellers,
//       trip_country: payload.trip_country,
//       medical_coverage: payload.medical_coverage,
//       pa_coverage: payload.pa_coverage,
//       transit_coverage: payload.transit_coverage,
//       green_zone_days: payload.green_zone_days,
//       amber_zone_days: payload.amber_zone_days,
//       red_zone_days: payload.red_zone_days
//     };

//     const response = await fetch('https://cpa-node-439821101939.europe-west1.run.app/api/quote', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-api-key': 'your_app_api_key_here', // <-- Replace with your actual API key
//       },
//       body: JSON.stringify(apiPayload),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Quote API error:", response.status, response.statusText, errorText);
//       return {
//         ok: false,
//         message: `API error: ${response.statusText} (${response.status})`,
//         warnings: [errorText],
//       };
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Network error while fetching quote:", error);
//     return {
//       ok: false,
//       message: 'Network error while fetching quote.',
//       warnings: [],
//     };
//   }
// }
// function generateQuote(data: GenerateQuotePayload, pricing: PricingMatrix): QuoteResult {
//   const startDate = dayjs(data.trip_start_date).startOf('day');
//   const endDate = dayjs(data.trip_end_date).endOf('day');
//   const totalDays = endDate.diff(startDate, 'day') + 1;

//   if (totalDays <= 0) {
//     return {
//       ok: false,
//       message: "Trip end date should be after trip start date.",
//       warnings: []
//     };
//   }

//   const sumOfZoneDays = data.green_zone_days + data.amber_zone_days + data.red_zone_days + data.black_zone_days;
//   if (totalDays !== sumOfZoneDays) {
//     return {
//       ok: false,
//       message: `Total trip days (${totalDays}) should be equal to the sum of zone days (${sumOfZoneDays}).`,
//       warnings: []
//     };
//   }

//   const medicalCoverageLevel = data.medical_coverage;
//   const paCoverageLevel = data.pa_coverage;

//   if (
//     (medicalCoverageLevel !== "0" && !pricing.matrix[medicalCoverageLevel]) ||
//     (paCoverageLevel !== "0" && !pricing.matrix[paCoverageLevel])
//   ) {
//     return {
//       ok: false,
//       message: "No pricing found for a selected non-zero coverage.",
//       warnings: []
//     };
//   }

//   const medicalRates = medicalCoverageLevel === "0" ? undefined : pricing.matrix[medicalCoverageLevel];
//   const paRates = paCoverageLevel === "0" ? undefined : pricing.matrix[paCoverageLevel];

//   let medicalCoverAmount = 0;
//   let paCoverAmount = 0;
//   const warnings: string[] = [];

//   if (medicalRates && medicalCoverageLevel !== "0") {
//     let greenMERate = medicalRates["greenME"] || 0;
//     if (data.country_of_residence === "DE" && data.green_zone_days > 0 && pricing.germanyGreenMERates[medicalCoverageLevel] !== undefined) {
//       greenMERate = pricing.germanyGreenMERates[medicalCoverageLevel]!;
//       if (greenMERate <= 0) {
//         warnings.push("Medical coverage for green zone (Germany resident) has zero cost for this coverage amount.");
//       }
//     } else if (data.green_zone_days > 0 && (!medicalRates["greenME"] || medicalRates["greenME"] <= 0)) {
//       warnings.push("Medical coverage for green zone is not available or has zero cost for this coverage amount.");
//     }


//     medicalCoverAmount += greenMERate * data.green_zone_days;
//     medicalCoverAmount += (medicalRates["amberME"] || 0) * data.amber_zone_days;
//     medicalCoverAmount += (medicalRates["redME"] || 0) * data.red_zone_days;
//     medicalCoverAmount += (medicalRates["blackME"] || 0) * data.black_zone_days;

//     if (!(data.country_of_residence === "DE" && data.green_zone_days > 0 && pricing.germanyGreenMERates[medicalCoverageLevel] !== undefined) && data.green_zone_days > 0 && (!medicalRates["greenME"] || medicalRates["greenME"] <= 0)) {
//     }
//     if (data.amber_zone_days > 0 && (!medicalRates["amberME"] || medicalRates["amberME"] <= 0)) {
//       warnings.push("Medical coverage for amber zone is not available or has zero cost for this coverage amount.");
//     }
//     if (data.red_zone_days > 0 && (!medicalRates["redME"] || medicalRates["redME"] <= 0)) {
//       warnings.push("Medical coverage for red zone is not available or has zero cost for this coverage amount.");
//     }
//     if (data.black_zone_days > 0 && (!medicalRates["blackME"] || medicalRates["blackME"] <= 0)) {
//       warnings.push("Medical coverage for black zone is not available or has zero cost for this coverage amount.");
//     }
//   }

//   if (paRates && paCoverageLevel !== "0") {
//     paCoverAmount += (paRates["greenPA"] || 0) * data.green_zone_days;
//     paCoverAmount += (paRates["amberPA"] || 0) * data.amber_zone_days;
//     paCoverAmount += (paRates["redPA"] || 0) * data.red_zone_days;
//     paCoverAmount += (paRates["blackPA"] || 0) * data.black_zone_days;

//     if (data.green_zone_days > 0 && (!paRates["greenPA"] || paRates["greenPA"] <= 0)) {
//       warnings.push("Personal Accident coverage for green zone is not available or has zero cost for this coverage amount.");
//     }
//     if (data.amber_zone_days > 0 && (!paRates["amberPA"] || paRates["amberPA"] <= 0)) {
//       warnings.push("Personal Accident coverage for amber zone is not available or has zero cost for this coverage amount.");
//     }
//     if (data.red_zone_days > 0 && (!paRates["redPA"] || paRates["redPA"] <= 0)) {
//       warnings.push("Personal Accident coverage for red zone is not available or has zero cost for this coverage amount.");
//     }
//     if (data.black_zone_days > 0 && (!paRates["blackPA"] || paRates["blackPA"] <= 0)) {
//       warnings.push("Personal Accident coverage for black zone is not available or has zero cost for this coverage amount.");
//     }
//   }

//   let totalAmount = medicalCoverAmount + paCoverAmount;

//   if (data.travellers_count > 0) {
//     totalAmount *= data.travellers_count;
//   }

//   if (data.transit_coverage) {
//     totalAmount += pricing.transitCost;
//   }

//   totalAmount = Math.round(totalAmount * 100) / 100;

//   return {
//     ok: true,
//     message: "Quote generated successfully",
//     warnings,
//     data: {
//       totalAmount,
//       medicalCoverAmount: Math.round(medicalCoverAmount * 100) / 100,
//       paCoverAmount: Math.round(paCoverAmount * 100) / 100,
//       travellersCount: data.travellers_count,
//       totalDays
//     }
//   };
// }

// const formatEuro = (amount: number) =>
//   new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(amount);


// export default function InsuranceForm() {
//   const { t } = useTranslation();
//   const { getValidationMessage } = useValidationMessages();

//   const [ageLimitExceeded, setAgeLimitExceeded] = useState(false);
//   const [ageAlertOpen, setAgeAlertOpen] = useState(false);

//   const currentEmergencyMedicalCoverageOptions = useMemo(() => getEmergencyMedicalCoverageOptions(getValidationMessage), [getValidationMessage]);
//   const currentPersonalAccidentCoverageOptions = useMemo(() => getPersonalAccidentCoverageOptions(getValidationMessage), [getValidationMessage]);
//   const currentTripPurposes = useMemo(() => getTripPurposes(getValidationMessage), [getValidationMessage]);

//   const currentNationalityOptions = useMemo(() => getNationalityOptions(), []);
//   const currentCountryOptions = useMemo(() => getCountryOptions(), []);
//   const currentCountryCodeOptions = useMemo(() => getCountryCodeOptions(), []);
//   const currentCountryTravellingToOptions = useMemo(() => getCountryTravellingToOptions(), []);


//   const steps = (t("insuranceForm.steps", { returnObjects: true }) as string[]).filter((_, idx) => idx !== 3);

//   const [step, setStep] = useState(0);
//   const [calculatedTotalRiskZoneDays, setCalculatedTotalRiskZoneDays] = useState<number | null>(null);
//   const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);

//   const schema = useMemo(() => getPurchaseWithoutLoginSchema(getValidationMessage), [getValidationMessage]);

//   const form = useForm<InsuranceFormValues>({
//     resolver: joiResolver(schema, {
//       abortEarly: false,
//     }),
//     defaultValues: {
//       trip_start_date: "", trip_end_date: "",
//       green_zone_days: 0, amber_zone_days: 0, red_zone_days: 0, black_zone_days: 0,
//       emergency_medical_coverage: "", personal_accident_coverage_level: "0",
//       add_transit_coverage: false,
//       c_first_name: "", c_last_name: "", c_birthdate: "",
//       c_passport_number: "", c_passport_expiry_date: "",
//       c_is_whatsapp_same_as_phone: false,
//       c_phone: "", c_phone_code: "", c_phone_number: "",
//       c_whats_app: "", c_whats_app_code: "", c_whats_app_number: "",
//       c_email: "", c_nationality: "", city_of_residence: "",
//       trip_countries: ["UA"],
//       address: "", zip: "",

//       travellers: [{
//         first_name: "", last_name: "", birthdate: "", passport_number: "", passport_expiry_date: "", email: "",
//         nationality: "",
//         address: "",
//         zip: ""
//       }],
//       arrival_in_ukraine: "", departure_from_ukraine: "",
//       primary_cities_regions_ukraine: "", trip_cities: [], trip_purpose: "",
//       stay_name: "", company_name: "", city_or_town: "",
//       emergency_contact_first_name: "", emergency_contact_last_name: "",
//       emergency_contact_phone: "", emergency_contact_phone_code: "", emergency_contact_phone_number: "",
//       emergency_contact_relation: "",
//       has_medical_conditions: false, has_allergies: false, has_current_medications: false,
//       medical_conditions: [], allergies: [], current_medications: [],
//       blood_type: "", special_assistance: "",
//       affiliate_code: "", consent: undefined,
//       purchase_context: "self",
//       consent_for_additional_travellers: undefined,
//       c_organization: "", is_company_arranged: false,
//     },
//     mode: "onChange",
//   });


//   useEffect(() => {
//     if (!form.getValues("purchase_context")) {
//       form.setValue("purchase_context", "self", { shouldValidate: true, shouldDirty: true });
//     }
//   }, [getValidationMessage, form]);


//   const { watch, setValue, getValues, trigger, formState, control, register } = form;

//   useEffect(() => {
//     const currentTravellers = getValues("travellers");
//     if (!currentTravellers || currentTravellers.length === 0) return;

//     let changed = false;
//     const newTraveller0 = { ...currentTravellers[0] };

//     if (newTraveller0.address !== getValues("address")) {
//       newTraveller0.address = getValues("address") || "";
//       changed = true;
//     }
//     if (newTraveller0.zip !== getValues("zip")) {
//       newTraveller0.zip = getValues("zip") || "";
//       changed = true;
//     }
//     if (newTraveller0.email !== getValues("c_email")) {
//       newTraveller0.email = getValues("c_email") || "";
//       changed = true;
//     }
//     if (newTraveller0.nationality !== getValues("c_nationality")) {
//       newTraveller0.nationality = getValues("c_nationality") || "";
//       changed = true;
//     }

//     if (changed) {
//       const updatedTravellers = [...currentTravellers];
//       updatedTravellers[0] = newTraveller0;
//       setValue("travellers", updatedTravellers, { shouldValidate: step === 1, shouldDirty: true });
//     }
//   }, [
//     watch("address"),
//     watch("zip"),
//     watch("c_email"),
//     watch("c_nationality"),
//     getValues,
//     setValue,
//     step,
//   ]);

//   const { fields: travellerFields, append: appendTraveller, remove: removeTraveller } = useFieldArray<InsuranceFormValues, "travellers", "id">({
//     control, name: "travellers"
//   });

//   const { fields: cityFields, append: appendCity, remove: removeCity } = useFieldArray<InsuranceFormValues, "trip_cities", "id">({
//     control, name: "trip_cities"
//   });


//   const watchedStartDate = watch("trip_start_date");
//   const watchedEndDate = watch("trip_end_date");
//   const watchedGreenDaysForDisplay = watch("green_zone_days");

//   const cFirstNameValue = watch("c_first_name");
//   const cLastNameValue = watch("c_last_name");
//   const cBirthdateValue = watch("c_birthdate");
//   const watchedTravellers = watch("travellers");


//   const calculateAge = (birthdate: string | undefined): string => {
//     if (!birthdate) return ""; const parts = birthdate.split('-'); if (parts.length !== 3) return "";
//     const year = parseInt(parts[0], 10), month = parseInt(parts[1], 10) - 1, day = parseInt(parts[2], 10);
//     if (isNaN(year) || isNaN(month) || isNaN(day)) return "";
//     const birthDateObj = new Date(year, month, day);
//     if (isNaN(birthDateObj.getTime()) || birthDateObj.getFullYear() !== year || birthDateObj.getMonth() !== month || birthDateObj.getDate() !== day) return "";
//     const today = new Date(); let age = today.getFullYear() - birthDateObj.getFullYear();
//     const m = today.getMonth() - birthDateObj.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) age--;
//     return age >= 0 ? age.toString() : "";
//   };
//   useEffect(() => {
//     const isAgeOverLimit = (birthdate: string | undefined): boolean => {
//       if (!birthdate) return false;
//       const age = parseInt(calculateAge(birthdate), 10);
//       return !isNaN(age) && age > 69;
//     };

//     if (step === 1) {

//       const allTravellers = watchedTravellers || [];
//       const isExceeded = allTravellers.some(t => isAgeOverLimit(t.birthdate));

//       if (isExceeded && !ageLimitExceeded) {
//         setAgeAlertOpen(true);
//       }

//       setAgeLimitExceeded(isExceeded);

//     } else {
//       if (ageLimitExceeded) {
//         setAgeLimitExceeded(false);
//       }
//     }
//   }, [watchedTravellers, step, ageLimitExceeded, calculateAge]);

//   const cPassportNumberValue = watch("c_passport_number");
//   const cPassportExpiryDateValue = watch("c_passport_expiry_date");

//   const coverageDisabled = !watchedStartDate || !watchedEndDate;

//   useEffect(() => {
//     const subscription = watch((value, { name }) => {
//       if (name && name.startsWith("travellers") && (name.endsWith("emergency_contact_phone_code") || name.endsWith("emergency_contact_phone_number"))) {
//         const parts = name.split('.');
//         if (parts.length === 3) {
//           const index = parseInt(parts[1], 10);
//           const traveller = getValues(`travellers.${index}`);
//           if (traveller) {
//             const fullNumber = `${traveller.emergency_contact_phone_code || ''}${traveller.emergency_contact_phone_number || ''}`;
//             if (traveller.emergency_contact_phone !== fullNumber) {
//               setValue(`travellers.${index}.emergency_contact_phone`, fullNumber, { shouldValidate: true, shouldDirty: true });
//             }
//           }
//         }
//       }
//     });
//     return () => subscription.unsubscribe();
//   }, [watch, getValues, setValue]);

//   useEffect(() => {
//     const currentTravellers = getValues("travellers");
//     if (!currentTravellers || currentTravellers.length === 0) {
//       setValue("travellers", [{
//         first_name: cFirstNameValue || "", last_name: cLastNameValue || "",
//         birthdate: cBirthdateValue || "", passport_number: cPassportNumberValue || "",
//         passport_expiry_date: cPassportExpiryDateValue || "",
//         emergency_contact_phone_code: "",
//         emergency_contact_phone_number: "",
//         emergency_contact_phone: "",
//         nationality: "",
//         email: "",
//         address: "",
//         zip: ""
//       }], { shouldValidate: false, shouldDirty: false });
//     } else {
//       let changed = false;
//       const newTraveller0 = { ...currentTravellers[0] };
//       if (newTraveller0.first_name !== cFirstNameValue) { newTraveller0.first_name = cFirstNameValue || ""; changed = true; }
//       if (newTraveller0.last_name !== cLastNameValue) { newTraveller0.last_name = cLastNameValue || ""; changed = true; }
//       if (newTraveller0.birthdate !== cBirthdateValue) { newTraveller0.birthdate = cBirthdateValue || ""; changed = true; }
//       if (newTraveller0.passport_number !== cPassportNumberValue) { newTraveller0.passport_number = cPassportNumberValue || ""; changed = true; }
//       if (newTraveller0.passport_expiry_date !== cPassportExpiryDateValue) { newTraveller0.passport_expiry_date = cPassportExpiryDateValue || ""; changed = true; }
//       if (changed) {
//         const updatedTravellers = [...currentTravellers];
//         updatedTravellers[0] = newTraveller0;
//         setValue("travellers", updatedTravellers, {
//           shouldValidate: step === 1 && (!!formState.dirtyFields.c_first_name || !!formState.dirtyFields.c_last_name || !!formState.dirtyFields.c_birthdate || !!formState.dirtyFields.c_passport_number || !!formState.dirtyFields.c_passport_expiry_date),
//           shouldDirty: true
//         });
//       }
//     }
//   }, [cFirstNameValue, cLastNameValue, cBirthdateValue, cPassportNumberValue, cPassportExpiryDateValue, setValue, getValues, step, formState.dirtyFields]);

//   useEffect(() => {
//     if (watchedStartDate && watchedEndDate) {
//       const start = dayjs(watchedStartDate + "T00:00:00");
//       const end = dayjs(watchedEndDate + "T00:00:00");
//       if (start.isValid() && end.isValid() && (end.isSame(start) || end.isAfter(start))) {
//         const diffDays = end.diff(start, 'day') + 1;
//         setCalculatedTotalRiskZoneDays(diffDays);
//         setValue("green_zone_days", diffDays, { shouldValidate: true, shouldDirty: true });
//         if (Number(getValues("amber_zone_days")) !== 0) setValue("amber_zone_days", 0, { shouldValidate: true, shouldDirty: true });
//         if (Number(getValues("red_zone_days")) !== 0) setValue("red_zone_days", 0, { shouldValidate: true, shouldDirty: true });
//       } else {
//         setCalculatedTotalRiskZoneDays(null);
//         if (Number(getValues("green_zone_days")) !== 0) setValue("green_zone_days", 0, { shouldValidate: true, shouldDirty: true });
//       }
//     } else {
//       setCalculatedTotalRiskZoneDays(null);
//       if (Number(getValues("green_zone_days")) !== 0) setValue("green_zone_days", 0, { shouldValidate: true, shouldDirty: true });
//     }
//   }, [watchedStartDate, watchedEndDate, setValue, getValues]);

//   useEffect(() => {
//     const subscription = watch((currentValues, { name, type }) => {
//       if ((name === "amber_zone_days" || name === "red_zone_days") && type === "change" && calculatedTotalRiskZoneDays !== null) {
//         let amber = Number(currentValues.amber_zone_days || 0);
//         let red = Number(currentValues.red_zone_days || 0);
//         amber = Math.max(0, Math.floor(amber));
//         red = Math.max(0, Math.floor(red));
//         if (amber + red > calculatedTotalRiskZoneDays) {
//           if (name === "amber_zone_days") {
//             amber = calculatedTotalRiskZoneDays - red;
//             setValue("amber_zone_days", Math.max(0, amber), { shouldValidate: true, shouldDirty: true });
//           } else if (name === "red_zone_days") {
//             red = calculatedTotalRiskZoneDays - amber;
//             setValue("red_zone_days", Math.max(0, red), { shouldValidate: true, shouldDirty: true });
//           }
//         }
//         const newGreenDays = calculatedTotalRiskZoneDays - amber - red;
//         if (Number(getValues("green_zone_days")) !== Math.max(0, newGreenDays)) {
//           setValue("green_zone_days", Math.max(0, newGreenDays), { shouldValidate: true, shouldDirty: true });
//         }
//       }
//     });
//     return () => subscription.unsubscribe();
//   }, [watch, setValue, getValues, calculatedTotalRiskZoneDays]);

//   const cPhoneCode = watch("c_phone_code");
//   const cPhoneNumber = watch("c_phone_number");
//   const cIsWhatsAppSameAsPhone = watch("c_is_whatsapp_same_as_phone");

//   useEffect(() => {
//     const fullNumber = `${cPhoneCode || ''}${cPhoneNumber || ''}`;
//     if (getValues("c_phone") !== fullNumber) setValue("c_phone", fullNumber, { shouldValidate: true, shouldDirty: true });
//   }, [cPhoneCode, cPhoneNumber, setValue, getValues]);

//   useEffect(() => {
//     if (cIsWhatsAppSameAsPhone) {
//       setValue("c_whats_app_code", cPhoneCode || "", { shouldValidate: true, shouldDirty: true });
//       setValue("c_whats_app_number", cPhoneNumber || "", { shouldValidate: true, shouldDirty: true });
//     }
//   }, [cIsWhatsAppSameAsPhone, cPhoneCode, cPhoneNumber, setValue]);

//   const cWhatsAppCode = watch("c_whats_app_code");
//   const cWhatsAppNumber = watch("c_whats_app_number");
//   useEffect(() => {
//     const fullNumber = `${cWhatsAppCode || ''}${cWhatsAppNumber || ''}`;
//     if (getValues("c_whats_app") !== fullNumber) setValue("c_whats_app", fullNumber, { shouldValidate: true, shouldDirty: true });
//   }, [cWhatsAppCode, cWhatsAppNumber, setValue, getValues]);

//   const emergencyContactPhoneCode = watch("emergency_contact_phone_code");
//   const emergencyContactPhoneNumber = watch("emergency_contact_phone_number");
//   useEffect(() => {
//     const fullNumber = `${emergencyContactPhoneCode || ''}${emergencyContactPhoneNumber || ''}`;
//     if (getValues("emergency_contact_phone") !== fullNumber) setValue("emergency_contact_phone", fullNumber, { shouldValidate: true, shouldDirty: true });
//   }, [emergencyContactPhoneCode, emergencyContactPhoneNumber, setValue, getValues]);

//   const watchedPathsForQuote = [
//     "trip_start_date", "trip_end_date", "trip_countries", "travellers",
//     "emergency_medical_coverage", "personal_accident_coverage_level",
//     "add_transit_coverage", "green_zone_days", "amber_zone_days",
//     "red_zone_days", "black_zone_days", "city_of_residence"
//   ] as const;
//   const watchedValuesForQuote = watch(watchedPathsForQuote);


//   // useEffect(() => {
//   //   const getQuote = async () => {
//   //     const formValues = getValues();

//   //     const travellers = (formValues.travellers || []).map(t => ({
//   //     dateOfBirth: t.birthdate,
//   //     residence: t.nationality || formValues.city_of_residence
//   //   }));

//   //     const hasRequiredFieldsForQuote =
//   //       formValues.trip_start_date &&
//   //       formValues.trip_end_date &&
//   //       formValues.trip_countries && formValues.trip_countries.length > 0 && formValues.trip_countries[0] &&
//   //       formValues.emergency_medical_coverage &&
//   //       formValues.personal_accident_coverage_level !== undefined &&
//   //       formValues.travellers && formValues.travellers.length > 0 &&
//   //       formValues.city_of_residence;
//   //     if (!hasRequiredFieldsForQuote) {
//   //       setQuoteResult({
//   //         ok: false,
//   //         message: formValues.city_of_residence ? "Please fill all required trip and coverage details." : "Please select country of residence to get a quote.",
//   //         warnings: []
//   //       });
//   //       return;
//   //     }

//   //     const startDate = dayjs(formValues.trip_start_date + "T00:00:00");
//   //     const endDate = dayjs(formValues.trip_end_date + "T00:00:00");
//   //     if (!startDate.isValid() || !endDate.isValid() || endDate.isBefore(startDate)) {
//   //       setQuoteResult({ ok: false, message: "Invalid trip dates for quote calculation.", warnings: [] });
//   //       return;
//   //     }

//   //     const totalTripDaysCalculated = endDate.diff(startDate, 'day') + 1;
//   //     const sumZoneDaysFromForm = Number(formValues.green_zone_days || 0) + Number(formValues.amber_zone_days || 0) + Number(formValues.red_zone_days || 0) + Number(formValues.black_zone_days || 0);
//   //     if (totalTripDaysCalculated !== sumZoneDaysFromForm) {
//   //       setQuoteResult({ ok: false, message: `Zone days sum (${sumZoneDaysFromForm}) does not match total trip days (${totalTripDaysCalculated}).`, warnings: [] });
//   //       return;
//   //     }

//   //     const payload: GenerateQuotePayload = {
//   //       trip_start_date: startDate.toDate(),
//   //       trip_end_date: endDate.toDate(),
//   //       trip_country: formValues.trip_countries[0] as string,
//   //       country_of_residence: formValues.city_of_residence as string,
//   //       travellers_count: (formValues.travellers?.length > 0 ? formValues.travellers.length : 1) as Integer,
//   //       medical_coverage: formValues.emergency_medical_coverage as GenerateQuotePayload['medical_coverage'],
//   //       pa_coverage: formValues.personal_accident_coverage_level as GenerateQuotePayload['pa_coverage'],
//   //       transit_coverage: formValues.add_transit_coverage,
//   //       green_zone_days: Number(formValues.green_zone_days || 0) as Integer,
//   //       amber_zone_days: Number(formValues.amber_zone_days || 0) as Integer,
//   //       red_zone_days: Number(formValues.red_zone_days || 0) as Integer,
//   //       black_zone_days: Number(formValues.black_zone_days || 0) as Integer,
//   //     };

//   //     // setQuoteResult(undefined); 
//   //     const result = await fetchQuoteFromApi(payload, formValues);
//   //     setQuoteResult(result);
//   //   };

//   //   getQuote();
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, [...watchedValuesForQuote, formState.errors, getValidationMessage]);

//   useEffect(() => {
//     const getQuote = async () => {
//       const formValues = getValues();
//       const allTravellersHaveDOB =
//         (formValues.travellers || []).every(t => !!t.birthdate && /^\d{4}-\d{2}-\d{2}$/.test(t.birthdate));

//       const travellersForApi =
//         allTravellersHaveDOB
//           ? (formValues.travellers || []).map(t => ({
//             dateOfBirth: t.birthdate,
//             residence: formValues.city_of_residence,
//           }))
//           : Array.from({ length: (formValues.travellers?.length || 1) }).map(() => ({
//             dateOfBirth: "1990-01-01",
//             residence: formValues.city_of_residence,
//           }));
//       const hasRequiredFieldsForQuote =
//         formValues.trip_start_date &&
//         formValues.trip_end_date &&
//         formValues.trip_countries && formValues.trip_countries.length > 0 && formValues.trip_countries[0] &&
//         formValues.emergency_medical_coverage &&
//         formValues.personal_accident_coverage_level !== undefined &&
//         formValues.city_of_residence;

//       if (!hasRequiredFieldsForQuote) {
//         setQuoteResult({
//           ok: false,
//           message: formValues.city_of_residence ? "Please fill all required trip and coverage details." : "Please select country of residence to get a quote.",
//           warnings: []
//         });
//         return;
//       }

//       const startDate = dayjs(formValues.trip_start_date + "T00:00:00");
//       const endDate = dayjs(formValues.trip_end_date + "T00:00:00");
//       if (!startDate.isValid() || !endDate.isValid() || endDate.isBefore(startDate)) {
//         setQuoteResult({ ok: false, message: "Invalid trip dates for quote calculation.", warnings: [] });
//         return;
//       }

//       const totalTripDaysCalculated = endDate.diff(startDate, 'day') + 1;
//       const sumZoneDaysFromForm =
//         Number(formValues.green_zone_days || 0) +
//         Number(formValues.amber_zone_days || 0) +
//         Number(formValues.red_zone_days || 0) +
//         Number(formValues.black_zone_days || 0);
//       if (totalTripDaysCalculated !== sumZoneDaysFromForm) {
//         setQuoteResult({
//           ok: false,
//           message: `Zone days sum (${sumZoneDaysFromForm}) does not match total trip days (${totalTripDaysCalculated}).`,
//           warnings: []
//         });
//         return;
//       }

//       const payload: GenerateQuotePayload = {
//         trip_start_date: startDate.toDate(),
//         trip_end_date: endDate.toDate(),
//         trip_country: formValues.trip_countries[0] as string,
//         country_of_residence: formValues.city_of_residence as string,
//         travellers_count: (formValues.travellers?.length > 0 ? formValues.travellers.length : 1) as Integer,
//         medical_coverage: formValues.emergency_medical_coverage as GenerateQuotePayload['medical_coverage'],
//         pa_coverage: formValues.personal_accident_coverage_level as GenerateQuotePayload['pa_coverage'],
//         transit_coverage: formValues.add_transit_coverage,
//         green_zone_days: Number(formValues.green_zone_days || 0) as Integer,
//         amber_zone_days: Number(formValues.amber_zone_days || 0) as Integer,
//         red_zone_days: Number(formValues.red_zone_days || 0) as Integer,
//         black_zone_days: Number(formValues.black_zone_days || 0) as Integer,
//       };

//       const result = await fetchQuoteFromApi(payload, travellersForApi);
//       setQuoteResult(result);
//     };
//     getQuote();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [step, ...watchedValuesForQuote, formState.errors, getValidationMessage]);
//   const onSubmitForm = () => {
//     const allData = getValues();

//     if (allData.travellers && allData.travellers.length > 0) {
//       allData.travellers[0] = {
//         ...allData.travellers[0],
//         first_name: allData.c_first_name || "",
//         last_name: allData.c_last_name || "",
//         birthdate: allData.c_birthdate || "",
//         passport_number: allData.c_passport_number || "",
//         passport_expiry_date: allData.c_passport_expiry_date || "",
//       };
//     } else {
//       allData.travellers = [{
//         first_name: allData.c_first_name || "",
//         last_name: allData.c_last_name || "",
//         birthdate: allData.c_birthdate || "",
//         passport_number: allData.c_passport_number || "",
//         passport_expiry_date: allData.c_passport_expiry_date || "",
//         emergency_contact_phone_code: "",
//         emergency_contact_phone_number: "",
//         emergency_contact_phone: "",
//         nationality: "",
//         email: "",
//         address: "",
//         zip: ""
//       }];
//     }

//     const allowedCoverage = ["0", "25000", "50000", "100000", "150000", "250000"];
//     const safeMedicalCoverage = allowedCoverage.includes(allData.emergency_medical_coverage) ? allData.emergency_medical_coverage : "0";
//     const safePaCoverage = allowedCoverage.includes(allData.personal_accident_coverage_level) ? allData.personal_accident_coverage_level : "0";

//     const quotePayload = {
//       trip_start_date: allData.trip_start_date ? dayjs(allData.trip_start_date + "T00:00:00").toDate() : new Date(),
//       trip_end_date: allData.trip_end_date ? dayjs(allData.trip_end_date + "T00:00:00").toDate() : new Date(),
//       trip_country: allData.trip_countries?.[0] || "",
//       country_of_residence: allData.city_of_residence || "",
//       travellers_count: (allData.travellers?.length || 1) as Integer,
//       medical_coverage: safeMedicalCoverage as GenerateQuotePayload['medical_coverage'],
//       pa_coverage: safePaCoverage as GenerateQuotePayload['pa_coverage'],
//       transit_coverage: allData.add_transit_coverage,
//       green_zone_days: Number(allData.green_zone_days || 0) as Integer,
//       amber_zone_days: Number(allData.amber_zone_days || 0) as Integer,
//       red_zone_days: Number(allData.red_zone_days || 0) as Integer,
//       black_zone_days: Number(allData.black_zone_days || 0) as Integer,
//     };
//     const quote = generateQuote(quotePayload, pricing);

//     const submission = { ...allData, quote, submittedAt: new Date().toISOString() };

//     // Save to localStorage
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     let existing: any[] = [];
//     try {
//       const stored = localStorage.getItem('insuranceFormData');
//       if (stored) {
//         const parsed = JSON.parse(stored);
//         if (Array.isArray(parsed)) existing = parsed;
//         else if (parsed && typeof parsed === 'object') existing = [parsed];
//       }
//     } catch (e) {
//       console.error("Error loading submissions from localStorage:", e);
//       existing = [];
//     }
//     existing.push(submission);
//     localStorage.setItem('insuranceFormData', JSON.stringify(existing));
//     console.log("Form Data (JSON):\n" + JSON.stringify(submission, null, 2));

//     const invoiceNumber = `INS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

//     const flywireConfig = {
//       env: "demo",
//       recipientCode: "POP",
//       amount: quote?.data?.totalAmount?.toString() || "0.00",
//       currency: quote?.currency || "EUR",

//       // Payer information from form data
//       firstName: allData.c_first_name || allData.travellers?.[0]?.first_name || "",
//       lastName: allData.c_last_name || allData.travellers?.[0]?.last_name || "",
//       email: allData.c_email || "",
//       phone: allData.c_phone || "",
//       address: allData.address || "",
//       city: allData.city_of_residence || "",
//       state: allData.state || "",
//       zip: allData.zip || "",
//       country: allData.country_of_residence || "",

//       recipientFields: {
//         invoice_number: invoiceNumber,
//         policy_type: "Travel Insurance",
//         trip_start_date: allData.trip_start_date || "",
//         trip_end_date: allData.trip_end_date || "",
//         destination: allData.trip_countries?.[0] || "",
//         travellers_count: (allData.travellers?.length || 1).toString(),
//         medical_coverage: safeMedicalCoverage,
//         pa_coverage: safePaCoverage,
//         customer_reference: allData.customer_id || "",
//         policy_holder: `${allData.c_first_name || ""} ${allData.c_last_name || ""}`.trim()
//       },

//       paymentOptionsConfig: {
//         sort: [
//           { currency: ["local", "foreign"] },
//           { amount: "asc" },
//           { type: ["bank_transfer", "credit_card", "online"] }
//         ]
//       },

//       callbackId: invoiceNumber,
//       callbackUrl: `${window.location.origin}/flywire-notifications`,
//       callbackVersion: "2",

//       payerEmailNotifications: true,
//       showLiveChat: true,

//       onInvalidInput: function (errors: FlywireError[]) {
//         errors.forEach(function (error: FlywireError) {
//           console.error("Flywire validation error:", error);
//           alert(error.msg || "Payment validation error occurred");
//         });
//       },

//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       onPaymentSuccess: function (paymentData: any) {
//         console.log("Payment successful:", paymentData);

//         const updatedSubmission = {
//           ...submission,
//           paymentStatus: 'completed',
//           paymentData: paymentData,
//           invoiceNumber: invoiceNumber,
//           paidAt: new Date().toISOString()
//         };

//         // Update localStorage with payment info
//         try {
//           const currentSubmissions = JSON.parse(localStorage.getItem('insuranceFormData') || '[]');
//           const lastIndex = currentSubmissions.length - 1;
//           if (lastIndex >= 0) {
//             currentSubmissions[lastIndex] = updatedSubmission;
//             localStorage.setItem('insuranceFormData', JSON.stringify(currentSubmissions));
//           }
//         } catch (error) {
//           console.error('Error updating localStorage:', error);
//         }

//         // Redirect to thank you page with actual payment data
//         const params = new URLSearchParams({
//           paymentId: paymentData.paymentId || paymentData.reference || invoiceNumber,
//           amount: quote?.data?.totalAmount?.toString() || "0.00",
//           currency: quote?.currency || "EUR",
//           status: 'completed'
//         });

//         window.location.href = `/thank-you?${params.toString()}`;
//       },

//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       onPaymentFailure: function (error: any) {
//         console.error("Payment failed:", error);
//         alert(t("insuranceForm.paymentFailureAlert") || "Payment failed. Please try again.");
//       },

//       onModalClose: function () {
//         console.log("Payment modal was closed");
//         // Handle modal close if needed
//       },

//       requestPayerInfo: true,
//       requestRecipientInfo: true,
//       returnUrl: `${window.location.origin}/thank-you`
//     };

//     // Function to load Flywire SDK dynamically if not loaded
//     const loadFlywireSDK = () => {
//       return new Promise((resolve, reject) => {
//         // Check if already loaded
//         if (typeof window.FlywirePayment !== 'undefined') {
//           resolve(window.FlywirePayment);
//           return;
//         }

//         // Check if script tag already exists
//         if (document.querySelector('script[src*="flywire-payment.js"]')) {
//           // Script exists, wait for it to load
//           const checkLoaded = setInterval(() => {
//             if (typeof window.FlywirePayment !== 'undefined') {
//               clearInterval(checkLoaded);
//               resolve(window.FlywirePayment);
//             }
//           }, 100);

//           // Timeout after 10 seconds
//           setTimeout(() => {
//             clearInterval(checkLoaded);
//             reject(new Error('Flywire SDK load timeout'));
//           }, 10000);
//           return;
//         }

//         // Load the script dynamically
//         const script = document.createElement('script');
//         script.src = 'https://checkout.flywire.com/flywire-payment.js';
//         script.async = true;

//         script.onload = () => {
//           if (typeof window.FlywirePayment !== 'undefined') {
//             resolve(window.FlywirePayment);
//           } else {
//             reject(new Error('Flywire SDK not available after load'));
//           }
//         };

//         script.onerror = () => {
//           reject(new Error('Failed to load Flywire SDK'));
//         };

//         document.head.appendChild(script);
//       });
//     };

//     // Load Flywire SDK and trigger payment modal
//     loadFlywireSDK()
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       .then((FlywirePayment: any) => {
//         try {
//           console.log("Flywire SDK loaded successfully");
//           const modal = FlywirePayment.initiate(flywireConfig);
//           modal.render();
//         } catch (error) {
//           console.error("Error initiating Flywire payment:", error);
//           alert("Payment system error. Please try again later.");
//         }
//       })
//       .catch((error) => {
//         console.error("Failed to load Flywire SDK:", error);
//         alert("Unable to load payment system. Please check your internet connection and try again.");
//       });
//   };


//   const handleNextOrContinue = async () => {
//     console.log("STEP", step, "VALUES", getValues());
//     console.log("STEP", step, "ERRORS", formState.errors);
//     if (step === 1 && ageLimitExceeded) {
//       setAgeAlertOpen(true);
//       return;
//     }
//     const currentStepFields = fieldsByStep[step] as Array<Path<InsuranceFormValues>>;
//     let overallValidationPassed = true;
//     const partFieldsToValidate: Path<InsuranceFormValues>[] = [];
//     if (step === 1) partFieldsToValidate.push("c_phone_code", "c_phone_number", "c_whats_app_code", "c_whats_app_number", "c_passport_number", "c_passport_expiry_date", "city_of_residence");
//     if (step === 3) partFieldsToValidate.push("emergency_contact_phone_code", "emergency_contact_phone_number");

//     if (partFieldsToValidate.length > 0) {
//       const partValidationResult = await trigger(partFieldsToValidate, { shouldFocus: true });
//       if (!partValidationResult) overallValidationPassed = false;
//     }

//     if (overallValidationPassed) {
//       const currentStepValidationResult = await trigger(currentStepFields, { shouldFocus: true });
//       if (!currentStepValidationResult) overallValidationPassed = false;
//     }

//     if (overallValidationPassed && step === 0) {
//       const values = getValues();
//       if (values.trip_start_date && values.trip_end_date) {
//         const startDate = dayjs(values.trip_start_date + "T00:00:00");
//         const endDate = dayjs(values.trip_end_date + "T00:00:00");
//         if (startDate.isValid() && endDate.isValid() && (endDate.isSame(startDate) || endDate.isAfter(startDate))) {
//           const totalTripDays = endDate.diff(startDate, 'day') + 1;
//           const sumZoneDays = Number(values.green_zone_days || 0) + Number(values.amber_zone_days || 0) + Number(values.red_zone_days || 0) + Number(values.black_zone_days || 0);
//           if (totalTripDays !== sumZoneDays) {
//             const message = getValidationMessage('insuranceForm.validationzoneDaysSum', { totalCalculatedDays: totalTripDays, sumOfZoneDays: sumZoneDays });
//             form.setError("root", { type: "manual", message });
//             overallValidationPassed = false;
//           } else {
//             form.clearErrors("root");
//           }
//         }
//       }
//     }

//     if (!overallValidationPassed) {
//       const fieldsToSearchForErrors = Array.from(new Set([...currentStepFields, ...partFieldsToValidate]));
//       let firstErrorKeyFound: Path<InsuranceFormValues> | undefined = fieldsToSearchForErrors.find(fieldName => getError(fieldName) !== undefined);
//       if (!firstErrorKeyFound && step === 1 && formState.errors.travellers) {
//         const travellerErrors = formState.errors.travellers;
//         if (Array.isArray(travellerErrors)) {
//           for (let i = 0; i < travellerErrors.length; i++) {
//             const specificTravellerErrors = travellerErrors[i] as undefined | Record<string, FieldError | undefined>;
//             if (specificTravellerErrors) {
//               const fieldsToCheck: (keyof InsuranceFormValues['travellers'][0])[] = ['first_name', 'last_name', 'birthdate', 'passport_number', 'passport_expiry_date'];
//               for (const Tfield of fieldsToCheck) if (specificTravellerErrors[Tfield]) { firstErrorKeyFound = `travellers.${i}.${Tfield}` as Path<InsuranceFormValues>; break; }
//             }
//             if (firstErrorKeyFound) break;
//           }
//         }
//       }
//       if (!firstErrorKeyFound && step === 2 && formState.errors.trip_cities) {
//         const cityErrorsArray = formState.errors.trip_cities;
//         if (Array.isArray(cityErrorsArray)) {
//           for (let i = 0; i < cityErrorsArray.length; i++) {
//             const specificCityErrors = cityErrorsArray[i];
//             if (specificCityErrors?.name) { firstErrorKeyFound = `trip_cities.${i}.name` as Path<InsuranceFormValues>; break; }
//           }
//         }
//       }
//       if (!firstErrorKeyFound && formState.errors.root?.message) {
//         const zoneDayElement = document.querySelector(`[name='amber_zone_days']`) || document.querySelector(`[name='red_zone_days']`) || document.querySelector(`[name='green_zone_days']`);
//         zoneDayElement?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return;
//       }
//       if (firstErrorKeyFound) {
//         const element = document.querySelector(`[name='${firstErrorKeyFound}']`) || document.getElementById(firstErrorKeyFound as string);
//         element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       }
//       return;
//     }
//     if (step < steps.length - 1) setStep((prev) => prev + 1);
//   };

//   const handlePrevStep = () => setStep((prev) => Math.max(prev - 1, 0));

//   const getError = (fieldName: Path<InsuranceFormValues>): FieldError | undefined => {
//     const error = get(formState.errors, fieldName);
//     if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') return error as FieldError;
//     return undefined;
//   };



//   const formatDateForDisplay = (dateString: string | undefined): string => {
//     if (!dateString) return "N/A";
//     try {
//       const parts = dateString.split('-'); if (parts.length !== 3) return "Invalid Date";
//       const year = parseInt(parts[0], 10), month = parseInt(parts[1], 10) - 1, day = parseInt(parts[2], 10);
//       const dateObj = new Date(year, month, day);
//       if (isNaN(dateObj.getTime()) || dateObj.getFullYear() !== year || dateObj.getMonth() !== month || dateObj.getDate() !== day) return "Invalid Date";
//       return formatDateFn(dateObj, "PPP");
//     } catch (e) { console.error("Error formatting date:", dateString, e); return "Invalid Date"; }
//   };

//   const watchedPathsForSummary = ["trip_start_date", "trip_end_date", "emergency_medical_coverage", "personal_accident_coverage_level", "add_transit_coverage", "c_first_name", "c_last_name", "c_birthdate", "c_nationality", "trip_purpose", "primary_cities_regions_ukraine", "emergency_contact_first_name", "emergency_contact_last_name", "emergency_contact_phone", "c_passport_number", "c_passport_expiry_date", "city_of_residence"] as const;
//   const watchedValuesForSummary = watch(watchedPathsForSummary);
//   const watchedTravellersForSummary = watch("travellers");
//   const watchedTripCitiesForSummary = watch("trip_cities");


//   const getEmergencyMedicalLabel = (value: string) => currentEmergencyMedicalCoverageOptions.find(opt => opt.value === value)?.label || value || "N/A";
//   const getPALabel = (value: string) => currentPersonalAccidentCoverageOptions.find(opt => opt.value === value)?.label || value || "N/A";
//   const getTripPurposeLabel = (value: string) => currentTripPurposes.find(opt => opt.value === value)?.label || value || "N/A";
//   const getNationalityLabel = (value: string) => currentNationalityOptions.find(opt => opt.value === value)?.label || value || "N/A";
//   const getCountryOfResidenceLabel = (value: string) => currentCountryOptions.find(opt => opt.value === value)?.label || value || "N/A";


//   const formatFullName = (firstName?: string, lastName?: string): string => {
//     const first = firstName || "", last = lastName || "";
//     if (first && last) return `${first} ${last}`;
//     return first || last || "N/A";
//   };

//   const renderQuoteDisplay = () => {
//     if (!quoteResult) return "€0.00 ";
//     if (!quoteResult.ok) return `€0.00 (${quoteResult.message || "Error"})`;
//     if (quoteResult.data) return `€${quoteResult.data.totalAmount.toFixed(2)}`;
//     return "€0.00 (Unavailable)";
//   };

//   const renderQuoteWarnings = () => {
//     if (quoteResult && quoteResult.ok && quoteResult.warnings && quoteResult.warnings.length > 0) {
//       return (<div className="mt-1 text-xs text-orange-600"><strong>{t("insuranceForm.warnings")}:</strong><ul className="list-disc list-inside pl-4">{quoteResult.warnings.map((warning, idx) => <li key={idx}>{warning}</li>)}</ul></div>);
//     }
//     return null;
//   };

//   function getTravellerBreakdown() {
//     if (!quoteResult?.ok || !quoteResult.data) return [];
//     const travellers = watchedTravellersForSummary || [];
//     const perTravellerCount = quoteResult.data.travellersCount || 1;
//     const perTravellerMedical = quoteResult.data.medicalCoverAmount / perTravellerCount;
//     const perTravellerPA = quoteResult.data.paCoverAmount / perTravellerCount;
//     const perTravellerTransit = quoteResult.data.totalAmount / perTravellerCount - perTravellerMedical - perTravellerPA;
//     return travellers.map((traveller, idx) => ({
//       name: formatFullName(traveller.first_name, traveller.last_name),
//       medical: perTravellerMedical,
//       pa: perTravellerPA,
//       transit: perTravellerTransit > 0 ? perTravellerTransit : 0,
//       nationality: traveller.nationality,
//     }));
//   }

//   function getVatInfo() {
//     // Example: apply 19% VAT if country_of_residence is DE (Germany)
//     const country = watch("city_of_residence");
//     const vatCountries = ["DE"];
//     if (vatCountries.includes(country)) {
//       return { rate: 0.19, label: "19%" };
//     }
//     return null;
//   }
//   const [pricing, setPricing] = useState<PricingMatrix>(defaultPricing);
//   useEffect(() => {
//     try {
//       const stored = localStorage.getItem('insurancePricingMatrix');
//       if (stored) {
//         setPricing(JSON.parse(stored));
//       } else {
//         localStorage.setItem('insurancePricingMatrix', JSON.stringify(defaultPricing));
//         setPricing(defaultPricing);
//       }
//     } catch {
//       localStorage.setItem('insurancePricingMatrix', JSON.stringify(defaultPricing));
//       setPricing(defaultPricing);
//     }
//   }, []);

//   return (
//     <>
//       <AlertDialog open={ageAlertOpen} onOpenChange={setAgeAlertOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>{t("insuranceForm.ageLimit.title")}</AlertDialogTitle>
//             <AlertDialogDescription>
//               {t("insuranceForm.ageLimit.description")}
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogAction onClick={() => setAgeAlertOpen(false)}>
//               {t("insuranceForm.ageLimit.confirm")}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       <div className="flex justify-center px-4 py-10 " style={{
//         backgroundImage: "url('/bg.jpg')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}>
//         <div className="w-full max-w-4xl">
//           <div className="mb-8 space-y-4">
//             <div className="flex items-center justify-between">
//               {steps.map((label, index) => (
//                 <div key={index} className="flex-1 text-center text-sm font-semibold">
//                   <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${index <= step ? "bg-[#1A2C50] text-white" : "bg-[#00BBD3] text-white"}`}>{index + 1}</div>
//                   <div className="mt-1 font-semibold">{label}</div>
//                 </div>
//               ))}
//             </div>
//             <div className="h-2 bg-[#00BBD3] rounded-full"><div className="h-2 bg-[#1A2C50] rounded-full transition-all duration-300" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
//           </div>

//           <div className="bg-white/90 p-6 md:p-8 shadow-lg shadow-[#1A2C50] rounded-md">
//             <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-8">
//               {step === 0 && (
//                 <>
//                   <h2 className="text-2xl font-semibold mb-6 text-[#1A2C50]">{t("insuranceForm.travelDetails")}</h2>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                     <DatePickerField label={t("insuranceForm.travelStartDate")} name="trip_start_date" control={control} error={getError("trip_start_date")} placeholder={t("insuranceForm.selectStartDate")} minDate={dayjs().startOf('day').toDate()} maxDate={watchedEndDate ? dayjs(watchedEndDate).toDate() : undefined} />
//                     <DatePickerField
//                       label={t("insuranceForm.travelEndDate")}
//                       name="trip_end_date"
//                       control={control}
//                       error={getError("trip_end_date")}
//                       placeholder={t("insuranceForm.selectEndDate")}
//                       minDate={
//                         watchedStartDate
//                           ? dayjs(watchedStartDate).startOf("day").toDate()
//                           : dayjs().startOf("day").toDate()
//                       }
//                       maxDate={
//                         watchedStartDate
//                           ? dayjs(watchedStartDate).add(179, "day").endOf("day").toDate()
//                           : undefined
//                       }
//                     />

//                   </div>
//                   <SelectWithLabel label={t('insuranceForm.step1.countryTravellingTo')} name="trip_countries.0" control={control} options={currentCountryTravellingToOptions} placeholder={t('insuranceForm.step1.selectCountry')} error={getError("trip_countries.0" as Path<InsuranceFormValues>) || getError("trip_countries" as Path<InsuranceFormValues>)} />
//                   {/* <h3 className="text-xl font-semibold mb-1 text-[#1A2C50]">{t("insuranceForm.riskZoneDays")}</h3> */}
//                   <h3 className="text-xl font-semibold mb-1 text-[#1A2C50] flex items-center">
//                     {t("insuranceForm.riskZoneDays")}
//                     <TooltipProvider>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <span className="ml-2 cursor-pointer">
//                             <Info className="w-5 h-5" aria-label="Info" />
//                           </span>
//                         </TooltipTrigger>
//                         <TooltipContent side="right" align="start" sideOffset={4}>
//                           <div
//                             className="bg-muted px-3 py-2 text-sm shadow"
//                             style={{ maxWidth: 470, whiteSpace: "pre-line", wordBreak: "break-word" }}
//                           >
//                             {t("insuranceForm.riskZoneDaysTooltip")}
//                           </div>
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                     <InputWithLabel label={t("insuranceForm.totalDays")} name="displayTotalDays" type="number" value={calculatedTotalRiskZoneDays !== null ? calculatedTotalRiskZoneDays.toString() : ""} readOnly={true} />
//                     <InputWithLabel label={t("insuranceForm.greenZoneDays")} name="green_zone_days" type="number" value={watchedGreenDaysForDisplay?.toString()} readOnly={true} register={register} error={getError("green_zone_days")} />
//                     <InputWithLabel label={t("insuranceForm.amberZoneDays")} name="amber_zone_days" type="number" register={register} error={getError("amber_zone_days")} />
//                     <InputWithLabel label={t("insuranceForm.redZoneDays")} name="red_zone_days" type="number" register={register} error={getError("red_zone_days")} />
//                   </div>
//                   {formState.errors.root && (<p className="text-sm text-red-500 mb-4">{formState.errors.root.message}</p>)}
//                   <div className="mb-6">
//                     <SelectWithLabel
//                       label={t('insuranceForm.step1.countryOfResidence')}
//                       name="city_of_residence"
//                       control={control}
//                       options={currentCountryOptions}
//                       placeholder={t('insuranceForm.step1.selectCountry')}
//                       error={getError("city_of_residence")}
//                     />
//                   </div>
//                   <h3 className="text-xl font-semibold mb-4 text-[#1A2C50]">{t("insuranceForm.coverageOptions")}</h3>
//                   <div className="space-y-4 mb-6">
//                     {/* <SelectWithLabel label={t("insuranceForm.emergencyMedical")} name="emergency_medical_coverage" control={control} options={currentEmergencyMedicalCoverageOptions} placeholder={t("insuranceForm.selectMedicalCoverage")} error={getError("emergency_medical_coverage")} readOnly={coverageDisabled || !watch("city_of_residence")} />
//                     <SelectWithLabel label={t("insuranceForm.personalAccident")} name="personal_accident_coverage_level" control={control} options={currentPersonalAccidentCoverageOptions} placeholder={t("insuranceForm.selectPACoverage")} error={getError("personal_accident_coverage_level")} readOnly={coverageDisabled || !watch("city_of_residence")} /> */}
//                     <div className="grid grid-cols-2 gap-6">
//                       <SelectWithLabel
//                         label={t("insuranceForm.emergencyMedical")}
//                         name="emergency_medical_coverage"
//                         control={control}
//                         options={currentEmergencyMedicalCoverageOptions}
//                         placeholder={t("insuranceForm.selectMedicalCoverage")}
//                         error={getError("emergency_medical_coverage")}
//                         readOnly={coverageDisabled || !watch("city_of_residence")}
//                       />

//                       <SelectWithLabel
//                         label={t("insuranceForm.personalAccident")}
//                         name="personal_accident_coverage_level"
//                         control={control}
//                         options={currentPersonalAccidentCoverageOptions}
//                         placeholder={t("insuranceForm.selectPACoverage")}
//                         error={getError("personal_accident_coverage_level")}
//                         readOnly={coverageDisabled || !watch("city_of_residence")}
//                       />
//                     </div>
//                     <TooltipProvider>
//                       <div className="flex items-center space-x-2">
//                         <Controller
//                           name="add_transit_coverage"
//                           control={control}
//                           render={({ field }) => (
//                             <Checkbox
//                               id="add_transit_coverage"
//                               checked={field.value}
//                               onCheckedChange={field.onChange}

//                             />
//                           )}
//                         />
//                         <Label
//                           htmlFor="add_transit_coverage"
//                         >
//                           {t("insuranceForm.addTransitCover")} <strong>€25</strong>
//                         </Label>
//                         <Tooltip>
//                           <TooltipTrigger asChild>
//                             <Info
//                               className="w-4 h-4 text-red cursor-pointer"
//                               aria-label="Transit Info"
//                             />
//                           </TooltipTrigger>
//                           <TooltipContent side="bottom" align="start" sideOffset={4}>
//                             <div className="relative">
//                               <div className="bg-muted px-3 py-2 text-sm shadow">
//                                 {t("insuranceForm.addTransitCoverTooltip")}
//                               </div>
//                               <div className="absolute top-0 left-2.5 -translate-y-full w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-muted" />
//                             </div>
//                           </TooltipContent>
//                         </Tooltip>
//                       </div>
//                     </TooltipProvider>
//                   </div>
//                   <div className="mt-4 pt-6 border-t">
//                     <div className="mt-4 p-6 bg-gray-50 rounded-md border">
//                       <h3 className="text-xl font-semibold text-[#1A2C50] mb-2">
//                         {t("insuranceForm.quoteSummary")}
//                       </h3>

//                       <p className="text-2xl font-bold text-[#00BBD3]">
//                         {renderQuoteDisplay()}
//                       </p>

//                       {renderQuoteWarnings()}

//                       <p>
//                         {t("insuranceForm.step4.summaryOfCoverage.coverage.medical")}:{" "}
//                         {getEmergencyMedicalLabel(watch("emergency_medical_coverage"))}{" "}
//                         {quoteResult?.data ? `(${formatEuro(quoteResult.data.medicalCoverAmount)})` : ""}
//                       </p>
//                       <p>
//                         {t("insuranceForm.step4.summaryOfCoverage.coverage.pa")}:{" "}
//                         {getPALabel(watch("personal_accident_coverage_level"))}{" "}
//                         {quoteResult?.data ? `(${formatEuro(quoteResult.data.paCoverAmount)})` : ""}
//                       </p>
//                       <p>
//                         {t("insuranceForm.step4.summaryOfCoverage.coverage.transit")}:{" "}
//                         {watchedValuesForSummary[4]
//                           ? t("insuranceForm.yes250k")
//                           : t("insuranceForm.no")}
//                       </p>
//                     </div>
//                   </div>
//                 </>
//               )}
//               {step === 1 && (
//                 <>
//                   <h2 className="text-2xl font-semibold mb-6 text-[#1A2C50]">{t('insuranceForm.step1.yourDetails')}</h2>
//                   <div className="mb-6">
//                     <Label className="font-semibold text-gray-900">{t("insuranceForm.step1.purchaseContextLabel")}</Label>
//                     <Controller
//                       name="purchase_context"
//                       control={control}
//                       render={({ field }) => (
//                         <RadioGroup
//                           onValueChange={field.onChange}
//                           value={field.value}
//                           className="flex flex-col space-y-2 mt-2"
//                         >
//                           <div className="flex items-center space-x-2">
//                             <RadioGroupItem value="self" id="purchase_context_self" />
//                             <Label htmlFor="purchase_context_self">{t("insuranceForm.step1.purchaseContextSelf")}</Label>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <RadioGroupItem value="other" id="purchase_context_other" />
//                             <Label htmlFor="purchase_context_other">{t("insuranceForm.step1.purchaseContextOther")}</Label>
//                           </div>
//                         </RadioGroup>
//                       )}
//                     />
//                     {getError("purchase_context") && <p className="text-sm text-red-500 mt-1">{getError("purchase_context")?.message}</p>}

//                     {watch("purchase_context") === "other" && (
//                       <div className="flex items-start space-x-2 pt-6">
//                         <Controller
//                           name="consent_for_additional_travellers"
//                           control={control}
//                           render={({ field }) => (
//                             <Checkbox
//                               id="consent_for_additional_travellers"
//                               checked={!!field.value}
//                               onCheckedChange={field.onChange}
//                             />
//                           )}
//                         />
//                         <div className="leading-none mt-0.5">
//                           <Label htmlFor="consent_for_additional_travellers" className="font-medium leading-snug">
//                             {t("insuranceForm.step1.consentForAdditionalTravellers")}
//                           </Label>
//                           {getError("consent_for_additional_travellers" as Path<InsuranceFormValues>) && (
//                             <p className="text-sm text-red-500">
//                               {getError("consent_for_additional_travellers" as Path<InsuranceFormValues>)?.message}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   <h3 className="text-lg font-semibold mb-3 text-[#1A2C50]">{t('insuranceForm.step1.primaryTraveller')}</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div><div className="flex items-start gap-2"><div className="flex-grow"><InputWithLabel label={t("insuranceForm.step1.contactFirstName")} name="c_first_name" register={register} placeholder={t("insuranceForm.step1.contactFirstName")} error={getError("c_first_name") || getError("travellers.0.first_name" as Path<InsuranceFormValues>)} /></div><div className="flex-grow"><InputWithLabel label={t("insuranceForm.step1.contactLastName")} name="c_last_name" register={register} placeholder={t("insuranceForm.step1.contactLastName")} error={getError("c_last_name") || getError("travellers.0.last_name" as Path<InsuranceFormValues>)} /></div></div></div>
//                     <div className="mt-1.5"><BirthDateField label={t('insuranceForm.step1.dob')} name="c_birthdate" control={control} getError={getError} watch={watch} /></div>
//                     <div><p className="text-sm font-medium text-gray-900 mb-1 mt-1">{t('insuranceForm.step1.phoneNumber')}</p><div className="flex items-start gap-2"><div className="w-1/3 shrink-0"><SelectWithLabel control={control} name="c_phone_code" label="" options={currentCountryCodeOptions} placeholder={t("insuranceForm.step3.codePlaceholder")} error={getError("c_phone_code")} /></div><div className="flex-grow"><InputWithLabel label="" name="c_phone_number" type="tel" register={register} placeholder={t('insuranceForm.step1.enterNumber')} error={getError("c_phone_number")} /></div></div>{getError("c_phone") && <p className="text-sm text-red-500 mt-1">{getError("c_phone")?.message}</p>}</div>
//                     <InputWithLabel label={t('insuranceForm.step1.email')} name="c_email" type="email" register={register} error={getError("c_email")} />
//                     <div className="md:col-span-2 mt-3"><div className="flex items-center space-x-2"><Controller name="c_is_whatsapp_same_as_phone" control={control} render={({ field }) => (<Checkbox id="c_is_whatsapp_same_as_phone" checked={field.value} onCheckedChange={field.onChange} />)} /><Label htmlFor="c_is_whatsapp_same_as_phone">{t("insuranceForm.step1.whatsappSameAsPhone")}</Label></div></div>
//                     <div className="flex items-start gap-2">
//                       <div className="flex-grow">
//                         <InputWithLabel
//                           label={t("insuranceForm.step1.address")}
//                           name="address"
//                           register={register}
//                           placeholder={t("insuranceForm.step1.addressPlaceholder")}
//                           error={getError("address")}
//                         />
//                       </div>
//                       <div className="flex-grow">
//                         <InputWithLabel
//                           label={t("insuranceForm.step1.zip")}
//                           name="zip"
//                           register={register}
//                           placeholder={t("insuranceForm.step1.zipPlaceholder")}
//                           error={getError("zip")}
//                         />
//                       </div>
//                     </div>
//                     <SelectWithLabel label={t('insuranceForm.step1.nationality')} name="c_nationality" control={control} options={currentNationalityOptions} placeholder={t('insuranceForm.step1.selectNationality')} error={getError("c_nationality")} />
//                   </div>

//                   <div className="mt-6 pt-6">
//                     <h2 className="text-lg font-semibold mb-3 text-[#1A2C50]">{t("insuranceForm.step3.title")}</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div><div className="flex items-start gap-2"><div className="flex-grow"><InputWithLabel label={t("insuranceForm.step1.contactFirstName")} name="emergency_contact_first_name" register={register} placeholder={t("insuranceForm.step1.contactFirstName")} error={getError("emergency_contact_first_name")} /></div><div className="flex-grow"><InputWithLabel label={t("insuranceForm.step1.contactLastName")} name="emergency_contact_last_name" register={register} placeholder={t("insuranceForm.step1.contactLastName")} error={getError("emergency_contact_last_name")} /></div></div></div>
//                       <div><p className="text-sm font-medium text-gray-900 mb-1 mt-1">{t("insuranceForm.step3.contactNumber")}</p><div className="flex items-start gap-2"><div className="w-1/3 shrink-0"><SelectWithLabel control={control} name="emergency_contact_phone_code" label="" options={currentCountryCodeOptions} placeholder={t("insuranceForm.step3.codePlaceholder")} error={getError("emergency_contact_phone_code")} /></div><div className="flex-grow"><InputWithLabel label="" name="emergency_contact_phone_number" type="tel" register={register} placeholder={t("insuranceForm.step3.numberPlaceholder")} error={getError("emergency_contact_phone_number")} /></div></div>{getError("emergency_contact_phone") && <p className="text-sm text-red-500 mt-1">{getError("emergency_contact_phone")?.message}</p>}</div>
//                       <InputWithLabel label={t("insuranceForm.step3.relationship")} name="emergency_contact_relation" register={register} error={getError("emergency_contact_relation")} />
//                     </div>
//                   </div>

//                   {travellerFields.map((field, index) => {
//                     if (index === 0) return null;

//                     const firstNamePath = `travellers.${index}.first_name` as Path<InsuranceFormValues>;
//                     const lastNamePath = `travellers.${index}.last_name` as Path<InsuranceFormValues>;
//                     const birthdatePath = `travellers.${index}.birthdate` as Path<InsuranceFormValues>;
//                     const ecFirstNamePath = `travellers.${index}.emergency_contact_first_name` as Path<InsuranceFormValues>;
//                     const ecLastNamePath = `travellers.${index}.emergency_contact_last_name` as Path<InsuranceFormValues>;
//                     const ecRelationPath = `travellers.${index}.emergency_contact_relation` as Path<InsuranceFormValues>;
//                     const ecPhoneCodePath = `travellers.${index}.emergency_contact_phone_code` as Path<InsuranceFormValues>;
//                     const ecPhoneNumberPath = `travellers.${index}.emergency_contact_phone_number` as Path<InsuranceFormValues>;
//                     const ecPhonePath = `travellers.${index}.emergency_contact_phone` as Path<InsuranceFormValues>;

//                     return (
//                       <div key={field.id} className="mt-6 pt-6 border-t">
//                         <div className="flex justify-between items-center mb-3">
//                           <h3 className="text-lg font-semibold text-[#1A2C50]">{t(`insuranceForm.step1.additionalTraveller`)} #{index + 1}</h3>
//                           <Button type="button" variant="destructive" size="sm" onClick={() => removeTraveller(index)}>{t("insuranceForm.step1.remove")}</Button>
//                         </div>

//                         {/* Personal Details */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                           <div>
//                             <div className="flex items-start gap-2">
//                               <div className="flex-grow">
//                                 <InputWithLabel label={t("insuranceForm.step1.contactFirstName")} name={firstNamePath} register={register} placeholder={t("insuranceForm.step1.contactFirstName")} error={getError(firstNamePath)} />
//                               </div>
//                               <div className="flex-grow">
//                                 <InputWithLabel label={t("insuranceForm.step1.contactLastName")} name={lastNamePath} register={register} placeholder={t("insuranceForm.step1.contactLastName")} error={getError(lastNamePath)} />
//                               </div>
//                             </div>
//                           </div>
//                           <div className="w-full mt-1.5">
//                             <BirthDateField label={t('insuranceForm.step1.dob')} name={birthdatePath} control={control} getError={getError} watch={watch} />
//                           </div>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//                           <InputWithLabel
//                             label={t('insuranceForm.step1.email')}
//                             name={`travellers.${index}.email` as Path<InsuranceFormValues>}
//                             type="email"
//                             register={register}
//                             error={getError(`travellers.${index}.email` as Path<InsuranceFormValues>)}
//                           />
//                           <SelectWithLabel
//                             label={t('insuranceForm.step1.nationality')}
//                             name={`travellers.${index}.nationality` as Path<InsuranceFormValues>}
//                             control={control}
//                             options={currentNationalityOptions}
//                             placeholder={t('insuranceForm.step1.selectNationality')}
//                             error={getError(`travellers.${index}.nationality` as Path<InsuranceFormValues>)}
//                           />
//                           <div className="flex items-start gap-6 md:col-span-2">
//                             <div className="flex-1">
//                               <InputWithLabel
//                                 label={t("insuranceForm.step1.address")}
//                                 name={`travellers.${index}.address` as Path<InsuranceFormValues>}
//                                 register={register}
//                                 placeholder={t("insuranceForm.step1.addressPlaceholder")}
//                                 error={getError(`travellers.${index}.address` as Path<InsuranceFormValues>)}
//                               />
//                             </div>
//                             <div className="flex-1">
//                               <InputWithLabel
//                                 label={t("insuranceForm.step1.zip")}
//                                 name={`travellers.${index}.zip` as Path<InsuranceFormValues>}
//                                 register={register}
//                                 placeholder={t("insuranceForm.step1.zipPlaceholder")}
//                                 error={getError(`travellers.${index}.zip` as Path<InsuranceFormValues>)}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                         {/* Emergency Contact Details */}
//                         <div className="mt-4 pt-4 border-t border-dashed">
//                           <h4 className="text-md font-semibold text-[#1A2C50] mb-3">{t("insuranceForm.step3.title")}</h4>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div>
//                               <div className="flex items-start gap-2">
//                                 <div className="flex-grow">
//                                   <InputWithLabel label={t("insuranceForm.step1.contactFirstName")} name={ecFirstNamePath} register={register} error={getError(ecFirstNamePath)} />
//                                 </div>
//                                 <div className="flex-grow">
//                                   <InputWithLabel label={t("insuranceForm.step1.contactLastName")} name={ecLastNamePath} register={register} error={getError(ecLastNamePath)} />
//                                 </div>
//                               </div>
//                             </div>
//                             <div>
//                               <p className="text-sm font-medium text-gray-900 mb-1 mt-1">{t("insuranceForm.step3.contactNumber")}</p>
//                               <div className="flex items-start gap-2">
//                                 <div className="w-1/3 shrink-0">
//                                   <SelectWithLabel control={control} name={ecPhoneCodePath} label="" options={currentCountryCodeOptions} placeholder={t("insuranceForm.step3.codePlaceholder")} error={getError(ecPhoneCodePath)} />
//                                 </div>
//                                 <div className="flex-grow">
//                                   <InputWithLabel label="" name={ecPhoneNumberPath} type="tel" register={register} placeholder={t("insuranceForm.step3.numberPlaceholder")} error={getError(ecPhoneNumberPath)} />
//                                 </div>
//                               </div>
//                               {getError(ecPhonePath) && <p className="text-sm text-red-500 mt-1">{getError(ecPhonePath)?.message}</p>}
//                             </div>
//                             <InputWithLabel label={t("insuranceForm.step3.relationship")} name={ecRelationPath} register={register} error={getError(ecRelationPath)} />
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}



//                   <div className="text-red-600 text-sm font-semibold mr-2">
//                     {t("insuranceForm.step1.note")}
//                   </div>
//                   <Button type="button" variant="outline" onClick={() => appendTraveller({
//                     first_name: "",
//                     last_name: "",
//                     birthdate: "",
//                     passport_number: "",
//                     passport_expiry_date: "",
//                     emergency_contact_first_name: "",
//                     emergency_contact_last_name: "",
//                     emergency_contact_relation: "",
//                     emergency_contact_phone_code: "",
//                     emergency_contact_phone_number: "",
//                     emergency_contact_phone: "",
//                     email: "",
//                     nationality: "",
//                     address: "",
//                     zip: "",
//                   })} className="mt-6">{t("insuranceForm.step1.addAdditionalTraveller")}</Button>

//                   <div className="mt-8 pt-6 border-t">
//                     <div className="mt-4 p-6 bg-gray-50 rounded-md border">
//                       <h3 className="text-xl font-semibold text-[#1A2C50] mb-2">{t("insuranceForm.quoteSummary")}</h3>
//                       <p className="text-2xl font-bold text-[#00BBD3]">{renderQuoteDisplay()}</p>
//                       <p>{t("insuranceForm.step4.summaryOfCoverage.coverage.medical")}: {getEmergencyMedicalLabel(watch("emergency_medical_coverage"))} {quoteResult?.data ? `(${formatEuro(quoteResult.data.medicalCoverAmount)})` : ''}</p>
//                       <p>{t("insuranceForm.step4.summaryOfCoverage.coverage.pa")}: {getPALabel(watch("personal_accident_coverage_level"))} {quoteResult?.data ? `(${formatEuro(quoteResult.data.paCoverAmount)})` : ''}</p>
//                       <p>{t("insuranceForm.step4.summaryOfCoverage.coverage.transit")}: {watchedValuesForSummary[4] ? t("insuranceForm.yes250k") : t("insuranceForm.no")}</p>
//                     </div>
//                   </div>
//                   {getError("travellers" as Path<InsuranceFormValues>) && typeof getError("travellers" as Path<InsuranceFormValues>)?.message === 'string' && <p className="text-sm text-red-500 mt-1">{getError("travellers" as Path<InsuranceFormValues>)?.message}</p>}
//                 </>
//               )}
//               {step === 2 && (
//                 <>
//                   <h2 className="text-2xl font-semibold mb-6 text-[#1A2C50]">{t("insuranceForm.step2.title")}</h2>
//                   <div className="mt-6"><SelectWithLabel label={t("insuranceForm.step2.tripPurpose")} name="trip_purpose" control={control} options={currentTripPurposes} placeholder={t("insuranceForm.step2.selectTripPurpose")} error={getError("trip_purpose")} /></div>
//                   <div className="mt-6"><InputWithLabel label={t("insuranceForm.step2.companyName")} name="company_name" register={register} error={getError("company_name")} /></div>
//                   <div className="mt-6">
//                     <SelectWithLabel
//                       label={t("insuranceForm.step2.primaryCities")}
//                       name="primary_cities_regions_ukraine"
//                       control={control}
//                       options={primaryCitiesUkraineOptions}
//                       placeholder={t("insuranceForm.step2.primaryCity")}
//                       error={getError("primary_cities_regions_ukraine")}
//                     />
//                   </div>
//                   <div className="mt-6">
//                     <InputWithLabel
//                       label={t("insuranceForm.step2.cityOrTown")}
//                       name="city_or_town"
//                       register={register}
//                       error={getError("city_or_town")}
//                     />
//                   </div>

//                   <div className="mt-6"><InputWithLabel label={t("insuranceForm.step2.stayName")} name="stay_name" register={register} error={getError("stay_name")} /></div>
//                   <div className="mt-8 pt-6 border-t">
//                     <h3 className="text-lg font-semibold mb-3 text-[#1A2C50]">{t("insuranceForm.step2.citiesVisitingTitle")}</h3>
//                     {cityFields.map((field, index) => {
//                       const cityNamePath = `trip_cities.${index}.name` as Path<InsuranceFormValues>; const cityZoneTypePath = `trip_cities.${index}.zoneType` as Path<InsuranceFormValues>;
//                       return (<div key={field.id} className="flex items-end gap-2 mb-3"><div className="flex-grow"><InputWithLabel
//                         label={t("insuranceForm.step2.cityName").replace("{{index}}", (index + 1).toString())}
//                         name={cityNamePath}
//                         register={register}
//                         error={getError(cityNamePath)}
//                         placeholder={t("insuranceForm.step2.enterCityName")}
//                       /><input type="hidden" {...register(cityZoneTypePath)} value="GREEN" /></div><Button type="button" variant="destructive" size="sm" onClick={() => removeCity(index)}>{t("insuranceForm.step2.remove")}</Button></div>);
//                     })}
//                     <Button type="button" variant="outline" onClick={() => appendCity({ name: "", zoneType: "GREEN" })}>{t("insuranceForm.step2.addCity")}</Button>
//                     {getError("trip_cities" as Path<InsuranceFormValues>) && typeof getError("trip_cities" as Path<InsuranceFormValues>)?.message === 'string' && <p className="text-sm text-red-500 mt-1">{getError("trip_cities" as Path<InsuranceFormValues>)?.message}</p>}
//                   </div>
//                   <div className="mt-6 pt-6 border-t">
//                     <div className="mt-4 p-6 bg-gray-50 rounded-md border">
//                       <h3 className="text-xl font-semibold text-[#1A2C50] mb-2">{t("insuranceForm.quoteSummary")}</h3>
//                       <p className="text-2xl font-bold text-[#00BBD3]">{renderQuoteDisplay()}</p>
//                       <p>{t("insuranceForm.step4.summaryOfCoverage.coverage.medical")}: {getEmergencyMedicalLabel(watch("emergency_medical_coverage"))} {quoteResult?.data ? `(${formatEuro(quoteResult.data.medicalCoverAmount)})` : ''}</p>
//                       <p>{t("insuranceForm.step4.summaryOfCoverage.coverage.pa")}: {getPALabel(watch("personal_accident_coverage_level"))} {quoteResult?.data ? `(${formatEuro(quoteResult.data.paCoverAmount)})` : ''}</p>
//                       <p>{t("insuranceForm.step4.summaryOfCoverage.coverage.transit")}: {watchedValuesForSummary[4] ? t("insuranceForm.yes250k") : t("insuranceForm.no")}</p>
//                     </div>
//                   </div>
//                 </>
//               )}
//               {/* {step === 3 && (
//                 <>

//                   <h3 className="text-xl font-semibold mt-8 mb-4 text-[#1A2C50]">{t("insuranceForm.step3.optionalMedicalTitle")}</h3>
//                   <div className="space-y-4">
//                     <div className="flex items-center space-x-2"><Controller name="has_medical_conditions" control={control} render={({ field }) => <Checkbox id="has_medical_conditions" checked={!!field.value} onCheckedChange={field.onChange} />} /><Label htmlFor="has_medical_conditions">{t("insuranceForm.step3.preExistingConditions")}</Label></div>
//                     {watch("has_medical_conditions") && (<ControlledTextareaArray name="medical_conditions" control={control} label={t("insuranceForm.step3.listConditions")} error={getError("medical_conditions" as Path<InsuranceFormValues>)} />)}
//                     <div className="flex items-center space-x-2"><Controller name="has_allergies" control={control} render={({ field }) => <Checkbox id="has_allergies" checked={!!field.value} onCheckedChange={field.onChange} />} /><Label htmlFor="has_allergies">{t("insuranceForm.step3.allergies")}</Label></div>
//                     {watch("has_allergies") && (<ControlledTextareaArray name="allergies" control={control} label={t("insuranceForm.step3.listAllergies")} error={getError("allergies" as Path<InsuranceFormValues>)} />)}
//                     <div className="flex items-center space-x-2"><Controller name="has_current_medications" control={control} render={({ field }) => <Checkbox id="has_current_medications" checked={!!field.value} onCheckedChange={field.onChange} />} /><Label htmlFor="has_current_medications">{t("insuranceForm.step3.currentMedications")}</Label></div>
//                     {watch("has_current_medications") && (<ControlledTextareaArray name="current_medications" control={control} label={t("insuranceForm.step3.listMedications")} error={getError("current_medications" as Path<InsuranceFormValues>)} />)}
//                     <InputWithLabel label={t("insuranceForm.step3.bloodType")} name="blood_type" register={register} error={getError("blood_type")} />
//                     <TextareaWithLabel label={t("insuranceForm.step3.specialAssistance")} name="special_assistance" register={register} error={getError("special_assistance")} />
//                   </div>
//                 </>
//               )} */}
//               {step === 3 && (
//                 <>
//                   <h2 className="text-2xl font-semibold mb-6 text-[#1A2C50]">{t("insuranceForm.step4.summaryOfCoverage.title")}</h2>
//                   <div className="space-y-3 p-6 bg-gray-50 rounded-md border mb-6">
//                     <div><strong>{t("insuranceForm.step4.summaryOfCoverage.travelDates")}</strong> {formatDateForDisplay(watchedValuesForSummary[0])} to {formatDateForDisplay(watchedValuesForSummary[1])}</div>
//                     <div><strong>{t("insuranceForm.step1.countryOfResidence")}:</strong> {getCountryOfResidenceLabel(watchedValuesForSummary[16])}</div>
//                     <div><strong>{t("insuranceForm.step4.summaryOfCoverage.totalRiskZoneDays")}</strong> {calculatedTotalRiskZoneDays ?? "N/A"}</div>
//                     <div><strong>{t("insuranceForm.step4.summaryOfCoverage.riskZoneBreakdown")}</strong></div>

//                     <div className="pl-4">
//                       <div className="flex justify-between">
//                         <span>{t("insuranceForm.step4.summaryOfCoverage.zone.green")}:</span>
//                         <span>{watch("green_zone_days") || 0}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>{t("insuranceForm.step4.summaryOfCoverage.zone.amber")}:</span>
//                         <span>{watch("amber_zone_days") || 0}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>{t("insuranceForm.step4.summaryOfCoverage.zone.red")}:</span>
//                         <span>{watch("red_zone_days") || 0}</span>
//                       </div>
//                       {Number(watch("black_zone_days") || 0) > 0 && (
//                         <div className="flex justify-between">
//                           <span>{t("insuranceForm.step4.summaryOfCoverage.zone.black")}:</span>
//                           <span>{watch("black_zone_days")}</span>
//                         </div>
//                       )}
//                     </div>



//                     <div>
//                       <strong>Coverage Selected</strong>
//                       <div className="pl-4">
//                         <div className="font-semibold mb-2">
//                           {t("insuranceForm.step4.summaryOfCoverage.traveller")} x {quoteResult?.data?.travellersCount || 1}
//                         </div>
//                         <div className="flex justify-between">
//                           <span>{t("insuranceForm.step4.summaryOfCoverage.coverage.medical")}:</span>
//                           <span>
//                             {formatEuro(getTravellerBreakdown()[0]?.medical || 0)} × {quoteResult?.data?.travellersCount || 1} = <strong>{formatEuro(quoteResult?.data?.medicalCoverAmount || 0)}</strong>
//                           </span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>{t("insuranceForm.step4.summaryOfCoverage.coverage.pa")}:</span>
//                           <span>
//                             {formatEuro(getTravellerBreakdown()[0]?.pa || 0)} × {quoteResult?.data?.travellersCount || 1} = <strong>{formatEuro(quoteResult?.data?.paCoverAmount || 0)}</strong>
//                           </span>
//                         </div>
//                         {watch("add_transit_coverage") && (
//                           <div className="flex justify-between">
//                             <span>{t("insuranceForm.step4.summaryOfCoverage.coverage.transit")}:</span>
//                             <span>
//                               {formatEuro(pricing.transitCost)}
//                             </span>
//                           </div>
//                         )}
//                         {/* {(() => {
//                           const vat = getVatInfo();
//                           if (
//                             vat &&
//                             quoteResult?.data &&
//                             watchedValuesForSummary[16] === "DE"
//                           ) {
//                             const vatAmount = (getTravellerBreakdown()[0]?.medical || 0) * vat.rate;
//                             return (
//                               <div className="flex justify-between mt-2">
//                                 <strong>VAT ({vat.label}) on Medical (Primary):</strong>
//                                 <span>{formatEuro(vatAmount)}</span>
//                               </div>
//                             );
//                           }
//                           return null;
//                         })()} */}
//                         {/* {(() => {
//                           const vat = getVatInfo();
//                           if (
//                             vat &&
//                             quoteResult?.data &&
//                             watchedValuesForSummary[16] === "DE"
//                           ) {
//                             const vatAmount = (getTravellerBreakdown()[0]?.medical || 0) * 0.19;
//                             return (
//                               <div className="flex justify-between mt-2">
//                                 <strong>VAT (19%) on Medical (Primary):</strong>
//                                 <span>{formatEuro(vatAmount)}</span>
//                               </div>
//                             );
//                           }
//                           return null;
//                         })()} */}
//                         {/* {(() => {
//                           const vat = getVatInfo();
//                           if (
//                             vat &&
//                             quoteResult?.data &&
//                             watchedValuesForSummary[16] === "DE"
//                           ) {
//                             // Calculate VAT on total medical cover for all travellers
//                             const vatAmount = (quoteResult.data.medicalCoverAmount || 0) * 0.19;
//                             return (
//                               <div className="flex justify-between mt-2">
//                                 <strong>VAT (19%) on Medical:</strong>
//                                 <span>{formatEuro(vatAmount)}</span>
//                               </div>
//                             );
//                           }
//                           return null;
//                         })()} */}
//                         <div className="mt-4 pt-3 border-t">
//                           <div className="flex justify-between">
//                             <strong className="text-xl">{t("insuranceForm.step4.summaryOfCoverage.totalQuote")}:</strong>
//                             <span className="text-xl font-bold text-[#00BBD3]">
//                               {formatEuro(quoteResult?.data?.totalAmount || 0)}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="text-red-600 font-semibold mb-2">
//                           {t("insuranceForm.step4.summaryOfCoverage.note")}
//                         </div>
//                         {renderQuoteWarnings()}
//                       </div>
//                     </div>
//                   </div>
//                   <h3 className="text-xl font-semibold text-[#1A2C50] mb-3">{t("insuranceForm.step4.insuredDetails.title")}</h3>
//                   {watchedTravellersForSummary && watchedTravellersForSummary.map((traveller, index) => (
//                     <div key={`summary-traveller-${index}`} className="space-y-1 p-4 bg-gray-50 rounded-md border mb-3">
//                       <p className="font-semibold">
//                         {index === 0
//                           ? t("insuranceForm.step4.insuredDetails.primaryTraveller")
//                           : `${t("insuranceForm.step4.insuredDetails.additionalTraveller")} ${index + 1}`}
//                       </p>
//                       <div>
//                         <strong>{t("insuranceForm.step4.insuredDetails.name")}:</strong> {formatFullName(traveller.first_name, traveller.last_name)}
//                       </div>
//                       <div>
//                         <strong>{t("insuranceForm.step4.insuredDetails.age")}:</strong> {calculateAge(traveller.birthdate) || "N/A"}
//                       </div>
//                       <div>
//                         <strong>{t("insuranceForm.step4.insuredDetails.nationality")}:</strong> {getNationalityLabel(traveller.nationality) || "N/A"}
//                       </div>
//                       <div>
//                         <strong>{t("insuranceForm.step1.email")}:</strong> {traveller.email || "N/A"}
//                       </div>
//                       <div>
//                         <strong>{t("insuranceForm.step1.address")}:</strong> {`${traveller.address || "N/A"}, ${traveller.zip || "N/A"}`}
//                       </div>
//                       <div className="mt-2">
//                         <strong>{t("insuranceForm.step4.emergencyContact.title")}:</strong>
//                         <div className="ml-2">
//                           {index === 0 ? (
//                             <>
//                               <div>
//                                 <strong>{t("insuranceForm.step4.emergencyContact.name")}:</strong>{" "}
//                                 {formatFullName(watchedValuesForSummary[11], watchedValuesForSummary[12])}
//                               </div>
//                               <div>
//                                 <strong>{t("insuranceForm.step4.emergencyContact.number")}:</strong>{" "}
//                                 {watchedValuesForSummary[13] || "N/A"}
//                               </div>
//                               <div>
//                                 <strong>{t("insuranceForm.step4.emergencyContact.relationship")}:</strong>{" "}
//                                 {watchedValuesForSummary[14] || "N/A"}
//                               </div>
//                             </>
//                           ) : (
//                             <>
//                               <div>
//                                 <strong>{t("insuranceForm.step4.emergencyContact.name")}:</strong>{" "}
//                                 {formatFullName(traveller.emergency_contact_first_name, traveller.emergency_contact_last_name) || "N/A"}
//                               </div>
//                               <div>
//                                 <strong>{t("insuranceForm.step4.emergencyContact.number")}:</strong>{" "}
//                                 {traveller.emergency_contact_phone || "N/A"}
//                               </div>
//                               <div>
//                                 <strong>{t("insuranceForm.step4.emergencyContact.relationship")}:</strong>{" "}
//                                 {traveller.emergency_contact_relation || "N/A"}
//                               </div>
//                             </>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                   <h3 className="text-xl font-semibold text-[#1A2C50] mb-3">{t("insuranceForm.step4.tripInformation.title")}:</h3>
//                   <div className="space-y-1 p-4 bg-gray-50 rounded-md border mb-6">
//                     <div><strong>{t("insuranceForm.step4.tripInformation.purpose")}:</strong> {getTripPurposeLabel(watchedValuesForSummary[9])}</div>
//                     <div><strong>{t("insuranceForm.step4.tripInformation.primaryRegions")}:</strong> {watchedValuesForSummary[10] || "N/A"}</div>
//                     {watchedTripCitiesForSummary && watchedTripCitiesForSummary.filter(city => city.name && city.name.trim() !== "").length > 0 && (<div><strong>{t("insuranceForm.step4.tripInformation.citiesVisiting")}:</strong><ul className="list-disc list-inside pl-4">{watchedTripCitiesForSummary.filter(city => city.name && city.name.trim() !== "").map((city, idx) => <li key={`summary-city-${idx}`}>{city.name}</li>)}</ul></div>)}
//                   </div>
//                   <h3 className="text-xl font-semibold text-[#1A2C50] mb-3">{t("insuranceForm.step4.emergencyContact.title")}:</h3>
//                   <div className="space-y-1 p-4 bg-gray-50 rounded-md border mb-6"><div><strong>{t("insuranceForm.step4.emergencyContact.name")}:</strong> {formatFullName(watchedValuesForSummary[11], watchedValuesForSummary[12])}</div><div><strong>{t("insuranceForm.step4.emergencyContact.number")}:</strong> {watchedValuesForSummary[13] || "N/A"}</div></div>
//                   <div className="mb-6"><InputWithLabel label={t("insuranceForm.step4.affiliateCode.label")} name="affiliate_code" register={register} error={getError("affiliate_code")} /></div>
//                   <div className="flex items-start space-x-3">
//                     <Controller name="consent" control={control} render={({ field }) => (<Checkbox id="consent" checked={field.value === true} onCheckedChange={(checked) => field.onChange(checked === true ? true : undefined)} onBlur={field.onBlur} />)} />
//                     <div className="grid gap-1.5 leading-none"><Label htmlFor="consent" className="font-medium leading-snug">{t("insuranceForm.step4.consent.label")}</Label>{getError("consent") && <p className="text-sm text-red-500">{getError("consent")?.message}</p>}</div>
//                   </div>
//                 </>
//               )}
//               <div className="flex flex-col sm:flex-row justify-between pt-8 mt-8 border-t gap-4">
//                 {step > 0 && (<Button type="button" variant="outline" onClick={handlePrevStep} className="w-full sm:w-auto px-8 py-3 text-base">{t("insuranceForm.actions.back")}</Button>)}
//                 {step === 0 && (<Button type="button" variant="outline" onClick={() => { alert(t("insuranceForm.actions.modifyChoicesAlert")) }} className="w-full sm:w-auto px-8 py-3 text-base">{t("insuranceForm.actions.modifyChoices")}</Button>)}
//                 {(step > 0 && step < steps.length - 1) && <div className="sm:flex-grow hidden sm:block"></div>}
//                 {/* {step < steps.length - 1 && (<Button type="button" onClick={handleNextOrContinue} className="w-full sm:w-auto px-8 py-3 text-base bg-[#1A2C50] hover:bg-[#2c3e6b] text-white">{t("insuranceForm.actions.continue")}</Button>)} */}
//                 {step < steps.length - 1 && (
//                   <Button
//                     type="button"
//                     onClick={handleNextOrContinue}
//                     className="w-full sm:w-auto px-8 py-3 text-base bg-[#1A2C50] hover:bg-[#2c3e6b] text-white"
//                     disabled={step === 1 && ageLimitExceeded}
//                   >
//                     {t("insuranceForm.actions.continue")}
//                   </Button>
//                 )}
//                 {step === steps.length - 1 && (<Button type="submit" className="w-full sm:w-auto px-8 py-3 text-base bg-green-600 hover:bg-green-700 text-white" disabled={formState.isSubmitting || !quoteResult?.ok || !quoteResult?.data || quoteResult.data.totalAmount <= 0}>{formState.isSubmitting ? t("insuranceForm.actions.processing") : t("insuranceForm.actions.confirm")}</Button>)}
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }



"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, Controller, FieldError, Path, useFieldArray, get } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  getPurchaseWithoutLoginSchema,
  type InsuranceFormValues,
  fieldsByStep,
  getTripPurposes,
  getEmergencyMedicalCoverageOptions,
  getPersonalAccidentCoverageOptions,
  getCountryCodeOptions,
  getNationalityOptions,
  getCountryOptions,
  getCountryTravellingToOptions,
  primaryCitiesUkraineOptions
} from "@/lib/insuranceFormSchema";
import {
  InputWithLabel,
  SelectWithLabel,
  DatePickerField
} from "./FormFields";
import { format as formatDateFn } from "date-fns";
import BirthDateField from "../form/BirthDateField";
import { useTranslation } from "@/hooks/useTranslation";
import { useValidationMessages } from "@/lib/useValidationMessages";
import dayjs from 'dayjs';
import { Tooltip, TooltipContent, TooltipProvider } from "../ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

type Integer = number & { __brand: 'integer' };

interface FlywireError {
  msg?: string;
  code?: string;
  field?: string;
}

interface GenerateQuotePayload {
  trip_start_date: Date;
  trip_end_date: Date;
  trip_country: string;
  country_of_residence: string;
  travellers_count: Integer;
  medical_coverage: "0" | "25000" | "50000" | "100000" | "150000" | "250000";
  pa_coverage: "0" | "25000" | "50000" | "100000" | "150000" | "250000";
  transit_coverage: boolean;
  green_zone_days: Integer;
  amber_zone_days: Integer;
  red_zone_days: Integer;
  black_zone_days: Integer;
}

interface PricingMatrix {
  matrix: {
    [key: string]: {
      greenME: number;
      amberME: number;
      redME: number;
      blackME: number;
      greenPA: number;
      amberPA: number;
      redPA: number;
      blackPA: number;
    };
  };
  transitCost: number;
  germanyGreenMERates: Partial<Record<GenerateQuotePayload['medical_coverage'], number>>;
}

interface QuoteResult {
  ok: boolean;
  message: string;
  warnings: string[];
  currency?: string;
  data?: {
    totalAmount: number;
    medicalCoverAmount: number;
    paCoverAmount: number;
    travellersCount: Integer;
    totalDays: number;
  };
}

const defaultPricing: PricingMatrix = {
  matrix: {
    "25000": { "greenME": 19.00, "amberME": 23.75, "redME": 0.0, "blackME": 0.0, "greenPA": 12.38, "amberPA": 13.61, "redPA": 0.0, "blackPA": 0.0 },
    "50000": { "greenME": 22.00, "amberME": 27.50, "redME": 30.25, "blackME": 0.0, "greenPA": 24.75, "amberPA": 29.25, "redPA": 31.73, "blackPA": 0.0 },
    "100000": { "greenME": 26.00, "amberME": 32.50, "redME": 35.75, "blackME": 0.0, "greenPA": 49.50, "amberPA": 54.00, "redPA": 58.95, "blackPA": 0.0 },
    "150000": { "greenME": 30.00, "amberME": 37.50, "redME": 40.25, "blackME": 0.0, "greenPA": 74.25, "amberPA": 81.68, "redPA": 89.84, "blackPA": 0.0 },
    "250000": { "greenME": 36.00, "amberME": 45.00, "redME": 49.50, "blackME": 0.0, "greenPA": 123.75, "amberPA": 136.13, "redPA": 149.74, "blackPA": 0.0 }
  },
  transitCost: 25.00,
  germanyGreenMERates: {
    "25000": 19.68,
    "50000": 22.95,
    "100000": 27.64,
    "150000": 32.25,
    "250000": 39.17,
  }
};

// async function fetchQuoteFromApi(payload: GenerateQuotePayload): Promise<QuoteResult> {
//   try {
//     const response = await fetch('https://cpa-node-439821101939.europe-west1.run.app/api/quote', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     });
//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Quote API error:", response.status, response.statusText, errorText);
//       return {
//         ok: false,
//         message: `API error: ${response.statusText}`,
//         warnings: [errorText],
//       };
//     }
//     return await response.json();

//   } catch (error) {
//     return {
//       ok: false,
//       message: 'Network error while fetching quote.',
//       warnings: [],
//     };
//   }
// }

// async function fetchQuoteFromApi(payload: GenerateQuotePayload): Promise<QuoteResult> {
//   try {
//     const response = await fetch('https://cpa-node-439821101939.europe-west1.run.app/api/quote', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     });
//     if (!response.ok) {
//       // Log status and response body for debugging
//       const errorText = await response.text();
//       console.error("Quote API error:", response.status, response.statusText, errorText);
//       return {
//         ok: false,
//         message: `API error: ${response.statusText} (${response.status})`,
//         warnings: [errorText],
//       };
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Network error while fetching quote:", error);
//     return {
//       ok: false,
//       message: 'Network error while fetching quote.',
//       warnings: [],
//     };
//   }
// }

// async function fetchQuoteFromApi(payload: GenerateQuotePayload, formValues: InsuranceFormValues): Promise<QuoteResult> {
//   try {
//     // Build the correct travellers array for the API
//     const travellers = (formValues.travellers || []).map(t => ({
//       dateOfBirth: t.birthdate, // or t.dateOfBirth if that's your field
//       residence: formValues.city_of_residence // or t.nationality or t.residence if per-traveller
//     }));

//     // Build the API payload
//     const apiPayload = {
//       trip_start_date: payload.trip_start_date.toISOString(),
//       trip_end_date: payload.trip_end_date.toISOString(),
//       travellers,
//       trip_country: payload.trip_country,
//       medical_coverage: payload.medical_coverage,
//       pa_coverage: payload.pa_coverage,
//       transit_coverage: payload.transit_coverage,
//       green_zone_days: payload.green_zone_days,
//       amber_zone_days: payload.amber_zone_days,
//       red_zone_days: payload.red_zone_days
//     };

//     const response = await fetch('https://cpa-node-439821101939.europe-west1.run.app/api/quote', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-api-key': 'your_app_api_key_here', // <-- Replace with your actual API key
//       },
//       body: JSON.stringify(apiPayload),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Quote API error:", response.status, response.statusText, errorText);
//       return {
//         ok: false,
//         message: `API error: ${response.statusText} (${response.status})`,
//         warnings: [errorText],
//       };
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Network error while fetching quote:", error);
//     return {
//       ok: false,
//       message: 'Network error while fetching quote.',
//       warnings: [],
//     };
//   }
// }

// async function fetchQuoteFromApi(payload: GenerateQuotePayload, formValues: InsuranceFormValues): Promise<QuoteResult> {
//   try {
//     // Build the correct travellers array for the API
//     const travellers = (formValues.travellers || []).map(t => ({
//       dateOfBirth: t.birthdate,
//       residence: t.nationality || formValues.city_of_residence
//     }));

//     // Validate all travellers
//     if (!travellers.length || travellers.some(t => !t.dateOfBirth || !t.residence)) {
//       return {
//         ok: false,
//         message: "All travellers must have a date of birth and country.",
//         warnings: [],
//       };
//     }

//     // Build the API payload
//     const apiPayload = {
//       trip_start_date: payload.trip_start_date.toISOString(),
//       trip_end_date: payload.trip_end_date.toISOString(),
//       travellers,
//       trip_country: payload.trip_country,
//       medical_coverage: payload.medical_coverage,
//       pa_coverage: payload.pa_coverage,
//       transit_coverage: payload.transit_coverage,
//       green_zone_days: payload.green_zone_days,
//       amber_zone_days: payload.amber_zone_days,
//       red_zone_days: payload.red_zone_days
//     };

//     const response = await fetch('https://cpa-node-439821101939.europe-west1.run.app/api/quote', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-api-key': 'your_app_api_key_here', // <-- Replace with your actual API key
//       },
//       body: JSON.stringify(apiPayload),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Quote API error:", response.status, response.statusText, errorText);
//       return {
//         ok: false,
//         message: `API error: ${response.statusText} (${response.status})`,
//         warnings: [errorText],
//       };
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Network error while fetching quote:", error);
//     return {
//       ok: false,
//       message: 'Network error while fetching quote.',
//       warnings: [],
//     };
//   }
// }



async function fetchQuoteFromApi(
  payload: GenerateQuotePayload,
  travellers: { dateOfBirth: string; residence: string }[]
): Promise<QuoteResult> {
  try {
    // Build the API payload
    const apiPayload = {
      trip_start_date: payload.trip_start_date.toISOString(),
      trip_end_date: payload.trip_end_date.toISOString(),
      travellers,
      trip_country: payload.trip_country,
      medical_coverage: payload.medical_coverage,
      pa_coverage: payload.pa_coverage,
      transit_coverage: payload.transit_coverage,
      green_zone_days: payload.green_zone_days,
      amber_zone_days: payload.amber_zone_days,
      red_zone_days: payload.red_zone_days
    };

    const response = await fetch('/api/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(apiPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Quote API error:", response.status, response.statusText, errorText);
      return {
        ok: false,
        message: `API error: ${response.statusText} (${response.status})`,
        warnings: [errorText],
      };
    }
    return await response.json();
  } catch (error) {
    console.error("Network error while fetching quote:", error);
    return {
      ok: false,
      message: 'Network error while fetching quote.',
      warnings: [],
    };
  }
}
function generateQuote(data: GenerateQuotePayload, pricing: PricingMatrix): QuoteResult {
  const startDate = dayjs(data.trip_start_date).startOf('day');
  const endDate = dayjs(data.trip_end_date).endOf('day');
  const totalDays = endDate.diff(startDate, 'day') + 1;

  if (totalDays <= 0) {
    return {
      ok: false,
      message: "Trip end date should be after trip start date.",
      warnings: []
    };
  }

  const sumOfZoneDays = data.green_zone_days + data.amber_zone_days + data.red_zone_days + data.black_zone_days;
  if (totalDays !== sumOfZoneDays) {
    return {
      ok: false,
      message: `Total trip days (${totalDays}) should be equal to the sum of zone days (${sumOfZoneDays}).`,
      warnings: []
    };
  }

  const medicalCoverageLevel = data.medical_coverage;
  const paCoverageLevel = data.pa_coverage;

  if (
    (medicalCoverageLevel !== "0" && !pricing.matrix[medicalCoverageLevel]) ||
    (paCoverageLevel !== "0" && !pricing.matrix[paCoverageLevel])
  ) {
    return {
      ok: false,
      message: "No pricing found for a selected non-zero coverage.",
      warnings: []
    };
  }

  const medicalRates = medicalCoverageLevel === "0" ? undefined : pricing.matrix[medicalCoverageLevel];
  const paRates = paCoverageLevel === "0" ? undefined : pricing.matrix[paCoverageLevel];

  let medicalCoverAmount = 0;
  let paCoverAmount = 0;
  const warnings: string[] = [];

  if (medicalRates && medicalCoverageLevel !== "0") {
    let greenMERate = medicalRates["greenME"] || 0;
    if (data.country_of_residence === "DE" && data.green_zone_days > 0 && pricing.germanyGreenMERates[medicalCoverageLevel] !== undefined) {
      greenMERate = pricing.germanyGreenMERates[medicalCoverageLevel]!;
      if (greenMERate <= 0) {
        warnings.push("Medical coverage for green zone (Germany resident) has zero cost for this coverage amount.");
      }
    } else if (data.green_zone_days > 0 && (!medicalRates["greenME"] || medicalRates["greenME"] <= 0)) {
      warnings.push("Medical coverage for green zone is not available or has zero cost for this coverage amount.");
    }


    medicalCoverAmount += greenMERate * data.green_zone_days;
    medicalCoverAmount += (medicalRates["amberME"] || 0) * data.amber_zone_days;
    medicalCoverAmount += (medicalRates["redME"] || 0) * data.red_zone_days;
    medicalCoverAmount += (medicalRates["blackME"] || 0) * data.black_zone_days;

    if (!(data.country_of_residence === "DE" && data.green_zone_days > 0 && pricing.germanyGreenMERates[medicalCoverageLevel] !== undefined) && data.green_zone_days > 0 && (!medicalRates["greenME"] || medicalRates["greenME"] <= 0)) {
    }
    if (data.amber_zone_days > 0 && (!medicalRates["amberME"] || medicalRates["amberME"] <= 0)) {
      warnings.push("Medical coverage for amber zone is not available or has zero cost for this coverage amount.");
    }
    if (data.red_zone_days > 0 && (!medicalRates["redME"] || medicalRates["redME"] <= 0)) {
      warnings.push("Medical coverage for red zone is not available or has zero cost for this coverage amount.");
    }
    if (data.black_zone_days > 0 && (!medicalRates["blackME"] || medicalRates["blackME"] <= 0)) {
      warnings.push("Medical coverage for black zone is not available or has zero cost for this coverage amount.");
    }
  }

  if (paRates && paCoverageLevel !== "0") {
    paCoverAmount += (paRates["greenPA"] || 0) * data.green_zone_days;
    paCoverAmount += (paRates["amberPA"] || 0) * data.amber_zone_days;
    paCoverAmount += (paRates["redPA"] || 0) * data.red_zone_days;
    paCoverAmount += (paRates["blackPA"] || 0) * data.black_zone_days;

    if (data.green_zone_days > 0 && (!paRates["greenPA"] || paRates["greenPA"] <= 0)) {
      warnings.push("Personal Accident coverage for green zone is not available or has zero cost for this coverage amount.");
    }
    if (data.amber_zone_days > 0 && (!paRates["amberPA"] || paRates["amberPA"] <= 0)) {
      warnings.push("Personal Accident coverage for amber zone is not available or has zero cost for this coverage amount.");
    }
    if (data.red_zone_days > 0 && (!paRates["redPA"] || paRates["redPA"] <= 0)) {
      warnings.push("Personal Accident coverage for red zone is not available or has zero cost for this coverage amount.");
    }
    if (data.black_zone_days > 0 && (!paRates["blackPA"] || paRates["blackPA"] <= 0)) {
      warnings.push("Personal Accident coverage for black zone is not available or has zero cost for this coverage amount.");
    }
  }

  let totalAmount = medicalCoverAmount + paCoverAmount;

  if (data.travellers_count > 0) {
    totalAmount *= data.travellers_count;
  }

  if (data.transit_coverage) {
    totalAmount += pricing.transitCost;
  }

  totalAmount = Math.round(totalAmount * 100) / 100;

  return {
    ok: true,
    message: "Quote generated successfully",
    warnings,
    data: {
      totalAmount,
      medicalCoverAmount: Math.round(medicalCoverAmount * 100) / 100,
      paCoverAmount: Math.round(paCoverAmount * 100) / 100,
      travellersCount: data.travellers_count,
      totalDays
    }
  };
}

const formatEuro = (amount: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(amount);


export default function InsuranceForm() {
  const { t } = useTranslation();
  const { getValidationMessage } = useValidationMessages();

  const [ageLimitExceeded, setAgeLimitExceeded] = useState(false);
  const [ageAlertOpen, setAgeAlertOpen] = useState(false);

  const currentEmergencyMedicalCoverageOptions = useMemo(() => getEmergencyMedicalCoverageOptions(getValidationMessage), [getValidationMessage]);
  const currentPersonalAccidentCoverageOptions = useMemo(() => getPersonalAccidentCoverageOptions(getValidationMessage), [getValidationMessage]);
  const currentTripPurposes = useMemo(() => getTripPurposes(getValidationMessage), [getValidationMessage]);

  const currentNationalityOptions = useMemo(() => getNationalityOptions(), []);
  const currentCountryOptions = useMemo(() => getCountryOptions(), []);
  const currentCountryCodeOptions = useMemo(() => getCountryCodeOptions(), []);
  const currentCountryTravellingToOptions = useMemo(() => getCountryTravellingToOptions(), []);


  const steps = (t("insuranceForm.steps", { returnObjects: true }) as string[]).filter((_, idx) => idx !== 3);

  const [step, setStep] = useState(0);
  const [calculatedTotalRiskZoneDays, setCalculatedTotalRiskZoneDays] = useState<number | null>(null);
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);

  const schema = useMemo(() => getPurchaseWithoutLoginSchema(getValidationMessage), [getValidationMessage]);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const pollPaymentStatus = async (checkoutId: string) => {
    let attempts = 0;
    const maxAttempts = 20;
    const delay = 2000; // 2 seconds

    while (attempts < maxAttempts) {
      try {
        const res = await fetch(`/api/checkout/${checkoutId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === "SUCCESS") {
            return true;
          }
        }
      } catch (e) {
        // Optionally handle error
      }
      await new Promise(resolve => setTimeout(resolve, delay));
      attempts++;
    }
    return false;
  };

  const form = useForm<InsuranceFormValues>({
    resolver: joiResolver(schema, {
      abortEarly: false,
    }),
    defaultValues: {
      trip_start_date: "", trip_end_date: "",
      green_zone_days: 0, amber_zone_days: 0, red_zone_days: 0, black_zone_days: 0,
      emergency_medical_coverage: "", personal_accident_coverage_level: "0",
      add_transit_coverage: false,
      c_first_name: "", c_last_name: "", c_birthdate: "",
      c_passport_number: "", c_passport_expiry_date: "",
      c_is_whatsapp_same_as_phone: false,
      c_phone: "", c_phone_code: "", c_phone_number: "",
      c_whats_app: "", c_whats_app_code: "", c_whats_app_number: "",
      c_email: "", c_nationality: "", city_of_residence: "",
      trip_countries: ["UA"],
      address: "", zip: "",

      travellers: [{
        first_name: "", last_name: "", birthdate: "", passport_number: "", passport_expiry_date: "", email: "",
        nationality: "",
        address: "",
        zip: ""
      }],
      arrival_in_ukraine: "", departure_from_ukraine: "",
      primary_cities_regions_ukraine: "", trip_cities: [], trip_purpose: "",
      stay_name: "", company_name: "", city_or_town: "",
      emergency_contact_first_name: "", emergency_contact_last_name: "",
      emergency_contact_phone: "", emergency_contact_phone_code: "", emergency_contact_phone_number: "",
      emergency_contact_relation: "",
      has_medical_conditions: false, has_allergies: false, has_current_medications: false,
      medical_conditions: [], allergies: [], current_medications: [],
      blood_type: "", special_assistance: "",
      affiliate_code: "", consent: undefined,
      purchase_context: "self",
      consent_for_additional_travellers: undefined,
      c_organization: "", is_company_arranged: false,
    },
    mode: "onChange",
  });


  useEffect(() => {
    if (!form.getValues("purchase_context")) {
      form.setValue("purchase_context", "self", { shouldValidate: true, shouldDirty: true });
    }
  }, [getValidationMessage, form]);


  const { watch, setValue, getValues, trigger, formState, control, register } = form;

  useEffect(() => {
    const currentTravellers = getValues("travellers");
    if (!currentTravellers || currentTravellers.length === 0) return;

    let changed = false;
    const newTraveller0 = { ...currentTravellers[0] };

    if (newTraveller0.address !== getValues("address")) {
      newTraveller0.address = getValues("address") || "";
      changed = true;
    }
    if (newTraveller0.zip !== getValues("zip")) {
      newTraveller0.zip = getValues("zip") || "";
      changed = true;
    }
    if (newTraveller0.email !== getValues("c_email")) {
      newTraveller0.email = getValues("c_email") || "";
      changed = true;
    }
    if (newTraveller0.nationality !== getValues("c_nationality")) {
      newTraveller0.nationality = getValues("c_nationality") || "";
      changed = true;
    }

    if (changed) {
      const updatedTravellers = [...currentTravellers];
      updatedTravellers[0] = newTraveller0;
      setValue("travellers", updatedTravellers, { shouldValidate: step === 1, shouldDirty: true });
    }
  }, [
    watch("address"),
    watch("zip"),
    watch("c_email"),
    watch("c_nationality"),
    getValues,
    setValue,
    step,
  ]);

  const { fields: travellerFields, append: appendTraveller, remove: removeTraveller } = useFieldArray<InsuranceFormValues, "travellers", "id">({
    control, name: "travellers"
  });

  const { fields: cityFields, append: appendCity, remove: removeCity } = useFieldArray<InsuranceFormValues, "trip_cities", "id">({
    control, name: "trip_cities"
  });


  const watchedStartDate = watch("trip_start_date");
  const watchedEndDate = watch("trip_end_date");
  const watchedGreenDaysForDisplay = watch("green_zone_days");

  const cFirstNameValue = watch("c_first_name");
  const cLastNameValue = watch("c_last_name");
  const cBirthdateValue = watch("c_birthdate");
  const watchedTravellers = watch("travellers");


  const calculateAge = (birthdate: string | undefined): string => {
    if (!birthdate) return ""; const parts = birthdate.split('-'); if (parts.length !== 3) return "";
    const year = parseInt(parts[0], 10), month = parseInt(parts[1], 10) - 1, day = parseInt(parts[2], 10);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return "";
    const birthDateObj = new Date(year, month, day);
    if (isNaN(birthDateObj.getTime()) || birthDateObj.getFullYear() !== year || birthDateObj.getMonth() !== month || birthDateObj.getDate() !== day) return "";
    const today = new Date(); let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) age--;
    return age >= 0 ? age.toString() : "";
  };
  useEffect(() => {
    const isAgeOverLimit = (birthdate: string | undefined): boolean => {
      if (!birthdate) return false;
      const age = parseInt(calculateAge(birthdate), 10);
      return !isNaN(age) && age > 69;
    };

    if (step === 1) {

      const allTravellers = watchedTravellers || [];
      const isExceeded = allTravellers.some(t => isAgeOverLimit(t.birthdate));

      if (isExceeded && !ageLimitExceeded) {
        setAgeAlertOpen(true);
      }

      setAgeLimitExceeded(isExceeded);

    } else {
      if (ageLimitExceeded) {
        setAgeLimitExceeded(false);
      }
    }
  }, [watchedTravellers, step, ageLimitExceeded, calculateAge]);

  const cPassportNumberValue = watch("c_passport_number");
  const cPassportExpiryDateValue = watch("c_passport_expiry_date");

  const coverageDisabled = !watchedStartDate || !watchedEndDate;

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && name.startsWith("travellers") && (name.endsWith("emergency_contact_phone_code") || name.endsWith("emergency_contact_phone_number"))) {
        const parts = name.split('.');
        if (parts.length === 3) {
          const index = parseInt(parts[1], 10);
          const traveller = getValues(`travellers.${index}`);
          if (traveller) {
            const fullNumber = `${traveller.emergency_contact_phone_code || ''}${traveller.emergency_contact_phone_number || ''}`;
            if (traveller.emergency_contact_phone !== fullNumber) {
              setValue(`travellers.${index}.emergency_contact_phone`, fullNumber, { shouldValidate: true, shouldDirty: true });
            }
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, getValues, setValue]);

  useEffect(() => {
    const currentTravellers = getValues("travellers");
    if (!currentTravellers || currentTravellers.length === 0) {
      setValue("travellers", [{
        first_name: cFirstNameValue || "", last_name: cLastNameValue || "",
        birthdate: cBirthdateValue || "", passport_number: cPassportNumberValue || "",
        passport_expiry_date: cPassportExpiryDateValue || "",
        emergency_contact_phone_code: "",
        emergency_contact_phone_number: "",
        emergency_contact_phone: "",
        nationality: "",
        email: "",
        address: "",
        zip: ""
      }], { shouldValidate: false, shouldDirty: false });
    } else {
      let changed = false;
      const newTraveller0 = { ...currentTravellers[0] };
      if (newTraveller0.first_name !== cFirstNameValue) { newTraveller0.first_name = cFirstNameValue || ""; changed = true; }
      if (newTraveller0.last_name !== cLastNameValue) { newTraveller0.last_name = cLastNameValue || ""; changed = true; }
      if (newTraveller0.birthdate !== cBirthdateValue) { newTraveller0.birthdate = cBirthdateValue || ""; changed = true; }
      if (newTraveller0.passport_number !== cPassportNumberValue) { newTraveller0.passport_number = cPassportNumberValue || ""; changed = true; }
      if (newTraveller0.passport_expiry_date !== cPassportExpiryDateValue) { newTraveller0.passport_expiry_date = cPassportExpiryDateValue || ""; changed = true; }
      if (changed) {
        const updatedTravellers = [...currentTravellers];
        updatedTravellers[0] = newTraveller0;
        setValue("travellers", updatedTravellers, {
          shouldValidate: step === 1 && (!!formState.dirtyFields.c_first_name || !!formState.dirtyFields.c_last_name || !!formState.dirtyFields.c_birthdate || !!formState.dirtyFields.c_passport_number || !!formState.dirtyFields.c_passport_expiry_date),
          shouldDirty: true
        });
      }
    }
  }, [cFirstNameValue, cLastNameValue, cBirthdateValue, cPassportNumberValue, cPassportExpiryDateValue, setValue, getValues, step, formState.dirtyFields]);

  useEffect(() => {
    if (watchedStartDate && watchedEndDate) {
      const start = dayjs(watchedStartDate + "T00:00:00");
      const end = dayjs(watchedEndDate + "T00:00:00");
      if (start.isValid() && end.isValid() && (end.isSame(start) || end.isAfter(start))) {
        const diffDays = end.diff(start, 'day') + 1;
        setCalculatedTotalRiskZoneDays(diffDays);
        setValue("green_zone_days", diffDays, { shouldValidate: true, shouldDirty: true });
        if (Number(getValues("amber_zone_days")) !== 0) setValue("amber_zone_days", 0, { shouldValidate: true, shouldDirty: true });
        if (Number(getValues("red_zone_days")) !== 0) setValue("red_zone_days", 0, { shouldValidate: true, shouldDirty: true });
      } else {
        setCalculatedTotalRiskZoneDays(null);
        if (Number(getValues("green_zone_days")) !== 0) setValue("green_zone_days", 0, { shouldValidate: true, shouldDirty: true });
      }
    } else {
      setCalculatedTotalRiskZoneDays(null);
      if (Number(getValues("green_zone_days")) !== 0) setValue("green_zone_days", 0, { shouldValidate: true, shouldDirty: true });
    }
  }, [watchedStartDate, watchedEndDate, setValue, getValues]);

  useEffect(() => {
    const subscription = watch((currentValues, { name, type }) => {
      if ((name === "amber_zone_days" || name === "red_zone_days") && type === "change" && calculatedTotalRiskZoneDays !== null) {
        let amber = Number(currentValues.amber_zone_days || 0);
        let red = Number(currentValues.red_zone_days || 0);
        amber = Math.max(0, Math.floor(amber));
        red = Math.max(0, Math.floor(red));
        if (amber + red > calculatedTotalRiskZoneDays) {
          if (name === "amber_zone_days") {
            amber = calculatedTotalRiskZoneDays - red;
            setValue("amber_zone_days", Math.max(0, amber), { shouldValidate: true, shouldDirty: true });
          } else if (name === "red_zone_days") {
            red = calculatedTotalRiskZoneDays - amber;
            setValue("red_zone_days", Math.max(0, red), { shouldValidate: true, shouldDirty: true });
          }
        }
        const newGreenDays = calculatedTotalRiskZoneDays - amber - red;
        if (Number(getValues("green_zone_days")) !== Math.max(0, newGreenDays)) {
          setValue("green_zone_days", Math.max(0, newGreenDays), { shouldValidate: true, shouldDirty: true });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, getValues, calculatedTotalRiskZoneDays]);

  const cPhoneCode = watch("c_phone_code");
  const cPhoneNumber = watch("c_phone_number");
  const cIsWhatsAppSameAsPhone = watch("c_is_whatsapp_same_as_phone");

  useEffect(() => {
    const fullNumber = `${cPhoneCode || ''}${cPhoneNumber || ''}`;
    if (getValues("c_phone") !== fullNumber) setValue("c_phone", fullNumber, { shouldValidate: true, shouldDirty: true });
  }, [cPhoneCode, cPhoneNumber, setValue, getValues]);

  useEffect(() => {
    if (cIsWhatsAppSameAsPhone) {
      setValue("c_whats_app_code", cPhoneCode || "", { shouldValidate: true, shouldDirty: true });
      setValue("c_whats_app_number", cPhoneNumber || "", { shouldValidate: true, shouldDirty: true });
    }
  }, [cIsWhatsAppSameAsPhone, cPhoneCode, cPhoneNumber, setValue]);

  const cWhatsAppCode = watch("c_whats_app_code");
  const cWhatsAppNumber = watch("c_whats_app_number");
  useEffect(() => {
    const fullNumber = `${cWhatsAppCode || ''}${cWhatsAppNumber || ''}`;
    if (getValues("c_whats_app") !== fullNumber) setValue("c_whats_app", fullNumber, { shouldValidate: true, shouldDirty: true });
  }, [cWhatsAppCode, cWhatsAppNumber, setValue, getValues]);

  const emergencyContactPhoneCode = watch("emergency_contact_phone_code");
  const emergencyContactPhoneNumber = watch("emergency_contact_phone_number");
  useEffect(() => {
    const fullNumber = `${emergencyContactPhoneCode || ''}${emergencyContactPhoneNumber || ''}`;
    if (getValues("emergency_contact_phone") !== fullNumber) setValue("emergency_contact_phone", fullNumber, { shouldValidate: true, shouldDirty: true });
  }, [emergencyContactPhoneCode, emergencyContactPhoneNumber, setValue, getValues]);

  const watchedPathsForQuote = [
    "trip_start_date", "trip_end_date", "trip_countries", "travellers",
    "emergency_medical_coverage", "personal_accident_coverage_level",
    "add_transit_coverage", "green_zone_days", "amber_zone_days",
    "red_zone_days", "black_zone_days", "city_of_residence"
  ] as const;
  const watchedValuesForQuote = watch(watchedPathsForQuote);


  // useEffect(() => {
  //   const getQuote = async () => {
  //     const formValues = getValues();

  //     const travellers = (formValues.travellers || []).map(t => ({
  //     dateOfBirth: t.birthdate,
  //     residence: t.nationality || formValues.city_of_residence
  //   }));

  //     const hasRequiredFieldsForQuote =
  //       formValues.trip_start_date &&
  //       formValues.trip_end_date &&
  //       formValues.trip_countries && formValues.trip_countries.length > 0 && formValues.trip_countries[0] &&
  //       formValues.emergency_medical_coverage &&
  //       formValues.personal_accident_coverage_level !== undefined &&
  //       formValues.travellers && formValues.travellers.length > 0 &&
  //       formValues.city_of_residence;
  //     if (!hasRequiredFieldsForQuote) {
  //       setQuoteResult({
  //         ok: false,
  //         message: formValues.city_of_residence ? "Please fill all required trip and coverage details." : "Please select country of residence to get a quote.",
  //         warnings: []
  //       });
  //       return;
  //     }

  //     const startDate = dayjs(formValues.trip_start_date + "T00:00:00");
  //     const endDate = dayjs(formValues.trip_end_date + "T00:00:00");
  //     if (!startDate.isValid() || !endDate.isValid() || endDate.isBefore(startDate)) {
  //       setQuoteResult({ ok: false, message: "Invalid trip dates for quote calculation.", warnings: [] });
  //       return;
  //     }

  //     const totalTripDaysCalculated = endDate.diff(startDate, 'day') + 1;
  //     const sumZoneDaysFromForm = Number(formValues.green_zone_days || 0) + Number(formValues.amber_zone_days || 0) + Number(formValues.red_zone_days || 0) + Number(formValues.black_zone_days || 0);
  //     if (totalTripDaysCalculated !== sumZoneDaysFromForm) {
  //       setQuoteResult({ ok: false, message: `Zone days sum (${sumZoneDaysFromForm}) does not match total trip days (${totalTripDaysCalculated}).`, warnings: [] });
  //       return;
  //     }

  //     const payload: GenerateQuotePayload = {
  //       trip_start_date: startDate.toDate(),
  //       trip_end_date: endDate.toDate(),
  //       trip_country: formValues.trip_countries[0] as string,
  //       country_of_residence: formValues.city_of_residence as string,
  //       travellers_count: (formValues.travellers?.length > 0 ? formValues.travellers.length : 1) as Integer,
  //       medical_coverage: formValues.emergency_medical_coverage as GenerateQuotePayload['medical_coverage'],
  //       pa_coverage: formValues.personal_accident_coverage_level as GenerateQuotePayload['pa_coverage'],
  //       transit_coverage: formValues.add_transit_coverage,
  //       green_zone_days: Number(formValues.green_zone_days || 0) as Integer,
  //       amber_zone_days: Number(formValues.amber_zone_days || 0) as Integer,
  //       red_zone_days: Number(formValues.red_zone_days || 0) as Integer,
  //       black_zone_days: Number(formValues.black_zone_days || 0) as Integer,
  //     };

  //     // setQuoteResult(undefined); 
  //     const result = await fetchQuoteFromApi(payload, formValues);
  //     setQuoteResult(result);
  //   };

  //   getQuote();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [...watchedValuesForQuote, formState.errors, getValidationMessage]);

  useEffect(() => {
    const getQuote = async () => {
      const formValues = getValues();
      const allTravellersHaveDOB =
        (formValues.travellers || []).every(t => !!t.birthdate && /^\d{4}-\d{2}-\d{2}$/.test(t.birthdate));

      const travellersForApi =
        allTravellersHaveDOB
          ? (formValues.travellers || []).map(t => ({
            dateOfBirth: t.birthdate,
            residence: formValues.city_of_residence,
          }))
          : Array.from({ length: (formValues.travellers?.length || 1) }).map(() => ({
            dateOfBirth: "1990-01-01",
            residence: formValues.city_of_residence,
          }));
      const hasRequiredFieldsForQuote =
        formValues.trip_start_date &&
        formValues.trip_end_date &&
        formValues.trip_countries && formValues.trip_countries.length > 0 && formValues.trip_countries[0] &&
        formValues.emergency_medical_coverage &&
        formValues.personal_accident_coverage_level !== undefined &&
        formValues.city_of_residence;

      if (!hasRequiredFieldsForQuote) {
        setQuoteResult({
          ok: false,
          message: formValues.city_of_residence ? "Please fill all required trip and coverage details." : "Please select country of residence to get a quote.",
          warnings: []
        });
        return;
      }

      const startDate = dayjs(formValues.trip_start_date + "T00:00:00");
      const endDate = dayjs(formValues.trip_end_date + "T00:00:00");
      if (!startDate.isValid() || !endDate.isValid() || endDate.isBefore(startDate)) {
        setQuoteResult({ ok: false, message: "Invalid trip dates for quote calculation.", warnings: [] });
        return;
      }

      const totalTripDaysCalculated = endDate.diff(startDate, 'day') + 1;
      const sumZoneDaysFromForm =
        Number(formValues.green_zone_days || 0) +
        Number(formValues.amber_zone_days || 0) +
        Number(formValues.red_zone_days || 0) +
        Number(formValues.black_zone_days || 0);
      if (totalTripDaysCalculated !== sumZoneDaysFromForm) {
        setQuoteResult({
          ok: false,
          message: `Zone days sum (${sumZoneDaysFromForm}) does not match total trip days (${totalTripDaysCalculated}).`,
          warnings: []
        });
        return;
      }

      const payload: GenerateQuotePayload = {
        trip_start_date: startDate.toDate(),
        trip_end_date: endDate.toDate(),
        trip_country: formValues.trip_countries[0] as string,
        country_of_residence: formValues.city_of_residence as string,
        travellers_count: (formValues.travellers?.length > 0 ? formValues.travellers.length : 1) as Integer,
        medical_coverage: formValues.emergency_medical_coverage as GenerateQuotePayload['medical_coverage'],
        pa_coverage: formValues.personal_accident_coverage_level as GenerateQuotePayload['pa_coverage'],
        transit_coverage: formValues.add_transit_coverage,
        green_zone_days: Number(formValues.green_zone_days || 0) as Integer,
        amber_zone_days: Number(formValues.amber_zone_days || 0) as Integer,
        red_zone_days: Number(formValues.red_zone_days || 0) as Integer,
        black_zone_days: Number(formValues.black_zone_days || 0) as Integer,
      };

      const result = await fetchQuoteFromApi(payload, travellersForApi);
      setQuoteResult(result);
    };
    getQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, ...watchedValuesForQuote, formState.errors, getValidationMessage]);
  const onSubmitForm = async () => {
    const allData = getValues();

    if (allData.travellers && allData.travellers.length > 0) {
      allData.travellers[0] = {
        ...allData.travellers[0],
        first_name: allData.c_first_name || "",
        last_name: allData.c_last_name || "",
        birthdate: allData.c_birthdate || "",
        passport_number: allData.c_passport_number || "",
        passport_expiry_date: allData.c_passport_expiry_date || "",
      };
    } else {
      allData.travellers = [{
        first_name: allData.c_first_name || "",
        last_name: allData.c_last_name || "",
        birthdate: allData.c_birthdate || "",
        passport_number: allData.c_passport_number || "",
        passport_expiry_date: allData.c_passport_expiry_date || "",
        emergency_contact_phone_code: "",
        emergency_contact_phone_number: "",
        emergency_contact_phone: "",
        nationality: "",
        email: "",
        address: "",
        zip: ""
      }];
    }

    const allowedCoverage = ["0", "25000", "50000", "100000", "150000", "250000"];
    const safeMedicalCoverage = allowedCoverage.includes(allData.emergency_medical_coverage) ? allData.emergency_medical_coverage : "0";
    const safePaCoverage = allowedCoverage.includes(allData.personal_accident_coverage_level) ? allData.personal_accident_coverage_level : "0";

    const quotePayload = {
      trip_start_date: allData.trip_start_date ? dayjs(allData.trip_start_date + "T00:00:00").toDate() : new Date(),
      trip_end_date: allData.trip_end_date ? dayjs(allData.trip_end_date + "T00:00:00").toDate() : new Date(),
      trip_country: allData.trip_countries?.[0] || "",
      country_of_residence: allData.city_of_residence || "",
      travellers_count: (allData.travellers?.length || 1) as Integer,
      medical_coverage: safeMedicalCoverage as GenerateQuotePayload['medical_coverage'],
      pa_coverage: safePaCoverage as GenerateQuotePayload['pa_coverage'],
      transit_coverage: allData.add_transit_coverage,
      green_zone_days: Number(allData.green_zone_days || 0) as Integer,
      amber_zone_days: Number(allData.amber_zone_days || 0) as Integer,
      red_zone_days: Number(allData.red_zone_days || 0) as Integer,
      black_zone_days: Number(allData.black_zone_days || 0) as Integer,
    };
    const quote = generateQuote(quotePayload, pricing);

    const submission = { ...allData, quote, submittedAt: new Date().toISOString() };

    // Save to localStorage
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let existing: any[] = [];
    try {
      const stored = localStorage.getItem('insuranceFormData');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) existing = parsed;
        else if (parsed && typeof parsed === 'object') existing = [parsed];
      }
    } catch (e) {
      console.error("Error loading submissions from localStorage:", e);
      existing = [];
    }
    existing.push(submission);
    localStorage.setItem('insuranceFormData', JSON.stringify(existing));
    console.log("Form Data (JSON):\n" + JSON.stringify(submission, null, 2));

    const invoiceNumber = `INS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;


    // Build the API payload you want to send
    /* const apiPayload = {
      ...allData,
      quote,
      submittedAt: new Date().toISOString(),
    }; */

    // Build the API payload in the required format
    const apiPayload = {
      trip_start_date: allData.trip_start_date ? new Date(allData.trip_start_date + "T00:00:00").toISOString() : "",
      trip_end_date: allData.trip_end_date ? new Date(allData.trip_end_date + "T00:00:00").toISOString() : "",
      travellers: (allData.travellers || []).map((t: any, idx: number) => ({
        firstName: t.first_name || allData.c_first_name || "",
        lastName: t.last_name || allData.c_last_name || "",
        dateOfBirth: t.birthdate || allData.c_birthdate || "",
        email: t.email || allData.c_email || "",
        phone: t.phone || allData.c_phone || "",
        nationality: t.nationality || allData.c_nationality || "",
        residence: allData.city_of_residence || "",
        street: t.address || allData.address || "",
        city: t.city || allData.city_of_residence || "",
        state: t.state || allData.state || "",
        zip: t.zip || allData.zip || "",
        emergencyContactName: (t.emergency_contact_first_name && t.emergency_contact_last_name)
          ? `${t.emergency_contact_first_name} ${t.emergency_contact_last_name}`
          : (allData.emergency_contact_first_name && allData.emergency_contact_last_name)
            ? `${allData.emergency_contact_first_name} ${allData.emergency_contact_last_name}`
            : "",
        emergencyContactPhone: t.emergency_contact_phone || allData.emergency_contact_phone || "",
        emergencyContactRelation: t.emergency_contact_relation || allData.emergency_contact_relation || "",
        chatAppName: "whatsapp",
        chatAppNumber: allData.c_whats_app || "",
        passportNumber: t.passport_number || allData.c_passport_number || "",
        passportExpiryDate: t.passport_expiry_date || allData.c_passport_expiry_date || "",
      })),
      trip_country: allData.trip_countries?.[0] || "",
      medical_coverage: allData.emergency_medical_coverage || "",
      pa_coverage: allData.personal_accident_coverage_level || "",
      transit_coverage: !!allData.add_transit_coverage,
      green_zone_days: Number(allData.green_zone_days || 0),
      amber_zone_days: Number(allData.amber_zone_days || 0),
      red_zone_days: Number(allData.red_zone_days || 0),
      black_zone_days: Number(allData.black_zone_days || 0),
      primaryCity: allData.primary_cities_regions_ukraine || "",
      purpose: allData.trip_purpose || "",
      accomodationName: allData.stay_name || "",
      companyName: allData.company_name || "",
      cities: (allData.trip_cities || []).map((c: any) => c.name).filter(Boolean),
      medicalConditions: (allData.medical_conditions || []).join(", "),
      allergies: (allData.allergies || []).join(", "),
      medications: (allData.current_medications || []).join(", "),
      bloodType: allData.blood_type || "",
      affiliateCode: allData.affiliate_code || "",
    };
    // Send to Next.js API route before Flywire
    let checkoutData = null;
    try {
      const apiRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiPayload),
      });
      if (!apiRes.ok) {
        const errorText = await apiRes.text();
        alert("Failed to submit insurance data: " + errorText);
        return;
      }
      // Use the actual checkout data for Flywire
      const apiData = await apiRes.json();
      checkoutData = apiData.data;
    } catch (err) {
      alert("Network error submitting insurance data.");
      return;
    }
    console.log(checkoutData);
    const flywireConfig = {
      /* env: "demo",
      recipientCode: "POP",
      amount: quote?.data?.totalAmount?.toString() || "0.00",
      currency: quote?.currency || "EUR",

      // Payer information from form data
      firstName: allData.c_first_name || allData.travellers?.[0]?.first_name || "",
      lastName: allData.c_last_name || allData.travellers?.[0]?.last_name || "",
      email: allData.c_email || "",
      phone: allData.c_phone || "",
      address: allData.address || "",
      city: allData.city_of_residence || "",
      state: allData.state || "",
      zip: allData.zip || "",
      country: allData.country_of_residence || "",

      recipientFields: {
        invoice_number: invoiceNumber,
        policy_type: "Travel Insurance",
        trip_start_date: allData.trip_start_date || "",
        trip_end_date: allData.trip_end_date || "",
        destination: allData.trip_countries?.[0] || "",
        travellers_count: (allData.travellers?.length || 1).toString(),
        medical_coverage: safeMedicalCoverage,
        pa_coverage: safePaCoverage,
        customer_reference: allData.customer_id || "",
        policy_holder: `${allData.c_first_name || ""} ${allData.c_last_name || ""}`.trim()
      },

      paymentOptionsConfig: {
        sort: [
          { currency: ["local", "foreign"] },
          { amount: "asc" },
          { type: ["bank_transfer", "credit_card", "online"] }
        ]
      },

      callbackId: invoiceNumber,
      callbackUrl: `${window.location.origin}/flywire-notifications`,
      callbackVersion: "2",

      payerEmailNotifications: true,
      showLiveChat: true, */

       env: "demo", // or use a value from your environment/config
      recipientCode: checkoutData.recipientCode,
      amount: checkoutData.amount?.toString() || "0.00",
      currency: checkoutData.currency || "EUR",

        // Payer information
        firstName: checkoutData.payer?.firstName || "",
        lastName: checkoutData.payer?.lastName || "",
        email: checkoutData.payer?.email || "",
        phone: checkoutData.payer?.phone || "",
        address: checkoutData.payer?.address || "",
        city: checkoutData.payer?.city || "",
        state: checkoutData.payer?.state || "",
        zip: checkoutData.payer?.zip || "",
        country: checkoutData.payer?.country || "",

        // Metadata and recipient fields
        recipientFields: {
          checkoutId: checkoutData.metadata?.checkoutId || "",
          policy_type: "Travel Insurance",
          // Add other fields as needed from your form or checkoutData
        },

        paymentOptionsConfig: {
          sort: [
            { currency: ["local", "foreign"] },
            { amount: "asc" },
            { type: ["bank_transfer", "credit_card", "online"] }
          ]
        },

        callbackId: checkoutData.callbackId,
        callbackUrl: checkoutData.callbackUrl,
        callbackVersion: checkoutData.callbackVersion,

        payerEmailNotifications: checkoutData.payerEmailNotifications,
        showLiveChat: true,

        requestPayerInfo: true,
        requestRecipientInfo: checkoutData.requestRecipientInfo,
        // returnUrl: `${window.location.origin}/thank-you`,

      onInvalidInput: function (errors: FlywireError[]) {
        errors.forEach(function (error: FlywireError) {
          console.error("Flywire validation error:", error);
          alert(error.msg || "Payment validation error occurred");
        });
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      /* onPaymentSuccess: function (paymentData: any) {
        console.log("Payment successful:", paymentData);

        const updatedSubmission = {
          ...submission,
          paymentStatus: 'completed',
          paymentData: paymentData,
          invoiceNumber: invoiceNumber,
          paidAt: new Date().toISOString()
        };

        // Update localStorage with payment info
        try {
          const currentSubmissions = JSON.parse(localStorage.getItem('insuranceFormData') || '[]');
          const lastIndex = currentSubmissions.length - 1;
          if (lastIndex >= 0) {
            currentSubmissions[lastIndex] = updatedSubmission;
            localStorage.setItem('insuranceFormData', JSON.stringify(currentSubmissions));
          }
        } catch (error) {
          console.error('Error updating localStorage:', error);
        }

        // Redirect to thank you page with actual payment data
        const params = new URLSearchParams({
          paymentId: paymentData.paymentId || paymentData.reference || invoiceNumber,
          amount: quote?.data?.totalAmount?.toString() || "0.00",
          currency: quote?.currency || "EUR",
          status: 'completed'
        });

        window.location.href = `/thank-you?${params.toString()}`;
      }, */

      // Inside flywireConfig
      onCompleteCallback: async function (paymentResult: any) {
        setIsProcessingPayment(true);

        // Use the checkoutId from your checkoutData
        const checkoutId = checkoutData.metadata?.checkoutId;
        const success = await pollPaymentStatus(checkoutId);

        setIsProcessingPayment(false);

        if (success) {
          // Redirect to thank you page
          const params = new URLSearchParams({
            paymentId: checkoutId,
            amount: quote?.data?.totalAmount?.toString() || "0.00",
            currency: quote?.currency || "EUR",
            status: 'completed'
          });
          window.location.href = `/thank-you?${params.toString()}`;
        } else {
          alert("Payment is still processing. Please check your email for confirmation.");
        }
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onPaymentFailure: function (error: any) {
        console.error("Payment failed:", error);
        alert(t("insuranceForm.paymentFailureAlert") || "Payment failed. Please try again.");
      },

      onModalClose: function () {
        console.log("Payment modal was closed");
        // Handle modal close if needed
      }
    };

    // Function to load Flywire SDK dynamically if not loaded
    const loadFlywireSDK = () => {
      return new Promise((resolve, reject) => {
        // Check if already loaded
        if (typeof window.FlywirePayment !== 'undefined') {
          resolve(window.FlywirePayment);
          return;
        }

        // Check if script tag already exists
        if (document.querySelector('script[src*="flywire-payment.js"]')) {
          // Script exists, wait for it to load
          const checkLoaded = setInterval(() => {
            if (typeof window.FlywirePayment !== 'undefined') {
              clearInterval(checkLoaded);
              resolve(window.FlywirePayment);
            }
          }, 100);

          // Timeout after 10 seconds
          setTimeout(() => {
            clearInterval(checkLoaded);
            reject(new Error('Flywire SDK load timeout'));
          }, 10000);
          return;
        }

        // Load the script dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.flywire.com/flywire-payment.js';
        script.async = true;

        script.onload = () => {
          if (typeof window.FlywirePayment !== 'undefined') {
            resolve(window.FlywirePayment);
          } else {
            reject(new Error('Flywire SDK not available after load'));
          }
        };

        script.onerror = () => {
          reject(new Error('Failed to load Flywire SDK'));
        };

        document.head.appendChild(script);
      });
    };

    // Load Flywire SDK and trigger payment modal
    loadFlywireSDK()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((FlywirePayment: any) => {
        try {
          console.log("Flywire SDK loaded successfully");
          console.log(flywireConfig);
          const modal = FlywirePayment.initiate(flywireConfig);
          modal.render();
        } catch (error) {
          console.error("Error initiating Flywire payment:", error);
          alert("Payment system error. Please try again later.");
        }
      })
      .catch((error) => {
        console.error("Failed to load Flywire SDK:", error);
        alert("Unable to load payment system. Please check your internet connection and try again.");
      });
  };


  const handleNextOrContinue = async () => {
    console.log("STEP", step, "VALUES", getValues());
    console.log("STEP", step, "ERRORS", formState.errors);
    if (step === 1 && ageLimitExceeded) {
      setAgeAlertOpen(true);
      return;
    }
    const currentStepFields = fieldsByStep[step] as Array<Path<InsuranceFormValues>>;
    let overallValidationPassed = true;
    const partFieldsToValidate: Path<InsuranceFormValues>[] = [];
    if (step === 1) partFieldsToValidate.push("c_phone_code", "c_phone_number", "c_whats_app_code", "c_whats_app_number", "c_passport_number", "c_passport_expiry_date", "city_of_residence");
    if (step === 3) partFieldsToValidate.push("emergency_contact_phone_code", "emergency_contact_phone_number");

    if (partFieldsToValidate.length > 0) {
      const partValidationResult = await trigger(partFieldsToValidate, { shouldFocus: true });
      if (!partValidationResult) overallValidationPassed = false;
    }

    if (overallValidationPassed) {
      const currentStepValidationResult = await trigger(currentStepFields, { shouldFocus: true });
      if (!currentStepValidationResult) overallValidationPassed = false;
    }

    if (overallValidationPassed && step === 0) {
      const values = getValues();
      if (values.trip_start_date && values.trip_end_date) {
        const startDate = dayjs(values.trip_start_date + "T00:00:00");
        const endDate = dayjs(values.trip_end_date + "T00:00:00");
        if (startDate.isValid() && endDate.isValid() && (endDate.isSame(startDate) || endDate.isAfter(startDate))) {
          const totalTripDays = endDate.diff(startDate, 'day') + 1;
          const sumZoneDays = Number(values.green_zone_days || 0) + Number(values.amber_zone_days || 0) + Number(values.red_zone_days || 0) + Number(values.black_zone_days || 0);
          if (totalTripDays !== sumZoneDays) {
            const message = getValidationMessage('insuranceForm.validationzoneDaysSum', { totalCalculatedDays: totalTripDays, sumOfZoneDays: sumZoneDays });
            form.setError("root", { type: "manual", message });
            overallValidationPassed = false;
          } else {
            form.clearErrors("root");
          }
        }
      }
    }

    if (!overallValidationPassed) {
      const fieldsToSearchForErrors = Array.from(new Set([...currentStepFields, ...partFieldsToValidate]));
      let firstErrorKeyFound: Path<InsuranceFormValues> | undefined = fieldsToSearchForErrors.find(fieldName => getError(fieldName) !== undefined);
      if (!firstErrorKeyFound && step === 1 && formState.errors.travellers) {
        const travellerErrors = formState.errors.travellers;
        if (Array.isArray(travellerErrors)) {
          for (let i = 0; i < travellerErrors.length; i++) {
            const specificTravellerErrors = travellerErrors[i] as undefined | Record<string, FieldError | undefined>;
            if (specificTravellerErrors) {
              const fieldsToCheck: (keyof InsuranceFormValues['travellers'][0])[] = ['first_name', 'last_name', 'birthdate', 'passport_number', 'passport_expiry_date'];
              for (const Tfield of fieldsToCheck) if (specificTravellerErrors[Tfield]) { firstErrorKeyFound = `travellers.${i}.${Tfield}` as Path<InsuranceFormValues>; break; }
            }
            if (firstErrorKeyFound) break;
          }
        }
      }
      if (!firstErrorKeyFound && step === 2 && formState.errors.trip_cities) {
        const cityErrorsArray = formState.errors.trip_cities;
        if (Array.isArray(cityErrorsArray)) {
          for (let i = 0; i < cityErrorsArray.length; i++) {
            const specificCityErrors = cityErrorsArray[i];
            if (specificCityErrors?.name) { firstErrorKeyFound = `trip_cities.${i}.name` as Path<InsuranceFormValues>; break; }
          }
        }
      }
      if (!firstErrorKeyFound && formState.errors.root?.message) {
        const zoneDayElement = document.querySelector(`[name='amber_zone_days']`) || document.querySelector(`[name='red_zone_days']`) || document.querySelector(`[name='green_zone_days']`);
        zoneDayElement?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return;
      }
      if (firstErrorKeyFound) {
        const element = document.querySelector(`[name='${firstErrorKeyFound}']`) || document.getElementById(firstErrorKeyFound as string);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (step < steps.length - 1) setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const getError = (fieldName: Path<InsuranceFormValues>): FieldError | undefined => {
    const error = get(formState.errors, fieldName);
    if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') return error as FieldError;
    return undefined;
  };



  const formatDateForDisplay = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    try {
      const parts = dateString.split('-'); if (parts.length !== 3) return "Invalid Date";
      const year = parseInt(parts[0], 10), month = parseInt(parts[1], 10) - 1, day = parseInt(parts[2], 10);
      const dateObj = new Date(year, month, day);
      if (isNaN(dateObj.getTime()) || dateObj.getFullYear() !== year || dateObj.getMonth() !== month || dateObj.getDate() !== day) return "Invalid Date";
      return formatDateFn(dateObj, "PPP");
    } catch (e) { console.error("Error formatting date:", dateString, e); return "Invalid Date"; }
  };

  const watchedPathsForSummary = ["trip_start_date", "trip_end_date", "emergency_medical_coverage", "personal_accident_coverage_level", "add_transit_coverage", "c_first_name", "c_last_name", "c_birthdate", "c_nationality", "trip_purpose", "primary_cities_regions_ukraine", "emergency_contact_first_name", "emergency_contact_last_name", "emergency_contact_phone", "c_passport_number", "c_passport_expiry_date", "city_of_residence"] as const;
  const watchedValuesForSummary = watch(watchedPathsForSummary);
  const watchedTravellersForSummary = watch("travellers");
  const watchedTripCitiesForSummary = watch("trip_cities");


  const getEmergencyMedicalLabel = (value: string) => currentEmergencyMedicalCoverageOptions.find(opt => opt.value === value)?.label || value || "N/A";
  const getPALabel = (value: string) => currentPersonalAccidentCoverageOptions.find(opt => opt.value === value)?.label || value || "N/A";
  const getTripPurposeLabel = (value: string) => currentTripPurposes.find(opt => opt.value === value)?.label || value || "N/A";
  const getNationalityLabel = (value: string) => currentNationalityOptions.find(opt => opt.value === value)?.label || value || "N/A";
  const getCountryOfResidenceLabel = (value: string) => currentCountryOptions.find(opt => opt.value === value)?.label || value || "N/A";


  const formatFullName = (firstName?: string, lastName?: string): string => {
    const first = firstName || "", last = lastName || "";
    if (first && last) return `${first} ${last}`;
    return first || last || "N/A";
  };

  const renderQuoteDisplay = () => {
    if (!quoteResult) return "€0.00 ";
    if (!quoteResult.ok) return `€0.00 (${quoteResult.message || "Error"})`;
    if (quoteResult.data) return `€${quoteResult.data.totalAmount.toFixed(2)}`;
    return "€0.00 (Unavailable)";
  };

  const renderQuoteWarnings = () => {
    if (quoteResult && quoteResult.ok && quoteResult.warnings && quoteResult.warnings.length > 0) {
      return (<div className="mt-1 text-xs text-orange-600"><strong>{t("insuranceForm.warnings")}:</strong><ul className="list-disc list-inside pl-4">{quoteResult.warnings.map((warning, idx) => <li key={idx}>{warning}</li>)}</ul></div>);
    }
    return null;
  };

  function getTravellerBreakdown() {
    if (!quoteResult?.ok || !quoteResult.data) return [];
    const travellers = watchedTravellersForSummary || [];
    const perTravellerCount = quoteResult.data.travellersCount || 1;
    const perTravellerMedical = quoteResult.data.medicalCoverAmount / perTravellerCount;
    const perTravellerPA = quoteResult.data.paCoverAmount / perTravellerCount;
    const perTravellerTransit = quoteResult.data.totalAmount / perTravellerCount - perTravellerMedical - perTravellerPA;
    return travellers.map((traveller, idx) => ({
      name: formatFullName(traveller.first_name, traveller.last_name),
      medical: perTravellerMedical,
      pa: perTravellerPA,
      transit: perTravellerTransit > 0 ? perTravellerTransit : 0,
      nationality: traveller.nationality,
    }));
  }

  function getVatInfo() {
    // Example: apply 19% VAT if country_of_residence is DE (Germany)
    const country = watch("city_of_residence");
    const vatCountries = ["DE"];
    if (vatCountries.includes(country)) {
      return { rate: 0.19, label: "19%" };
    }
    return null;
  }
  const [pricing, setPricing] = useState<PricingMatrix>(defaultPricing);
  useEffect(() => {
    try {
      const stored = localStorage.getItem('insurancePricingMatrix');
      if (stored) {
        setPricing(JSON.parse(stored));
      } else {
        localStorage.setItem('insurancePricingMatrix', JSON.stringify(defaultPricing));
        setPricing(defaultPricing);
      }
    } catch {
      localStorage.setItem('insurancePricingMatrix', JSON.stringify(defaultPricing));
      setPricing(defaultPricing);
    }
  }, []);

  return (
    <>
      <AlertDialog open={ageAlertOpen} onOpenChange={setAgeAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("insuranceForm.ageLimit.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("insuranceForm.ageLimit.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAgeAlertOpen(false)}>
              {t("insuranceForm.ageLimit.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isProcessingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-4">Processing your payment...</h2>
            <p>Please wait while we confirm your payment status.</p>
            <div className="mt-4">
              <span className="loader" /> {/* You can add a spinner here */}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center px-4 py-10 " style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <div className="w-full max-w-4xl">
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between">
              {steps.map((label, index) => (
                <div key={index} className="flex-1 text-center text-sm font-semibold">
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${index <= step ? "bg-[#1A2C50] text-white" : "bg-[#00BBD3] text-white"}`}>{index + 1}</div>
                  <div className="mt-1 font-semibold">{label}</div>
                </div>
              ))}
            </div>
            <div className="h-2 bg-[#00BBD3] rounded-full"><div className="h-2 bg-[#1A2C50] rounded-full transition-all duration-300" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
          </div>

          <div className="bg-white/90 p-6 md:p-8 shadow-lg shadow-[#1A2C50] rounded-md">
            <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-8">
              {step === 0 && (
                <>
                  <h2 className="text-2xl font-semibold mb-6 text-[#1A2C50]">{t("insuranceForm.travelDetails")}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <DatePickerField label={t("insuranceForm.travelStartDate")} name="trip_start_date" control={control} error={getError("trip_start_date")} placeholder={t("insuranceForm.selectStartDate")} minDate={dayjs().startOf('day').toDate()} maxDate={watchedEndDate ? dayjs(watchedEndDate).toDate() : undefined} />
                    <DatePickerField
                      label={t("insuranceForm.travelEndDate")}
                      name="trip_end_date"
                      control={control}
                      error={getError("trip_end_date")}
                      placeholder={t("insuranceForm.selectEndDate")}
                      minDate={
                        watchedStartDate
                          ? dayjs(watchedStartDate).startOf("day").toDate()
                          : dayjs().startOf("day").toDate()
                      }
                      maxDate={
                        watchedStartDate
                          ? dayjs(watchedStartDate).add(179, "day").endOf("day").toDate()
                          : undefined
                      }
                    />

                  </div>
                  <SelectWithLabel label={t('insuranceForm.step1.countryTravellingTo')} name="trip_countries.0" control={control} options={currentCountryTravellingToOptions} placeholder={t('insuranceForm.step1.selectCountry')} error={getError("trip_countries.0" as Path<InsuranceFormValues>) || getError("trip_countries" as Path<InsuranceFormValues>)} />
                  {/* <h3 className="text-xl font-semibold mb-1 text-[#1A2C50]">{t("insuranceForm.riskZoneDays")}</h3> */}
                  <h3 className="text-xl font-semibold mb-1 text-[#1A2C50] flex items-center">
                    {t("insuranceForm.riskZoneDays")}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="ml-2 cursor-pointer">
                            <Info className="w-5 h-5" aria-label="Info" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="right" align="start" sideOffset={4}>
                          <div
                            className="bg-muted px-3 py-2 text-sm shadow"
                            style={{ maxWidth: 470, whiteSpace: "pre-line", wordBreak: "break-word" }}
                          >
                            {t("insuranceForm.riskZoneDaysTooltip")}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <InputWithLabel label={t("insuranceForm.totalDays")} name="displayTotalDays" type="number" value={calculatedTotalRiskZoneDays !== null ? calculatedTotalRiskZoneDays.toString() : ""} readOnly={true} />
                    <InputWithLabel label={t("insuranceForm.greenZoneDays")} name="green_zone_days" type="number" value={watchedGreenDaysForDisplay?.toString()} readOnly={true} register={register} error={getError("green_zone_days")} />
                    <InputWithLabel label={t("insuranceForm.amberZoneDays")} name="amber_zone_days" type="number" register={register} error={getError("amber_zone_days")} />
                    <InputWithLabel label={t("insuranceForm.redZoneDays")} name="red_zone_days" type="number" register={register} error={getError("red_zone_days")} />
                  </div>
                  {formState.errors.root && (<p className="text-sm text-red-500 mb-4">{formState.errors.root.message}</p>)}
                  <div className="mb-6">
                    <SelectWithLabel
                      label={t('insuranceForm.step1.countryOfResidence')}
                      name="city_of_residence"
                      control={control}
                      options={currentCountryOptions}
                      placeholder={t('insuranceForm.step1.selectCountry')}
                      error={getError("city_of_residence")}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-[#1A2C50]">{t("insuranceForm.coverageOptions")}</h3>
                  <div className="space-y-4 mb-6">
                    {/* <SelectWithLabel label={t("insuranceForm.emergencyMedical")} name="emergency_medical_coverage" control={control} options={currentEmergencyMedicalCoverageOptions} placeholder={t("insuranceForm.selectMedicalCoverage")} error={getError("emergency_medical_coverage")} readOnly={coverageDisabled || !watch("city_of_residence")} />
                    <SelectWithLabel label={t("insuranceForm.personalAccident")} name="personal_accident_coverage_level" control={control} options={currentPersonalAccidentCoverageOptions} placeholder={t("insuranceForm.selectPACoverage")} error={getError("personal_accident_coverage_level")} readOnly={coverageDisabled || !watch("city_of_residence")} /> */}
                    <div className="grid grid-cols-2 gap-6">
                      <SelectWithLabel
                        label={t("insuranceForm.emergencyMedical")}
                        name="emergency_medical_coverage"
                        control={control}
                        options={currentEmergencyMedicalCoverageOptions}
                        placeholder={t("insuranceForm.selectMedicalCoverage")}
                        error={getError("emergency_medical_coverage")}
                        readOnly={coverageDisabled || !watch("city_of_residence")}
                      />

                      <SelectWithLabel
                        label={t("insuranceForm.personalAccident")}
                        name="personal_accident_coverage_level"
                        control={control}
                        options={currentPersonalAccidentCoverageOptions}
                        placeholder={t("insuranceForm.selectPACoverage")}
                        error={getError("personal_accident_coverage_level")}
                        readOnly={coverageDisabled || !watch("city_of_residence")}
                      />
                    </div>
                    <TooltipProvider>
                      <div className="flex items-center space-x-2">
                        <Controller
                          name="add_transit_coverage"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="add_transit_coverage"
                              checked={field.value}
                              onCheckedChange={field.onChange}

                            />
                          )}
                        />
                        <Label
                          htmlFor="add_transit_coverage"
                        >
                          {t("insuranceForm.addTransitCover")} <strong>€25</strong>
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info
                              className="w-4 h-4 text-red cursor-pointer"
                              aria-label="Transit Info"
                            />
                          </TooltipTrigger>
                          <TooltipContent side="bottom" align="start" sideOffset={4}>
                            <div className="relative">
                              <div className="bg-muted px-3 py-2 text-sm shadow">
                                {t("insuranceForm.addTransitCoverTooltip")}
                              </div>
                              <div className="absolute top-0 left-2.5 -translate-y-full w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-muted" />
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </div>
                  <div className="mt-4 pt-6 border-t">
                    <div className="mt-4 p-6 bg-gray-50 rounded-md border">
                      <h3 className="text-xl font-semibold text-[#1A2C50] mb-2">
                        {t("insuranceForm.quoteSummary")}
                      </h3>

                      <p className="text-2xl font-bold text-[#00BBD3]">
                        {renderQuoteDisplay()}
                      </p>

                      {renderQuoteWarnings()}

                      <p>
                        {t("insuranceForm.step4.summaryOfCoverage.coverage.medical")}:{" "}
                        {getEmergencyMedicalLabel(watch("emergency_medical_coverage"))}{" "}
                        {quoteResult?.data ? `(${formatEuro(quoteResult.data.medicalCoverAmount)})` : ""}
                      </p>
                      <p>
                        {t("insuranceForm.step4.summaryOfCoverage.coverage.pa")}:{" "}
                        {getPALabel(watch("personal_accident_coverage_level"))}{" "}
                        {quoteResult?.data ? `(${formatEuro(quoteResult.data.paCoverAmount)})` : ""}
                      </p>
                      <p>
                        {t("insuranceForm.step4.summaryOfCoverage.coverage.transit")}:{" "}
                        {watchedValuesForSummary[4]
                          ? t("insuranceForm.yes250k")
                          : t("insuranceForm.no")}
                      </p>
                    </div>
                  </div>
                </>
              )}
              {step === 1 && (
                <>
                  <h2 className="text-2xl font-semibold mb-6 text-[#1A2C50]">{t('insuranceForm.step1.yourDetails')}</h2>
                  <div className="mb-6">
                    <Label className="font-semibold text-gray-900">{t("insuranceForm.step1.purchaseContextLabel")}</Label>
                    <Controller
                      name="purchase_context"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-2 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="self" id="purchase_context_self" />
                            <Label htmlFor="purchase_context_self">{t("insuranceForm.step1.purchaseContextSelf")}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="purchase_context_other" />
                            <Label htmlFor="purchase_context_other">{t("insuranceForm.step1.purchaseContextOther")}</Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                    {getError("purchase_context") && <p className="text-sm text-red-500 mt-1">{getError("purchase_context")?.message}</p>}

                    {watch("purchase_context") === "other" && (
                      <div className="flex items-start space-x-2 pt-6">
                        <Controller
                          name="consent_for_additional_travellers"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="consent_for_additional_travellers"
                              checked={!!field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <div className="leading-none mt-0.5">
                          <Label htmlFor="consent_for_additional_travellers" className="font-medium leading-snug">
                            {t("insuranceForm.step1.consentForAdditionalTravellers")}
                          </Label>
                          {getError("consent_for_additional_travellers" as Path<InsuranceFormValues>) && (
                            <p className="text-sm text-red-500">
                              {getError("consent_for_additional_travellers" as Path<InsuranceFormValues>)?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-[#1A2C50]">{t('insuranceForm.step1.primaryTraveller')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><div className="flex items-start gap-2"><div className="flex-grow"><InputWithLabel label={t("insuranceForm.step1.contactFirstName")} name="c_first_name" register={register} placeholder={t("insuranceForm.step1.contactFirstName")} error={getError("c_first_name") || getError("travellers.0.first_name" as Path<InsuranceFormValues>)} /></div><div className="flex-grow"><InputWithLabel label={t("insuranceForm.step1.contactLastName")} name="c_last_name" register={register} placeholder={t("insuranceForm.step1.contactLastName")} error={getError("c_last_name") || getError("travellers.0.last_name" as Path<InsuranceFormValues>)} /></div></div></div>
                    <div className="mt-1.5"><BirthDateField label={t('insuranceForm.step1.dob')} name="c_birthdate" control={control} getError={getError} watch={watch} /></div>
                    <div><p className="text-sm font-medium text-gray-900 mb-1 mt-1">{t('insuranceForm.step1.phoneNumber')}</p><div className="flex items-start gap-2"><div className="w-1/3 shrink-0"><SelectWithLabel control={control} name="c_phone_code" label="" options={currentCountryCodeOptions} placeholder={t("insuranceForm.step3.codePlaceholder")} error={getError("c_phone_code")} /></div><div className="flex-grow"><InputWithLabel label="" name="c_phone_number" type="tel" register={register} placeholder={t('insuranceForm.step1.enterNumber')} error={getError("c_phone_number")} /></div></div>{getError("c_phone") && <p className="text-sm text-red-500 mt-1">{getError("c_phone")?.message}</p>}</div>
                    <InputWithLabel label={t('insuranceForm.step1.email')} name="c_email" type="email" register={register} error={getError("c_email")} />
                    <div className="md:col-span-2 mt-3"><div className="flex items-center space-x-2"><Controller name="c_is_whatsapp_same_as_phone" control={control} render={({ field }) => (<Checkbox id="c_is_whatsapp_same_as_phone" checked={field.value} onCheckedChange={field.onChange} />)} /><Label htmlFor="c_is_whatsapp_same_as_phone">{t("insuranceForm.step1.whatsappSameAsPhone")}</Label></div></div>
                    <div className="flex items-start gap-2">
                      <div className="flex-grow">
                        <InputWithLabel
                          label={t("insuranceForm.step1.address")}
                          name="address"
                          register={register}
                          placeholder={t("insuranceForm.step1.addressPlaceholder")}
                          error={getError("address")}
                        />
                      </div>
                      <div className="flex-grow">
                        <InputWithLabel
                          label={t("insuranceForm.step1.zip")}
                          name="zip"
                          register={register}
                          placeholder={t("insuranceForm.step1.zipPlaceholder")}
                          error={getError("zip")}
                        />
                      </div>
                    </div>
                    <SelectWithLabel label={t('insuranceForm.step1.nationality')} name="c_nationality" control={control} options={currentNationalityOptions} placeholder={t('insuranceForm.step1.selectNationality')} error={getError("c_nationality")} />
                  </div>

                  <div className="mt-6 pt-6">
                    <h2 className="text-lg font-semibold mb-3 text-[#1A2C50]">{t("insuranceForm.step3.title")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><div className="flex items-start gap-2"><div className="flex-grow"><InputWithLabel label={t("insuranceForm.step1.contactFirstName")} name="emergency_contact_first_name" register={register} placeholder={t("insuranceForm.step1.contactFirstName")} error={getError("emergency_contact_first_name")} /></div><div className="flex-grow"><InputWithLabel label={t("insuranceForm.step1.contactLastName")} name="emergency_contact_last_name" register={register} placeholder={t("insuranceForm.step1.contactLastName")} error={getError("emergency_contact_last_name")} /></div></div></div>
                      <div><p className="text-sm font-medium text-gray-900 mb-1 mt-1">{t("insuranceForm.step3.contactNumber")}</p><div className="flex items-start gap-2"><div className="w-1/3 shrink-0"><SelectWithLabel control={control} name="emergency_contact_phone_code" label="" options={currentCountryCodeOptions} placeholder={t("insuranceForm.step3.codePlaceholder")} error={getError("emergency_contact_phone_code")} /></div><div className="flex-grow"><InputWithLabel label="" name="emergency_contact_phone_number" type="tel" register={register} placeholder={t("insuranceForm.step3.numberPlaceholder")} error={getError("emergency_contact_phone_number")} /></div></div>{getError("emergency_contact_phone") && <p className="text-sm text-red-500 mt-1">{getError("emergency_contact_phone")?.message}</p>}</div>
                      <InputWithLabel label={t("insuranceForm.step3.relationship")} name="emergency_contact_relation" register={register} error={getError("emergency_contact_relation")} />
                    </div>
                  </div>

                  {travellerFields.map((field, index) => {
                    if (index === 0) return null;

                    const firstNamePath = `travellers.${index}.first_name` as Path<InsuranceFormValues>;
                    const lastNamePath = `travellers.${index}.last_name` as Path<InsuranceFormValues>;
                    const birthdatePath = `travellers.${index}.birthdate` as Path<InsuranceFormValues>;
                    const ecFirstNamePath = `travellers.${index}.emergency_contact_first_name` as Path<InsuranceFormValues>;
                    const ecLastNamePath = `travellers.${index}.emergency_contact_last_name` as Path<InsuranceFormValues>;
                    const ecRelationPath = `travellers.${index}.emergency_contact_relation` as Path<InsuranceFormValues>;
                    const ecPhoneCodePath = `travellers.${index}.emergency_contact_phone_code` as Path<InsuranceFormValues>;
                    const ecPhoneNumberPath = `travellers.${index}.emergency_contact_phone_number` as Path<InsuranceFormValues>;
                    const ecPhonePath = `travellers.${index}.emergency_contact_phone` as Path<InsuranceFormValues>;

                    return (
                      <div key={field.id} className="mt-6 pt-6 border-t">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-semibold text-[#1A2C50]">{t(`insuranceForm.step1.additionalTraveller`)} #{index + 1}</h3>
                          <Button type="button" variant="destructive" size="sm" onClick={() => removeTraveller(index)}>{t("insuranceForm.step1.remove")}</Button>
                        </div>

                        {/* Personal Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="flex items-start gap-2">
                              <div className="flex-grow">
                                <InputWithLabel label={t("insuranceForm.step1.contactFirstName")} name={firstNamePath} register={register} placeholder={t("insuranceForm.step1.contactFirstName")} error={getError(firstNamePath)} />
                              </div>
                              <div className="flex-grow">
                                <InputWithLabel label={t("insuranceForm.step1.contactLastName")} name={lastNamePath} register={register} placeholder={t("insuranceForm.step1.contactLastName")} error={getError(lastNamePath)} />
                              </div>
                            </div>
                          </div>
                          <div className="w-full mt-1.5">
                            <BirthDateField label={t('insuranceForm.step1.dob')} name={birthdatePath} control={control} getError={getError} watch={watch} />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          <InputWithLabel
                            label={t('insuranceForm.step1.email')}
                            name={`travellers.${index}.email` as Path<InsuranceFormValues>}
                            type="email"
                            register={register}
                            error={getError(`travellers.${index}.email` as Path<InsuranceFormValues>)}
                          />
                          <SelectWithLabel
                            label={t('insuranceForm.step1.nationality')}
                            name={`travellers.${index}.nationality` as Path<InsuranceFormValues>}
                            control={control}
                            options={currentNationalityOptions}
                            placeholder={t('insuranceForm.step1.selectNationality')}
                            error={getError(`travellers.${index}.nationality` as Path<InsuranceFormValues>)}
                          />
                          <div className="flex items-start gap-6 md:col-span-2">
                            <div className="flex-1">
                              <InputWithLabel
                                label={t("insuranceForm.step1.address")}
                                name={`travellers.${index}.address` as Path<InsuranceFormValues>}
                                register={register}
                                placeholder={t("insuranceForm.step1.addressPlaceholder")}
                                error={getError(`travellers.${index}.address` as Path<InsuranceFormValues>)}
                              />
                            </div>
                            <div className="flex-1">
                              <InputWithLabel
                                label={t("insuranceForm.step1.zip")}
                                name={`travellers.${index}.zip` as Path<InsuranceFormValues>}
                                register={register}
                                placeholder={t("insuranceForm.step1.zipPlaceholder")}
                                error={getError(`travellers.${index}.zip` as Path<InsuranceFormValues>)}
                              />
                            </div>
                          </div>
                        </div>
                        {/* Emergency Contact Details */}
                        <div className="mt-4 pt-4 border-t border-dashed">
                          <h4 className="text-md font-semibold text-[#1A2C50] mb-3">{t("insuranceForm.step3.title")}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <div className="flex items-start gap-2">
                                <div className="flex-grow">
                                  <InputWithLabel label={t("insuranceForm.step1.contactFirstName")} name={ecFirstNamePath} register={register} error={getError(ecFirstNamePath)} />
                                </div>
                                <div className="flex-grow">
                                  <InputWithLabel label={t("insuranceForm.step1.contactLastName")} name={ecLastNamePath} register={register} error={getError(ecLastNamePath)} />
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-1 mt-1">{t("insuranceForm.step3.contactNumber")}</p>
                              <div className="flex items-start gap-2">
                                <div className="w-1/3 shrink-0">
                                  <SelectWithLabel control={control} name={ecPhoneCodePath} label="" options={currentCountryCodeOptions} placeholder={t("insuranceForm.step3.codePlaceholder")} error={getError(ecPhoneCodePath)} />
                                </div>
                                <div className="flex-grow">
                                  <InputWithLabel label="" name={ecPhoneNumberPath} type="tel" register={register} placeholder={t("insuranceForm.step3.numberPlaceholder")} error={getError(ecPhoneNumberPath)} />
                                </div>
                              </div>
                              {getError(ecPhonePath) && <p className="text-sm text-red-500 mt-1">{getError(ecPhonePath)?.message}</p>}
                            </div>
                            <InputWithLabel label={t("insuranceForm.step3.relationship")} name={ecRelationPath} register={register} error={getError(ecRelationPath)} />
                          </div>
                        </div>
                      </div>
                    );
                  })}



                  <div className="text-red-600 text-sm font-semibold mr-2">
                    {t("insuranceForm.step1.note")}
                  </div>
                  <Button type="button" variant="outline" onClick={() => appendTraveller({
                    first_name: "",
                    last_name: "",
                    birthdate: "",
                    passport_number: "",
                    passport_expiry_date: "",
                    emergency_contact_first_name: "",
                    emergency_contact_last_name: "",
                    emergency_contact_relation: "",
                    emergency_contact_phone_code: "",
                    emergency_contact_phone_number: "",
                    emergency_contact_phone: "",
                    email: "",
                    nationality: "",
                    address: "",
                    zip: "",
                  })} className="mt-6">{t("insuranceForm.step1.addAdditionalTraveller")}</Button>

                  <div className="mt-8 pt-6 border-t">
                    <div className="mt-4 p-6 bg-gray-50 rounded-md border">
                      <h3 className="text-xl font-semibold text-[#1A2C50] mb-2">{t("insuranceForm.quoteSummary")}</h3>
                      <p className="text-2xl font-bold text-[#00BBD3]">{renderQuoteDisplay()}</p>
                      <p>{t("insuranceForm.step4.summaryOfCoverage.coverage.medical")}: {getEmergencyMedicalLabel(watch("emergency_medical_coverage"))} {quoteResult?.data ? `(${formatEuro(quoteResult.data.medicalCoverAmount)})` : ''}</p>
                      <p>{t("insuranceForm.step4.summaryOfCoverage.coverage.pa")}: {getPALabel(watch("personal_accident_coverage_level"))} {quoteResult?.data ? `(${formatEuro(quoteResult.data.paCoverAmount)})` : ''}</p>
                      <p>{t("insuranceForm.step4.summaryOfCoverage.coverage.transit")}: {watchedValuesForSummary[4] ? t("insuranceForm.yes250k") : t("insuranceForm.no")}</p>
                    </div>
                  </div>
                  {getError("travellers" as Path<InsuranceFormValues>) && typeof getError("travellers" as Path<InsuranceFormValues>)?.message === 'string' && <p className="text-sm text-red-500 mt-1">{getError("travellers" as Path<InsuranceFormValues>)?.message}</p>}
                </>
              )}
              {step === 2 && (
                <>
                  <h2 className="text-2xl font-semibold mb-6 text-[#1A2C50]">{t("insuranceForm.step2.title")}</h2>
                  <div className="mt-6"><SelectWithLabel label={t("insuranceForm.step2.tripPurpose")} name="trip_purpose" control={control} options={currentTripPurposes} placeholder={t("insuranceForm.step2.selectTripPurpose")} error={getError("trip_purpose")} /></div>
                  <div className="mt-6"><InputWithLabel label={t("insuranceForm.step2.companyName")} name="company_name" register={register} error={getError("company_name")} /></div>
                  <div className="mt-6">
                    <SelectWithLabel
                      label={t("insuranceForm.step2.primaryCities")}
                      name="primary_cities_regions_ukraine"
                      control={control}
                      options={primaryCitiesUkraineOptions}
                      placeholder={t("insuranceForm.step2.primaryCity")}
                      error={getError("primary_cities_regions_ukraine")}
                    />
                  </div>
                  <div className="mt-6">
                    <InputWithLabel
                      label={t("insuranceForm.step2.cityOrTown")}
                      name="city_or_town"
                      register={register}
                      error={getError("city_or_town")}
                    />
                  </div>

                  <div className="mt-6"><InputWithLabel label={t("insuranceForm.step2.stayName")} name="stay_name" register={register} error={getError("stay_name")} /></div>
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-3 text-[#1A2C50]">{t("insuranceForm.step2.citiesVisitingTitle")}</h3>
                    {cityFields.map((field, index) => {
                      const cityNamePath = `trip_cities.${index}.name` as Path<InsuranceFormValues>; const cityZoneTypePath = `trip_cities.${index}.zoneType` as Path<InsuranceFormValues>;
                      return (<div key={field.id} className="flex items-end gap-2 mb-3"><div className="flex-grow"><InputWithLabel
                        label={t("insuranceForm.step2.cityName").replace("{{index}}", (index + 1).toString())}
                        name={cityNamePath}
                        register={register}
                        error={getError(cityNamePath)}
                        placeholder={t("insuranceForm.step2.enterCityName")}
                      /><input type="hidden" {...register(cityZoneTypePath)} value="GREEN" /></div><Button type="button" variant="destructive" size="sm" onClick={() => removeCity(index)}>{t("insuranceForm.step2.remove")}</Button></div>);
                    })}
                    <Button type="button" variant="outline" onClick={() => appendCity({ name: "", zoneType: "GREEN" })}>{t("insuranceForm.step2.addCity")}</Button>
                    {getError("trip_cities" as Path<InsuranceFormValues>) && typeof getError("trip_cities" as Path<InsuranceFormValues>)?.message === 'string' && <p className="text-sm text-red-500 mt-1">{getError("trip_cities" as Path<InsuranceFormValues>)?.message}</p>}
                  </div>
                  <div className="mt-6 pt-6 border-t">
                    <div className="mt-4 p-6 bg-gray-50 rounded-md border">
                      <h3 className="text-xl font-semibold text-[#1A2C50] mb-2">{t("insuranceForm.quoteSummary")}</h3>
                      <p className="text-2xl font-bold text-[#00BBD3]">{renderQuoteDisplay()}</p>
                      <p>{t("insuranceForm.step4.summaryOfCoverage.coverage.medical")}: {getEmergencyMedicalLabel(watch("emergency_medical_coverage"))} {quoteResult?.data ? `(${formatEuro(quoteResult.data.medicalCoverAmount)})` : ''}</p>
                      <p>{t("insuranceForm.step4.summaryOfCoverage.coverage.pa")}: {getPALabel(watch("personal_accident_coverage_level"))} {quoteResult?.data ? `(${formatEuro(quoteResult.data.paCoverAmount)})` : ''}</p>
                      <p>{t("insuranceForm.step4.summaryOfCoverage.coverage.transit")}: {watchedValuesForSummary[4] ? t("insuranceForm.yes250k") : t("insuranceForm.no")}</p>
                    </div>
                  </div>
                </>
              )}
              {/* {step === 3 && (
                <>

                  <h3 className="text-xl font-semibold mt-8 mb-4 text-[#1A2C50]">{t("insuranceForm.step3.optionalMedicalTitle")}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2"><Controller name="has_medical_conditions" control={control} render={({ field }) => <Checkbox id="has_medical_conditions" checked={!!field.value} onCheckedChange={field.onChange} />} /><Label htmlFor="has_medical_conditions">{t("insuranceForm.step3.preExistingConditions")}</Label></div>
                    {watch("has_medical_conditions") && (<ControlledTextareaArray name="medical_conditions" control={control} label={t("insuranceForm.step3.listConditions")} error={getError("medical_conditions" as Path<InsuranceFormValues>)} />)}
                    <div className="flex items-center space-x-2"><Controller name="has_allergies" control={control} render={({ field }) => <Checkbox id="has_allergies" checked={!!field.value} onCheckedChange={field.onChange} />} /><Label htmlFor="has_allergies">{t("insuranceForm.step3.allergies")}</Label></div>
                    {watch("has_allergies") && (<ControlledTextareaArray name="allergies" control={control} label={t("insuranceForm.step3.listAllergies")} error={getError("allergies" as Path<InsuranceFormValues>)} />)}
                    <div className="flex items-center space-x-2"><Controller name="has_current_medications" control={control} render={({ field }) => <Checkbox id="has_current_medications" checked={!!field.value} onCheckedChange={field.onChange} />} /><Label htmlFor="has_current_medications">{t("insuranceForm.step3.currentMedications")}</Label></div>
                    {watch("has_current_medications") && (<ControlledTextareaArray name="current_medications" control={control} label={t("insuranceForm.step3.listMedications")} error={getError("current_medications" as Path<InsuranceFormValues>)} />)}
                    <InputWithLabel label={t("insuranceForm.step3.bloodType")} name="blood_type" register={register} error={getError("blood_type")} />
                    <TextareaWithLabel label={t("insuranceForm.step3.specialAssistance")} name="special_assistance" register={register} error={getError("special_assistance")} />
                  </div>
                </>
              )} */}
              {step === 3 && (
                <>
                  <h2 className="text-2xl font-semibold mb-6 text-[#1A2C50]">{t("insuranceForm.step4.summaryOfCoverage.title")}</h2>
                  <div className="space-y-3 p-6 bg-gray-50 rounded-md border mb-6">
                    <div><strong>{t("insuranceForm.step4.summaryOfCoverage.travelDates")}</strong> {formatDateForDisplay(watchedValuesForSummary[0])} to {formatDateForDisplay(watchedValuesForSummary[1])}</div>
                    <div><strong>{t("insuranceForm.step1.countryOfResidence")}:</strong> {getCountryOfResidenceLabel(watchedValuesForSummary[16])}</div>
                    <div><strong>{t("insuranceForm.step4.summaryOfCoverage.totalRiskZoneDays")}</strong> {calculatedTotalRiskZoneDays ?? "N/A"}</div>
                    <div><strong>{t("insuranceForm.step4.summaryOfCoverage.riskZoneBreakdown")}</strong></div>
                    {/* <ul className="list-disc list-inside pl-4">
                      <li>{t("insuranceForm.step4.summaryOfCoverage.zone.green")}: {watch("green_zone_days") || 0}</li>
                      <li>{t("insuranceForm.step4.summaryOfCoverage.zone.amber")}: {watch("amber_zone_days") || 0}</li>
                      <li>{t("insuranceForm.step4.summaryOfCoverage.zone.red")}: {watch("red_zone_days") || 0} </li>
                      {Number(watch("black_zone_days") || 0) > 0 && <li>{t("insuranceForm.step4.summaryOfCoverage.zone.black")}: {watch("black_zone_days")}</li>}
                    </ul> */}
                    <div className="pl-4">
                      <div className="flex justify-between">
                        <span>{t("insuranceForm.step4.summaryOfCoverage.zone.green")}:</span>
                        <span>{watch("green_zone_days") || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("insuranceForm.step4.summaryOfCoverage.zone.amber")}:</span>
                        <span>{watch("amber_zone_days") || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("insuranceForm.step4.summaryOfCoverage.zone.red")}:</span>
                        <span>{watch("red_zone_days") || 0}</span>
                      </div>
                      {Number(watch("black_zone_days") || 0) > 0 && (
                        <div className="flex justify-between">
                          <span>{t("insuranceForm.step4.summaryOfCoverage.zone.black")}:</span>
                          <span>{watch("black_zone_days")}</span>
                        </div>
                      )}
                    </div>
                    {/* <div><strong>{t("insuranceForm.step4.summaryOfCoverage.coverageSelected")}</strong></div>
                    <ul className="list-disc list-inside pl-4">
                      <li>{t("insuranceForm.step4.summaryOfCoverage.coverage.medical")}: {getEmergencyMedicalLabel(watch("emergency_medical_coverage"))} {quoteResult?.data ? `(${formatEuro(quoteResult.data.medicalCoverAmount)})` : ''}</li>
                      <li>{t("insuranceForm.step4.summaryOfCoverage.coverage.pa")}: {getPALabel(watch("personal_accident_coverage_level"))} {quoteResult?.data ? `(${formatEuro(quoteResult.data.paCoverAmount)})` : ''}</li>
                      <li>{t("insuranceForm.step4.summaryOfCoverage.coverage.transit")}: {watchedValuesForSummary[4] ? t("insuranceForm.yes250k") : t("insuranceForm.no")}</li>
                    </ul> */}
                    {/* <div className="mt-4 pt-3 border-t"><strong className="text-xl">{t("insuranceForm.step4.summaryOfCoverage.totalQuote")}:</strong><span className="text-xl font-bold text-[#00BBD3] ml-2">{renderQuoteDisplay()}</span></div> */}
                    <div>
                      <strong>Coverage Selected (per traveller):</strong>
                      <div className="pl-4">
                        {getTravellerBreakdown().map((trav, idx) => (
                          <div key={idx} className="mb-4">
                            <div className="flex justify-between font-semibold">
                              <span>{trav.name || `Traveller ${idx + 1}`}</span>
                              <span></span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t("insuranceForm.step4.summaryOfCoverage.coverage.medical")}:</span>
                              <span>{formatEuro(trav.medical)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t("insuranceForm.step4.summaryOfCoverage.coverage.pa")}:</span>
                              <span>{formatEuro(trav.pa)}</span>
                            </div>
                            {trav.transit > 0 && (
                              <div className="flex justify-between">
                                <span>{t("insuranceForm.step4.summaryOfCoverage.coverage.transit")}:</span>
                                <span>{formatEuro(trav.transit)}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Show VAT if applicable */}
                    {(() => {
                      const vat = getVatInfo();
                      if (vat && quoteResult?.data) {
                        const vatAmount = quoteResult.data.totalAmount * vat.rate;
                        return (
                          <div className="flex justify-between mt-2">
                            <strong>VAT ({vat.label}):</strong>
                            <span>{formatEuro(vatAmount)}</span>
                          </div>
                        );
                      }
                      return null;
                    })()}
                    {/* Show total and final total with VAT */}
                    <div className="mt-4 pt-3 border-t">
                      <div className="flex justify-between">
                        <strong className="text-xl">{t("insuranceForm.step4.summaryOfCoverage.totalQuote")}:</strong>
                        <span className="text-xl font-bold text-[#00BBD3]">
                          {formatEuro(quoteResult?.data?.totalAmount || 0)}
                        </span>
                      </div>
                      {(() => {
                        const vat = getVatInfo();
                        if (vat && quoteResult?.data) {
                          const vatAmount = quoteResult.data.totalAmount * vat.rate;
                          return (
                            <div className="flex justify-between mt-2">
                              <strong>Final Total:</strong>
                              <span className="font-bold text-[#00BBD3]">{formatEuro(quoteResult.data.totalAmount + vatAmount)}</span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                    <div className="text-red-600 font-semibold mb-2">
                      {t("insuranceForm.step4.summaryOfCoverage.note")}
                    </div>
                    {renderQuoteWarnings()}
                  </div>
                  <h3 className="text-xl font-semibold text-[#1A2C50] mb-3">{t("insuranceForm.step4.insuredDetails.title")}</h3>
                  {/* {watchedTravellersForSummary && watchedTravellersForSummary.map((traveller, index) => (<div key={`summary-traveller-${index}`} className="space-y-1 p-4 bg-gray-50 rounded-md border mb-3"><p className="font-semibold">{index === 0 ? t("insuranceForm.step4.insuredDetails.primaryTraveller") : `${t("insuranceForm.step4.insuredDetails.additionalTraveller")} ${index + 1}`}</p><div><strong>{t("insuranceForm.step4.insuredDetails.name")}:</strong> {formatFullName(traveller.first_name, traveller.last_name)}</div><div><strong>{t("insuranceForm.step4.insuredDetails.age")}:</strong> {calculateAge(traveller.birthdate) || "N/A"}</div><div><strong>{t("insuranceForm.step4.insuredDetails.nationality")}:</strong> {getNationalityLabel(traveller.nationality) || "N/A"}</div><div><strong>{t("insuranceForm.step1.email")}:</strong> {traveller.email || "N/A"}</div> */}
                  {/* <div><strong>{t("insuranceForm.step1.address")}:</strong> {`${traveller.address || "N/A"}, ${traveller.zip || "N/A"}`}</div></div>))} */}
                  {watchedTravellersForSummary && watchedTravellersForSummary.map((traveller, index) => (
                    <div key={`summary-traveller-${index}`} className="space-y-1 p-4 bg-gray-50 rounded-md border mb-3">
                      <p className="font-semibold">
                        {index === 0
                          ? t("insuranceForm.step4.insuredDetails.primaryTraveller")
                          : `${t("insuranceForm.step4.insuredDetails.additionalTraveller")} ${index + 1}`}
                      </p>
                      <div>
                        <strong>{t("insuranceForm.step4.insuredDetails.name")}:</strong> {formatFullName(traveller.first_name, traveller.last_name)}
                      </div>
                      <div>
                        <strong>{t("insuranceForm.step4.insuredDetails.age")}:</strong> {calculateAge(traveller.birthdate) || "N/A"}
                      </div>
                      <div>
                        <strong>{t("insuranceForm.step4.insuredDetails.nationality")}:</strong> {getNationalityLabel(traveller.nationality) || "N/A"}
                      </div>
                      <div>
                        <strong>{t("insuranceForm.step1.email")}:</strong> {traveller.email || "N/A"}
                      </div>
                      <div>
                        <strong>{t("insuranceForm.step1.address")}:</strong> {`${traveller.address || "N/A"}, ${traveller.zip || "N/A"}`}
                      </div>
                      <div className="mt-2">
                        <strong>{t("insuranceForm.step4.emergencyContact.title")}:</strong>
                        <div className="ml-2">
                          {index === 0 ? (
                            <>
                              <div>
                                <strong>{t("insuranceForm.step4.emergencyContact.name")}:</strong>{" "}
                                {formatFullName(watchedValuesForSummary[11], watchedValuesForSummary[12])}
                              </div>
                              <div>
                                <strong>{t("insuranceForm.step4.emergencyContact.number")}:</strong>{" "}
                                {watchedValuesForSummary[13] || "N/A"}
                              </div>
                              <div>
                                <strong>{t("insuranceForm.step4.emergencyContact.relationship")}:</strong>{" "}
                                {watchedValuesForSummary[14] || "N/A"}
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <strong>{t("insuranceForm.step4.emergencyContact.name")}:</strong>{" "}
                                {formatFullName(traveller.emergency_contact_first_name, traveller.emergency_contact_last_name) || "N/A"}
                              </div>
                              <div>
                                <strong>{t("insuranceForm.step4.emergencyContact.number")}:</strong>{" "}
                                {traveller.emergency_contact_phone || "N/A"}
                              </div>
                              <div>
                                <strong>{t("insuranceForm.step4.emergencyContact.relationship")}:</strong>{" "}
                                {traveller.emergency_contact_relation || "N/A"}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <h3 className="text-xl font-semibold text-[#1A2C50] mb-3">{t("insuranceForm.step4.tripInformation.title")}:</h3>
                  <div className="space-y-1 p-4 bg-gray-50 rounded-md border mb-6">
                    <div><strong>{t("insuranceForm.step4.tripInformation.purpose")}:</strong> {getTripPurposeLabel(watchedValuesForSummary[9])}</div>
                    <div><strong>{t("insuranceForm.step4.tripInformation.primaryRegions")}:</strong> {watchedValuesForSummary[10] || "N/A"}</div>
                    {watchedTripCitiesForSummary && watchedTripCitiesForSummary.filter(city => city.name && city.name.trim() !== "").length > 0 && (<div><strong>{t("insuranceForm.step4.tripInformation.citiesVisiting")}:</strong><ul className="list-disc list-inside pl-4">{watchedTripCitiesForSummary.filter(city => city.name && city.name.trim() !== "").map((city, idx) => <li key={`summary-city-${idx}`}>{city.name}</li>)}</ul></div>)}
                  </div>
                  <h3 className="text-xl font-semibold text-[#1A2C50] mb-3">{t("insuranceForm.step4.emergencyContact.title")}:</h3>
                  <div className="space-y-1 p-4 bg-gray-50 rounded-md border mb-6"><div><strong>{t("insuranceForm.step4.emergencyContact.name")}:</strong> {formatFullName(watchedValuesForSummary[11], watchedValuesForSummary[12])}</div><div><strong>{t("insuranceForm.step4.emergencyContact.number")}:</strong> {watchedValuesForSummary[13] || "N/A"}</div></div>
                  <div className="mb-6"><InputWithLabel label={t("insuranceForm.step4.affiliateCode.label")} name="affiliate_code" register={register} error={getError("affiliate_code")} /></div>
                  <div className="flex items-start space-x-3">
                    <Controller name="consent" control={control} render={({ field }) => (<Checkbox id="consent" checked={field.value === true} onCheckedChange={(checked) => field.onChange(checked === true ? true : undefined)} onBlur={field.onBlur} />)} />
                    <div className="grid gap-1.5 leading-none"><Label htmlFor="consent" className="font-medium leading-snug">{t("insuranceForm.step4.consent.label")}</Label>{getError("consent") && <p className="text-sm text-red-500">{getError("consent")?.message}</p>}</div>
                  </div>
                </>
              )}
              <div className="flex flex-col sm:flex-row justify-between pt-8 mt-8 border-t gap-4">
                {step > 0 && (<Button type="button" variant="outline" onClick={handlePrevStep} className="w-full sm:w-auto px-8 py-3 text-base">{t("insuranceForm.actions.back")}</Button>)}
                {step === 0 && (<Button type="button" variant="outline" onClick={() => { alert(t("insuranceForm.actions.modifyChoicesAlert")) }} className="w-full sm:w-auto px-8 py-3 text-base">{t("insuranceForm.actions.modifyChoices")}</Button>)}
                {(step > 0 && step < steps.length - 1) && <div className="sm:flex-grow hidden sm:block"></div>}
                {/* {step < steps.length - 1 && (<Button type="button" onClick={handleNextOrContinue} className="w-full sm:w-auto px-8 py-3 text-base bg-[#1A2C50] hover:bg-[#2c3e6b] text-white">{t("insuranceForm.actions.continue")}</Button>)} */}
                {step < steps.length - 1 && (
                  <Button
                    type="button"
                    onClick={handleNextOrContinue}
                    className="w-full sm:w-auto px-8 py-3 text-base bg-[#1A2C50] hover:bg-[#2c3e6b] text-white"
                    disabled={step === 1 && ageLimitExceeded}
                  >
                    {t("insuranceForm.actions.continue")}
                  </Button>
                )}
                {step === steps.length - 1 && (<Button type="submit" className="w-full sm:w-auto px-8 py-3 text-base bg-green-600 hover:bg-green-700 text-white" disabled={formState.isSubmitting || !quoteResult?.ok || !quoteResult?.data || quoteResult.data.totalAmount <= 0}>{formState.isSubmitting ? t("insuranceForm.actions.processing") : t("insuranceForm.actions.confirm")}</Button>)}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}