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
} from 'recharts';
import { useEffect, useState } from 'react';
import type { ChartDataType, FilterType } from '../../../../types/types';
import API from '../../../../api/axios';

const ComposeChart = () => {

  const [filter, setFilter] = useState<FilterType>("Yearly");
  const [chartData, setChartData] = useState<ChartDataType[]>([]);

  useEffect(() => {

    const fetchAnalytics = async () => {
      try {
        const res = await API.get(`/dash/appointments?filter=${filter}`);
        setChartData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAnalytics();
  }, [filter]);

  const hasData = chartData.some((item:any) => item.value > 0);

  if (!hasData) {
    return (

      <div className="flex h-full w-full flex-col items-center justify-center text-gray-400">
        <div className="mb-3 text-5xl">📊</div>

        <h3 className="text-lg font-semibold">
          No Appointment Data
        </h3>

        <p className="mt-1 text-sm text-center">
          No new appointment data
          were found for the selected period.
        </p>
      </div>
    );
  }

  return (
    <div>

      <div className="flex justify-between items-center flex-wrap gap-3">


        <div className="flex items-center gap-3 flex-wrap">

          <div className="flex gap-2">
            {['Today', 'Weekly', 'Monthly', 'Yearly'].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item as FilterType)}
                className={`px-3 py-1 rounded-lg text-sm border transition ${filter === item
                  ? 'bg-blue-500 text-white shadow'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height: '400px' }}>
        <ResponsiveContainer>
          <ComposedChart data={chartData}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Area
              type="monotone"
              dataKey="approved"
              fill="#559c46"
              stroke="#118b0d"
            />

            <Bar
              dataKey="total"
              barSize={20}
              fill="#2596be"
            />

            <Line
              type="monotone"
              dataKey="completed"
              stroke="#045d99"
            />

            <Line
              type="monotone"
              dataKey="paid"
              stroke="#208003"
            />

            <Line
              type="monotone"
              dataKey="canceled"
              stroke="#ef4444"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComposeChart;