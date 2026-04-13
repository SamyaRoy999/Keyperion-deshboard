"use client";

import { useState } from "react";
import Header from "@/components/common/dash/Header";
import RegistrationChart from "@/components/RegistrationChart";
import StatCard from "@/components/StatCard";
import UserStatsChart from "@/components/UserStatsChart";
import { Users, Home, Shield, TrendingUp } from "lucide-react";
import { useGetDashboardQuery } from "@/redux/apiSlices/deshboardApi/deshboardApiSlice";

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

// ─── Component ────────────────────────────────────────────────────────────────

export default function RootHome() {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(currentYear);

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetDashboardQuery(
    { year, month },
    { refetchOnMountOrArgChange: true },
  );

  const data = response?.data;

  const fmt = (n: number | undefined) =>
    n !== undefined ? n.toLocaleString() : "—";

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <Header
        title="Dashboard"
        description="Your overall dashboard overview. See the statistics, analytics and manage them."
      />

      {/* Welcome + Filter Row */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Hello Abid!
          </h2>
          <p className="text-muted-foreground">
            Track and manage your application from here.
          </p>
        </div>

        {/* Month / Year filter */}
        <div className="flex items-center gap-3">
          {/* Month */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="month-select"
              className="text-xs font-medium text-muted-foreground"
            >
              Month
            </label>
            <select
              id="month-select"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="year-select"
              className="text-xs font-medium text-muted-foreground"
            >
              Year
            </label>
            <select
              id="year-select"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error banner */}
      {isError && (
        <div className="mb-6 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {(error as any)?.message ?? "Failed to load dashboard data."}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={Users}
          label="Total Tenants"
          value={isLoading ? "…" : fmt(data?.totalTenants)}
          bgColor="bg-slate-700"
        />
        <StatCard
          icon={Home}
          label="Total Properties"
          value={isLoading ? "…" : fmt(data?.totalProperties)}
          bgColor="bg-slate-700"
        />
        <StatCard
          icon={Shield}
          label="Total Managers"
          value={isLoading ? "…" : fmt(data?.manager)}
          bgColor="bg-slate-700"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Earnings"
          value={isLoading ? "…" : `$${fmt(data?.earnings)}`}
          bgColor="bg-slate-700"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RegistrationChart
          ownerData={data?.owner_statistics ?? []}
          managerData={data?.manager_statistics ?? []}
          loading={isLoading}
        />
        <UserStatsChart
          userData={data?.user_statistics ?? []}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
