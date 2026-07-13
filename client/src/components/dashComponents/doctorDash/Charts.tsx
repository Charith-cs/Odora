import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import type { Props } from '../../../../types/types';


const Charts = ({ data, config }: Props) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={config.xKey} />
          <YAxis />
          <Tooltip />

          {config.areas.map((area, index) => (
            <Area
              key={index}
              type="monotone"
              dataKey={area.key}
              stroke={area.color}
              fill={area.color}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Charts