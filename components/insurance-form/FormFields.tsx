"use client";

import React from "react";
import { UseFormRegister, FieldError, Control, Controller, Path, FieldValues } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIconLucide } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { cn } from "@/lib/utils";

interface InputWithLabelProps<TFieldValues extends FieldValues = FieldValues> { 
  label: string;
  name: Path<TFieldValues> | string;
  register?: UseFormRegister<TFieldValues>;
  type?: string;
  error?: FieldError | { root?: { message?: string } };
  readOnly?: boolean;
  value?: string | number;
  placeholder?: string;
}
export function InputWithLabel<TFieldValues extends FieldValues = FieldValues>({
  label,
  name,
  register,
  type = "text",
  error,
  readOnly,
  value,
  placeholder,
}: InputWithLabelProps<TFieldValues>) {
  const errorMessage = error && ('message' in error ? error.message : (typeof error === 'object' && error !== null && 'root' in error && (error as { root?: { message?: string } })?.root?.message));
  const inputBaseProps: React.InputHTMLAttributes<HTMLInputElement> & { id: string; name: string } = {
    id: name as string,
    name: name as string,
    type: type,
    placeholder: placeholder,
    className: cn(
        errorMessage ? "border-red-500 focus-visible:ring-red-500" : "border-input",
        type !== "date" && type !== "checkbox" ? "rounded-none" : "",
        readOnly ? "bg-slate-100 text-slate-700 cursor-not-allowed focus:ring-0 focus:ring-offset-0 focus:border-input" : ""
    ),
  };
  let registrationProps = {};
  if (readOnly) {
    inputBaseProps.value = value !== undefined ? String(value) : "";
    inputBaseProps.readOnly = true;
  } else if (register) {
    registrationProps = register(name as Path<TFieldValues>, { 
      setValueAs: (val: unknown) => {
        if (type === "number" && val !== "" && !isNaN(Number(val))) {
          return Number(val);
        } else if (val === "" && type === "number") {
          return null; 
        }
        return val;
      }
    });
  } else { 
    inputBaseProps.value = value !== undefined ? String(value) : "";
  }
  return (
    <div className="space-y-1">
      {label && <Label htmlFor={name as string}>{label}</Label>}
      <Input {...inputBaseProps} {...registrationProps} />
      {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage as string}</p>}
    </div>
  );
}


interface DatePickerFieldProps<TFieldValues extends FieldValues = FieldValues> {
  label: string;
  name: Path<TFieldValues> | string;
  control: Control<TFieldValues>;
  error?: FieldError;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDate?: (date: Date) => boolean;
}
export function DatePickerField<TFieldValues extends FieldValues = FieldValues>({
  label,
  name,
  control,
  error,
  placeholder = "Pick a date",
  minDate,
  maxDate,
  disabledDate
}: DatePickerFieldProps<TFieldValues>) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  return (
    <div className="space-y-1">
      <Label htmlFor={name as string}>{label}</Label>
      <Controller
        name={name as Path<TFieldValues>}
        control={control}
        render={({ field, fieldState }) => {
          const currentFieldError = fieldState.error || error;
          let selectedDateForCalendar: Date | undefined = undefined;
          let buttonDisplayText: React.ReactNode = <span>{placeholder}</span>;

          if (field.value && typeof field.value === 'string') {
            const dateObj = new Date(field.value + "T00:00:00");
            if (!isNaN(dateObj.getTime())) {
              selectedDateForCalendar = dateObj;
              try {
                buttonDisplayText = format(dateObj, "PPP");
              } catch (e) {
                console.error("DatePickerField: Error formatting date", name, field.value, e);
                buttonDisplayText = <span>Invalid Date</span>;
              }
            } else {
               console.warn("DatePickerField: Invalid date string from RHF", name, field.value);
            }
          }

          return (
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  id={name as string}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground",
                    "rounded-none",
                    currentFieldError ? "border-red-500 focus-visible:ring-red-500" : "border-input"
                  )}
                  onClick={() => setIsPopoverOpen(true)}
                >
                  <CalendarIconLucide className="mr-2 h-4 w-4" />
                  {buttonDisplayText}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDateForCalendar}
                  onSelect={(date) => {
                    field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                    setIsPopoverOpen(false);
                  }}
                  initialFocus
                  fromDate={minDate}
                  toDate={maxDate}
                  disabled={disabledDate}
                  classNames={{
                    day_selected: cn(
                      "!bg-[#00BBD3] !text-white",
                      "hover:!bg-[#00BBD3] hover:!text-white",
                      "focus:!bg-[#00BBD3] focus:!text-white"
                    ),
                    day_today: cn(
                      "aria-selected:!text-white",
                      "!text-[#00BBD3]"
                    ),
                  }}
                />
              </PopoverContent>
            </Popover>
          );
        }}
      />
      {(error || control.getFieldState(name as Path<TFieldValues>).error) &&
        <p className="text-red-500 text-sm mt-1">{(control.getFieldState(name as Path<TFieldValues>).error?.message || error?.message )}</p>
      }
    </div>
  );
}


