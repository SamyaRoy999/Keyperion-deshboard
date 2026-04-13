"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui";
import FavIcon from "@/icon/favIcon";
import { cn } from "@/lib/utils";
import React, { createContext, useContext, useState, ReactNode } from "react";

/* =======================
   ✅ Types
======================= */
type ConfirmDialogOptions = Partial<
  Omit<ConfirmDialogState, "open" | "resolve">
>;

interface ConfirmDialogState {
  open: boolean;
  title: string;
  subTitle?: string;
  description: string;
  confirmText: string;
  cancelText: string;
  className?: string;
  titleStyle?: string;
  btnStyle?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  resolve?: (value: boolean) => void;
}

interface ConfirmDialogContextType {
  confirm: (options?: ConfirmDialogOptions) => Promise<boolean>;
}

interface ConfirmDialogProviderProps {
  children: ReactNode;
}

/* =======================
   ✅ Default State
======================= */
const initialDialogState: ConfirmDialogState = {
  open: false,
  title: "Are you sure to delete this video?",
  subTitle: "Delete Provider",
  description: "Users can't find your video anymore.",
  confirmText: "Delete",
  cancelText: "Cancel",
  className: "",
  titleStyle: "",
  btnStyle: "",
  onConfirm: undefined,
  onCancel: undefined,
  resolve: undefined,
};

/* =======================
   ✅ Context
======================= */
const ConfirmDialogContext = createContext<
  ConfirmDialogContextType | undefined
>(undefined);

/* =======================
   ✅ Provider
======================= */
export const ConfirmDialogProvider = ({
  children,
}: ConfirmDialogProviderProps) => {
  const [dialogState, setDialogState] =
    useState<ConfirmDialogState>(initialDialogState);

  // Main confirm function
  const confirm = (options: ConfirmDialogOptions = {}): Promise<boolean> => {
    const finalState = {
      ...initialDialogState, // fallback to defaults if any field missing
      ...options, // override with provided options
      open: true, // open the dialog
    };
    return new Promise((resolve) => {
      setDialogState({ ...finalState, resolve });
    });
  };

  // Handlers
  const handleConfirm = () => {
    dialogState.resolve?.(true);
    dialogState.onConfirm?.();
    closeDialog();
  };

  const handleCancel = () => {
    dialogState.resolve?.(false);
    dialogState.onCancel?.();
    closeDialog();
  };

  // ✅ Close without resetting content (prevents default flashing on exit)
  const closeDialog = () => {
    setDialogState((prev) => ({
      ...prev,
      open: false, // শুধু বন্ধ করা হবে
      resolve: undefined, // promise cleanup
      onConfirm: undefined,
      onCancel: undefined,
    }));
  };

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      <AlertDialog
        open={dialogState.open}
        onOpenChange={(open) => {
          if (!open) closeDialog(); // শুধু বন্ধ, reset নয়
        }}
      >
        <AlertDialogContent
          className={cn(
            "rounded-xl w-[420px] border-none modal-shadow1 px-3 py-10",
            dialogState?.className
          )}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>
              <ul>
                <li
                  className={cn(
                    "text-center text-reds text-2xl mb-2",
                    dialogState.titleStyle
                  )}
                >
                  {dialogState.title}
                </li>
              </ul>
            </AlertDialogTitle>

            {dialogState.description ? (
              <AlertDialogDescription className="text-center px-4 text-secondery-figma">
                {dialogState.description}
              </AlertDialogDescription>
            ) : null}
          </AlertDialogHeader>

          <AlertDialogFooter className="sm:justify-center space-x-5 mt-3">
            <AlertDialogCancel
              onClick={handleCancel}
              className={cn(
                "cursor-pointer border-none bg-figma-gray/10  rounded-xl py-5 px-8",
                dialogState?.btnStyle
              )}
            >
              {dialogState.cancelText}
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirm}
              className={cn(
                "cursor-pointer bg-primary rounded-xl py-5 px-8",
                dialogState?.btnStyle
              )}
            >
              {dialogState.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmDialogContext.Provider>
  );
};

/* =======================
   ✅ Hook
======================= */
export default function useConfirmation(): ConfirmDialogContextType {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error(
      "useConfirmation must be used within a ConfirmDialogProvider"
    );
  }
  return context;
}
