import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import type { FilterType } from '../../../../types/types';
import API from '../../../../api/axios';

const RevenueAreaChart = () => {

  const [filter, setFilter] = useState<FilterType>('Yearly');
  const [chartData, setChartData] = useState<any[]>([]);

     useEffect(() => {

    const fetchRevenue = async () => {
      try {
        const res = await API.get(
          `/dash/revenue?filter=${filter}`
        );
        setChartData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRevenue();
  }, [filter]);

    const hasData = chartData.some((item:any) => item.value > 0);

  if (!hasData) {
    return (

      <div className="flex h-full w-full flex-col items-center justify-center text-gray-400">
        <div className="mb-3 text-5xl">📊</div>

        <h3 className="text-lg font-semibold">
          No Revenue Data
        </h3>

        <p className="mt-1 text-sm text-center">
          No revenue data
          were found for the selected period.
        </p>
      </div>
    );
  }


  return (
    <div className="">
      <div className=" flex flex-col items-start md:justify-between ">

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
      <div style={{ width: '100%', height: "400px" }}>
        <ResponsiveContainer>
          <AreaChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 0,
            }}

          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#058301"
              fill="#2bdb6f"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default RevenueAreaChart