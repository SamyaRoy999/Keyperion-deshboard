"use client";
import Form from "@/components/reuseable/from";
import { FromInput } from "@/components/reuseable/form-input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { loginSchema } from "@/schema";
import Image from "next/image";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/redux/apiSlices/authApiSlices";

export default function VerifyOtp() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const from = useForm({
    resolver: zodResolver(loginSchema.partial()),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: FieldValues) => {
    try {
      const res = await forgotPassword({ email: values.email }).unwrap();
      console.log(res);

      toast.success("OTP Sent", {
        description: "Please check your email for the OTP",
      });
      router.push(`/verify-otp?email=${values.email}`);
    } catch (error: any) {
      toast.error("Failed", {
        description: error?.data?.message || "Something went wrong",
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
          <h1 className="text-2xl font-bold text-center">Forgot password ?</h1>
        </div>
        <Form className="space-y-4 pt-7" from={from} onSubmit={handleSubmit}>
          <FromInput
            className="h-10"
            label="Email"
            name="email"
            placeholder="example@gmail.com"
          />
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </Form>
      </div>
    </div>
  );
}
