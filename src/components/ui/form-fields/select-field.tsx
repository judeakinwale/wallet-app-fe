"use client"

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form"

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

type SelectFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  options: SelectOption[]
  label?: string
  description?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

function SelectField<TFieldValues extends FieldValues>({
  control,
  name,
  options,
  label,
  description,
  placeholder = "Select an option",
  required,
  disabled,
  className,
}: SelectFieldProps<TFieldValues>) {
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
          <Select
            value={field.value ?? ""}
            onValueChange={(value) => field.onChange(value)}
            disabled={disabled}
          >
            <SelectTrigger
              className="w-full"
              aria-invalid={!!fieldState.error}
              aria-required={required}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  )
}

export { SelectField, type SelectOption }
