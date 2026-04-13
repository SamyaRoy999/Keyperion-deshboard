"use client";
import React from "react";
import { ImgBox } from "@/components/reuseable/Img-box";
import { Button } from "@/components/ui";
import Link from "next/link";


export default function Congratulations() {


  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative z-10">
      <div className="md:m-0 w-11/12 lg:w-0 lg:min-w-lg px-10 py-14 rounded-2xl bg-white">
        <div className="space-y-10">
          <ImgBox src="/logo.svg" alt="logo" className="size-23 mb-5 mx-auto" />
          <h1 className="text-2xl font-bold text-center">
            Congratulations
          </h1>
          <p className="text-center">
            Your password has been updated, please change your password regularly to avoid this happening
          </p>
          <Link href="/">
            <Button className="w-full">Done</Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
