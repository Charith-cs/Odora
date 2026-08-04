import { useLocation, useNavigate } from "react-router-dom";
import { formattedDate, formattedTime } from "../../services/timeService";
import toast from "react-hot-toast";
import API from "../../api/axios";
import { useState } from "react";


const Bookappointment = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [button, setButtton] = useState(false);

    const session = location.state?.session;
    const doctor = location.state?.doctor;
    const clinic = location.state?.clinic;
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const AC = 100;
    const total = session?.fee + AC;

    const handleBook = () => {
        setButtton(true);
    }

    const handleSubmit = async () => {
        const dateTime = new Date(session.startDateTime);

        const data = {
            userId: user._id,
            doctorId: doctor._id,
            clinicId: clinic._id,
            sessionId: session._id,
            dateTime: dateTime.toISOString(),
            fee: total,
            method: "visit",
            status: "pending",
        };

        try {
            const res = await API.post("/appointment", data);
            setButtton(false);
            toast.success(res.data.message);
            navigate(`/my_appointment/${user._id}`,{
                replace:true
            });
        } catch (err: any) {
            setButtton(false);
            toast.error(err.response?.data?.message || "Request failed");
        }
    };

    return (
        <>
            {button && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-[420px] rounded-2xl bg-white p-6 shadow-2xl">

                        <div className="flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <span className="text-3xl">✔️</span>
                            </div>
                        </div>

                        <h2 className="mt-5 text-center text-xl font-bold text-gray-800"> Confirm Appointment</h2>
                        <p className="mt-3 text-center text-gray-500">Are you sure you want to book this appointment?</p>
                        <p className="mt-2 text-center text-sm text-red-500"> This action cannot be undone.</p>

                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={handleSubmit}
                                className="flex-1 rounded-xl border bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600"
                            >
                                Confirm
                            </button>

                            <button

                                onClick={() => setButtton(false)}
                                className="flex-1 rounded-xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                </div>
            )}
            <div className=" mt-6 grid grid-cols-1">
                <div className="group bg-white rounded-2xl shadow-md p-3 mt-2 mb-2 flex flex-col w-full ">

                    <div className=" w-full flex flex-row justify-between">
                        <span className="flex items-center justify-center text-center cursor-pointer">
                            <img src={doctor.img ?? ".userDash/user.png"} alt="clinicimg" className=" w-16 h-16 rounded-full object-cover" />
                            <span className=" ml-8 text-start">
                                <h2 className=" font-semibold">Dr. {doctor.firstName + " " + doctor.lastName}</h2>
                            </span>
                        </span>
                        <h1 className=" text-end text-sm font-semibold">{formattedDate} <br />{formattedTime}</h1>
                    </div>

                    <div className=" bg-yellow-200 rounded-2xl shadow-md p-4 mt-5 mb-2 flex items-center justify-center gap-5">
                        <img src="/icons/warning.png" alt="warning" className=" w-8 h-8 " />
                        <h1 className=" text-yellow-900">Your appointment is not confirmed yet. Please click on the 'Confirm' button to pay & confirm your appointment.</h1>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-10 w-full divide-y md:divide-y-0 md:divide-x">

                        {/* Appointment Details */}
                        <div className="flex flex-col w-full md:pr-6">
                            <h1 className="text-xl text-[#2596be] font-semibold mb-3">Your Appointment Details</h1>

                            <div className="flex justify-between mt-2">
                                <span className="font-bold text-sm">Name</span>
                                <span className=" text-sm">{user.firstName + " " + user.lastName}</span>
                            </div>

                            <div className="flex justify-between mt-2">
                                <span className="font-bold text-sm">Mobile Number</span>
                                <span className=" text-sm">{user.mobileNumber}</span>
                            </div>

                            <div className="flex justify-between mt-2">
                                <span className="font-bold text-sm">Doctor</span>
                                <span className=" text-sm">Dr. {doctor.firstName + " " + doctor.lastName}</span>
                            </div>

                            <div className="flex justify-between mt-2">
                                <span className="font-bold text-sm">Clinic</span>
                                <span className=" text-sm">{clinic.clinicName}</span>
                            </div>

                            <div className="flex justify-between mt-2">
                                <span className="font-bold text-sm">Appointment Time</span>
                                <span className="text-right text-sm">
                                    {new Date(session.startDateTime).toLocaleDateString("en-GB")} <br />
                                    {new Date(session.startDateTime).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}{" "}
                                    to{" "}
                                    {new Date(session.endDateTime).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Billing Details */}
                        <div className="flex flex-col w-full md:pl-6">
                            <h1 className="text-xl text-[#2596be] font-semibold mb-3">Your Billing Details</h1>

                            <div className="flex justify-between mt-2">
                                <span className="font-bold text-sm">Doctor Fee</span>
                                <span className=" text-sm">Rs:{session?.fee}</span>
                            </div>


                            <div className="flex justify-between mt-2">
                                <span className="font-bold text-sm">Appointment Charge</span>
                                <span className=" text-sm">Rs: {AC}</span>
                            </div>

                            <hr className="my-5" />

                            <div className="flex justify-between mt-2 text-lg font-semibold">
                                <span>Total Payment</span>
                                <span>Rs:{session?.fee + AC}</span>
                            </div>

                            <hr className="my-2" />

                            <div className="flex flex-col mt-3 items-start ">
                                <span className=" text-lg font-semibold mb-2">Select Payment Method</span>
                                <span className=" flex gap-6">
                                    <input type="radio" className="" defaultChecked />
                                    <h1 className="">On visit</h1>
                                </span>
                                <span className=" flex gap-6">
                                    <input type="radio" className="cursor-not-allowed" disabled />
                                    <h1 className=" text-gray-600 cursor-not-allowed">Online Banking (Not available at this moment)</h1>
                                </span>
                            </div>

                            <hr className="my-5" />

                            <div className="flex justify-between mt-2 mb-4">
                                <button onClick={handleBook} className=" w-2/5 mt-10 border-none bg-green-500 shadow:md hover:bg-green-600 hover:shadow-xl p-2 rounded-xl text-white font-semibold">Confirm appointment</button>
                                <button onClick={() => navigate(`/${doctor._id}`)} className=" w-2/5 mt-10 border-none bg-red-500 shadow:md hover:bg-red-600 hover:shadow-xl p-2 rounded-xl text-white font-semibold">Cancel appointment</button>
                            </div>
                        </div>

                    </div>


                </div>

            </div>
        </>
    )
}

export default Bookappointment
