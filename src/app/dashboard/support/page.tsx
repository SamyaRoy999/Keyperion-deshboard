"use client";

import React, { useState } from "react";
import { Search, Eye, Trash2, X } from "lucide-react";
import Header from "@/components/common/dash/Header";
import Image from "next/image";
import {
  useDeleteSupportMutation,
  useGetSupportsQuery,
  useReplySupportMutation,
} from "@/redux/apiSlices/deshboardApi/deshboardApiSlice";
import { Pagination } from "@/components/reuseable/pagination";
import { toast } from "sonner";

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
      <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
        <Image src={img} alt={name} fill className="object-cover" />
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
      <span className="text-purple-700 font-semibold text-xs">
        {getInitials(name)}
      </span>
    </div>
  );
}

export default function SupportPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Modal states
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [replyText, setReplyText] = useState("");

  // API
  const { data: supports, isLoading } = useGetSupportsQuery({ page, search });
  const [deleteSupport, { isLoading: isDeleting }] = useDeleteSupportMutation();
  const [replySupport, { isLoading: isReplying }] = useReplySupportMutation();

  const list = supports?.data ?? [];
  const meta = supports?.meta;

  const handleView = (item: any) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  const handleReplyOpen = (item: any) => {
    setSelectedItem(item);
    setReplyText("");
    setShowReplyModal(true);
  };

  const handleDeleteOpen = (item: any) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleSendReply = async () => {
    if (!selectedItem || !replyText.trim()) return;
    try {
      await replySupport({ id: selectedItem.id, reply: replyText }).unwrap();
      toast.success("Reply Sent", {
        description: "Your reply has been sent successfully",
      });
      setShowReplyModal(false);
      setReplyText("");
      setSelectedItem(null);
    } catch (err: any) {
      toast.error("Failed", {
        description: err?.data?.message || "Something went wrong",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    try {
      await deleteSupport(selectedItem.id).unwrap();
      toast.success("Deleted", {
        description: "Support message deleted successfully",
      });
      setShowDeleteModal(false);
      setSelectedItem(null);
    } catch (err: any) {
      toast.error("Failed", {
        description: err?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 p-8">
      <div className="mx-auto space-y-6">
        <Header
          title="Supports"
          description="You can manage all the support messages here."
        />

        {/* Search */}
        <div className="border border-border rounded-lg p-4 bg-white">
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg w-full md:w-72">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="bg-transparent outline-none flex-1 text-sm text-foreground"
            />
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </div>
        </div>

        {/* Table */}
        <div className="border border-border rounded-lg overflow-hidden bg-white">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Tenant/Landlord/manager name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Support subject
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
              ) : list.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-sm text-gray-400"
                  >
                    No support messages found.
                  </td>
                </tr>
              ) : (
                list.map((item: any) => {
                  const user = item?.user;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      {/* Name + Avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            img={user?.img ?? ""}
                            name={user?.name ?? "?"}
                          />
                          <span className="text-sm font-medium">
                            {user?.name ?? "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user?.email ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">
                        {item?.subject ?? "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* View */}
                          <button
                            onClick={() => handleView(item)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteOpen(item)}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {/* Reply */}
                          <button
                            onClick={() => handleReplyOpen(item)}
                            className="px-4 py-1.5 bg-foreground text-background text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                          >
                            Reply
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50/50 border-t border-border flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Total: <span className="font-semibold">{meta?.total ?? 0}</span>{" "}
              appointments
            </p>
            <Pagination onPageChange={(v: number) => setPage(v)} {...meta} />
          </div>
        </div>
      </div>

      {/* ── MODAL: SUPPORT DETAILS ─────────────────────────────────────── */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden relative">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-center w-full">
                Support details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="absolute right-4"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              {/* User info + action buttons */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    img={selectedItem?.user?.img ?? ""}
                    name={selectedItem?.user?.name ?? "?"}
                  />
                  <div>
                    <p className="font-semibold text-sm">
                      {selectedItem?.user?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedItem?.user?.email}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 bg-red-50 text-red-500 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleReplyOpen(selectedItem);
                    }}
                    className="px-4 py-1.5 bg-foreground text-background text-sm font-medium rounded-lg hover:opacity-90"
                  >
                    Reply
                  </button>
                </div>
              </div>

              {/* Subject */}
              <p className="font-semibold text-sm mb-2">
                {selectedItem?.subject}
              </p>

              {/* Message / Issue */}
              <p className="text-sm text-gray-600 leading-relaxed border-t pt-4">
                {selectedItem?.issue}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: REPLY ───────────────────────────────────────────────── */}
      {showReplyModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden relative">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-center w-full">
                Reply to this support
              </h2>
              <button
                onClick={() => setShowReplyModal(false)}
                className="absolute right-4"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              <p className="font-semibold text-sm mb-4">
                {selectedItem?.subject}
              </p>
              <textarea
                className="w-full h-36 p-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 ring-blue-500/10 resize-none"
                placeholder="Write your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowReplyModal(false)}
                  disabled={isReplying}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={isReplying || !replyText.trim()}
                  className="flex-1 py-3 px-4 bg-foreground text-background rounded-xl font-semibold hover:opacity-90 disabled:opacity-60"
                >
                  {isReplying ? "Sending..." : "Send reply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: DELETE CONFIRMATION ─────────────────────────────────── */}
      {showDeleteModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-10 h-10 text-red-500" fill="currentColor" />
            </div>
            <h3 className="text-xl font-bold text-red-500 mb-2">
              Delete support?
            </h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              You are going to delete this support message. After deleting, you
              won't be able to find this message in your platform.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 bg-red-500 rounded-xl font-semibold text-white hover:bg-red-600 disabled:opacity-60"
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
