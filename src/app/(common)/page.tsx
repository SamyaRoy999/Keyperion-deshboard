"use client";
import Form from "@/components/reuseable/from";
import { FromInput } from "@/components/reuseable/form-input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { loginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, Label } from "@/components/ui";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import Image from "next/image";
import { useLoginUserMutation } from "@/redux/apiSlices/authApiSlices";
import Cookies from "js-cookie";
import { authKey } from "@/lib/constants";

export default function HomePage() {
  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const from = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: FieldValues) => {
    try {
      const res = await loginUser({
        email: values.email,
        password: values.password,
      }).unwrap();

      const token = res?.data?.token;

      if (token) {
        Cookies.set(authKey, token, { expires: 7 });
      }

      toast.success("Login Successfully", {
        description: "You have successfully logged in",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast.error("Login Failed", {
        description: error?.data?.message || "Invalid credentials",
      });
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative z-10">
      <div className="mb-6">
        <Image
          alt={"change korte hobe"}
          src="/Image/Logo.png"
          width={200}
          height={42}
        />
      </div>
      <div className="md:m-0 w-11/12 lg:w-0 lg:min-w-lg border px-16 py-24 rounded-2xl bg-white">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl mb-6 font-bold text-center">
            Log in to your account
          </h1>
          <h4 className="text-center">
            Please enter your email and password to continue
          </h4>
        </div>
        <Form className="space-y-4 pt-7" from={from} onSubmit={handleSubmit}>
          <FromInput
            className="h-10"
            name="email"
            label="Email"
            placeholder="example@gmail.com"
          />
          <FromInput
            className="h-10"
            name="password"
            label="Password"
            placeholder="**********"
            eye={true}
          />
          <div className="flex items-center mt-3 justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Checkbox className="" id="remember-me" />
              <Label htmlFor="remember-me">Remember me</Label>
            </div>
            <Link
              href="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="w-full flex justify-center items-center mx-auto">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </Form>
      </div>
      <p className="text-sm mt-5">
        Copyright 2025 All rights reserved to Keyperion
      </p>
    </div>
  );
}
