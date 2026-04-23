"use client";

import Header from "@/components/common/dash/Header";

import React, { useState } from "react";
import { Trash2, Pencil, Plus, X, Minus } from "lucide-react";
import {
  useAddFaqMutation,
  useDeleteFaqMutation,
  useGetFaqsQuery,
  useUpdateFaqMutation,
} from "@/redux/apiSlices/deshboardApi/deshboardApiSlice";
import { toast } from "sonner";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

// ── Add / Edit Modal ──────────────────────────────────────────────────────────
function FAQModal({
  mode,
  initial,
  onClose,
  onSubmit,
  isLoading,
}: {
  mode: "add" | "edit";
  initial?: FAQItem;
  onClose: () => void;
  onSubmit: (data: { question: string; answer: string }) => void;
  isLoading: boolean;
}) {
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [answer, setAnswer] = useState(initial?.answer ?? "");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden relative">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-center w-full">
            {mode === "add" ? "Add FAQ" : "Edit FAQ"}
          </h2>
          <button onClick={onClose} className="absolute right-4">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter question"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 ring-blue-500/10"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Answer
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter answer"
              rows={5}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 ring-blue-500/10 resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              disabled={isLoading || !question.trim() || !answer.trim()}
              onClick={() => onSubmit({ question, answer })}
              className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-60"
            >
              {isLoading
                ? "Saving..."
                : mode === "add"
                  ? "Add FAQ"
                  : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteModal({
  onClose,
  onConfirm,
  isLoading,
}: {
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-10 h-10 text-red-500" fill="currentColor" />
        </div>
        <h3 className="text-xl font-bold text-red-500 mb-2">Delete FAQ?</h3>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          You are going to delete this FAQ. After deleting, it will no longer be
          available on your platform.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 bg-red-500 rounded-xl font-semibold text-white hover:bg-red-600 disabled:opacity-60"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const FAQ = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState<FAQItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<FAQItem | null>(null);

  // API
  const { data: faqs = [], isLoading } = useGetFaqsQuery(undefined);
  const [addFaq, { isLoading: isAdding }] = useAddFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();

  const handleAdd = async (data: { question: string; answer: string }) => {
    try {
      await addFaq(data).unwrap();
      toast.success("FAQ Added", {
        description: "FAQ has been added successfully",
      });
      setShowAddModal(false);
    } catch (err: any) {
      toast.error("Failed", {
        description: err?.data?.message || "Something went wrong",
      });
    }
  };

  const handleUpdate = async (data: { question: string; answer: string }) => {
    if (!editItem) return;
    try {
      await updateFaq({ id: editItem.id, ...data }).unwrap();
      toast.success("FAQ Updated", {
        description: "FAQ has been updated successfully",
      });
      setEditItem(null);
    } catch (err: any) {
      toast.error("Failed", {
        description: err?.data?.message || "Something went wrong",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await deleteFaq(deleteItem.id).unwrap();
      toast.success("FAQ Deleted", {
        description: "FAQ has been deleted successfully",
      });
      setDeleteItem(null);
    } catch (err: any) {
      toast.error("Failed", {
        description: err?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Header
        title="Settings"
        description="You can manage all the settings of your platform from here."
      />

      <div className="mx-auto mt-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Frequently Asked Questions (FAQ)
        </h1>

        {isLoading ? (
          <div className="text-center py-10 text-sm text-gray-400">
            Loading...
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-10 text-sm text-gray-400">
            No FAQs found.
          </div>
        ) : (
          <div className="space-y-2">
            {faqs.map((faq: FAQItem) => (
              <div
                key={faq.id}
                className="bg-white rounded-lg border border-gray-200"
              >
                {/* Header row */}
                <div
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50"
                  onClick={() =>
                    setExpandedId(expandedId === faq.id ? null : faq.id)
                  }
                >
                  <h3 className="text-gray-900 font-medium flex-1 pr-4">
                    {faq.question}
                  </h3>

                  <div className="flex items-center gap-3">
                    {/* Expand/Collapse */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(expandedId === faq.id ? null : faq.id);
                      }}
                      className="p-1 text-gray-500 hover:text-gray-900"
                    >
                      {expandedId === faq.id ? (
                        <Minus className="w-5 h-5" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditItem(faq);
                      }}
                      className="p-1 text-gray-500 hover:text-gray-900"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteItem(faq);
                      }}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Answer */}
                {expandedId === faq.id && (
                  <div className="px-6 pb-6 text-gray-700 text-sm leading-relaxed border-t border-gray-200 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add More button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add more
          </button>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <FAQModal
          mode="add"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAdd}
          isLoading={isAdding}
        />
      )}

      {/* Edit Modal */}
      {editItem && (
        <FAQModal
          mode="edit"
          initial={editItem}
          onClose={() => setEditItem(null)}
          onSubmit={handleUpdate}
          isLoading={isUpdating}
        />
      )}

      {/* Delete Modal */}
      {deleteItem && (
        <DeleteModal
          onClose={() => setDeleteItem(null)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default FAQ;
