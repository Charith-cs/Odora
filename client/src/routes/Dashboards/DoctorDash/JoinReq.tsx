import { useEffect, useState } from 'react'
import Table from '../../../components/dashComponents/adminDash/Table';
import { toast } from 'react-hot-toast';
import API from '../../../../api/axios';
import { JoinColumns } from '../../../../data';

const JoinReq = () => {

    const [clinics, setClinics] = useState<any[]>([]);


    useEffect(() => {
        const getClinics = async () => {
            try {
                const res = await API.get("/clinic");
                setClinics(res.data.clinics);
            } catch (err) {
                toast.error("No clinics found!");
            }
        } 
        getClinics();
    }, []);

    const formattedData = clinics.map((item: any) => ({
        id: item._id,
        name: item.clinicName,
        address: item.address,
        contact: item.email + " " + item.mobileNumber,
        registered: item.doctorList.length
    }));

    const handleJoin = async (clinicId: string) => {
        try {
            const res = await API.post(`/clinic/request-join/${clinicId}`);
            toast.success(res?.data?.message);
        } catch (err:any) {
             toast.error(err.response?.data?.message || "Something went wrong");
        }
    }


    return (
        <div>
            <Table
                columns={JoinColumns}
                data={formattedData}
                title={""}
                actions={(_row) => (
                    <div className="flex gap-2">
                        <button onClick={() => (handleJoin(_row.id))} className="px-3 py-1 rounded-lg border text-gray-600 hover:text-green-500 hover:border-green-500 transition">Request Now</button>
                        {/* <button className="px-3 py-1 rounded-lg border text-gray-600 hover:text-red-500 hover:border-red-500 transition">Delete</button> */}
                    </div>
                )}
            />
        </div>
    )
}

export default JoinReq
