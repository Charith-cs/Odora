import { Link } from "react-router-dom";
import type { CardType } from "../../../../types/types.ts";

type DashCardProps = {
  cardDetails: CardType[];
};

const DashCard = ({ cardDetails }: DashCardProps) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cardDetails.map((card, index) => (
          <Link key={index} to="#" className="group">
            <div className={`${card.color} h-full rounded-3xl p-6 border border-white/20 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center text-center overflow-hidden relative`}>
              <div className=" absolute -top-10 -right-10 w-28 h-28 rounded-full bg-white/10" />
              <div className=" w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300 ">
                <img src={card.img} alt={card.desc} className="w-12 h-12 object-contain" />
              </div>

              <h2 className=" text-lg md:text-xl sm:text-2xl font-bold text-white">{card.desc}</h2>
              <p className=" text-white/90 mt-2 text-sm sm:text-base leading-6">{card.subDesc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashCard;