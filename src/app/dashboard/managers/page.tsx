"use client";

import Header from "@/components/common/dash/Header";
import { Pagination } from "@/components/reuseable/pagination";
import {
  useDeleteTenantMutation,
  useGetManagersQuery,
  useGetManagerUnitsQuery,
} from "@/redux/apiSlices/deshboardApi/deshboardApiSlice";
import { Eye, Trash2, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

interface Manager {
  id: number;
  name: string;
  email: string;
  img: string;
  property_name: string;
}

interface Unit {
  id: number;
  unit_name: string;
  rent_amount: string;
  rent_status: string;
  tenant_id: number | null;
}

export default function ManagersPage(): React.ReactElement {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [selectedManagerId, setSelectedManagerId] = useState<number | null>(
    null,
  );
  const [managerToDelete, setManagerToDelete] = useState<Manager | null>(null);

  // ── API Calls ──────────────────────────────────────────────────────────────
  const {
    data: managers,
    isLoading,
    refetch,
  } = useGetManagersQuery({ page, search });

  const { data: managerDetail, isLoading: isDetailLoading } =
    useGetManagerUnitsQuery(selectedManagerId);
  const [deleteManager, { isLoading: isDeleting }] = useDeleteTenantMutation();

  const managerList: Manager[] = managers?.data ?? [];
  const meta = managers?.meta;

  const selectedManager: Manager | undefined = managerList.find(
    (m) => m.id === selectedManagerId,
  );

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const isDefaultImg = (img: string) => img?.includes("default.png");

  const handleDelete = async () => {
    if (!managerToDelete) return;
    try {
      await deleteManager(managerToDelete.id).unwrap();
      toast.success("Manager deleted", {
        description: `${managerToDelete.name} has been removed successfully.`,
      });
      setManagerToDelete(null);
      refetch();
    } catch (error: any) {
      toast.error("Delete failed", {
        description: error?.data?.message || "Something went wrong.",
      });
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50/30">
      <div className="mx-auto space-y-6">
        <Header
          title="Managers management"
          description="Manage all the managers of your platform from here."
        />

        {/* Search Bar */}
        <div className="border border-border rounded-lg p-4 bg-white">
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg w-full md:w-64">
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="bg-transparent outline-none flex-1 text-sm text-foreground"
            />
          </div>
        </div>

        {/* Table */}
        <div className="border border-border rounded-lg overflow-hidden bg-white">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Assigned property name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-sm text-gray-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : managerList.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-sm text-gray-400"
                  >
                    No managers found.
                  </td>
                </tr>
              ) : (
                managerList.map((manager) => (
                  <tr key={manager.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {!isDefaultImg(manager.img) ? (
                          <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={manager.img}
                              alt={manager.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-purple-700 font-semibold text-xs">
                              {getInitials(manager.name)}
                            </span>
                          </div>
                        )}
                        <span className="text-sm font-medium">
                          {manager.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {manager.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {manager.property_name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedManagerId(manager.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setManagerToDelete(manager)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination onPageChange={(v: number) => setPage(v)} {...meta} />
      </div>

      {/* ── MODAL: MANAGER DETAILS ─────────────────────────────────────────── */}
      {selectedManagerId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden relative">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-center w-full">
                Manager details
              </h2>
              <button
                onClick={() => setSelectedManagerId(null)}
                className="absolute right-4"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[80vh]">
              {isDetailLoading ? (
                <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
                  Loading details...
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      {managerDetail?.user?.img &&
                      !isDefaultImg(managerDetail.user.img) ? (
                        <div className="relative w-14 h-14 rounded-full overflow-hidden">
                          <Image
                            src={managerDetail.user.img}
                            alt={managerDetail.user.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 bg-purple-200 rounded-full flex items-center justify-center">
                          <span className="text-purple-700 font-bold text-xl">
                            {getInitials(
                              managerDetail?.user?.name ??
                                selectedManager?.name ??
                                "",
                            )}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-lg">
                          {managerDetail?.user?.name ?? selectedManager?.name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {managerDetail?.user?.email ?? selectedManager?.email}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (selectedManager)
                          setManagerToDelete(selectedManager);
                        setSelectedManagerId(null);
                      }}
                      className="p-2 bg-red-50 text-red-500 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs text-gray-400 uppercase">
                        Total Units
                      </p>
                      <p className="text-xl font-bold">
                        {String(managerDetail?.units?.length ?? 0).padStart(
                          2,
                          "0",
                        )}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs text-gray-400 uppercase">
                        Rented Units
                      </p>
                      <p className="text-xl font-bold">
                        {String(
                          managerDetail?.units?.filter(
                            (u: Unit) => u.rent_status === "rented",
                          ).length ?? 0,
                        ).padStart(2, "0")}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        🏠
                      </div>
                      <p className="font-semibold">
                        {selectedManager?.property_name ?? "Property"}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 pl-10">
                      {managerDetail?.units?.length ?? 0} units
                    </p>
                  </div>

                  <div className="space-y-2">
                    {managerDetail?.units?.length === 0 ? (
                      <p className="text-center text-sm text-gray-400 py-4">
                        No units found.
                      </p>
                    ) : (
                      managerDetail?.units?.map((unit: Unit) => (
                        <div
                          key={unit.id}
                          className="flex justify-between items-center p-4 bg-green-50/50 border border-green-100 rounded-xl"
                        >
                          <div>
                            <p className="font-medium text-sm">
                              {unit.unit_name}
                            </p>
                            <p className="text-xs text-gray-400 capitalize">
                              {unit.rent_status}
                            </p>
                          </div>
                          <span className="font-bold text-sm">
                            ${unit.rent_amount}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: DELETE CONFIRMATION ─────────────────────────────────────── */}
      {managerToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-10 h-10 text-red-500" fill="currentColor" />
            </div>
            <h3 className="text-xl font-bold text-red-500 mb-2">
              Delete manager?
            </h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              You are going to delete this manager. After deleting, this manager
              will no longer be available in your platform.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setManagerToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 bg-red-500 rounded-xl font-semibold text-white hover:bg-red-600 disabled:opacity-70"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
