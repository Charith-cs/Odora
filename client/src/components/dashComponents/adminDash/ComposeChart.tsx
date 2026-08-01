import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

import { useEffect, useState } from "react";
import { CalendarCheck, BarChart3 } from "lucide-react";

import type {
  ChartDataType,
  FilterType
} from "../../../../types/types";

import API from "../../../../api/axios";


const ComposeChart = () => {

  const [filter, setFilter] = useState<FilterType>("Yearly");
  const [chartData, setChartData] = useState<ChartDataType[]>([]);
  const [loading, setLoading] = useState(false);

  const filters: FilterType[] = [
    "Today",
    "Weekly",
    "Monthly",
    "Yearly"
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await API.get("/dash/appointments",
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
    fetchAnalytics();

  }, [filter]);

  const hasData = chartData.some((item: any) =>
    (item.total ?? 0) > 0 ||
    (item.approved ?? 0) > 0 ||
    (item.completed ?? 0) > 0 ||
    (item.paid ?? 0) > 0 ||
    (item.canceled ?? 0) > 0
  );

  const totalAppointments = chartData.reduce(
    (total: number, item: any) =>
      total + (item.total ?? 0),
    0
  );


  return (

    <div className="w-full">

      <div className="flex flex-col gap-5 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2596be]/10 text-[#2596be]">
            <CalendarCheck size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 md:text-2xl"> Appointment Performance</h2>
            <p className="mt-1 text-sm text-gray-500"> Track clinic appointments and their status for the selected period.</p>
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
          <p className="text-sm font-medium text-gray-500">Total Appointments</p>
          <div className="mt-1 flex items-end gap-2">
            <h3 className="text-3xl font-bold text-gray-800">{totalAppointments.toLocaleString()}</h3>
            <span className="mb-1 rounded-full bg-[#2596be]/10 px-3 py-1 text-xs font-semibold text-[#2596be]">{filter}</span>
          </div>
        </div>
      </div>

      <div className="mt-7">
        {loading ? (

          <div className="flex h-[400px] w-full flex-col items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#2596be]" />
            <p className="mt-4 text-sm font-medium text-gray-400">Loading appointment data...</p>

          </div>

        ) : !hasData ? (

          <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/60 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#2596be]/10 text-[#2596be]">
              <BarChart3 size={36} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-700">No Appointment Data</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
              No appointments were found for the selected{" "}
              <span className="font-semibold text-gray-600">
                {filter.toLowerCase()}
              </span>{" "}period.
            </p>
            <p className="mt-1 text-xs text-gray-400">Select another period to view available appointment data.</p>

          </div>

        ) : (

          <div className="h-[400px] w-full">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <ComposedChart
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
                    id="appointmentGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="5%"
                      stopColor="#21a262"
                      stopOpacity={0.30}
                    />

                    <stop
                      offset="95%"
                      stopColor="#21a262"
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
                  allowDecimals={false}
                  tick={{
                    fill: "#6b7280",
                    fontSize: 12
                  }}
                />

                <Tooltip
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
                    marginBottom: "7px"
                  }}
                />

                <Legend
                  verticalAlign="top"
                  align="right"
                  height={40}
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: "12px"
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="approved"
                  name="Approved"
                  stroke="#21a262"
                  strokeWidth={2}
                  fill="url(#appointmentGradient)"
                />

                <Bar
                  dataKey="total"
                  name="Total"
                  barSize={18}
                  fill="#2596be"
                  radius={[6, 6, 0, 0]}
                />

                <Line
                  type="monotone"
                  dataKey="completed"
                  name="Completed"
                  stroke="#045d99"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    fill: "#ffffff",
                    stroke: "#045d99"
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="paid"
                  name="Paid"
                  stroke="#21a262"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    fill: "#ffffff",
                    stroke: "#21a262"
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="canceled"
                  name="Canceled"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    fill: "#ffffff",
                    stroke: "#ef4444"
                  }}
                />

              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComposeChart;