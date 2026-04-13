"use client";
import React from "react";
import NavItem from "./navitem";
import { adminLinks } from "./navdata";
import Avatars from "@/components/reuseable/avater";
import FavIcon from "@/icon/favIcon";
import Image from "next/image";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const links = adminLinks;
  return (
    <div className="flex">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`absolute left-0 top-0 z-20 bg-reds flex h-screen  transition-transform transform duration-300 bg-[#FFFFFF] ease-linear flex-col overflow-y-hidden  text-white w-[240px] lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-screen relative">
          <div className="flex items-center justify-center m-2 rounded-md py-8">
            <Image
              alt={"change korte hobe"}
              src="/Image/Logo.png"
              width={200}
              height={42}
            />
          </div>
          <div className="h-[calc(100vh-80px)] flex flex-col justify-between overflow-y-scroll scrollbar-hide">
            <nav>
              <NavItem item={links} />
            </nav>
            <div className="mx-2 mt-2 mb-6 flex px-2 py-1 rounded-md items-center justify-between bg-[#CDD9DA]">
              <div className="flex items-center gap-2">
                <Avatars
                  src=""
                  fallback="E"
                  className="size-10"
                  fallbackStyle="fallbackStyle"
                  alt="img"
                />
                Elena
              </div>
              <FavIcon className="size-5" name="signout" />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
