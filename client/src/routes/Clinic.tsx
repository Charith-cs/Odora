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
        <div>
            <div className=" mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                <div className=" flex flex-col p-4 gap-8 ">

                    <div className=" flex ">
                        <img src={details.clinic.img} alt="userimg" className=" w-24 h-24 object-cover rounded-full " />
                        <span className=" ml-5 mt-5">
                            <h1 className=" text-md md:text-3xl font-semibold ">{details.clinic.clinicName}</h1>
                        </span>
                    </div>
                    <div className=" flex flex-col">
                        <h1 className=" text-xl font-medium">About {details.clinic.clinicName}</h1>
                        <p className=" mt-4 leading-relaxed">{details.clinic?.desc}</p>
                    </div>
                </div>
                {/* ///////////////////////////////////// */}
                <div className=" flex flex-col p-4  gap-6 ">
                    <Link to={`/doctors/${details.clinic._id}`} className=" w-full text-center mt-5 border-none bg-sky-500 shadow:md hover:bg-sky-600 hover:shadow-xl p-2 rounded-xl text-white font-semibold">{details.clinic.doctorList.length < 1 ? "No available doctors" : "See available sessions"}</Link>
                    <div className="group bg-white rounded-2xl shadow-md p-4 mt-2 mb-2  ">

                        <div className=" flex flex-row justify-between my-2">
                            <span className="flex items-center justify-center text-center">
                                {details.clinic.doctorList &&
                                    <span className=" ml-8 text-start">
                                        <h2 className=" text-md font-bold">Available Doctors</h2>
                                        <p className=" text-sm">in our clinic</p>
                                    </span>}
                            </span>
                            <div className="">
                                <img src="/icons/verified.png" alt="bookingimg" className=" w-8 h-8  object-fit " />
                            </div>
                        </div>

                        {details.clinic.doctorList && details.clinic?.doctorList.map((d: any) => (
                            <>
                                <hr className=" my-2 mt-8" />
                                <div className=" flex flex-row justify-between my-2">
                                    <span className="flex items-center justify-center text-center cursor-pointer">
                                        <span className=" ml-8 text-start">
                                            <h2 className=" text-md font-semibold">Dr. {d.firstName + " " + d.lastName}</h2>
                                            <p className=" text-sm">See more ..</p>
                                        </span>
                                    </span>
                                    <img src="/icons/booking.png" alt="bookingimg" onClick={() => navigate(`/${d._id}`, {
                                    })} className=" w-8 h-8  object-fit cursor-pointer hover:shadow-xl hover:-translate-y-1 transition duration-300" />
                                </div>
                            </>
                        ))}

                    </div>

                </div>
            </div>
        </div>
    )
}

export default Clinic
