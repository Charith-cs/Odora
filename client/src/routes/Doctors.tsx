import Table from '../components/dashComponents/adminDash/Table'
import { DoctorListColumns } from '../../data'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../api/axios';

const Doctors = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState<any>();

    useEffect(() => {
        const getDetails = async () => {
            try {
                const res = await API.get(`/doctor/details/${id}`);
                setDoctor(res.data);
            } catch (err: any) {
                toast.error(err.response?.data.message)
            }
        }
        getDetails();
    }, [id]);

    const formattedDoctors = doctor?.clinic?.doctorList?.map((d: any) => ({
        _id: d?._id,
        clinic: doctor?.clinic?.clinicName,
        doctor:d.firstName + " " + d.lastName
    })) || [];

    return (
        <div>
            <Table
                columns={DoctorListColumns}
                data={formattedDoctors}
                title={"Available Session"}
                actions={(row) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate(`/${row._id}`)}
                            className="px-3 py-1 rounded-lg border text-gray-600 hover:text-green-500 hover:border-green-500 transition">Book now</button>
                    </div>
                )}
            />
        </div>
    )
}

export default Doctors
