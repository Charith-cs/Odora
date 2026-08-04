import Table from '../components/dashComponents/adminDash/Table'
import { SessionColumns } from '../../data'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../api/axios';

const Sessions = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    const [session, setSession] = useState<any[]>([]);
    const recordsPerPage = 10;

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;



    useEffect(() => {
        const getDetails = async () => {
            try {
                const res = await API.get(`/session/doctor/${id}`);
                setSession(res.data.sessions);
            } catch (err: any) {
                toast.error(err.response?.data.message)
            }
        }
        getDetails();
    }, [id]);

    const formattedSessions = session.map((s: any) => ({
        _id: s?._id,
        clinic: s.clinicId?.clinicName,
        date: s?.startDateTime.slice(0, 10),
        stime: s?.startDateTime.slice(11, 16),
        etime: s?.endDateTime.slice(11, 16),
    })) || [];

    const currentRecords = formattedSessions.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(formattedSessions.length / recordsPerPage);

    if (!formattedSessions) {
        return <div className="mt-6 w-full">Loading...</div>;
    }

    console.log({ "current record": session })

    return (
        <div>
            <Table
                columns={SessionColumns}
                data={currentRecords}
                title={"Available Session"}
                actions={(_row, index) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate(`/book/${formattedSessions[index]._id}`, {
                                state: {
                                    session: session[index],
                                    doctor: session[index].doctorId,
                                    clinic: session[index].clinicId,
                                }
                            })}
                            className="px-3 py-1 rounded-lg border text-gray-600 hover:text-green-500 hover:border-green-500 transition">Book now</button>
                    </div>
                )}
            />
            <div className="flex justify-center mt-6 gap-2">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-3 py-1 border rounded"
                >
                    Prev
                </button>

                <span>{currentPage} / {totalPages}</span>

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-3 py-1 border rounded"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default Sessions
