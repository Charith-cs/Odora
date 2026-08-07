import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import API from '../../api/axios';

const Clinic = () => {

    const [details, setDetails] = useState<any>(null);
    const navigate = useNavigate();
    const { slug } = useParams();

    useEffect(() => {
        const getDetails = async () => {
            if (!slug) return;
            try {
                const docDetails = await API.get(`/doctor/details/${slug}`);
                setDetails(docDetails.data);
                console.log(docDetails.data);
            } catch (err) {
                console.log(err);
            }
        }
        getDetails();
    }, [slug]);


    if (!details) {
        return <div>Loading...</div>;
    }


    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                <div className="space-y-8">

                    <div className=" bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                            <img src={details.clinic.img ? details.clinic.img : "/userDash/user.png"} alt={details.clinic.clinicName} className=" w-28 h-28 rounded-3xl object-cover border border-gray-100" />
                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-2xl sm:text-3xl font-bold ">
                                    {details.clinic.clinicName}
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className=" bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8">
                        <h2 className="text-2xl font-bold text-[#2596be]">About {details.clinic.clinicName}</h2>
                        <p className="mt-6 leading-8 text-gray-600">{details.clinic?.desc} </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <Link
                        to={`/doctors/${details.clinic._id}`}
                        className={` w-full flex items-center justify-center rounded-2xl py-4 font-semibold text-lg transition-all duration-300 shadow-md
            ${details.clinic.doctorList.length > 0
                                ? "bg-[#2596be] text-white hover:bg-[#1f7ea0] hover:shadow-xl hover:-translate-y-1"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed pointer-events-none"
                            }`} >
                        {details.clinic.doctorList.length > 0
                            ? "See Available Doctors"
                            : "No Available Doctors"}
                    </Link>

                    <div className=" bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8">
                        <div className="flex justify-between items-center">
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-[#2596be]">Available Doctors</h2>
                                <p className="text-gray-500 mt-2">Meet the dentists currently practicing at this clinic.</p>
                            </div>
                            <div className=" flex items-center justify-center w-12 h-12 rounded-full bg-cyan-50 ">
                                <img src="/icons/verified.png" alt="Verified" className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="mt-8 space-y-5">
                            {details.clinic.doctorList &&
                                details.clinic.doctorList.map((d: any) => (
                                    <div
                                        key={d._id}
                                        className="border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={d.img ? d.img : "/userDash/user.png"}
                                                    alt="Doctor"
                                                    className=" w-14 h-14 rounded-2xl object-cover border border-gray-100" />
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800"> Dr. {d.firstName} {d.lastName} </h3>
                                                    <p className="text-gray-500 mt-1"> View doctor's profile </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => navigate(`/${d._id}`)}
                                                className=" flex items-center justify-center w-12 h-12 rounded-full bg-cyan-50 hover:bg-[#2596be] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                                <img src="/icons/booking.png" alt="View Doctor" className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Clinic
