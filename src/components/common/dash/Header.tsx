import FavIcon from "@/icon/favIcon";
import { useGetProfileQuery } from "@/redux/apiSlices/deshboardApi/deshboardApiSlice";
import Image from "next/image";
import React from "react";

interface HeaderProps {
  description: string;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title, description }) => {
  const { data: profileData } = useGetProfileQuery(undefined);

  const user = profileData?.data;
  const userName = user?.name ?? "User";
  const userEmail = user?.email ?? "";
  const userImg = user?.img ?? "/Image/Avater.jpg";

  return (
    <div className="mb-12 flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-card rounded-lg transition"></button>
        <div className="flex items-center gap-3 p-2">
          <div className="h-[45px] w-[45px] flex-shrink-0 overflow-hidden rounded-full border-2 border-black">
            <img
              alt={userName}
              src={userImg}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="text-left">
            <p className="font-semibold text-foreground leading-tight">
              {userName}
            </p>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
