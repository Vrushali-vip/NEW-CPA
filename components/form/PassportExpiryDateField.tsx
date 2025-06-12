"use client";

import { useController, Control, FieldValues, Path, UseFormWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import ShadcnDatePicker from "../shadcn-date-picker"; // Assuming this path is correct
import { Label } from "@/components/ui/label";

const parseDateStringForPicker = (dateString: string | undefined | null): Date | undefined => {
  if (!dateString) return undefined;
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
       const date = new Date(year, month, day);
       if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
        return date;
       }
    }
  }
  return undefined;
};

const formatDateToStringForRHF = (date: Date | undefined | null): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

type PassportExpiryDateFieldProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  getError: (field: Path<TFieldValues>) => { message?: string } | undefined; // This is the prop
  watch: UseFormWatch<TFieldValues>;
  label?: string;
  minDate?: Date;
};

const PassportExpiryDateField = <TFieldValues extends FieldValues>({
  name,
  control,
  getError,
  label = "Passport Expiry Date",
  minDate,
}: PassportExpiryDateFieldProps<TFieldValues>) => { // Direct destructuring
  const {
    field: { value: rhfValue, onChange: rhfOnChange, onBlur: rhfOnBlur },
    fieldState: { error: rhfError }
  } = useController({
    name,
    control,
  });

  const getDefaultPickerDate = (): Date => {
    const today = new Date();
    return new Date(today.getFullYear() + 5, today.getMonth(), today.getDate());
  };

  const [pickerDate, setPickerDate] = useState<Date>(() => {
    const parsedDate = parseDateStringForPicker(rhfValue as string);
    if (parsedDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if ((minDate && parsedDate < minDate) || (!minDate && parsedDate < today)) {
            return getDefaultPickerDate();
        }
        return parsedDate;
    }
    return getDefaultPickerDate();
  });

  useEffect(() => {
    const newParsedRhfDate = parseDateStringForPicker(rhfValue as string);
    let dateToSetForPicker: Date;

    if (newParsedRhfDate) {
      let isValidFutureDate = true;
      const today = new Date();
      today.setHours(0,0,0,0);

      if (minDate && newParsedRhfDate < minDate) {
        isValidFutureDate = false;
      } else if (!minDate && newParsedRhfDate < today) {
        isValidFutureDate = false;
      }

      if (isValidFutureDate) {
        dateToSetForPicker = newParsedRhfDate;
      } else {
        dateToSetForPicker = getDefaultPickerDate();
      }
    } else {
      dateToSetForPicker = getDefaultPickerDate();
    }
    
    if (formatDateToStringForRHF(dateToSetForPicker) !== formatDateToStringForRHF(pickerDate)) {
      setPickerDate(dateToSetForPicker);
    }
  }, [rhfValue, pickerDate, minDate]);

  const handleDateSelect = (selectedDateFromPicker: Date | undefined) => {
    if (selectedDateFromPicker) {
      if (minDate && selectedDateFromPicker < minDate) {
        setPickerDate(selectedDateFromPicker);
        rhfOnChange(formatDateToStringForRHF(selectedDateFromPicker));
      } else {
        setPickerDate(selectedDateFromPicker);
        rhfOnChange(formatDateToStringForRHF(selectedDateFromPicker));
      }
    } else {
      setPickerDate(getDefaultPickerDate());
      rhfOnChange("");
    }
    rhfOnBlur();
  };

  // Use the directly destructured getError prop
  const displayError = getError(name) || (rhfError ? { message: rhfError.message } : undefined);
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full">
      <Label htmlFor={name} className="block text-sm font-medium mb-1 mt-1.5">{label}</Label>
      <ShadcnDatePicker
        startYear={currentYear}
        endYear={currentYear + 15}
        selected={pickerDate}
        onSelect={handleDateSelect}
      />
      {displayError && (
        <p className="text-sm text-red-500 mt-1">{displayError?.message}</p>
      )}
    </div>
  );
};

export default PassportExpiryDateField;