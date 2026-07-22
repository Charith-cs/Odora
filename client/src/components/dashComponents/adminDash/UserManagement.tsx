import { useState } from "react";
import Table from "./Table";
import { columns} from "../../../../data";
import { Link } from "react-router-dom";
import Add from "./Add";
import type { UpdateLabelType } from "../../../../types/types";

const UserManagement = ({ data }: any) => {

    const formattedUsers = data.map((user: any) => ({
        ...user,
        name: `${user.firstName} ${user.lastName}`,
    }));

    const [showForm, setShowForm] = useState(false);
 
    const userUpdateLabel:UpdateLabelType[] = [
        { key: "firstName", label: "First name :", placeholder:"Jhon" ,type:"text"  },
        { key: "lastName", label: "Last name :", placeholder:"Doe" ,type:"text"},
        { key: "email", label: "Email :", placeholder:"example@gmail.com", type:"email"},
        { key: "mobileNumber", label: "Mobile number :", placeholder:"07xxxxxxxx" ,type:"text"},
        { key: "birthDay", label: "Birth Day :", placeholder:"01/01/1970", type:"date"},
        { key: "gender", label: "Gender :", placeholder: "Gender" ,type:"text"},
        { key: "address", label: "Address :", placeholder: "ExampleStreet" ,type:"text"},
        { key: "password", label: "Password :", placeholder: "********", type:"password"},
    ];

    return (
        <div className="mt-6 w-full">
            <div className="flex justify-between items-center my-2 ">
                <p className="text-sm text-gray-400">
                    Showing results...
                </p>

                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-transparent border-none"
                >
                    <img src="./userDash/add-user.png" alt="addimg" className=" w-8 h-8 hover:shadow-xl hover:translate-y-1 transition hover:scale-105 duration-300" />
                </button>
                {showForm === true && (
                    <div className=" fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                        <div className="bg-white rounded-2xl shadow-xl w-[500px] h-[90%] overflow-hidden">

                            <div className="h-full overflow-y-auto p-6">
                                <Add updateLabel={userUpdateLabel} setShowForm={setShowForm} role={"user"}/>

                                <button
                                    onClick={() => setShowForm(false)}
                                    className=" mt-5 w-full border-none bg-red-500 shadow:md hover:bg-red-600 hover:shadow-xl px-5 py-3.5 rounded-2xl text-white font-semibold">
                                    Close
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
                actions={(_row) => (
                    <div className="flex gap-2">
                        <Link to={`/view_edit/${_row._id}`} className="px-3 py-1 rounded-lg border text-gray-600 hover:text-sky-500 hover:border-sky-500 transition">View</Link>
                        <button className="px-3 py-1 rounded-lg border text-gray-600 hover:text-red-500 hover:border-red-500 transition">Delete</button>
                    </div>
                )}
            />
        </div>
    );
};

export default UserManagement;