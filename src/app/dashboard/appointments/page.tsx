"use client";

import React, { useState, useRef, useEffect } from "react";
import { Filter, Search } from "lucide-react";
import Header from "@/components/common/dash/Header";

import Image from "next/image";
import { useGetAppointmentsQuery } from "@/redux/apiSlices/deshboardApi/deshboardApiSlice";
import { Pagination } from "@/components/reuseable/pagination";

type FilterType = "all" | "pending" | "ongoing" | "completed";

const isDefaultImg = (img: string) =>
  !img || img.includes("default.png") || img.includes("default.jpg");

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function UserAvatar({
  img,
  name,
  bgColor,
}: {
  img: string;
  name: string;
  bgColor: string;
}) {
  if (!isDefaultImg(img)) {
    return (
      <div className="relative h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
        <Image src={img} alt={name} fill className="object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${bgColor}`}
    >
      {getInitials(name)}
    </div>
  );
}

const getStatusColor = (status: string | null | undefined): string => {
  switch ((status ?? "").toLowerCase()) {
    case "pending":
      return "text-blue-600 bg-blue-50";
    case "ongoing":
      return "text-orange-600 bg-orange-50";
    case "completed":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Completed", value: "completed" },
];

export default function AppointmentsPage(): React.ReactElement {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: appointments, isLoading } = useGetAppointmentsQuery({
    page,
    search,
    filter,
  });

  const list = appointments?.data ?? [];
  const meta = appointments?.meta;

  const activeFilterLabel =
    FILTER_OPTIONS.find((f) => f.value === filter)?.label ?? "Filter";

  return (
    <div className="min-h-screen p-6 bg-gray-50/30">
      <div className="mx-auto space-y-6">
        <Header
          title="Appointments management"
          description="You can monitor all the appointments of your platform from here."
        />

        {/* Search and Filter Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 ring-blue-500/10 transition-all bg-white"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="flex items-center gap-2 px-6 py-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {activeFilterLabel}
              </span>
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setFilter(opt.value);
                      setPage(1);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors border-b last:border-0 border-gray-50 hover:bg-gray-50 ${
                      filter === opt.value
                        ? "text-blue-600 font-semibold bg-blue-50/30"
                        : "text-gray-600"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Tenant name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Landlord name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Property name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-sm text-gray-400"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : list.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-sm text-gray-400"
                    >
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  list.map((item: any) => {
                    const tenant = item?.tenant;
                    const organizer = item?.organizer;

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50/30 transition-colors"
                      >
                        {/* Tenant */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar
                              img={tenant?.img ?? ""}
                              name={tenant?.name ?? "?"}
                              bgColor="bg-orange-100 text-orange-600"
                            />
                            <span className="text-sm font-medium">
                              {tenant?.name ?? "—"}
                            </span>
                          </div>
                        </td>

                        {/* Organizer / Landlord */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar
                              img={organizer?.img ?? ""}
                              name={organizer?.name ?? "?"}
                              bgColor="bg-blue-100 text-blue-600"
                            />
                            <span className="text-sm font-medium">
                              {organizer?.name ?? "—"}
                            </span>
                          </div>
                        </td>

                        {/* Property */}
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {item?.property_name ?? "—"}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getStatusColor(item.status)}`}
                          >
                            {item.status ?? "—"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200">
            <Pagination onPageChange={(v: number) => setPage(v)} {...meta} />
          </div>
        </div>
      </div>
    </div>
  );
}
