"use client";

import React, { useState } from "react";
import { Search, Eye, Trash2, X } from "lucide-react";
import { Suspense } from "react";
import Loading from "./loading";
import Header from "@/components/common/dash/Header";
import Image from "next/image";
import FavIcon from "@/icon/favIcon";
import { Pagination } from "@/components/reuseable/pagination";
import {
  useDeleteTenantMutation,
  useGetTenantsQuery,
} from "@/redux/apiSlices/deshboardApi/deshboardApiSlice";

const isDefaultImg = (img: string) =>
  !img || img.includes("default.png") || img.includes("default.jpg");

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function UserAvatar({ img, name }: { img: string; name: string }) {
  if (!isDefaultImg(img)) {
    return (
      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
        <Image src={img} alt={name} fill className="object-cover" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
      <span className="text-purple-700 font-semibold text-xs">
        {getInitials(name)}
      </span>
    </div>
  );
}

export default function TenantsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);

  // API
  const { data: tenants, isLoading } = useGetTenantsQuery({ page, search });
  const [deleteTenant, { isLoading: isDeleting }] = useDeleteTenantMutation();

  const list = tenants?.data ?? [];
  const meta = tenants?.meta;

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteTenant(deleteConfirm.id).unwrap();
      setDeleteConfirm(null);
      setSelectedTenant(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen p-8">
        <Header
          title="Tenants management"
          description="You can manage all the tenants of your platform from here."
        />

        {/* Search Bar */}
        <div className="relative mb-6 max-w-sm">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pr-10 pl-4 h-10 border border-gray-200 rounded-lg outline-none focus:ring-2 ring-blue-500/10 bg-white text-sm"
          />
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Unit name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Property name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-gray-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-gray-400"
                  >
                    No tenants found.
                  </td>
                </tr>
              ) : (
                list.map((tenant: any) => (
                  <tr
                    key={tenant.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          img={tenant?.img ?? ""}
                          name={tenant?.name ?? "?"}
                        />
                        <span className="font-medium">{tenant?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {tenant?.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {tenant?.unit?.unit_name ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {tenant?.property_name ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedTenant(tenant)}
                          className="p-1.5 hover:bg-muted rounded transition-colors"
                        >
                          <Eye className="w-5 h-5 text-gray-500" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(tenant)}
                          className="p-1.5 hover:bg-muted rounded transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
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
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
            Total: <span className="font-semibold">{meta?.total ?? 0}</span>{" "}
            tenants
          </p>
          <Pagination onPageChange={(v: number) => setPage(v)} {...meta} />
        </div>

        {/* ── Tenant Details Modal ─────────────────────────────── */}
        {selectedTenant && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#F6F6F6] rounded-lg max-w-md w-full p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div />
                <h2 className="text-lg font-semibold">Tenant details</h2>
                <button
                  onClick={() => setSelectedTenant(null)}
                  className="p-1 hover:bg-muted rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User info */}
              <div className="flex justify-between p-3 rounded-xl bg-white items-center gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    img={selectedTenant?.img ?? ""}
                    name={selectedTenant?.name ?? "?"}
                  />
                  <div>
                    <h3 className="font-semibold">{selectedTenant?.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedTenant?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setDeleteConfirm(selectedTenant);
                    setSelectedTenant(null);
                  }}
                  className="p-1.5 hover:bg-muted rounded"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              {/* Location */}
              {selectedTenant?.location && (
                <div className="flex gap-3 items-center mb-4 bg-white p-4 rounded-2xl">
                  <FavIcon name="location" />
                  <p className="text-sm text-gray-500">
                    {selectedTenant.location}
                  </p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-2xl">
                  <p className="text-xs text-gray-400 mb-1">Property</p>
                  <p className="font-medium text-sm">
                    {selectedTenant?.property_name ?? "—"}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-2xl">
                  <p className="text-xs text-gray-400 mb-1">Unit name</p>
                  <p className="font-medium text-sm">
                    {selectedTenant?.property_info ?? "—"}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-2xl">
                  <p className="text-xs text-gray-400 mb-1">Role</p>
                  <p className="font-medium text-sm capitalize">
                    {selectedTenant?.role ?? "—"}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-2xl">
                  <p className="text-xs text-gray-400 mb-1">Verified</p>
                  <p className="font-medium text-sm">
                    {selectedTenant?.is_verified ? "✅ Yes" : "❌ No"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Delete Confirmation Modal ────────────────────────── */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2
                  className="w-10 h-10 text-red-500"
                  fill="currentColor"
                />
              </div>
              <h3 className="text-xl font-bold text-red-500 mb-2">
                Delete tenant?
              </h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                You are going to delete this tenant. After deleting, this tenant
                will no longer be available in your platform.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-red-500 rounded-xl font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
}
