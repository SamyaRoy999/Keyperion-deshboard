"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import FavIcon from "@/icon/favIcon";

interface SubmenuItem {
  to?: string;
  label: string;
  icon?: any;
}

interface MenuItem {
  to?: string;
  label: string;
  icon?: any;
  submenu?: SubmenuItem[];
}

interface NavItemProps {
  item: MenuItem[];
}

export default function NavIetm({ item }: NavItemProps) {
  const pathname = usePathname();
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [subhoverIdx, setsubHoverIdx] = useState<number | null>(null);

  const menuRefs = useRef<(HTMLUListElement | null)[]>([]);

  useEffect(() => {
    menuRefs.current.forEach((menu, index) => {
      if (menu) {
        menu.style.maxHeight =
          activeSubmenu === index ? `${menu.scrollHeight}px` : "0px";
      }
    });
  }, [activeSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setActiveSubmenu((prev) => (prev === index ? null : index));
  };

  return (
    <ul className="space-y-2 m-2">
      {item.map(({ to, label, icon, submenu }, parentIndex) => (
        <li key={parentIndex} className="group">
          {to ? (
            <Link
              onMouseEnter={() => setHoverIdx(parentIndex)}
              onMouseLeave={() => setHoverIdx(null)}
              className={`flex px-3 ${
                pathname === to && "!bg-[#F6F6F6] !text-primary"
              } hover:bg-[#F6F6F6]  rounded-md hover:!text-primary transition-all duration-200  font-medium   border-l-5 border-transparent  py-2 items-center  text-base gap-x-2 text-[#A8A8A8]`}
              href={to}
            >
              {icon && (
                <FavIcon
                  hoverColor="#202020"
                  groupHover={hoverIdx === parentIndex}
                  activeColor={pathname === to && ("#202020" as any)}
                  name={icon}
                />
              )}{" "}
              {label}
            </Link>
          ) : (
            <div
              onClick={() => handleSubmenuToggle(parentIndex)}
              className="flex items-center px-3 py-2 justify-between cursor-pointer"
            >
              <span className="flex items-center gap-x-2 text-[#A8A8A8] font-medium">
                {icon && <FavIcon name={icon} />} {label}
              </span>
              {activeSubmenu === parentIndex ? (
                <ChevronUp className="size-5 text-[#A8A8A8] font-extrabold" />
              ) : (
                <ChevronDown className="size-5 text-[#A8A8A8] font-extrabold" />
              )}
            </div>
          )}

          {submenu && (
            <ul
              ref={(el) => {
                menuRefs.current[parentIndex] = el;
              }}
              className="overflow-hidden transition-all duration-300 ease-out max-h-0 space-y-1"
            >
              {submenu.map(({ to, label, icon }, subIndex) => (
                <li
                  key={subIndex}
                  onMouseEnter={() => setsubHoverIdx(subIndex)}
                  onMouseLeave={() => setsubHoverIdx(null)}
                  className={`${
                    pathname === to && "!bg-[#F6F6F6] !text-primary"
                  } rounded-md pl-6 font-medium border-l-5 border-transparent text-[#A8A8A8]  py-2 hover:!bg-[#F6F6F6]`}
                >
                  {to && (
                    <Link className="flex items-center gap-x-2" href={to}>
                      {icon && (
                        <FavIcon
                          hoverColor="#176BB3"
                          groupHover={subhoverIdx === subIndex}
                          activeColor={pathname === to && ("#176BB3" as any)}
                          name={icon}
                        />
                      )}{" "}
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
