import React, { useEffect, useState } from "react";
import API from "../../../../api/axios";
import { toast } from "react-hot-toast";


const MySession = () => {

    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const [available, setAvailable] = useState<any>("");
    const [editingTemplate, setEditingTemplate] = useState<any>(null);

    const initialFormData = {
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        daysOfWeek: [] as number[],
        maxPatients: "",
        maxPatientsPerHour: "",
        fee: ""
    }
    const [formData, setFormData] = useState<any>(initialFormData);

    const days = [
        { label: "Sunday", value: 0 },
        { label: "Monday", value: 1 },
        { label: "Tuesday", value: 2 },
        { label: "Wednesday", value: 3 },
        { label: "Thursday", value: 4 },
        { label: "Friday", value: 5 },
        { label: "Saturday", value: 6 },
    ];

    const getAvailable = async () => {
        try {
            const res = await API.get(`/session/template/${currentUser._id}`);
            setAvailable(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleDayChange = (day: number) => {
        setFormData((prev: any) => ({
            ...prev,
            daysOfWeek: prev.daysOfWeek.includes(day)
                ? prev.daysOfWeek.filter((d: number) => d !== day)
                : [...prev.daysOfWeek, day],
        }));
    };

    const handleSubmit = async () => {
        const data = {
            doctorId: currentUser._id,
            ...formData
        }
        try {
            const res = await API.post("/session", data);
            toast.success(res.data.message);
            setFormData(initialFormData);
            await getAvailable();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Oops! Something went wrong");
        }
    };



    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-GB");
    };

    //update
    const handleEdit = (template: any) => {
        setEditingTemplate(template);
        setFormData({
            startDate: template.startDate.split("T")[0],
            endDate: template.endDate.split("T")[0],
            startTime: template.startTime,
            endTime: template.endTime,
            daysOfWeek: template.daysOfWeek,
            maxPatients: template.maxPatients,
            maxPatientsPerHour: template.maxPatientsPerHour,
            fee: template.fee,
        })
    }

    const handleUpdate = async () => {
        try {
            const data = {
                doctorId: editingTemplate.doctorId,
                clinicId: editingTemplate.clinicId,
                ...formData
            }
            await API.put(`/session/update/${editingTemplate._id}`, data);
            toast.success("Template is updated successfully!")
            await getAvailable();
        } catch (err) {
            toast.error("Oops! Something went wrong");
        }
    }

    useEffect(() => {
        getAvailable();
    }, [currentUser._id]);

    return (
        <div className="space-y-8">

            <div className="flex items-center gap-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
                <img src="/icons/warning.png" alt="warning" className="h-10 w-10 flex-shrink-0" />
                <div>
                    <h3 className="font-semibold text-yellow-800">Session Template Notice</h3>
                    <p className="mt-1 text-sm text-yellow-700">
                        This template is valid only between the selected start
                        date and end date.Sessions created based on selected days of the week.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                {/* Left */}
                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md">
                    <h2 className="mb-8 text-2xl font-bold text-gray-800">{editingTemplate ? "Update Session Template" : "Create Session Template"}</h2>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-[#2596be] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2596be]/10"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">End Date</label>

                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-[#2596be] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2596be]/10"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">Start Time</label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-[#2596be] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2596be]/10"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">End Time</label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-[#2596be] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2596be]/10"
                                />
                            </div>
                        </div>


                        <div>
                            <label className="mb-4 block text-sm font-semibold text-gray-700">
                                Days of Week
                            </label>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">

                                {days.map((day) => (
                                    <label
                                        key={day.value}
                                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 hover:border-[#2596be]"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.daysOfWeek.includes(day.value)}
                                            onChange={() => handleDayChange(day.value)}
                                        />
                                        <span>{day.label}</span>
                                    </label>
                                ))}

                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">Max Patients / Session</label>
                                <input
                                    type="text"
                                    name="maxPatients"
                                    value={formData.maxPatients}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-[#2596be] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2596be]/10"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">Max Patients / Hour</label>
                                <input
                                    type="text"
                                    name="maxPatientsPerHour"
                                    value={formData.maxPatientsPerHour}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-[#2596be] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2596be]/10"
                                />
                            </div>

                        </div>
                        <div className="grid grid-cols-1">
                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Consultation Fee (Rs.)
                                </label>

                                <input
                                    type="number"
                                    name="fee"
                                    value={formData.fee}
                                    onChange={handleChange}
                                    placeholder="1500"
                                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-[#2596be] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2596be]/10"
                                />

                            </div>
                        </div>

                        <button type="button" onClick={editingTemplate ? handleUpdate : handleSubmit} className="w-full rounded-2xl bg-[#2596be] py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2088af] hover:shadow-lg">
                            {editingTemplate ? "Update Template" : "Create Template"}
                        </button>
                        <button type="button" onClick={() => { setEditingTemplate(null); setFormData(initialFormData); }} className="w-full rounded-2xl bg-white py-3 border border-red-500 font-semibold text-red-500 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-lg hover:text-white">
                            Reset
                        </button>
                    </div>
                </div>
                {/* Right */}

                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">Available Session Templates</h2>
                        <span className="rounded-full bg-[#2596be]/10 px-4 py-2 text-sm font-semibold text-[#2596be]">{available.length} Templates</span>
                    </div>
                    <div className="h-[550px] space-y-5 overflow-y-auto rounded-2xl bg-gray-50 p-4">
                        {available ?
                            available.map((item: any) => (

                                <div key={item._id} className="relative rounded-3xl border border-gray-100 bg-white p-5 shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-xs uppercase text-gray-400">Start Date</p>
                                            <p className="mt-1 font-semibold">{formatDate(item.startDate)}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase text-gray-400">End Date</p>
                                            <p className="mt-1 font-semibold">{formatDate(item.endDate)}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase text-gray-400">Start Time</p>
                                            <p className="mt-1 font-semibold">{item.startTime}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase text-gray-400">End Time</p>
                                            <p className="mt-1 font-semibold">{item.endTime}</p>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-3">
                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Fee : Rs.{item.fee}.00</span>
                                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">Max : {item.maxPatients} Patients</span>
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {item.daysOfWeek.map((dayValue: number) => {
                                            const day = days.find((d) => d.value === dayValue);

                                            return (
                                                <span
                                                    key={dayValue}
                                                    className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-[#2596be]"
                                                >
                                                    {day?.label}
                                                </span>
                                            );
                                        })}
                                    </div>
                                    <button onClick={() => handleEdit(item)} className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#2596be] text-white shadow-lg transition hover:bg-[#2088af]">✎</button>
                                </div>

                            )) :
                            <p className=" flex items-center justify-center">No available session templates. Please create one.</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MySession;