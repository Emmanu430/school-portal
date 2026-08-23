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

    interface AttendanceDatum {
    day: string;
    present: number;
    absent: number;
    }

    interface AttendanceChartProps {
    data: AttendanceDatum[];
    title?: string;
    subtitle?: string;
    }

    export function AttendanceChart({
    data,
    title = "Weekly attendance",
    subtitle,
    }: AttendanceChartProps) {
    return (
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="mb-4">
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
        </div>

        <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
                <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
                />
                <XAxis
                dataKey="day"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                />
                <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={28}
                />
                <Tooltip
                contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                }}
                cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                />
                <Bar
                dataKey="present"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
                maxBarSize={18}
                />
                <Bar
                dataKey="absent"
                fill="var(--accent)"
                radius={[4, 4, 0, 0]}
                maxBarSize={18}
                />
            </BarChart>
            </ResponsiveContainer>
        </div>
        </div>
    );
}