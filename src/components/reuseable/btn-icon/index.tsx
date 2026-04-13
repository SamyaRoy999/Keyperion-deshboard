import { cn } from "@/lib";
import { XIcon } from "lucide-react";

interface CloseIconProps {
  className?: string;
  onClose: () => any;
}

// CloseIcon
export function CloseIcon({ className, onClose }: CloseIconProps) {
  return (
    <button
      className={cn("absolute  top-2 right-2", className)}
      onClick={onClose}
      type="button"
    >
      <XIcon className="size-6 opacity-80 cursor-pointer text-figma-red" />
    </button>
  );
}