import { Pie, PieChart, Tooltip, type TooltipIndex } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';


type chartType = {
    isAnimationActive?: boolean;
    defaultIndex?: TooltipIndex;
    data: any
}

const UserChart = ({ isAnimationActive, defaultIndex, data }: chartType) => {

    const data02 = [
        { name: 'Returning patients', value: data?.returningPatients },
        { name: 'New registration', value: data?.newPatients},
    ];

    return (
        <PieChart
            style={{ width: '100%', height: '100%', maxWidth: '500px', maxHeight: '80vh', aspectRatio: 1, display: "flex", justifyContent: "center", alignItems: "center" }}
            responsive
        >
            <Pie
                data={data02}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                fill="#5f88d4"
                label
                isAnimationActive={isAnimationActive}
            />
            <Tooltip defaultIndex={defaultIndex} />
            <RechartsDevtools />
        </PieChart>
    )
}

export default UserChart