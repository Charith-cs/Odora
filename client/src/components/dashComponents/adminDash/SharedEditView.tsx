import { useParams } from 'react-router-dom';
import type { editViewUserProps } from '../../../../types/types'
import Charts from '../doctorDash/Charts'
import DetailCard from './DetailCard'
import Table from './Table'


const SharedEditView = ({ dataColumns, tableData, tableTitle, title, label, data, updateLabel, performanceData, revenueData, performanceConf, revenueConf, isUser }: editViewUserProps) => {
   
    const {id} = useParams();
   
    return (
        <div className="mt-6 grid grid-cols-1 gap-8">
            <div>
                <DetailCard
                    title={title}
                    label={label}
                    data={data}
                    userId={id}
                    updateLabel={updateLabel}
                    img={ data.img ? data.img : "/userDash/user.png"}
                />
            </div>

            <div className=' max-h-[80vh]'>
                <Table
                    columns={dataColumns}
                    data={tableData}
                    title={tableTitle}
                />
            </div>

            {isUser === false && (
                <div>
                    <h1 className="text-3xl font-semibold my-5">{performanceConf.title}</h1>
                    <div className="w-full h-[300px]">
                        <Charts data={performanceData} config={performanceConf} />
                    </div>

                    <h1 className="text-3xl font-semibold my-5">{revenueConf.title}</h1>
                    <div className="w-full h-[300px]">
                        <Charts data={revenueData} config={revenueConf} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default SharedEditView