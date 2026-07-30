import { Building2, MapPin, Users, Stethoscope, Plus, Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface MyClinicCardProps {
    clinic: any | null;
}

const MyClinicCard = ({ clinic }: MyClinicCardProps) => {

    const hasClinic = !!clinic;

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">

            <div className="bg-gradient-to-r from-[#2596be] to-[#21a262] px-8 py-6 text-white">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                        <Building2 size={34} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold">My Clinic</h2>
                        <p className="text-cyan-100 mt-1">Clinic Management</p>
                    </div>
                </div>
            </div>

            <div className="p-8">
                {!hasClinic ? (
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">Welcome to Odora!</h3>
                            <p className="text-gray-500 mt-3 max-w-xl">
                                Your clinic profile hasn't been created yet.
                                Create your clinic to start managing doctors,
                                staff, appointments and reports.
                            </p>
                        </div>

                        <Link
                            to="/my_clinic"
                            className="flex items-center gap-3 px-7 py-4 rounded-2xl bg-[#2596be] hover:bg-[#1e7ea0] text-white font-semibold transition-all"><Plus size={22} />Create Clinic
                        </Link>
                    </div>

                ) : (

                    <div className="flex flex-col lg:flex-row justify-between gap-10">
                        <div className="flex gap-6">
                            <img
                                src={clinic.clinicDetails.img || "/userDash/user.png"}
                                alt={clinic.clinicDetails.clinicName}
                                className="w-28 h-28 rounded-3xl object-cover border border-gray-200"
                            />
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">{clinic.clinicDetails.clinicName}</h2>
                                <div className="flex items-center gap-2 mt-3 text-gray-500"><MapPin size={18} />{clinic.clinicDetails.address}</div>
                                <div className="flex flex-wrap gap-4 mt-6">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-50 text-[#2596be]"><Stethoscope size={18} />
                                        <span className="font-semibold">{clinic.clinicDetails.doctorList?.length ?? 0} Doctors</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 text-[#21a262]">
                                        <Users size={18} />
                                        <span className="font-semibold">{clinic.staffCount} Staff</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <Link
                                to={`/my_clinic/${clinic.clinicDetails._id}`}
                                className="flex items-center gap-3 px-7 py-4 rounded-2xl bg-[#2596be] hover:bg-[#1e7ea0] text-white font-semibold transition-all">
                                <Settings size={20} />
                                Manage Clinic
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyClinicCard;