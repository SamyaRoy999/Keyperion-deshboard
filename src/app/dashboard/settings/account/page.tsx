"use client";

import Header from "@/components/common/dash/Header";
import React, { useState } from "react";

const AccountSettings = () => {
  const [formData, setFormData] = useState({
    name: "Admin",
    email: "admin@gmail.com",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saved:", formData);
  };

  return (
    <div className="min-h-screen  p-6">
      <Header
        title="Settings"
        description="You can manage all the settings of your platform from here."
      />
      <div className=" mx-auto border  rounded-lg p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-8">
          Account settings
        </h2>

        <div className="flex flex-col items-center mb-8">
          <div className="w-28 h-28 bg-black rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-12 h-12 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
            </svg>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center bg-[#F6F6F6] gap-3 p-4  rounded-lg">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="flex-1 border-none  text-gray-900 font-medium outline-none"
              placeholder="Enter name"
            />
          </div>

          <div className="flex items-center gap-3 p-4  bg-[#F6F6F6] rounded-lg">
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
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="flex-1 border-none text-gray-900 font-medium outline-none"
              placeholder="Enter email"
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
