"use client";

import Header from "@/components/common/dash/Header";
import {
  useGetProfileQuery,
  useUpdateProfileImageMutation,
  useUpdateProfileMutation,
} from "@/redux/apiSlices/deshboardApi/deshboardApiSlice";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const AccountSettings = () => {
  const [name, setName] = useState("");
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profileData, isLoading } = useGetProfileQuery(undefined);
  const [updateProfile] = useUpdateProfileMutation();
  const [updateProfileImage] = useUpdateProfileImageMutation();

  useEffect(() => {
    if (profileData?.data) {
      setName(profileData.data.name || "");
    }
  }, [profileData]);

  // সরাসরি API data অথবা local preview
  const displayImage = localPreview || profileData?.data?.img || null;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to API
    try {
      const formData = new FormData();
      formData.append("img", file);
      await updateProfileImage(formData).unwrap();
      toast.success("Profile image updated", {
        description: "Your profile image has been updated successfully",
      });
    } catch {
      toast.error("Failed to update image", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile({ name }).unwrap();
      toast.success("Profile updated", {
        description: "Your profile has been updated successfully",
      });
    } catch {
      toast.error("Failed to update profile", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }
  console.log(name, "name........", "ima", displayImage);

  return (
    <div className="min-h-screen p-6">
      <Header
        title="Settings"
        description="You can manage all the settings of your platform from here."
      />
      <div className="mx-auto border rounded-lg p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-8">
          Account settings
        </h2>

        <div className="flex flex-col items-center mb-8">
          <div className="relative w-28 h-28 mb-6">
            <div className="w-28 h-28 bg-black rounded-full flex items-center justify-center overflow-hidden">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <svg
                  className="w-12 h-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                </svg>
              )}
            </div>

            {/* Plus / Edit Button */}
            <button
              onClick={handleImageClick}
              className="absolute bottom-0 right-0 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center border-2 border-white hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* Name - Editable */}
          <div className="flex items-center bg-[#F6F6F6] gap-3 p-4 rounded-lg">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 border-none bg-transparent text-gray-900 font-medium outline-none"
              placeholder="Enter name"
            />
          </div>

          {/* Email - Read Only */}
          <div className="flex items-center gap-3 p-4 bg-[#F6F6F6] rounded-lg opacity-70">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <input
              type="email"
              value={profileData?.data?.email || ""}
              readOnly
              className="flex-1 border-none bg-transparent text-gray-500 font-medium outline-none cursor-not-allowed"
              placeholder="Email"
            />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSave}
            className="bg-gray-900 text-white px-6 py-2 rounded font-medium hover:bg-gray-800 transition-colors"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
