import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Search from "../components/Search";


const HomePage = () => {

  const navigate = useNavigate();

  let currentUser = null;

  try {
    currentUser = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    currentUser = null;
  }

  const handleRedirect = (q: string) => {
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    if (q === "all") {
      navigate(`/search?q=all`);
    } else {
      navigate(`/search?q=clinic`);
    }
  };

  return (
    <div className="mt-6 flex flex-col">

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">

        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold leading-tight">
            Smile meets <br />
            <span className="text-[#2596be]">Technology</span>
          </h1>

          <p className="mt-4 text-gray-600 text-lg">
            Sri Lanka’s No.1 dental channeling platform. Book trusted clinics,
            consult experienced doctors, and manage appointments effortlessly.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">

            <button
              onClick={() => handleRedirect("all")}
              className="bg-[#2596be] text-white px-6 py-3 rounded-full shadow hover:scale-105 transition"
            >
              Book Appointment
            </button>

            <button
              onClick={() => handleRedirect("clinic")}
              className="border border-gray-300 px-6 py-3 rounded-full hover:bg-gray-100 transition"
            >
              Explore Clinics
            </button>

          </div>


          <div className="mt-6">
            <Search />
          </div>
        </div>


        <div>
          <img
            src="./cover.png"
            alt="Dental cover"
            className="w-full h-[250px] sm:h-[350px] md:h-[450px] object-cover rounded-2xl shadow-lg"
          />
        </div>

      </section>


      <section className="bg-gray-50 py-10 mt-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-6">
          <div>
            <h2 className="text-3xl font-bold text-[#2596be]">500+</h2>
            <p className="text-gray-600">Doctors</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#2596be]">120+</h2>
            <p className="text-gray-600">Clinics</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#2596be]">10K+</h2>
            <p className="text-gray-600">Patients</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#2596be]">4.9★</h2>
            <p className="text-gray-600">Rating</p>
          </div>
        </div>
      </section>


      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div>
          <Card />
        </div>
      </section>

    </div>
  );
};

export default HomePage;