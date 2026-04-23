"use client";
import Header from "@/components/common/dash/Header";
import TextEditor from "@/components/reuseable/text-editor";
import {
  useGetAboutUsQuery,
  useUpdateAboutUsMutation,
} from "@/redux/apiSlices/deshboardApi/deshboardApiSlice";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

interface AboutUsItem {
  id: number;
  about_us: string;
  type: string | null;
}

const sections = [
  { label: "About us for tenants", type: "user" },
  { label: "About us for landlords", type: "owner" },
  { label: "About us for managers", type: "manager" },
];

export default function AboutUs() {
  const [contents, setContents] = useState<Record<string, string>>({
    user: "",
    owner: "",
    manager: "",
  });
  const [savingType, setSavingType] = useState<string | null>(null);

  const { data, isLoading } = useGetAboutUsQuery(undefined);

  const [updateAboutUs] = useUpdateAboutUsMutation();

  useEffect(() => {
    if (data?.status && data?.data) {
      const updated: Record<string, string> = {
        user: "",
        owner: "",
        manager: "",
      };

      (data.data as AboutUsItem[]).forEach((item) => {
        if (item.type && item.type in updated) {
          updated[item.type] = item.about_us;
        }
      });

      setContents(updated);
    }
  }, [data]);

  // Save handler
  const handleSave = async (type: string) => {
    setSavingType(type);
    try {
      const res = await updateAboutUs({
        about_us: contents[type],
        type,
      }).unwrap();

      if (res?.status) {
        toast.success("Saved successfully!");
      } else {
        toast.error("Failed to save. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setSavingType(null);
    }
  };

  if (isLoading) {
    return (
      <div className="wapper">
        <div className="card flex items-center justify-center py-20">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wapper">
      <Header
        title="Settings"
        description="You can manage all the settings of your platform from here."
      />
      <div className="card">
        {sections.map(({ label, type }) => (
          <div key={type} className="pt-10 pb-5">
            <p className="text-xl font-medium mb-5">{label}</p>
            <TextEditor
              value={contents[type]}
              onChange={(val) =>
                setContents((prev) => ({ ...prev, [type]: val }))
              }
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={() => handleSave(type)}
                disabled={savingType === type}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 transition"
              >
                {savingType === type ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
