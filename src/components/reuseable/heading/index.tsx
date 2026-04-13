import { cn } from "@/lib";
import React from "react";

interface HeadingProps {
  title: string;
  text?: string;
  titleStyle?: string;
  textStyle?: string;
  className?: string;
}

export default function Heading({
  title,
  text,
  titleStyle,
  textStyle,
  className,
}: HeadingProps) {
  return (
    <div className={className}>
      <h2 className={cn(`font-semibold`, titleStyle)}>{title}</h2>
      {text && <h4 className={cn(`text-sm`, textStyle)}>{text}</h4>}
    </div>
  );
}
