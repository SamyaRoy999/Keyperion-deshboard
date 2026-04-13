"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MonthStat {
  month: string;
  count: number;
}

interface Props {
  ownerData: MonthStat[];
  managerData: MonthStat[];
  loading?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegistrationChart({
  ownerData = [],
  managerData = [],
  loading = false,
}: Props) {
  // Merge owner + manager data by month into a single array for recharts
  const chartData = ownerData.map((owner) => {
    const manager = managerData.find((m) => m.month === owner.month);
    return {
      month: owner.month,
      landlords: owner.count,
      managers: manager?.count ?? 0,
    };
  });

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Landlords and managers registration statistics
        </h3>
      </div>

      {loading ? (
        <div className="w-full h-80 flex items-center justify-center text-muted-foreground text-sm">
          Loading…
        </div>
      ) : (
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                stroke="var(--muted-foreground)"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                style={{ fontSize: "12px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line
                type="monotone"
                dataKey="landlords"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="managers"
                stroke="#1f2937"
                strokeWidth={3}
                dot={{ fill: "#1f2937", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
