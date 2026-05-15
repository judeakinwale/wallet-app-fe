"use client"

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form"

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type InputFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label?: string
  description?: string
  placeholder?: string
  type?: React.HTMLInputTypeAttribute
  required?: boolean
  disabled?: boolean
  className?: string
}

function InputField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  type = "text",
  required,
  disabled,
  className,
}: InputFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
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
          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!fieldState.error}
            aria-required={required}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  )
}

export { InputField }
