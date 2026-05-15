"use client";

import React from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Input } from "./input";

type InputFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

function InputField<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  required,
  disabled,
  className,
  ...props
}: InputFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required && <span className="ml-0.5 text-destructive">*</span>}
          </FormLabel>
          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            value={field.value ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              if (type === "number") {
                field.onChange(val === "" ? "" : Number(val));
              } else {
                field.onChange(val);
              }
            }}
            max={props.max}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { InputField };
