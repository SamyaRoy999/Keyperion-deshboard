import FavIcon from "@/icon/favIcon";
import { de } from "date-fns/locale";
import { Bell } from "lucide-react";
import Image from "next/image";
import React from "react";

interface HeaderProps {
  description: string;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-12 flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-card rounded-lg transition">
          <FavIcon name="bells" />
        </button>
        <div className="flex items-center gap-3">
          <div className="rounded-full flex items-center justify-center">
            <Image
              alt="asdf"
              src="/Image/Avater.jpg"
              height={45}
              className="rounded-full"
              width={45}
            />
          </div>
          <div className="text-right">
            <p className="font-semibold text-foreground">Md. Abid Hasan</p>
            <p className="text-sm text-muted-foreground">example@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
