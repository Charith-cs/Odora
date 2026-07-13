import { Link } from "react-router-dom";

const Card = () => {

  const cardDetails = [
    { img: "./cardIcons/telehealth.png", desc: "Connect with your Dentist (Telehealth)" },
    { img: "./cardIcons/braces.png", desc: "Best Braces in island" },
    { img: "./cardIcons/child.png", desc: "Your Child deserves best treatment" },
    { img: "./cardIcons/extraction.png", desc: "Simple, but effective" },
    { img: "./cardIcons/filling.png", desc: "Save your tooth!" },
    { img: "./cardIcons/implant.png", desc: "New life, better smile" },
    { img: "./cardIcons/rct.png", desc: "Modern solution" },
    { img: "./cardIcons/restoration.png", desc: "Restore your confidence" },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Top Searches This Week
        </h2>

        <Link to="/" className="text-[#2596be] text-sm hover:underline">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">

        {cardDetails.map((card, index) => (
          <Link key={index} to="/">
            <div className="group bg-white rounded-2xl h-full shadow-md p-6 flex flex-col items-center text-center 
                            hover:shadow-xl hover:-translate-y-1 transition duration-300">

              <img
                src={card.img}
                alt={card.desc}
                className="w-16 h-16 mb-4 group-hover:scale-110 transition"
              />

              <p className="font-medium text-gray-700 group-hover:text-[#2596be]">
                {card.desc}
              </p>

            </div>
          </Link>
        ))}

      </div>
    </div>
  );
};

export default Card;