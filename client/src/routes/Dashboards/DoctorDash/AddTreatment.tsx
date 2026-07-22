import { useEffect, useState } from 'react'
import PatientDetails from '../../../components/dashComponents/staffDash/PatientDetails'
import { useNavigate, useParams } from 'react-router-dom'
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
            toast.error("Oops! Something went wrong");
        }
    }

    return (
        <div className=" mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5">
            <div className=" flex flex-col">
                <PatientDetails
                    data={fetchedData}
                />
            </div>
            <div className="flex flex-col border border-gray-200 rounded-xl p-8 shadow-md">


                <div>
                    <div className="grid grid-cols-2 gap-y-1 gap-x-4 items-center text-sm">
                        <div className="font-semibold">Doctor :</div>
                        <span>Dr. {fetchedData?.appointment?.doctorId?.firstName + " " + fetchedData?.appointment?.doctorId?.lastName}</span>

                        <div className="font-semibold">Clinic :</div>
                        <span>{fetchedData?.appointment?.clinicId?.clinicName} </span>

                        <div className="font-semibold">Date :</div>
                        <span>{now.toDateString()}</span>
                    </div>
                </div>

                <div className="mt-10">
                    <h1 className="mb-5 text-xl font-semibold">Add Treatment Details</h1>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-4 items-center">

                        <div className="font-semibold">Treatment Name :</div>
                        <input
                            type="text"
                            value={treatment}
                            onChange={(e) => setTreatment(e.target.value)}
                            placeholder="Composite filling"
                            className="mt-2 shadow-md rounded-xl p-2 border-none focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />

                        <div className="font-semibold">Treatment Amount (Rs):</div>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="5000.00"
                            className="mt-2 shadow-md rounded-xl p-2 border-none focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />

                        <div className="font-semibold">Special Note:</div>
                        <textarea
                            placeholder="Add special note (Optional)"
                            value={special}
                            onChange={(e) => setSpecial(e.target.value)}
                            className="mt-2 shadow-md rounded-xl p-2 border-none focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />

                        <div className="font-semibold mt-5">Total :</div>
                        <span className="font-semibold mt-5">Rs.{totalAmount.toFixed(2)}</span>

                        <button onClick={handleAdd} className=" col-span-2 px-3 py-1 mt-6 rounded-lg border border-green-500 text-green-500 hover:text-white hover:bg-green-500 transition">
                            Add Treatment +
                        </button>

                        <button onClick={createTreatment} className="px-3 py-1 mt-6 rounded-lg border border-green-500 text-green-500 hover:text-white hover:bg-green-500 transition">
                            Save
                        </button>

                        <button className="px-3 py-1 mt-6 rounded-lg border border-red-500 text-red-500 hover:text-white hover:bg-red-500 transition">
                            Cancel
                        </button>

                    </div>
                </div>

                <div className="mt-10">
                    <h1 className="mb-5 text-xl font-semibold">Added Treatments</h1>

                    <div className="flex flex-col gap-4">

                        {treatmentDetails.map((t) => (
                            <div
                                key={t.id}
                                className="flex justify-between items-center p-2 shadow-md rounded-xl hover:shadow-xl transition"
                            >
                                <div className="font-semibold">
                                    {t.name} - Rs.{t.price}.00
                                </div>

                                <img
                                    src="/userDash/close.png"
                                    alt="remove"
                                    className="w-5 h-5 cursor-pointer"
                                    onClick={() => handleRemove(t.id)}
                                />
                            </div>
                        ))}

                    </div>
                </div>

            </div>
        </div>
    )
}

export default AddTreatment