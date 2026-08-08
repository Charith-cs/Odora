import { useEffect, useState } from "react";
import Table from "../../../components/dashComponents/adminDash/Table";
import { RefundColumns } from "../../../../data";
import API from "../../../../api/axios";
import { toast } from "react-hot-toast";


const Refund = () => {

    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [refund, setRefund] = useState<any[]>([]);
    const [selectedBillingId, setSelectedBillingId] = useState<string | null>(null);


    const getRefund = async () => {
        try {
            const res = await API.get(`/dash/refund/${currentUser._id}`);
            setRefund(res.data);
        } catch (err: any) {
            console.log(err);
        }
    }

    useEffect(() => {
        getRefund();
    }, [currentUser._id]);

    const formattedRefund = refund.map((item: any) => ({
        _id: item?._id,
        name: item?.userId?.firstName + " " + item?.userId?.lastName,
        doctor: "Dr. " + item?.doctorId?.firstName + " " + item?.doctorId?.lastName,
        contact: item?.userId?.mobileNumber,
        reason: item?.refundRequests[0]?.reason,
        amount: item?.refundRequests[0]?.amount
    }));

    console.log(refund)


    const handleApprove = async (id: any) => {
        try {
            await API.post(`/dash/refund_approve/${id}`);
            toast.success("Refund request accepted");
            await getRefund();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Oops! Something went wrong");
        }
    };

    const handleReject = async (id: any) => {
        try {
            await API.post(`/dash/reject_refund/${id}`);
            toast.success("Refund request Rejected");
            await getRefund();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Oops! Something went wrong");
        }
    };

    return (
        <div className="mt-6 w-full">
            <div className="flex justify-between items-center my-2 ">
                <p className="text-sm text-gray-400">
                    Showing results ...
                </p>

                {showApproveModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="w-[420px] rounded-2xl bg-white p-6 shadow-2xl">

                            <div className="flex justify-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                                    <span className="text-3xl">↻</span>
                                </div>
                            </div>

                            <h2 className="mt-5 text-center text-xl font-bold text-gray-800"> Approve Refund Request</h2>
                            <p className="mt-3 text-center text-gray-500">Are you sure you want to approve this refund request?</p>
                            <p className="mt-2 text-center text-sm text-red-500"> This action cannot be undone.</p>

                            <div className="mt-8 flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowApproveModal(false);
                                        handleApprove(selectedBillingId);
                                    }}
                                    className="flex-1 rounded-xl border border-gray-300 py-3 font-semibold text-gray-600 transition hover:bg-gray-100"
                                >
                                    Approve
                                </button>

                                <button
                                    onClick={() => {
                                        setShowApproveModal(false);
                                    }}
                                    className="flex-1 rounded-xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
                                >
                                    Reject
                                </button>

                            </div>
                        </div>
                    </div>
                )}
            </div>

            <hr className="my-2" />

            <Table
                columns={RefundColumns}
                data={formattedRefund}
                title={null}
                actions={(_row) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setShowApproveModal(true);
                                setSelectedBillingId(_row._id)
                            }}
                            className="px-3 py-1 rounded-lg border text-gray-600 hover:text-green-500 hover:border-green-500 transition"
                        >
                            Approve
                        </button>

                        <button
                            onClick={() => handleReject(_row._id)}
                            className="px-3 py-1 rounded-lg border text-gray-600 hover:text-red-500 hover:border-red-500 transition">
                            Remove
                        </button>
                    </div>
                )}
            />
        </div>
    )
}

export default Refund
