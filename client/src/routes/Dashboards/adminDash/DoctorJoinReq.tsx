import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import API from "../../../../api/axios";
import { JoinAdminColumns } from "../../../../data";
import Table from "../../../components/dashComponents/adminDash/Table";
import { email } from "zod";

const DoctorJoinReq = () => {

    const [joinRequests, setJoinRequests] = useState<any[]>([]);
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        const getRequests = async () => {
            try {
                const res = await API.get(`/clinic/pending_request/${currentUser._id}`);
                setJoinRequests(res.data);
            } catch (err: any) {
                toast.error(err.response?.data.message);
            }
        }
        getRequests();
    }, []);

    const formattedData = joinRequests.map((item: any) => ({
        id: item.doctorId._id,
        name: "Dr " + item.doctorId.firstName + " " + item.doctorId.lastName,
        email: item.doctorId.email,
        contact: item.doctorId.mobileNumber
    }));

    const handleApprove = async (doctorId: string) => {
        try {
            await API.patch(`/clinic/approve-request/${doctorId}`);
            toast.success("Request approved successfully!");
        } catch (err: any) {
            toast.error(err.response?.data.message || "Oops! Something went wrong");
        }
    }

    const handleReject = async (doctorId: string) => {
        try {
            await API.patch(`/clinic/reject-request/${doctorId}`);
            toast.success("Request rejected successfully!");
        } catch (err: any) {
            toast.error(err.response?.data.message || "Oops! Something went wrong");
        }
    }

    return (
        <div>
            <Table
                columns={JoinAdminColumns}
                data={formattedData}
                title={""}
                actions={(_row) => (
                    <div className="flex gap-2">
                        <button onClick={() => (handleApprove(_row.id))} className="px-3 py-1 rounded-lg border text-gray-600 hover:text-green-500 hover:border-green-500 transition">Approve</button>
                        <button onClick={() => (handleReject(_row.id))} className="px-3 py-1 rounded-lg border text-gray-600 hover:text-red-500 hover:border-red-500 transition">Reject</button>
                    </div>
                )}
            />
        </div>
    )
}

export default DoctorJoinReq
