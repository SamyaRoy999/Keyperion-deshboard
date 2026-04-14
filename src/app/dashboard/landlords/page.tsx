"use client";

import React, { useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  X,
  Home,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  ArrowRight,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Suspense } from "react";
import FavIcon from "@/icon/favIcon";
import Header from "@/components/common/dash/Header";
import { Pagination } from "@/components/reuseable/pagination";
import { toast } from "sonner";
import {
  useGetLandlordDetailsQuery,
  useGetLandlordsQuery,
  useDeleteTenantMutation,
  useCreatePlanMutation,
  useGetPropertyDetailsQuery,
  useDeletePropertyMutation,
} from "@/redux/apiSlices/deshboardApi/deshboardApiSlice";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaymentMethod {
  id: number;
  type: string;
  brand: string;
  last4: string;
  card_logo: string;
  is_default: boolean;
}

interface ApiLandlord {
  id: number;
  name: string;
  email: string;
  img: string;
  property_count: number;
  subscriptions: any;
  payment_method: PaymentMethod[];
  has_payment_method: boolean;
}

interface Property {
  id: number;
  name: string;
  units_count: number;
  units: any[];
}

// ─── Property Details Modal ───────────────────────────────────────────────────

function PropertyDetailsModal({
  property,
  onClose,
}: {
  property: Property;
  onClose: () => void;
}) {
  const { data: propertyDetails, isLoading: isPropertyLoading } =
    useGetPropertyDetailsQuery(property.id);

  const [deleteProperty, { isLoading: isDeleting }] =
    useDeletePropertyMutation();

  const handleDeleteProperty = async () => {
    try {
      await deleteProperty(property.id).unwrap();
      toast.success("Property deleted", {
        description: "Property has been successfully deleted.",
      });
      onClose();
    } catch (err) {
      toast.error("Delete failed", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  // Flatten all units from all floors
  const allUnits =
    propertyDetails?.data?.floors?.flatMap((floor: any) => floor.units) ?? [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4 backdrop-blur-sm">
      <div className="bg-[#F9FAFB] rounded-[32px] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-6 flex justify-between items-center bg-white border-b border-gray-100 relative">
          <h2 className="text-xl font-bold text-gray-900 mx-auto">
            Property details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full absolute right-8"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <FavIcon name="house" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  {propertyDetails?.data?.name ?? property.name}
                </h3>
                <p className="text-sm text-gray-500">{allUnits.length} units</p>
              </div>
            </div>
            {/* ✅ Property delete button */}
            <button
              onClick={handleDeleteProperty}
              disabled={isDeleting}
              className="p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <span className="text-xs text-red-500 px-1">Deleting…</span>
              ) : (
                <Trash2 className="w-5 h-5 text-red-500" />
              )}
            </button>
          </div>

          {isPropertyLoading ? (
            <p className="text-sm text-gray-400 text-center py-8">
              Loading units…
            </p>
          ) : allUnits.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              No units found.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {allUnits.map((unit: any) => (
                <div
                  key={unit.id}
                  className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${
                    unit.rent_status === "rented"
                      ? "bg-[#F0FFF4] border-[#C6F6D5]"
                      : "bg-white border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gray-50 rounded-xl">
                      {unit.rent_status === "rented" ? (
                        <Home className="w-5 h-5 text-gray-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        {unit.unit_name}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium capitalize">
                        {unit.rent_status}
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-black">
                    ${unit.rent_amount ?? 0}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Landlord Details Modal ───────────────────────────────────────────────────

function LandlordDetailsModal({
  landlordId,
  onClose,
  onDeleteClick,
}: {
  landlordId: number;
  onClose: () => void;
  onDeleteClick: (landlord: any) => void;
}) {
  const { data: details, isLoading } = useGetLandlordDetailsQuery(landlordId);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-[32px] w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
          <div className="p-6 flex justify-end">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-black" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
              Loading details…
            </div>
          ) : (
            <div className="flex flex-1 overflow-y-auto">
              {/* Left panel */}
              <div className="w-[400px] bg-[#F9FAFB] border-r border-gray-100 p-8 flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4 border-none shadow-sm">
                  <AvatarImage src={details?.img} />
                  <AvatarFallback className="bg-purple-200 text-2xl">
                    {details?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {details?.name}
                </h2>
                <p className="text-sm text-gray-500 mb-6">{details?.email}</p>

                {details?.subscriptions && (
                  <Button className="bg-[#F5A623] hover:bg-[#e09612] text-white rounded-lg px-6 py-2 h-auto mb-8 flex items-center gap-2 text-sm font-medium">
                    <span>👑</span>{" "}
                    {details.subscriptions?.plan ?? "Subscribed"}
                  </Button>
                )}

                <div className="w-full space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-2xl flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-full">
                        <Home className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-600 font-semibold uppercase">
                          Total property
                        </p>
                        <p className="text-lg text-black font-bold">
                          {details?.property_count ?? 0}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-full">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-600 font-semibold uppercase">
                          Total tenant
                        </p>
                        <p className="text-lg font-bold text-black">
                          {details?.total_tenants ?? 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-full">
                      <DollarSign className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-600 font-semibold uppercase">
                        Total rent
                      </p>
                      <p className="text-lg font-bold text-black">
                        ${details?.total_rent ?? 0}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-2xl flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-full">
                        <Calendar className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-600 font-semibold uppercase">
                          Starting date
                        </p>
                        <p className="text-[13px] font-bold">
                          {formatDate(details?.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-full">
                        <Calendar className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-600 font-semibold uppercase">
                          Expiry date
                        </p>
                        <p className="text-[13px] font-bold">
                          {formatDate(details?.subscriptions?.ends_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl flex items-start gap-3">
                    <div className="p-2 bg-gray-50 rounded-full mt-1">
                      <MapPin className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-600 font-semibold uppercase">
                        Address
                      </p>
                      <p className="text-[13px] font-bold text-gray-800 leading-tight whitespace-pre-line">
                        {details?.location ?? "—"}
                      </p>
                    </div>
                  </div>

                  {details?.payment_method?.length > 0 && (
                    <div className="bg-white p-4 rounded-2xl space-y-2">
                      <p className="text-[10px] text-gray-600 font-semibold uppercase mb-2">
                        Payment methods
                      </p>
                      {details.payment_method.map((pm: PaymentMethod) => (
                        <div key={pm.id} className="flex items-center gap-3">
                          <img
                            src={pm.card_logo}
                            alt={pm.brand}
                            className="w-6 h-6 object-contain"
                          />
                          <span className="text-sm text-gray-700 capitalize">
                            {pm.brand}
                          </span>
                          <span className="text-sm text-gray-500">
                            •••• {pm.last4}
                          </span>
                          {pm.is_default && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onDeleteClick(details);
                  }}
                  className="mt-8 flex items-center gap-2 text-sm font-bold text-gray-900 bg-gray-100 px-6 py-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  <Trash2 className="w-4 h-4 text-red-500" /> Delete landlord
                </button>
              </div>

              {/* Right panel */}
              <div className="flex-1 p-10 bg-white overflow-y-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Properties ({details?.property?.length ?? 0})
                </h3>
                {details?.property?.length === 0 ? (
                  <p className="text-sm text-gray-400">No properties found.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {details?.property?.map((property: Property) => (
                      <div
                        key={property.id}
                        className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-purple-200 transition-all cursor-pointer"
                        onClick={() => setSelectedProperty(property)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <FavIcon name="house" />
                          <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-purple-600 transition-colors" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">
                          {property.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {property.units_count} units
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Property details modal */}
      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LandlordsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLandlordId, setSelectedLandlordId] = useState<number | null>(
    null,
  );
  const [deleteConfirm, setDeleteConfirm] = useState<any | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [planPrice, setPlanPrice] = useState("");
  const [planInterval, setPlanInterval] = useState("month");

  const { data, isLoading } = useGetLandlordsQuery({ page });
  const [deleteLandlord, { isLoading: isDeleting }] = useDeleteTenantMutation();
  const [createPlan, { isLoading: isCreatingPlan }] = useCreatePlanMutation();

  const landlords: ApiLandlord[] = data?.data ?? [];

  const filteredLandlords = landlords.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteLandlord(deleteConfirm.id).unwrap();
      toast.success("Landlord deleted", {
        description: "Landlord has been successfully deleted.",
      });
      setDeleteConfirm(null);
      setSelectedLandlordId(null);
    } catch (err) {
      toast.error("Delete failed", {
        description: "Something went wrong. Please try again.",
      });
      console.error("Delete failed:", err);
    }
  };

  const handleCreatePlan = async () => {
    if (!planPrice) return;
    try {
      await createPlan({
        price: Number(planPrice),
        interval: planInterval,
      }).unwrap();
      toast.success("Plan updated", {
        description: "Subscription price has been updated successfully.",
      });
      setIsSubscriptionModalOpen(false);
      setPlanPrice("");
      setPlanInterval("month");
    } catch (err) {
      toast.error("Failed to update plan", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <Suspense>
      <div className="min-h-screen p-8">
        <Header
          title="Landlords management"
          description="You can manage all the landlords of your platform from here."
        />

        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pr-12 h-10"
            />
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-black" />
          </div>
          <Button
            onClick={() => setIsSubscriptionModalOpen(true)}
            className="bg-black hover:bg-gray-800"
          >
            Manage subscription price
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Total property
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Subscription expiry date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
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
                    Loading…
                  </td>
                </tr>
              ) : filteredLandlords.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-gray-400"
                  >
                    No landlords found.
                  </td>
                </tr>
              ) : (
                filteredLandlords.map((landlord) => (
                  <tr
                    key={landlord.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={landlord.img} alt={landlord.name} />
                          <AvatarFallback>
                            {landlord.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-900">
                          {landlord.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {landlord.email}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {String(landlord.property_count).padStart(2, "0")}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {landlord.subscriptions?.end_date ?? "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedLandlordId(landlord.id)}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Eye className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(landlord)}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
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
          <Pagination onPageChange={(v: any) => setPage(v)} {...data?.meta} />
        </div>

        {/* Details modal */}
        {selectedLandlordId !== null && (
          <LandlordDetailsModal
            landlordId={selectedLandlordId}
            onClose={() => setSelectedLandlordId(null)}
            onDeleteClick={(landlord) => setDeleteConfirm(landlord)}
          />
        )}

        {/* Subscription modal */}
        {isSubscriptionModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl relative">
              <button
                onClick={() => setIsSubscriptionModalOpen(false)}
                className="absolute right-6 top-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <h2 className="text-xl font-bold text-gray-900 text-center mb-8">
                Manage your subscription prices
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interval
                  </label>
                  <div className="relative">
                    <select
                      value={planInterval}
                      onChange={(e) => setPlanInterval(e.target.value)}
                      className="w-full h-12 rounded-2xl bg-gray-50 border border-gray-200 px-4 pr-10 text-sm font-medium text-gray-800 appearance-none outline-none focus:ring-2 focus:ring-black/10 cursor-pointer"
                    >
                      <option value="month">Monthly</option>
                      <option value="year">Yearly</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                        <path
                          d="M1 1L5 5L9 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={planPrice}
                      onChange={(e) => setPlanPrice(e.target.value)}
                      className="w-full h-12 rounded-2xl bg-gray-50 border border-gray-200 px-4 pr-10 text-sm outline-none focus:ring-2 focus:ring-black/10"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                      $
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCreatePlan}
                  disabled={!planPrice || isCreatingPlan}
                  className="w-full h-12 bg-black hover:bg-gray-800 disabled:opacity-50 text-white rounded-2xl font-semibold text-sm transition-colors"
                >
                  {isCreatingPlan ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete confirmation modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-6">
                <Trash2 className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete landlord?
              </h3>
              <p className="text-sm text-gray-500 mb-8">
                You are going to delete the landlord. After deleting, this
                landlord will no longer be available.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 h-12 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold transition-colors"
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
