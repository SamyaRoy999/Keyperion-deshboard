"use client";
import NavItem from "./navitem";
import { adminLinks } from "./navdata";
import FavIcon from "@/icon/favIcon";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useGetProfileQuery,
  useLogoutMutation,
} from "@/redux/apiSlices/deshboardApi/deshboardApiSlice";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const links = adminLinks;
  const router = useRouter();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const { data: profileData, isLoading } = useGetProfileQuery(undefined);
  console.log(profileData);

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      toast.success("Logged out", {
        description: "You have been logged out successfully",
      });
      router.push("/");
    } catch (err: any) {
      toast.error("Failed", {
        description: err?.data?.message || "Something went wrong",
      });
    }
  };

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
        className={`absolute left-0 top-0 z-20 bg-reds flex h-screen transition-transform transform duration-300 bg-[#FFFFFF] ease-linear flex-col overflow-y-hidden text-white w-[240px] lg:static lg:translate-x-0 ${
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
            <div
              onClick={handleLogout}
              className="mx-2 mt-2 mb-6 flex px-2 py-1 rounded-md items-center justify-between bg-black/70"
            >
              <div className="flex items-center gap-2">
                <img
                  src={profileData?.data?.img}
                  className="w-10 h-10 object-cover rounded-full "
                />
                {profileData?.data?.name}
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="disabled:opacity-50"
              >
                <FavIcon className="size-5" name="signout" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