interface TextareaWithLabelProps<TFieldValues extends FieldValues = FieldValues> {
  label: string;
  name: Path<TFieldValues> | string;
  register: UseFormRegister<TFieldValues>;
  error?: FieldError;
}
export function TextareaWithLabel<TFieldValues extends FieldValues = FieldValues>({ 
    label, name, register, error 
}: TextareaWithLabelProps<TFieldValues>) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name as string}>{label}</Label>
      <Textarea id={name as string} {...register(name as Path<TFieldValues>)}
        className={cn(
            error ? "border-red-500 focus-visible:ring-red-500" : "border-input",
            "rounded-none"
        )}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

type ExtendedFieldError = FieldError | {
  message?: string;
  root?: { message?: string };
};

interface ControlledTextareaArrayProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues> | string;
  label: string;
  error?: ExtendedFieldError;
}
export function ControlledTextareaArray<TFieldValues extends FieldValues = FieldValues>({ 
    control, name, label, error 
}: ControlledTextareaArrayProps<TFieldValues>) {
    const errorMessage = error && (
      'message' in error
        ? error.message
        : (typeof error === 'object' && error !== null && 'root' in error && (error as { root?: { message?: string } })?.root?.message)
    );

    return (
    <div className="space-y-1">
      <Label htmlFor={name as string}>{label}</Label>
      <Controller
        name={name as Path<TFieldValues>}
        control={control}
        render={({ field }) => (
          <Textarea
            id={name as string}
            value={Array.isArray(field.value) ? field.value.join(', ') : (field.value || '')}
            onChange={(e) => {
              const val = e.target.value;
              const arr = val === "" ? [] : val.split(',').map(s => s.trim()).filter(s => s !== "");
              field.onChange(arr);
            }}
            onBlur={field.onBlur}
            className={cn(
                errorMessage ? "border-red-500 focus-visible:ring-red-500" : "border-input",
                "rounded-none"
            )}
          />
        )}
      />
      {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage as string}</p>}
    </div>
  );
}

interface SelectWithLabelProps<TFieldValues extends FieldValues = FieldValues> {
    control: Control<TFieldValues>;
    name: Path<TFieldValues> | string;
    label: string;
    options: { value: string; label: string; disabled?: boolean }[];
    placeholder?: string;
    error?: FieldError;
    readOnly?: boolean;
}
export function SelectWithLabel<TFieldValues extends FieldValues = FieldValues>({ 
    control, name, label, options, placeholder, error 
}: SelectWithLabelProps<TFieldValues>) {
    const triggerTextColorClassOnError = "text-slate-900 data-[placeholder]:text-slate-400";
    const triggerTextColorClassNormal = "text-slate-700 data-[placeholder]:text-slate-500";
    return (
        <div className="space-y-1">
            {label && <Label htmlFor={name as string}>{label}</Label>}
            <Controller
                name={name as Path<TFieldValues>}
                control={control}
                render={({ field, fieldState }) => ( 
                    <Select
                        onValueChange={field.onChange}
                        value={field.value as string || ""}
                        name={field.name}
                    >
                        <SelectTrigger
                            id={name as string}
                            className={cn(
                                "rounded-none",
                                "w-full",
                                "border",
                                "bg-white",
                                (fieldState.error || error)
                                  ? `border-red-500 ${triggerTextColorClassOnError} focus-visible:ring-red-500`
                                  : `border-input ${triggerTextColorClassNormal}`
                            )}
                        >
                            <SelectValue placeholder={placeholder || `Select ${label ? label.toLowerCase() : '...'}`} />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border border-input">
                            {/* {options.map(option => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className={cn(
                                        "data-[highlighted]:bg-[#00BBD3] data-[highlighted]:text-white",
                                        "focus:bg-[#00BBD3] focus:text-white"
                                    )}
                                >
                                    {option.label}
                                </SelectItem>
                            ))} */}
                            {options.map(option => (
  <SelectItem
    key={option.value}
    value={option.value}
    disabled={option.disabled}
    className={cn(
      "data-[highlighted]:bg-[#00BBD3] data-[highlighted]:text-white",
      "focus:bg-[#00BBD3] focus:text-white"
    )}
  >
    {option.label}
  </SelectItem>
))}

                        </SelectContent>
                    </Select>
                )}
            />
            {(error || control.getFieldState(name as Path<TFieldValues>).error) &&
              <p className="text-red-500 text-sm mt-1">{(error?.message || control.getFieldState(name as Path<TFieldValues>).error?.message )}</p>
            }
        </div>
    );
}