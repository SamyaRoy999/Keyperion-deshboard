import FavIcon from "@/icon/favIcon";
import { Menu } from "lucide-react";
import Link from "next/link";


interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Navber({children}:any) {
  return (
    <div className="sticky top-0  bg-background flex w-full py-3 z-10">
      <header className="w-full px-3">
        <div className="flex justify-between items-center">
          {/* left side*/}
          <div className="flex gap-4 items-center  lg:hidden">
            <button
              aria-controls="sidebar"
              className="z-99999   border rounded-md border-stroke cursor-pointer  p-1.5"
            >
              <Menu className="cursor-pointer" size={20} />
            </button>

          </div>
          {children && children}
          {/* right side */}
          <div>
            <div className="flex mr-6 items-center gap-2">
              <Link href={"/dashboard/notification"}>
                <div className="relative cursor-pointer bg-reds text-green-900 size-11 2xl:size-12  grid place-items-center rounded-full">
                  {/* <Icon name="bell"/> */}
                  <FavIcon name="bell" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
