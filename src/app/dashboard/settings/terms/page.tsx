"use client";
import Heading from "@/components/reuseable/heading";
import TextEditor from "@/components/reuseable/text-editor";
import {
  useGetTermsConditionQuery,
  useUpdateTermsConditionMutation,
} from "@/redux/apiSlices/deshboardApi/deshboardApiSlice";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Terms() {
  const [content, setContent] = useState<string>("");

  // GET
  const { data, isLoading } = useGetTermsConditionQuery(undefined);

  // Mutation
  const [updateTermsCondition, { isLoading: isSaving }] =
    useUpdateTermsConditionMutation();
  useEffect(() => {
    if (data?.status && data?.data?.terms_condition) {
      setContent(data.data.terms_condition);
    }
  }, [data]);

  // Save handler
  const handleSave = async () => {
    try {
      const res = await updateTermsCondition({
        terms_condition: content,
      }).unwrap();

      if (res?.status) {
        toast.success("Terms & Conditions saved successfully!");
      } else {
        toast.error("Failed to save. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
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
      <div className="card">
        <Heading
          title="Terms & Conditions"
          text="Admin can edit terms & conditions"
        />
        <div className="pt-10 pb-5">
          <TextEditor value={content} onChange={setContent} />
        </div>
        <div className="flex justify-end pb-5">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 transition"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
