"use client";

import Header from "@/components/common/dash/Header";
import { useChangePasswordMutation } from "@/redux/apiSlices/deshboardApi/deshboardApiSlice";
import React, { useState } from "react";
import { toast } from "sonner";

const ChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match", {
        description: "New password and confirm password must be the same",
      });
      return;
    }

    try {
      await changePassword({
        current_password: formData.currentPassword,
        password: formData.newPassword,
        password_confirmation: formData.confirmPassword,
      }).unwrap();

      toast.success("Password updated successfully", {
        description: "Please login again with your new password",
      });

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error("Failed to update password", {
        description: error?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Header
        title="Settings"
        description="You can manage all the settings of your platform from here."
      />
      <div className="mx-auto bg-white rounded-lg p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-8">
          Change password
        </h2>

        <div className="space-y-4">
          {/* Current Password */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <svg
              className="w-5 h-5 text-gray-600 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="flex-1 border-none bg-gray-50 text-gray-900 font-medium outline-none"
              placeholder="Current Password"
            />
            <button
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="p-1 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* New Password */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <svg
              className="w-5 h-5 text-gray-600 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="flex-1 border-none bg-gray-50 text-gray-900 font-medium outline-none"
              placeholder="New Password"
            />
            <button
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="p-1 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Confirm New Password */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <svg
              className="w-5 h-5 text-gray-600 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="flex-1 border-none bg-gray-50 text-gray-900 font-medium outline-none"
              placeholder="Confirm New Password"
            />
            <button
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="p-1 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gray-900 text-white px-6 py-2 rounded font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
