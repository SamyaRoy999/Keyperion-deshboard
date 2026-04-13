"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DayStat {
  day: string;
  count: number;
}

interface Props {
  userData: DayStat[];
  loading?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function UserStatsChart({
  userData = [],
  loading = false,
}: Props) {
  // Map API shape { day, count } → recharts shape { day, users }
  const chartData = userData.map((item) => ({
    day: item.day,
    users: item.count,
  }));

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Users statistics
        </h3>
      </div>

      {loading ? (
        <div className="w-full h-80 flex items-center justify-center text-muted-foreground text-sm">
          Loading…
        </div>
      ) : (
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="day"
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
              <Bar dataKey="users" fill="#1f2937" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
