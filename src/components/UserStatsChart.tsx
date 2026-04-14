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

interface DayStat {
  day: string;
  count: number;
}

interface Props {
  userData: DayStat[];
  loading?: boolean;
}

export default function UserStatsChart({
  userData = [],
  loading = false,
}: Props) {
  const chartData = userData.map((item) => ({
    day: item.day,
    value: item.count,
  }));

  const maxValue = Math.max(...chartData.map((d) => d.value), 0);
  const yMax = Math.max(10, Math.ceil(maxValue / 2) * 2);
  const yTicks = Array.from({ length: yMax / 2 + 1 }, (_, i) => i * 2);

  return (
    <div className="bg-[#f8f8f8] rounded-3xl px-6 md:px-8 py-8 md:py-10 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 md:mb-12">
        <h2 className="text-xl font-medium text-gray-900">Users statistics</h2>
      </div>

      {/* Chart */}
      <div className="h-72 w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Loading...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              barGap={-35}
            >
              <defs>
                <filter
                  id="barShadow2"
                  x="-10%"
                  y="-10%"
                  width="120%"
                  height="120%"
                >
                  <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                  <feOffset dx="0" dy="2" result="offsetblur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.5" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="#eaeaea"
                strokeWidth={1}
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9e9e9e", fontSize: 14, fontWeight: 400 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[0, yMax]}
                ticks={yTicks}
                tick={{ fill: "#9e9e9e", fontSize: 14 }}
              />

              {/* Background pill */}
              <Bar
                dataKey={() => yMax + 2}
                fill="#f1f1f1"
                radius={[20, 20, 20, 20]}
                barSize={35}
                isAnimationActive={false}
              />

              {/* Actual data bar */}
              <Bar
                dataKey="value"
                fill="#2d2e2f"
                radius={[0, 0, 20, 20]}
                barSize={35}
                style={{ filter: "url(#barShadow2)" }}
              />

              <Tooltip cursor={false} content={() => null} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
