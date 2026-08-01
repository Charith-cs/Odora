import { useParams } from 'react-router-dom';
import type { editViewUserProps } from '../../../../types/types'
import DetailCard from './DetailCard'
import Table from './Table'
import CommonChart from './CommonChart';


const SharedEditView = ({ dataColumns, tableData, tableTitle, title, label, data, staff, updateLabel, isUser, onRefresh }: editViewUserProps) => {

    const { id } = useParams();

    return (
        <div className="space-y-8">
            <section className="w-full">
                <DetailCard
                    title={title}
                    label={label}
                    data={data}
                    userId={id}
                    staff={staff}
                    updateLabel={updateLabel}
                    onRefresh={onRefresh}
                    img={data.img ? data.img : "/userDash/user.png"}
                />
            </section>

            {!isUser && (
                <section className="space-y-8 ">
                    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-md md:p-6 hover:shadow-xl">
                        <CommonChart id={id} />
                    </div>
                </section>
            )}

            <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-md md:p-6">
                <Table
                    columns={dataColumns}
                    data={tableData}
                    title={tableTitle}
                />
            </section>


        </div>
    )
}

export default SharedEditView