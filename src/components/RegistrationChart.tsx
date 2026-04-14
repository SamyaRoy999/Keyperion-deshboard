"use client";

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DayStat {
  day: number;
  count: number;
}

interface Props {
  ownerData: DayStat[];
  managerData: DayStat[];
  loading?: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col items-center mb-4">
        <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold relative">
          {payload[0].value}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45" />
        </div>
      </div>
    );
  }
  return null;
};

export default function RegistrationChart({
  ownerData = [],
  managerData = [],
  loading = false,
}: Props) {
  const chartData = ownerData.map((owner) => {
    const manager = managerData.find((m) => m.day === owner.day);
    return {
      label: String(owner.day),
      landlords: owner.count,
      managers: manager?.count ?? 0,
    };
  });

  const maxValue = Math.max(
    ...chartData.flatMap((d) => [d.landlords, d.managers]),
    0,
  );
  const yMax = Math.max(10, Math.ceil(maxValue / 20) * 20);
  const yTicks = Array.from({ length: yMax / 20 + 1 }, (_, i) => i * 20);

  return (
    <div className="bg-[#f2f2f2] rounded-[40px] p-6 md:p-10 w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-medium text-gray-900">
            Landlords and managers registration statistics
          </h2>
          <div className="flex gap-8 mt-4 text-gray-400 font-medium text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-[#38BDF8]" />
              <span>Landlords</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-black" />
              <span>Managers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Loading...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
            >
              <defs>
                <filter
                  id="glow-reg"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <CartesianGrid
                vertical={false}
                strokeDasharray="4 4"
                stroke="#d1d5db"
              />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 11, fontWeight: 500 }}
                padding={{ left: 20, right: 20 }}
                interval={1}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[0, yMax]}
                ticks={yTicks}
                tick={{ fill: "#6b7280", fontSize: 13 }}
              />

              {/* Background pill bars */}
              <Bar
                dataKey={() => yMax + 10}
                barSize={20}
                radius={[25, 25, 25, 25]}
                isAnimationActive={false}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill="#ffffff"
                    fillOpacity={0.4}
                  />
                ))}
              </Bar>

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "transparent" }}
              />

              {/* Landlords line — blue */}
              <Line
                type="monotone"
                dataKey="landlords"
                stroke="#38BDF8"
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 7,
                  fill: "#38BDF8",
                  stroke: "white",
                  strokeWidth: 3,
                }}
                filter="url(#glow-reg)"
              />

              {/* Managers line — black */}
              <Line
                type="monotone"
                dataKey="managers"
                stroke="#111"
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 7,
                  fill: "black",
                  stroke: "white",
                  strokeWidth: 3,
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
