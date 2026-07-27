import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { revenueChartData } from '../../../../data';
import { useEffect, useState } from 'react';
import type { FilterType } from '../../../../types/types';
import API from '../../../../api/axios';

const RevenueAreaChart = () => {

  const [filter, setFilter] = useState<FilterType>('Monthly');
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


  return (
    <div className="">
      <div className=" flex flex-col items-start md:justify-between ">
        <h1 className="text-2xl md:text-3xl font-semibold my-5 text-[#2596be]">
          Revenue Trend
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
            <XAxis dataKey="month" />
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