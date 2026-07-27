import { useEffect, useState } from "react";
import API from "../../../../api/axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { exportBillingInvoice } from "../../../../utils/reports/BillingReport";

const Billing = () => {

    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const [fetchedData, setFetchedData] = useState<any>(null);
    const { id } = useParams();
    const now = new Date();

    const [treatmentDetails, setTreatmentDetails] = useState<any[]>([]);
    const [treatment, setTreatment] = useState("");
    const [value, setValue] = useState("");
    const [special, setSpecial] = useState("");
    const [treatmentId, setTreatmentId] = useState("");

    const navigate = useNavigate();

    // fetch current appointment treatment history only
    const currentAppointmentHistory = fetchedData?.history?.find(
        (item: any) =>
            item?.appointmentId?._id === fetchedData?.appointment?._id
    );

    const currentTreatment = fetchedData?.history?.find(
        (item: any) =>
            item?.appointmentId?._id === fetchedData?.appointment?._id
    );

    // existing treatment total
    const existingTreatmentTotal =
        currentAppointmentHistory?.treatments?.reduce(
            (total: number, item: any) =>
                total + Number(item.price),
            0
        ) || 0;

    // newly added treatment total
    const newTreatmentTotal = treatmentDetails.reduce(
        (total, item) => total + Number(item.price),
        0
    );

    // final total
    const grandTotal = existingTreatmentTotal + newTreatmentTotal;

    const handleAdd = () => {

        if (!treatment || !value) {
            toast.error("Please fill all fields");
            return;
        }

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

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const res = await API.get(`/appointment/treat/${id}`);
                setFetchedData(res.data);
            } catch (err) {
                toast.error("Oops! Something went wrong");
            }
        };
        fetchAppointment();
    }, [id]);


    const handleProceedPayment = async () => {
        try {

            let finalTreatmentId = currentTreatment?._id || treatmentId;
            const treatmentPayload = {
                userId: fetchedData?.appointment?.userId?._id,
                appointmentId: fetchedData?.appointment?._id,
                sessionId: fetchedData?.appointment?.sessionId,
                doctorId: fetchedData?.appointment?.doctorId?._id,
                staffId: currentUser._id,
                treatments: treatmentDetails.map((t) => ({
                    name: t.name,
                    price: t.price,
                })),
                specialNotes: special,
            };
            ///////////////////////////////////////////////////////////////need to check
            if (treatmentDetails.length > 0) {
                const res = await API.post("/treatment", treatmentPayload);
                finalTreatmentId = res.data.data._id;
                setTreatmentId(res.data.data._id);
            }

            const billingPayload = {
                appointmentId: fetchedData?.appointment?._id,
                userId: fetchedData?.appointment?.userId?._id,
                clinicId: fetchedData?.appointment?.clinicId?._id,
                doctorId: fetchedData?.appointment?.doctorId?._id,
                amount: grandTotal,
                treatmentId: finalTreatmentId,
                status: "paid",
                staffId: currentUser?._id,
            };

            const res = await API.post("/billing/payment", billingPayload);
            toast.success("Billing created successfully");
            try {
                const invoice = await API.get(`/billing/invoice/${res.data.billId}`);
                exportBillingInvoice(invoice.data.invoice);
            } catch (err) {
                console.log(err);
            }
            navigate("/payment_list"); 

        } catch (err: any) {

            toast.error(
                err?.response?.data?.message ||
                "Oops! Something went wrong"
            );
        }
    };

    if (!fetchedData) {
        return <div className="mt-6">Loading...</div>;
    }



    return (
        <div className=" grid grid-cols-1 gap-8 xl:grid-cols-2 ">
            {/* LEFT PANEL */}
            <div className="flex flex-col gap-5">
                <div className="space-y-8">
                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Current Appointment Treatment</h2>
                                <p className="mt-1 text-sm text-gray-500">Treatments already recorded for this appointment.</p>
                            </div>

                            <div className="rounded-2xl bg-[#21a262]/10 px-5 py-3 text-center">
                                <p className="text-xs uppercase tracking-wide text-gray-500">Total</p>
                                <p className="text-xl font-bold text-[#21a262]">Rs. {existingTreatmentTotal.toFixed(2)}</p>
                            </div>
                        </div>

                        {
                            currentAppointmentHistory ? (

                                <div className="space-y-6">
                                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">
                                                    Dr.{" "}{currentAppointmentHistory?.doctorId?.firstName}{" "}{currentAppointmentHistory?.doctorId?.lastName}
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {new Date(currentAppointmentHistory?.appointmentId?.dateTime).toDateString()}
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-[#2596be]/10 px-4 py-2 font-semibold text-[#2596be]">
                                                {currentAppointmentHistory?.treatments?.length} Treatment(s)
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {currentAppointmentHistory?.treatments?.map((t: any) => (
                                            <div
                                                key={t._id}
                                                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:border-[#2596be]/20 hover:shadow-md">
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">{t.name}</h4>
                                                    <p className="mt-1 text-sm text-gray-500">Completed Treatment</p>
                                                </div>
                                                <div className="font-bold text-[#21a262]">Rs. {Number(t.price).toFixed(2)}</div>
                                            </div>
                                        ))
                                        }
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center">
                                    <h3 className="text-lg font-semibold text-gray-700">No Treatments Found</h3>
                                    <p className="mt-2 text-sm text-gray-500">There are no treatments recorded for this appointment.</p>
                                </div>
                            )
                        }
                    </div>
                </div>

                {/* Billing Summary */}

                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md">
                    <h2 className="mb-6 text-2xl font-bold text-gray-800">Billing Summary</h2>
                    <div className="space-y-5">
                        <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                            <span className="font-medium text-gray-600">Existing Treatments </span>
                            <span className="font-bold text-gray-800">Rs. {existingTreatmentTotal.toFixed(2)}</span>
                        </div>

                        <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                            <span className="font-medium text-gray-600">Newly Added</span>
                            <span className="font-bold text-[#2596be]">Rs. {newTreatmentTotal.toFixed(2)}</span>
                        </div>

                        <div className="rounded-2xl border border-[#21a262]/20 bg-[#21a262]/5 p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold text-gray-700">Grand Total</span>
                                <span className="text-3xl font-bold text-[#21a262]"> Rs. {grandTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <button
                        onClick={handleProceedPayment}
                        className="rounded-2xl bg-[#2596be] py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2088af]">
                        Proceed to Payment
                    </button>

                    <button
                        onClick={() => navigate("/staff_dash")}
                        className="rounded-2xl border border-red-400 bg-white py-3 font-semibold text-red-500 shadow-md transition-all duration-300 hover:bg-red-500 hover:text-white">
                        Cancel
                    </button>
                </div>
            </div>


            {/* RIGHT PANEL */}

            <div className="space-y-8">
                {/* Add treatment Details */}

                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md">
                    <h2 className="mb-8 text-2xl font-bold text-gray-800">Add Treatments</h2>
                    <div className="space-y-6">
                        <div>
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

                            <label className="mb-2 block text-sm font-semibold text-gray-700">Special Notes</label>
                            <textarea
                                rows={4}
                                value={special}
                                onChange={(e) => setSpecial(e.target.value)}
                                placeholder="Add special note (Optional)"
                                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-[#2596be] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2596be]/10"
                            />
                        </div>

                        <button
                            onClick={handleAdd}
                            className="w-full rounded-2xl bg-[#21a262] py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1b8d55]"
                        >
                            + Add Treatment
                        </button>
                    </div>
                </div>
                {/* Newly Added Treatments */}
                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md">

                    <div className="mb-6 flex items-center justify-between">

                        <h2 className="text-2xl font-bold text-gray-800">
                            Newly Added Treatments
                        </h2>

                        <span className="rounded-full bg-[#2596be]/10 px-4 py-2 text-sm font-semibold text-[#2596be]">
                            {treatmentDetails.length}
                        </span>

                    </div>

                    {

                        treatmentDetails.length === 0 ? (

                            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-10 text-center">

                                <p className="text-gray-500">
                                    No new treatments added.
                                </p>

                            </div>

                        ) : (

                            <div className="space-y-4">

                                {

                                    treatmentDetails.map((t) => (

                                        <div
                                            key={t.id}
                                            className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-5 transition-all duration-300 hover:border-[#2596be]/20 hover:bg-white hover:shadow-md"
                                        >

                                            <div>

                                                <h4 className="font-semibold text-gray-800">
                                                    {t.name}
                                                </h4>

                                                <p className="mt-1 text-sm text-[#21a262]">
                                                    Rs. {Number(t.price).toFixed(2)}
                                                </p>

                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleRemove(t.id)}
                                                className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 transition-all duration-300 hover:bg-red-500 hover:text-white"
                                            >

                                                <img
                                                    src="/userDash/close.png"
                                                    alt="remove"
                                                    className="h-5 w-5"
                                                />

                                            </button>

                                        </div>

                                    ))

                                }

                            </div>

                        )

                    }

                </div>
            </div>
        </div>
    );
};

export default Billing;