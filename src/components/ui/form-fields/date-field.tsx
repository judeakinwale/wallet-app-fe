"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, ClockIcon } from "lucide-react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DateFieldMode = "date" | "datetime";

type DateFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  placeholder?: string;
  mode?: DateFieldMode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

function DateField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder = "Pick a date",
  mode = "date",
  required,
  disabled,
  className,
}: DateFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const dateValue =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (field.value as any) instanceof Date ? field.value : undefined;

        function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
          if (!dateValue) return;
          const [hours, minutes] = e.target.value.split(":").map(Number);
          const updated = new Date(dateValue);
          updated.setHours(hours ?? 0);
          updated.setMinutes(minutes ?? 0);
          field.onChange(updated);
        }

        return (
          <Field
            data-invalid={fieldState.error ? true : undefined}
            data-disabled={disabled ? true : undefined}
            className={className}
          >
            {label && (
              <FieldLabel>
                {label}
                {required && <span className="text-destructive"> *</span>}
              </FieldLabel>
            )}
            <Popover>
              <PopoverTrigger
                disabled={disabled}
                aria-invalid={!!fieldState.error}
                aria-required={required}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full justify-start text-left font-normal",
                  !dateValue && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="size-4 shrink-0" />
                {dateValue ? (
                  format(dateValue, mode === "datetime" ? "PPP HH:mm" : "PPP")
                ) : (
                  <span>{placeholder}</span>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateValue}
                  onSelect={(date) => {
                    if (!date) {
                      field.onChange(undefined);
                      return;
                    }
                    if (mode === "datetime" && dateValue) {
                      date.setHours((dateValue as Date).getHours());
                      date.setMinutes((dateValue as Date).getMinutes());
                    }
                    field.onChange(date);
                  }}
                  disabled={disabled}
                />
                {mode === "datetime" && (
                  <div className="flex items-center gap-2 border-t p-3">
                    <ClockIcon className="size-4 shrink-0 text-muted-foreground" />
                    <Input
                      type="time"
                      value={dateValue ? format(dateValue, "HH:mm") : ""}
                      onChange={handleTimeChange}
                      disabled={!dateValue || disabled}
                      className="h-7 w-full"
                    />
                  </div>
                )}
              </PopoverContent>
            </Popover>
            {description && <FieldDescription>{description}</FieldDescription>}
            <FieldError errors={[fieldState.error]} />
          </Field>
        );
      }}
    />
  );
}

export { DateField };
