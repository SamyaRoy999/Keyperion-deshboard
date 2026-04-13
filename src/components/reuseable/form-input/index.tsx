"use client";
import { useState } from "react";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type ControllerRenderProps,
  type ControllerFieldState,
} from "react-hook-form";
import { Input, Label } from "@/components/ui";
import { cn } from "@/lib/utils";

interface formInputProps {
  stylelabel?: string;
  name: string;
  type?: string;
  label?: string;
  eye?: boolean;
  placeholder?: string;
  className?: string;
  matching?: boolean;
  icon?: any;
  [key: string]: any;
}

export function FromInput({
  name,
  type = "text",
  eye = false,
  label,
  placeholder,
  stylelabel,
  className,
  icon,
  ...rest
}: formInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const { control } = useFormContext();
  const inputType = eye ? (isPasswordVisible ? "text" : "password") : type;

  const inputId = `input-${name}`;

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field,
        fieldState: { error },
      }: {
        field: ControllerRenderProps<FieldValues>;
        fieldState: ControllerFieldState;
      }) => (
        <div>
          <Label
            htmlFor={inputId}
            className={cn(
              "text-[#636363] text-base font-medium  mb-1",
              stylelabel,
            )}
          >
            {label}
          </Label>
          <div className="relative">
            <Input
              id={inputId}
              className={cn(
                `h-13 w-full    rounded-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                  icon ? "pl-10" : "pl-4"
                } ${eye ? "pr-10" : "pr-3"} text-blacks`,
                className,
              )}
              {...field}
              {...rest}
              type={inputType}
              placeholder={placeholder}
            />

            {icon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {icon}
              </div>
            )}
            {eye && (
              <div
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
              >
                {isPasswordVisible ? (
                  <EyeOff className="text-muted-foreground" size={20} />
                ) : (
                  <Eye className="text-muted-foreground" size={20} />
                )}
              </div>
            )}
          </div>
          {error?.message && (
            <h3 className="text-sm pt-[1px] text-end text-red-400 flex gap-1 items-center justify-end">
              {error.message}
              <CircleAlert size={14} />
            </h3>
          )}
        </div>
      )}
    />
  );
}
