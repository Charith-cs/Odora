import { useParams } from 'react-router-dom';
import type { editViewUserProps } from '../../../../types/types'
import Charts from '../doctorDash/Charts'
import DetailCard from './DetailCard'
import Table from './Table'


const SharedEditView = ({ dataColumns, tableData, tableTitle, title, label, data, updateLabel, performanceData, revenueData, performanceConf, revenueConf, isUser }: editViewUserProps) => {

    const { id } = useParams();

    return (
        <div className="space-y-8">
            <section className="w-full">
                <DetailCard
                    title={title}
                    label={label}
                    data={data}
                    userId={id}
                    updateLabel={updateLabel}
                    img={data.img ? data.img : "/userDash/user.png"}
                />
            </section>

            <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-md md:p-6">
                <Table
                    columns={dataColumns}
                    data={tableData}
                    title={tableTitle}
                />
            </section>

            {!isUser && (
                <section className="space-y-8 ">
                    {/* Performance Chart */}
                    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-md md:p-6">
                        <h2 className="mb-6 text-2xl font-bold text-gray-800 md:text-3xl">
                            {performanceConf.title}
                        </h2>
                        <div className="h-[300px] md:h-[380px]">
                            <Charts
                                data={performanceData}
                                config={performanceConf}
                            />
                        </div>
                    </div>

                    {/* Revenue Chart */}
                    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-md md:p-6">
                        <h2 className="mb-6 text-2xl font-bold text-gray-800 md:text-3xl">
                            {revenueConf.title}
                        </h2>

                        <div className="h-[300px] md:h-[380px]">
                            <Charts
                                data={revenueData}
                                config={revenueConf}
                            />
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}

export default SharedEditView