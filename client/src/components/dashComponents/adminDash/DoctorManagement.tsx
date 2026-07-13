import { useState } from "react";
import Table from "./Table";
import { DoctorColumns } from "../../../../data";
import { Link } from "react-router-dom";
import Add from "./Add";
import type { DoctorUpdateLabelType } from "../../../../types/types";

const DoctorManagement = ({ data }: any) => {

    const [showForm, setShowForm] = useState(false);

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
        { key: "password", label: "Password :", placeholder: "********", type:"password"},

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
                                <Add updateLabel={doctorUpdateLabel} role={"doctor"}/>

                                <button
                                    onClick={() => setShowForm(false)}
                                    className=" mt-5 w-full border-none bg-red-500 shadow:md hover:bg-red-600 hover:shadow-xl p-2 rounded-xl text-white font-semibold">
                                    Close
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
                        <button className="px-3 py-1 rounded-lg border text-gray-600 hover:text-red-500 hover:border-red-500 transition">Delete</button>
                    </div>
                )}
            />
        </div>
    )
}

export default DoctorManagement