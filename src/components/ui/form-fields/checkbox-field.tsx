"use client"

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"

type CheckboxFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  description?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

function CheckboxField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  required,
  disabled,
  className,
}: CheckboxFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          orientation="horizontal"
          data-invalid={fieldState.error ? true : undefined}
          data-disabled={disabled ? true : undefined}
          className={className}
        >
          <Checkbox
            checked={!!field.value}
            onCheckedChange={(checked) => field.onChange(checked)}
            disabled={disabled}
            aria-invalid={!!fieldState.error}
            aria-required={required}
            ref={field.ref}
          />
          <FieldContent>
            <FieldLabel>
              {label}
              {required && <span className="text-destructive"> *</span>}
            </FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
            <FieldError errors={[fieldState.error]} />
          </FieldContent>
        </Field>
      )}
    />
  )
}

export { CheckboxField }
