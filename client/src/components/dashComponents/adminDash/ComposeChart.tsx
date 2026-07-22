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
  Scatter,
  ResponsiveContainer
} from 'recharts';
import { useEffect, useState } from 'react';
import type { ChartDataType, FilterType } from '../../../../types/types';
import API from '../../../../api/axios';

const ComposeChart = () => {

  const [filter, setFilter] = useState<FilterType>("Monthly");
  const [chartData, setChartData] = useState<ChartDataType[]>([]);


  useEffect(() => {

    const fetchAnalytics = async () => {
      try {

        const res = await API.get(
          `/dash/appointments?filter=${filter}`
        );
        setChartData(res.data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchAnalytics();

  }, [filter]);

  return (
    <div>

      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-2xl md:text-3xl font-semibold my-5">
          Total Appointments
        </h1>

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

            <XAxis dataKey="month" />

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
              fill="#0615e4"
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


            <Scatter
              dataKey="canceled"
              fill="red"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComposeChart;