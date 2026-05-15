"use client"

import * as React from "react"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) throw new Error("useFormField must be used within <FormField>")

  return {
    name: fieldContext.name,
    ...fieldState,
  }
}

function FormItem({ className, ...props }: React.ComponentProps<typeof Field>) {
  return (
    <Field
      data-slot="form-item"
      className={cn("gap-1.5", className)}
      {...props}
    />
  )
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof FieldLabel>) {
  const { error } = useFormField()
  return (
    <FieldLabel
      data-slot="form-label"
      className={cn(error && "text-destructive", className)}
      {...props}
    />
  )
}

function FormDescription({ ...props }: React.ComponentProps<typeof FieldDescription>) {
  return <FieldDescription data-slot="form-description" {...props} />
}

function FormMessage({ children, ...props }: React.ComponentProps<typeof FieldError>) {
  const { error } = useFormField()
  return (
    <FieldError
      data-slot="form-message"
      errors={error ? [error] : undefined}
      {...props}
    >
      {!error ? children : undefined}
    </FieldError>
  )
}

export {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
}
