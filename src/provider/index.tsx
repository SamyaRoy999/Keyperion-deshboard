"use client";
import { childrenProps } from "@/types";
import { ConfirmDialogProvider } from "../components/context/delete-modal";
import { Toaster } from "sonner";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";

export default function Provider({ children }: childrenProps) {
  return (
    <ReduxProvider store={store}>
      <ConfirmDialogProvider>
        {children}
        <Toaster
          toastOptions={{
            style: {
              background: "rgba(29, 29, 29, 0.20)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "white",
              backdropFilter: "blur(48px)",
            },
            classNames: {
              description: "!text-white",
              icon: "!text-green-800",
            },
          }}
          position="top-right"
        />
      </ConfirmDialogProvider>
    </ReduxProvider>
  );
}
