import { Link } from "react-router-dom";

const Card = () => {

    const cardDetails = [
        { img: "./cardIcons/telehealth.png", desc: "Connect with your Dentist (Telehealth)" },
        { img: "./cardIcons/braces.png", desc: "Best Braces in the Island" },
        { img: "./cardIcons/child.png", desc: "Your Child Deserves the Best Care" },
        { img: "./cardIcons/extraction.png", desc: "Simple & Effective Tooth Extraction" },
        { img: "./cardIcons/filling.png", desc: "Protect and Save Your Tooth" },
        { img: "./cardIcons/implant.png", desc: "Dental Implants for a Better Smile" },
        { img: "./cardIcons/rct.png", desc: "Modern Root Canal Treatment" },
        { img: "./cardIcons/restoration.png", desc: "Restore Your Smile with Confidence" },
    ];

    return (
        <section className="py-14 sm:py-16 lg:py-20 px-5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
                        Top Searches This Week
                    </h2>

                    <div className="w-24 h-1 bg-[#2596be] rounded-full mx-auto my-5"></div>

                    <p className="max-w-2xl mx-auto text-gray-600 text-base sm:text-lg leading-7">
                        Explore the most popular dental services searched by patients this week and discover quality care tailored to your needs.
                    </p>

                </div>



                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">

                    {cardDetails.map((card, index) => (

                        <Link key={index} to="/" className="group">

                            <div className=" h-full bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#2596be]">
                                <div className=" w-20 h-20sm:w-24 sm:h-24 rounded-full bg-cyan-50 flex items-center justify-center mb-5 transition group-hover:scale-110 ">
                                    <img src={card.img} alt={card.desc} className="w-10 h-10 sm:w-12 sm:h-12 object-contain"/>
                                </div>
                                <p className="text-sm sm:text-base font-semibold text-gray-700 leading-6 transition group-hover:text-[#2596be] " >
                                    {card.desc}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Card;