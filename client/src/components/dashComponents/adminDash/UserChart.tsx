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
        { name: 'New registration', value: data?.newPatients },
    ];

    const hasData =
        data &&
        (data.returningPatients > 0 || data.newPatients > 0);

    return (
        <>
            {!hasData ? (
                <div className="flex flex-col h-full items-center justify-center ">
                    <span className="">📄</span>
                   <h2 className="text-gray-400"> No Data Found</h2>
                </div>)
                :
                (<PieChart
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
                </PieChart>)
            }
        </>
    )
}

export default UserChart