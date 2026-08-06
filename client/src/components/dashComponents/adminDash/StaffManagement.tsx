import { useEffect, useState } from "react";
import Table from "./Table";
import { StaffColumns, StaffUpdateLabel } from "../../../../data";
import { Link } from "react-router-dom";
import Add from "./Add";
import { toast } from "react-hot-toast";
import API from "../../../../api/axios";


type Props = {
    data: any[];
    refresh: () => Promise<void>;
};

const StaffManagement = ({
    data,
    refresh,
}: Props) => {

    const [showForm, setShowForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const [clinic, setClinic] = useState<any>();

    useEffect(() => {
        const getClinic = async () => {
            try {
                const res = await API.get(`/dash/clinic/${currentUser._id}`);
                setClinic(res.data);
            } catch (err: any) {
                console.error(err);
            }
        }
        getClinic();
    }, [currentUser])

    const handleDelete = async () => {
        if (!selectedStaffId) return;

        try {
            await API.delete(`/management/remove_staff/${selectedStaffId}`, {
                data: {
                    id: currentUser._id
                }
            });
            await refresh();
            setShowDeleteModal(false);
            setSelectedStaffId(null);

            toast.success("Staff deleted successfully.");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to delete Staff.");
        }
    };

    const formattedStaff = data.map((s: any) => ({
        account: s.staffName,
        clinic: s.clinicName,
        clinicId: s.clinicId,
        transactions: s.totalBilling,
        _id: `${s?.details?._id}`,
    }));

    console.log(formattedStaff)



    const StaffUpdateLabel = [
        { key: "firstName", label: "First name :", placeholder: "Jhon", type: "text" },
        { key: "lastName", label: "Last name :", placeholder: "Doe", type: "text" },
        { key: "email", label: "Email", placeholder: "example@gmail.com", type: "text" },
        { key: "mobileNumber", label: "Mobile number :", placeholder: "07xxxxxxxx", type: "text" },
        { key: "address", label: "Address :", placeholder: "ExampleStreet", type: "text" },
        { key: "birthDay", label: "Birth Day :", placeholder: "01/01/1970", type: "date" },
        { key: "gender", label: "Gender :", placeholder: "Gender", type: "text" },
        { key: "clinic", label: "Clinic : ", value: clinic|| "", type: "text", disabled: true },
        { key: "password", label: "Password :", placeholder: "********", type: "password" }
    ];


    return (
        <div className="mt-6 w-full">
            <div className="flex justify-between items-center my-2 ">
                <p className="text-sm text-gray-400">
                    Showing results ...
                </p>

                {clinic && <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-[#2596be] hover:bg-[#2596be]/5 hover:shadow-md"
                >
                    <img
                        src="./userDash/add-user.png"
                        alt="Add User"
                        className="h-6 w-6 transition-transform duration-300 hover:scale-110"
                    />
                </button>}
                {showForm === true && (
                    <div className=" fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                        <div className="bg-white rounded-2xl shadow-xl w-[500px] h-[90%] overflow-hidden">

                            <div className="h-full overflow-y-auto p-6">
                                <Add updateLabel={StaffUpdateLabel} role={"staff"} setShowForm={setShowForm} refresh={refresh} />

                                <button
                                    onClick={() => setShowForm(false)}
                                    className=" mt-5 w-full  border-none bg-red-500 shadow:md hover:bg-red-600 hover:shadow-xl p-3 rounded-xl text-white font-semibold">
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

                            <h2 className="mt-5 text-center text-xl font-bold text-gray-800"> Delete Staff</h2>
                            <p className="mt-3 text-center text-gray-500">Are you sure you want to delete this staff?</p>
                            <p className="mt-2 text-center text-sm text-red-500"> This action cannot be undone.</p>

                            <div className="mt-8 flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedStaffId(null);
                                    }}
                                    className="flex-1 rounded-xl border border-gray-300 py-3 font-semibold text-gray-600 transition hover:bg-gray-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleDelete}
                                    className="flex-1 rounded-xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
                                >
                                    Delete
                                </button>

                            </div>
                        </div>
                    </div>
                )}
            </div>

            <hr className="my-2" />

            <Table
                columns={StaffColumns}
                data={formattedStaff}
                title={null}
                actions={(_row) => (
                    <div className="flex gap-2">
                        <Link to={`/view_edit_staff/${_row._id}`} className="px-3 py-1 rounded-lg border text-gray-600 hover:text-sky-500 hover:border-sky-500 transition">View</Link>
                        <button
                            onClick={() => {
                                setSelectedStaffId(_row._id);
                                setShowDeleteModal(true);
                            }}
                            className="px-3 py-1 rounded-lg border text-gray-600 hover:text-red-500 hover:border-red-500 transition"
                        >
                            Delete
                        </button>
                    </div>
                )}
            />
        </div>
    )
}

export default StaffManagement