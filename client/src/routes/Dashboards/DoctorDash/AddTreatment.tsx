import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import API from '../../../../api/axios';
import toast from 'react-hot-toast';

const AddTreatment = () => {

    const { id } = useParams();
    const [fetchedData, setFetchedData] = useState<any>(null);
    const now = new Date();
    const [treatmentDetails, setTreatmentDetails] = useState<any[]>([]);
    const [treatment, setTreatment] = useState("");
    const [value, setValue] = useState("");
    const [special, setSpecial] = useState("");
    const navigate = useNavigate();

    const totalAmount = treatmentDetails.reduce(
        (total, item) => total + Number(item.price),
        0
    );

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const res = await API.get(`/appointment/treat/${id}`);
                setFetchedData(res.data)
            } catch (err) {
                toast.error("Oops! Something went wrong");
            }
        }
        fetchAppointment();
    }, [id]);

    const handleAdd = () => {
        if (!treatment || !value) return;

        const newItem = {
            id: Date.now(),
            name: treatment,
            price: Number(value)
        };

        if (!isNaN(Number(newItem.price))) {
            setTreatmentDetails((prev) => [...prev, newItem]);

            setTreatment("");
            setValue("");
            setSpecial("");
        } else {
            toast.error("Please input a valid price");
        }
    };

    const handleRemove = (id: number) => {
        setTreatmentDetails((prev) =>
            prev.filter((item) => item.id !== id)
        );
    };

    if (!fetchedData) {
        return <div className="mt-6">Loading...</div>;
    }

    const createTreatment = async () => {
        try {
            const data = {
                userId: fetchedData.appointment.userId._id,
                appointmentId: fetchedData.appointment._id,
                sessionId: fetchedData.appointment.sessionId,
                doctorId: fetchedData.appointment.doctorId._id,
                treatments: treatmentDetails,
                specialNotes: special
            }
            const res = await API.post("/treatment", data);
            toast.success(res?.data?.message);
            navigate("/doctor_appointments");
        } catch (err) {
            toast.error("Oops! Something went wrong. Check your inputs");
        }
    }

       console.log(fetchedData);

    return (
        <div className="mt-8 grid grid-cols-1 gap-8 ">
            <div className="space-y-8">

                {/* Appointment Information */}
                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2596be]/10">
                                <img src="/userDash/calendar (2).png" alt="appointment" className="h-6 w-6" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Appointment Information</h2>
                                <p className="text-sm text-gray-500">View doctor, patient and appointment details.</p>
                            </div>
                        </div>

                        <Link 
                        to={"/past"} 
                        className="flex items-center justify-center gap-3 rounded-2xl border border-[#2596be] bg-white px-5 py-3 font-semibold text-[#2596be] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2596be] hover:text-white"
                        state={{data:fetchedData?.history}}
                        >
                            Check Past Appointments
                            <span className="rounded-full bg-[#2596be]/10 px-3 py-1 text-xs font-bold text-[#2596be] group-hover:bg-white/20">{fetchedData?.history?.length}</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                            <p className="text-xs uppercase tracking-wide text-gray-400">Doctor</p>
                            <p className="mt-2 font-semibold text-gray-800">
                                Dr. {fetchedData?.appointment?.doctorId?.firstName}{" "}
                                {fetchedData?.appointment?.doctorId?.lastName}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                            <p className="text-xs uppercase tracking-wide text-gray-400">Clinic</p>
                            <p className="mt-2 font-semibold text-gray-800">{fetchedData?.appointment?.clinicId?.clinicName}</p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                            <p className="text-xs uppercase tracking-wide text-gray-400">Patient</p>
                            <p className="mt-2 font-semibold text-gray-800">
                                {fetchedData?.appointment?.userId?.firstName}{" "}
                                {fetchedData?.appointment?.userId?.lastName}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                            <p className="text-xs uppercase tracking-wide text-gray-400">Today</p>
                            <p className="mt-2 font-semibold text-gray-800">{now.toDateString()}</p>
                        </div>
                    </div>
                </div>

                {/* Treatment Form */}

                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md">
                    <h2 className="mb-8 text-2xl font-bold text-gray-800">Add Treatment</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="md:col-span-2">

                            <label className="mb-2 block text-sm font-semibold text-gray-700">Treatment Name</label>
                            <input
                                type="text"
                                value={treatment}
                                onChange={(e) => setTreatment(e.target.value)}
                                placeholder="Composite Filling"
                                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-[#2596be] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2596be]/10"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">Treatment Amount (Rs.)</label>
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder="5000.00"
                                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-[#2596be] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2596be]/10"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">Total Amount</label>
                            <div className="rounded-2xl border border-[#2596be]/20 bg-[#2596be]/5 px-5 py-3">

                                <p className="text-xs uppercase text-gray-500">Current Total</p>
                                <p className="mt-1 text-2xl font-bold text-[#2596be]">Rs.{totalAmount.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-gray-700">Special Notes</label>
                            <textarea
                                rows={4}
                                value={special}
                                onChange={(e) => setSpecial(e.target.value)}
                                placeholder="Add special note (Optional)"
                                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-[#2596be] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2596be]/10"
                            />

                        </div>
                    </div>

                    <div className="mt-8 space-y-4">
                        <button
                            onClick={handleAdd}
                            className="w-full rounded-2xl bg-[#21a262] py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1b8d55]"
                        >
                            Add Treatment
                        </button>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            <button
                                onClick={createTreatment}
                                className="rounded-2xl bg-[#2596be] py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2088af]"
                            >
                                Save Treatment
                            </button>

                            <button
                                onClick={() => navigate(-1)}
                                className="rounded-2xl border border-red-400 bg-white py-3 font-semibold text-red-500 shadow-md transition-all duration-300 hover:bg-red-500 hover:text-white"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>

                {/* Added Treatments */}

                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md">

                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Added Treatments</h2>
                            <p className="mt-1 text-sm text-gray-500">Review all treatments before saving.</p>
                        </div>

                        <span className="rounded-full bg-[#2596be]/10 px-4 py-2 text-sm font-semibold text-[#2596be]">
                            {treatmentDetails.length} Treatment{treatmentDetails.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {
                        treatmentDetails.length === 0 ? (

                            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center">
                                <img src="/icons/empty.png" alt="empty" className="mx-auto mb-4 h-14 w-14 opacity-50" />
                                <h3 className="text-lg font-semibold text-gray-700">No Treatments Added</h3>
                                <p className="mt-2 text-sm text-gray-500">Add treatment details using the form above.</p>
                            </div>

                        ) : (

                            <div className="space-y-4">
                                {treatmentDetails.map((t) => (
                                    <div
                                        key={t.id}
                                        className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2596be]/20 hover:bg-white hover:shadow-md"
                                    >

                                        <div className="flex flex-col">
                                            <h3 className="font-semibold text-gray-800">{t.name}</h3>
                                            <span className="mt-1 text-sm font-medium text-[#21a262]">
                                                Rs. {Number(t.price).toFixed(2)}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemove(t.id)}
                                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 transition-all duration-300 hover:bg-red-500 hover:text-white"
                                        >
                                            <img src="/userDash/close.png" alt="remove" className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )
                    }

                    {
                        treatmentDetails.length > 0 && (
                            <div className="mt-8 rounded-2xl border border-[#21a262]/20 bg-[#21a262]/5 p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Grand Total</p>
                                        <h3 className="mt-1 text-3xl font-bold text-[#21a262]">Rs. {totalAmount.toFixed(2)}</h3>
                                    </div>

                                    <div className="rounded-2xl bg-[#21a262] px-5 py-3 text-center text-white shadow-md">
                                        <p className="text-xs uppercase opacity-80">Treatments</p>
                                        <p className="text-2xl font-bold">{treatmentDetails.length}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
export default AddTreatment