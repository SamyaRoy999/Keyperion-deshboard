import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  title: string;
  titleStyle?: string;
  mainStyle?: string;
  style?: string;
}

export default function Modal({
  open,
  setIsOpen,
  children,
  className,
  title,
  titleStyle,
  mainStyle,
  style,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild />
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        overlyStyle={`${style} transition-opacity duration-200`}
        className={cn(
          "sm:max-w-md p-0 gap-0  modal-shadow1 rounded-2xl overflow-y-auto  max-h-[95vh] h-fit scrollbar-hide border-none",
          className
        )}
      >
        <DialogHeader className="bg-white *:text-primary1 p-4">
          <DialogTitle className={cn("font-semibold", titleStyle)}>
            {title}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden"></DialogDescription>
        <div className={cn("p-4", mainStyle)}>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
