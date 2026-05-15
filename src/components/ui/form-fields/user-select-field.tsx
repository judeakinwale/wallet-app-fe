/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { ChevronDownIcon, CheckIcon, RefreshCw } from "lucide-react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useGetItems } from "@/hooks";
import { cn } from "@/lib/utils";
import type { User } from "@/types/user";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";

type UserSelectFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  getValue?: (user: User) => unknown;
};

function UserSelectField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder = "Search for a user...",
  required,
  disabled,
  className,
  getValue = (user) => user.id,
}: UserSelectFieldProps<TFieldValues>) {
  const { user } = useAuth();
  const userId = user?.id;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    if (query.length < 3 && debouncedQuery !== "") {
      return setDebouncedQuery("");
    }
    if (query.length < 3) return;

    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const { data: users, isLoading } = useGetItems<User>(
    `/user/search?query=${debouncedQuery}`,
    undefined,
    { enabled: debouncedQuery.length >= 3 },
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedUser = users?.find((u) => getValue(u) === field.value);
        console.log({ selectedUser, fieldValue: field.value });

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
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                disabled={disabled}
                aria-invalid={!!fieldState.error}
                aria-required={required}
                className={cn(
                  "flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm whitespace-nowrap transition-colors outline-none select-none",
                  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
                  "dark:bg-input/30",
                  !selectedUser && "text-muted-foreground",
                )}
              >
                {selectedUser ? selectedUser.name : placeholder}
                <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
              </PopoverTrigger>
              <PopoverContent align="start" className="w-72 p-2">
                <Input
                  placeholder="Search users..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
                <div className="mt-1 max-h-48 overflow-y-auto">
                  {query.length < 3 ? (
                    <p className="py-2 text-center text-xs text-muted-foreground">
                      Type at least 3 characters to search
                    </p>
                  ) : isLoading ? (
                    <p className="flex items-center justify-center py-2 text-center text-xs text-muted-foreground">
                      {/* Loading... */}
                      <RefreshCw className="animate-spin" />
                    </p>
                  ) : !users?.length ? (
                    <p className="py-2 text-center text-xs text-muted-foreground">
                      No users found
                    </p>
                  ) : (
                    users.map((user) => {
                      if (userId && user?.id === userId) return;

                      return (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => {
                            field.onChange(getValue(user));
                            setOpen(false);
                            // setQuery(""); // this breaks viewing the selected user after selection
                          }}
                          className={cn(
                            "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                            field.value === getValue(user) &&
                              "bg-accent font-medium border border-primary/30",
                          )}
                        >
                          <span className="truncate">{user.name}</span>
                          <span className="flex items-center gap-2">
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {user.email}
                            </span>
                            {field.value === getValue(user) && (
                              <CheckIcon className="size-3.5 shrink-0" />
                            )}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
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

export { UserSelectField };
