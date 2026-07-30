import { useState } from "react";
import Table from "./Table";
import { DoctorColumns } from "../../../../data";
import { Link } from "react-router-dom";
import Add from "./Add";
import type { DoctorUpdateLabelType } from "../../../../types/types";
import { toast } from "react-hot-toast";
import API from "../../../../api/axios";

type Props = {
    data: any[];
    refresh: () => Promise<void>;
};

const DoctorManagement = ({
    data,
    refresh,
}: Props) => {

    const [showForm, setShowForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");

    const handleDelete = async () => {
        if (!selectedDoctorId) return;
        try {
            await API.delete(`/management/remove_doc/${selectedDoctorId}` ,{
                data:{
                    id:currentUser._id
                }
            });
            await refresh();
            setShowDeleteModal(false);
            setSelectedDoctorId(null);

            toast.success("Doctor deleted successfully.");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to delete doctor.");
        }
    };

    const formattedDoctors = data.map((doctor: any) => ({
        name: `${doctor?.userId?.firstName} ${doctor?.userId?.lastName}`,
        email: `${doctor?.userId?.email}`,
        tpnum: `${doctor?.userId?.mobileNumber}`,
        address: `${doctor?.userId?.address}`,
        _id: `${doctor?.userId?._id}`,
    }));

    const doctorUpdateLabel: DoctorUpdateLabelType[] = [
        { key: "firstName", label: "First name :", placeholder: "Jhon", type: "text" },
        { key: "lastName", label: "Last name :", placeholder: "Doe", type: "text" },
        { key: "email", label: "Email", placeholder: "example@gmail.com", type: "text" },
        { key: "mobileNumber", label: "Mobile number :", placeholder: "07xxxxxxxx", type: "text" },
        { key: "address", label: "Address :", placeholder: "ExampleStreet", type: "text" },
        { key: "birthDay", label: "Birth Day :", placeholder: "01/01/1970", type: "date" },
        { key: "gender", label: "Gender :", placeholder: "Gender", type: "text" },
        { key: "password", label: "Password :", placeholder: "********", type: "password" },

        { key: "slmcReg", label: "SLMC :", placeholder: "0000", type: "text" },
        { key: "university", label: "University :", placeholder: "Example university", type: "text" },
        { key: "experience", label: "Experience :", placeholder: "01", type: "text" },
        { key: "consultationFee", label: "Consultation Fee :", placeholder: "100", type: "text" },
        { key: "specialization", label: "Specialization :", placeholder: "example specialization", type: "text" },
        { key: "desc", label: "Description :", placeholder: "example Description", type: "text" },
        { key: "degree", label: "Name of the Degree :", placeholder: "example Description", type: "text" },
    ];

    return (
        <div className="mt-6 w-full">
            <div className="flex justify-between items-center my-2 ">
                <p className="text-sm text-gray-400">
                    Showing results ...
                </p>

                <div className="flex items-center gap-3">
                    <Link
                        to="/doctor_req"
                        className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-300 hover:border-[#2596be] hover:bg-[#2596be]/5 hover:text-[#2596be] hover:shadow-md"
                    >
                        <span>🏥</span>
                        <span>Join Requests</span>
                    </Link>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-[#2596be] hover:bg-[#2596be]/5 hover:shadow-md"
                    >
                        <img
                            src="./userDash/add-user.png"
                            alt="Add User"
                            className="h-6 w-6 transition-transform duration-300 hover:scale-110"
                        />
                    </button>
                </div>
                {showForm === true && (
                    <div className=" fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                        <div className="bg-white rounded-2xl shadow-xl w-[500px] h-[90%] overflow-hidden">

                            <div className="h-full overflow-y-auto p-6">
                                <Add updateLabel={doctorUpdateLabel} role={"doctor"} setShowForm={setShowForm} refresh={refresh} />

                                <button
                                    onClick={() => setShowForm(false)}
                                    className=" mt-5 w-full border-none bg-red-500 shadow:md hover:bg-red-600 hover:shadow-xl p-3 rounded-xl text-white font-semibold">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="w-[420px] rounded-2xl bg-white p-6 shadow-2xl">

                            <div className="flex justify-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                    <span className="text-3xl">🗑️</span>
                                </div>
                            </div>

                            <h2 className="mt-5 text-center text-xl font-bold text-gray-800"> Remove Doctor</h2>
                            <p className="mt-3 text-center text-gray-500">Are you sure you want to remove this doctor from clinic?</p>
                            <p className="mt-2 text-center text-sm text-red-500"> This action cannot be undone.</p>

                            <div className="mt-8 flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedDoctorId(null);
                                    }}
                                    className="flex-1 rounded-xl border border-gray-300 py-3 font-semibold text-gray-600 transition hover:bg-gray-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleDelete}
                                    className="flex-1 rounded-xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
                                >
                                    Remove
                                </button>

                            </div>
                        </div>
                    </div>
                )}
            </div>

            <hr className="my-2" />

            <Table
                columns={DoctorColumns}
                data={formattedDoctors}
                title={null}
                actions={(_row) => (
                    <div className="flex gap-2">
                        <Link to={`/view_edit_doctor/${_row._id}`} className="px-3 py-1 rounded-lg border text-gray-600 hover:text-sky-500 hover:border-sky-500 transition">View</Link>
                        <button
                            onClick={() => {
                                setSelectedDoctorId(_row._id);
                                setShowDeleteModal(true);
                            }}
                            className="px-3 py-1 rounded-lg border text-gray-600 hover:text-red-500 hover:border-red-500 transition"
                        >
                            Remove
                        </button>
                    </div>
                )}
            />
        </div>
    )
}

export default DoctorManagement