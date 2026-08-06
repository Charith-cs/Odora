import { useState } from "react";
import Table from "./Table";
import { columns } from "../../../../data";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import API from "../../../../api/axios";

type Props = {
    data: any[];
    refresh: () => Promise<void>;
};

const UserManagement = ({ data, refresh, }: Props) => {

    const formattedUsers = data.map((user: any) => ({
        ...user,
        name: `${user.firstName} ${user.lastName}`,
    }));

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    

    const handleDelete = async () => {
        if (!selectedUserId) return;

        try {
            await API.delete(`/management/remove_user/${selectedUserId}`, {
                data: {
                    id: currentUser._id
                }
            });
            await refresh();
            setShowDeleteModal(false);
            setSelectedUserId(null);

            toast.success("User deleted successfully.");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to delete user.");
        }
    };

    return (
        <div className="mt-6 w-full">
            <div className="flex justify-between items-center my-2 ">
                <p className="text-sm text-gray-400">
                    Showing results...
                </p>

                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="w-[420px] rounded-2xl bg-white p-6 shadow-2xl">

                            <div className="flex justify-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                    <span className="text-3xl">🗑️</span>
                                </div>
                            </div>

                            <h2 className="mt-5 text-center text-xl font-bold text-gray-800"> Delete Appointments</h2>
                            <p className="mt-3 text-center text-gray-500">Are you sure you want to delete future appointments to this clinic from this user?</p>
                            <p className="mt-2 text-center text-sm text-red-500"> This action cannot be undone.</p>

                            <div className="mt-8 flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedUserId(null);
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
                columns={columns}
                data={formattedUsers}
                title={null}
                actions={(_row:any) => (
                    <div className="flex gap-2">
                        <Link to={`/view_edit/${_row._id}`} className="px-3 py-1 rounded-lg border text-gray-600 hover:text-sky-500 hover:border-sky-500 transition">View</Link>
                        <button
                            onClick={() => {
                                setSelectedUserId(_row._id);
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
    );
};

export default UserManagement;