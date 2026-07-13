import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import API from "../../api/axios";


const DocClinic = () => {

  const [details, setDetails] = useState<any>(null);
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    const getDetails = async () => {
      if (!slug) return;
      try {
        const docDetails = await API.get(`/doctor/details/${slug}`);
        console.log(docDetails.data)
        setDetails(docDetails.data);
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
    <div className=" mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
      <div className=" flex flex-col p-4 gap-8 ">

        <div className=" flex ">
          <img src="./cardIcons/dentist.png" alt="userimg" className=" w-24 h-24 object-cover rounded-full " />
          <span className=" ml-5 mt-5">
            <h1 className=" text-md md:text-3xl font-semibold ">Dr.{details.doctor.firstName + " " + details.doctor.lastName}</h1>
            {details.doctorDetails.specialization.map((s: string) => (
              <span key={s} className=" text-gray-500 ">{s + " "}</span>
            ))}
          </span>
        </div>
        <div className=" flex flex-col">
          <h1 className=" text-xl font-medium">About Dr.{details.doctor.firstName + " " + details.doctor.lastName}</h1>
          <p className=" mt-4 leading-relaxed">{details.doctorDetails?.desc}</p>
        </div>
      </div>

      <div className=" flex flex-col p-4  gap-6 ">
        <Link to={`/session/${slug}`}
          className={`w-full text-center mt-5 border-none p-2 rounded-xl text-white font-semibold shadow-md transition    
          ${details.availableSessions.length > 0 ? "bg-sky-500 hover:bg-sky-600 hover:shadow-xl" : "bg-gray-400 cursor-not-allowed pointer-events-none"
            }`}>{details.availableSessions.length > 0 ? "See available sessions" : "Sessions unavailable"}</Link>
        {
          details?.clinicDetails[0] && <div className="group bg-white rounded-2xl shadow-md p-4 mt-2 mb-2  ">


            <div className=" flex flex-row justify-between my-2">
              <span className="flex items-center justify-center text-center cursor-pointer">
                <span className=" ml-8 text-start">
                  <h2 className=" text-md font-bold">{details?.clinicDetails[0]?.clinicName}</h2>
                  <p className=" text-sm">{details?.clinicDetails[0]?.address}</p>
                </span>
              </span>
              <Link to={`/clinic/${details?.clinicDetails[0]?._id}`} className="">
                <img src="./icons/verified.png" alt="bookingimg" className=" w-8 h-8  object-fit cursor-pointer" />
              </Link>
            </div>


            {details.availableSessions.map((s: any) => (
              <>
                <hr className=" my-2 mt-8" />
                <div className=" flex flex-row justify-between my-2">
                  <span className="flex items-center justify-center text-center cursor-pointer">
                    <span className=" ml-8 text-start">
                      <h2 className=" text-md font-semibold">{s.startDateTime.slice(0 , 10)}</h2>
                      <p className=" text-sm">{s.startDateTime.slice(11 , 16) + " to " + s.endDateTime.slice(11 , 16)}</p>
                    </span>
                  </span>
                  <img src="./icons/booking.png" alt="bookingimg" onClick={() => navigate(`/book/${s._id}`, {
                    state: {
                      session: s,
                      doctor: details.doctor,
                      clinic: details.clinicDetails[0]
                    }
                  })} className=" w-8 h-8  object-fit cursor-pointer hover:shadow-xl hover:-translate-y-1 transition duration-300" />
                </div>
              </>
            ))}

          </div>
        }
      </div>

    </div>
  )
}

export default DocClinic