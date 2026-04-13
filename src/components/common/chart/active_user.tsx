"use client"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

const data = [
    { day: "Mon", value: 800 },
    { day: "Tue", value: 2200 },
    { day: "Wed", value: 1800 },
    { day: "Thu", value: 3200 },
    { day: "Fri", value: 2800 },
    { day: "Sat", value: 3800 },
    { day: "Sun", value: 1200 },
]

const chartConfig = {
    value: {
        label: "Value",
        color: "hsl(var(--chart-1))",
    },
}



export default function ActiveUser() {
    return (
        <div>
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 20,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.1} />
                                <stop offset="50%" stopColor="#06b6d4" stopOpacity={0.1} />
                                <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                            className="text-muted-foreground"
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                            tickFormatter={(value) => `${value < 1000 ? value : `${value / 1000}k`}`}
                            domain={[0, 4000]}
                            ticks={[0, 1000, 2000, 3000, 4000]}
                        />
                        <ChartTooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    const value = payload[0].value as number
                                    const isHighlight = label === "Thu" && value === 3200

                                    return (
                                        <div className="rounded-lg border bg-background p-2 shadow-md">
                                            <div className="grid gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
                                                    <span className="font-bold text-foreground">
                                                        {isHighlight ? "+2.2k" : `${value < 1000 ? value : `${(value / 1000).toFixed(1)}k`}`}
                                                    </span>
                                                    {isHighlight && (
                                                        <span className="text-[0.70rem] text-muted-foreground">26 Apr, 13:24</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#06b6d4"
                            strokeWidth={2}
                            fill="url(#colorGradient)"
                            fillOpacity={1}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    )
}
