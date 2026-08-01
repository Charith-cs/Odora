import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

import type { Props } from "../../../../types/types";

const Charts = ({ data, config }: Props) => {

  return (
    <div className="w-full">

      <div className="h-[300px] w-full sm:h-[340px] md:h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >

            <defs>

              {config.areas.map((area, index) => (

                <linearGradient
                  key={area.key}
                  id={`areaGradient-${index}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={area.color}
                    stopOpacity={0.35}
                  />

                  <stop
                    offset="95%"
                    stopColor={area.color}
                    stopOpacity={0.03}
                  />

                </linearGradient>

              ))}

            </defs>


            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey={config.xKey}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6b7280",
                fontSize: 12,
              }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6b7280",
                fontSize: 12,
              }}
              width={45}
            />

            <Tooltip
              cursor={{
                stroke: "#d1d5db",
                strokeDasharray: "4 4",
              }}
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                padding: "12px 16px",
              }}
              labelStyle={{
                color: "#374151",
                fontWeight: 600,
                marginBottom: "5px",
              }}
            />

            {config.areas.map((area, index) => (
              <Area
                key={area.key}
                type="monotone"
                dataKey={area.key}
                stroke={area.color}
                strokeWidth={2.5}
                fill={`url(#areaGradient-${index})`}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;