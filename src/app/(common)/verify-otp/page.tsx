"use client";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui";
import React, {
  ChangeEvent,
  KeyboardEvent,
  Suspense,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useVerifyOtpMutation } from "@/redux/apiSlices/authApiSlices";

function ForgotPasswordChild() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [code, setCode] = useState<string[]>(Array(4).fill(""));
  const [error, setError] = useState<string>("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    const { value } = e.target;
    if (!/^\d?$/.test(value)) return;

    const updated = [...code];
    updated[i] = value;
    setCode(updated);

    if (value && i < 3) {
      inputRefs.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 4);
    if (!/^\d{4}$/.test(pastedData)) {
      setError("Please paste a 4-digit number.");
      return;
    }
    setError("");
    setCode(pastedData.split(""));
  };

  const handleVerify = async () => {
    setError("");
    const joinedCode = code.join("");
    if (joinedCode.length < 4) {
      setError("Please enter all 4 digits.");
      return;
    }

    try {
      await verifyOtp({ email, otp: joinedCode } as any).unwrap();
      toast.success("OTP Verified");
      router.push(`/new-password?email=${email}&otp=${joinedCode}`);
    } catch (err: any) {
      toast.error("Verification Failed", {
        description: err?.data?.message || "Invalid OTP",
      });
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative z-10">
      <div className="mb-6">
        <Image alt={"Logo"} src="/Image/Logo.png" width={200} height={42} />
      </div>
      <div className="md:m-0 w-11/12 lg:w-0 lg:min-w-lg border px-16 py-24 rounded-2xl bg-white">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-bold text-center">Verification code</h1>
          <h4 className="text-center">
            {`We have sent a verification code to ${email || ""}`}
          </h4>
        </div>
        <div className="flex justify-center space-x-3 mt-10">
          {code.map((digit, i) => (
            <Input
              key={i}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              className="w-12 h-12 text-center text-lg font-medium bg-figma-chart rounded-md"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}

        <div className="w-full flex my-10 justify-center items-center mx-auto">
          <Button onClick={handleVerify} disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-sm mt-2 text-center flex justify-center">
            You have not received the email?
            <span className="text-primary ml-2 cursor-pointer">Resend</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordParent() {
  return (
    <Suspense>
      <ForgotPasswordChild />
    </Suspense>
  );
}
