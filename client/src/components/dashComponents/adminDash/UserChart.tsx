import { useMemo } from "react";
import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    Cell,
    ResponsiveContainer,
    type TooltipIndex,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";

type UserChartData = {
    returningPatients: number;
    newPatients: number;
};

type ChartProps = {
    isAnimationActive?: boolean;
    defaultIndex?: TooltipIndex;
    data?: UserChartData;
};

const COLORS = ["#3B82F6", "#10B981"];

const UserChart = ({
    isAnimationActive = true,
    defaultIndex,
    data,
}: ChartProps) => {

    const chartData = useMemo(
        () => [
            {
                name: "Returning Patients",
                value: data?.returningPatients ?? 0,
            },
            {
                name: "New Registration",
                value: data?.newPatients ?? 0,
            },
        ],
        [data]
    );

    const hasData = chartData.some((item:any) => item.value > 0);

    if (!hasData) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center text-gray-400">
                <div className="mb-3 text-5xl">📊</div>

                <h3 className="text-lg font-semibold">
                    No Patient Data
                </h3>

                <p className="mt-1 text-sm text-center">
                    No new registrations or returning patients
                    were found for the selected period.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>

                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="55%"
                        outerRadius="80%"
                        paddingAngle={3}
                        label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        isAnimationActive={isAnimationActive}
                    >
                        {chartData.map((_, index) => (
                            <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>

                    <Tooltip
                        defaultIndex={defaultIndex}
                        formatter={(value: number) => [
                            value,
                            "Patients",
                        ]}
                    />

                    <Legend
                        verticalAlign="bottom"
                        align="center"
                    />

                    <RechartsDevtools />

                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default UserChart;