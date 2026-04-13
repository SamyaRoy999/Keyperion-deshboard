"use client";
import Form from "@/components/reuseable/from";
import { FromInput } from "@/components/reuseable/form-input";
import { Button } from "@/components/ui/button";
import { FieldValues, useForm } from "react-hook-form";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { passwordChangeSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";
import { useResetPasswordMutation } from "@/redux/apiSlices/authApiSlices";

function NewPasswordChild() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const from = useForm({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      new_password: "",
      c_password: "",
    },
  });

  const handleSubmit = async (values: FieldValues) => {
    try {
      await resetPassword({
        email,
        otp,
        password: values.new_password,
        password_confirmation: values.c_password,
      }).unwrap();

      toast.success("Password Updated", {
        description: "Your password has been reset successfully",
      });
      router.push("/");
    } catch (error: any) {
      toast.error("Failed", {
        description: error?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative z-10">
      <div className="mb-6">
        <Image alt={"Logo"} src="/Image/Logo.png" width={200} height={42} />
      </div>
      <div className="md:m-0 w-11/12 lg:w-0 lg:min-w-lg border px-16 py-24 rounded-2xl bg-white">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-bold text-center mb-3">
            Set a new password
          </h1>
          <h4 className="text-center">
            Create a new password. Ensure it differs from previous ones for
            security
          </h4>
        </div>
        <Form className="space-y-4 py-7" from={from} onSubmit={handleSubmit}>
          <FromInput
            className="h-10"
            name="new_password"
            label="New Password"
            placeholder="**********"
            eye={true}
          />
          <FromInput
            className="h-10"
            name="c_password"
            label="Confirm Password"
            placeholder="**********"
            eye={true}
          />
          <div className="w-full flex justify-center items-center mx-auto">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default function NewPassword() {
  return (
    <Suspense>
      <NewPasswordChild />
    </Suspense>
  );
}
