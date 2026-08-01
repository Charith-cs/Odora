import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";

import type { FilterType } from "../../../../types/types";
import API from "../../../../api/axios";

interface ChartData {
  label: string;
  revenue: number;
}

const RevenueAreaChart = () => {

  const [filter, setFilter] = useState<FilterType>("Yearly");
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);

  const filters: FilterType[] = [
    "Today",
    "Weekly",
    "Monthly",
    "Yearly"
  ];

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        const res = await API.get("/dash/revenue",
          {
            params: {
              filter
            }
          }
        );
        setChartData(res.data);
      } catch (error) {
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();

  }, [filter]);

  const hasData = chartData.some(
    (item) => item.revenue > 0
  );

  const totalRevenue = chartData.reduce(
    (total, item) => total + item.revenue,
    0
  );


  const formatCurrency = (value: number) => {

    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }

    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }

    return value.toString();
  };


  return (

    <div className="w-full">
      <div className="flex flex-col gap-5 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2596be]/10 text-[#2596be]">
            <TrendingUp size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800 md:text-2xl">Revenue Performance</h2>
            <p className="mt-1 text-sm text-gray-500">Track clinic revenue for the selected period. </p>
          </div>
        </div>

        <div className="flex w-fit items-center gap-1 rounded-2xl border border-gray-100 bg-gray-50 p-1.5">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`
                rounded-xl px-4 py-2
                text-sm font-medium
                transition-all duration-300

                ${filter === item
                  ? "bg-[#2596be] text-white shadow-md"
                  : "text-gray-500 hover:bg-white hover:text-[#2596be]"
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Total Clinic Revenue</p>
          <div className="mt-1 flex items-end gap-2">
            <h3 className="text-3xl font-bold text-gray-800">LKR {totalRevenue.toLocaleString()}</h3>
            <span className="mb-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">{filter}</span>
          </div>
        </div>
      </div>

      <div className="mt-7">

        {loading ? (

          <div className="flex h-[400px] w-full flex-col items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#2596be]" />
            <p className="mt-4 text-sm font-medium text-gray-400">Loading revenue data...</p>
          </div>

        ) : !hasData ? (

          <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/60 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#2596be]/10 text-[#2596be]">
              <BarChart3 size={36} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-700">No Revenue Data</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
              No clinic revenue was recorded for the selected{" "}
              <span className="font-semibold text-gray-600">{filter.toLowerCase()}</span>{" "}period.
            </p>

            <p className="mt-1 text-xs text-gray-400">Select another period to view available revenue data.</p>
          </div>

        ) : (

          <div className="h-[400px] w-full">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 5,
                  bottom: 0
                }}
              >

                <defs>

                  <linearGradient
                    id="adminRevenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="5%"
                      stopColor="#2596be"
                      stopOpacity={0.35}
                    />

                    <stop
                      offset="95%"
                      stopColor="#2596be"
                      stopOpacity={0.03}
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#e5e7eb"
                />

                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#6b7280",
                    fontSize: 12
                  }}
                  dy={10}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#6b7280",
                    fontSize: 12
                  }}
                  tickFormatter={(value) =>
                    formatCurrency(value)
                  }
                />

                <Tooltip
                  formatter={(value: any) => [
                    `LKR ${Number(value).toLocaleString()}`,
                    "Revenue"
                  ]}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid #f3f4f6",
                    boxShadow:
                      "0 10px 30px rgba(0,0,0,0.08)",
                    padding: "12px 16px"
                  }}
                  labelStyle={{
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "5px"
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2596be"
                  strokeWidth={3}
                  fill="url(#adminRevenueGradient)"
                  activeDot={{
                    r: 6,
                    strokeWidth: 3,
                    fill: "#ffffff",
                    stroke: "#2596be"
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueAreaChart;