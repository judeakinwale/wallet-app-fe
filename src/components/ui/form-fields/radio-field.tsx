"use client"

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form"

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldSet, FieldLegend } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type RadioOption = {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

type RadioFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  options: RadioOption[]
  label?: string
  description?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

function RadioField<TFieldValues extends FieldValues>({
  control,
  name,
  options,
  label,
  description,
  required,
  disabled,
  className,
}: RadioFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldSet className={className}>
          {label && (
            <FieldLegend>
              {label}
              {required && <span className="text-destructive"> *</span>}
            </FieldLegend>
          )}
          {description && <FieldDescription>{description}</FieldDescription>}
          <RadioGroup
            value={field.value ?? ""}
            onValueChange={(value) => field.onChange(value)}
            aria-invalid={!!fieldState.error}
            aria-required={required}
            disabled={disabled}
          >
            {options.map((option) => (
              <Field key={option.value} orientation="horizontal">
                <RadioGroupItem
                  value={option.value}
                  disabled={disabled ?? option.disabled}
                  aria-invalid={!!fieldState.error}
                />
                <FieldContent>
                  <FieldLabel>{option.label}</FieldLabel>
                  {option.description && (
                    <FieldDescription>{option.description}</FieldDescription>
                  )}
                </FieldContent>
              </Field>
            ))}
          </RadioGroup>
          <FieldError errors={[fieldState.error]} />
        </FieldSet>
      )}
    />
  )
}

export { RadioField, type RadioOption }
