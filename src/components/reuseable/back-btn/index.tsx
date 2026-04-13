"use client";
import { cn } from "@/lib";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackBtn({ className, iconStyle }: any) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.back()}
      className={cn(
        `size-10 2xl:size-11 cursor-pointer grid place-items-center`,
        className
      )}
    >
      <ChevronLeft className={iconStyle} />
    </div>
  );
}

