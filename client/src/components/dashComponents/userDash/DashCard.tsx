import { Link } from "react-router-dom";
import type { CardType } from "../../../../types/types.ts";

type DashCardProps = {
  cardDetails: CardType[];
};
const DashCard = ({ cardDetails }:  DashCardProps) => {

  return (
    <div className="">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">

        {cardDetails.map((card, index) => (
          <Link key={index} to="/">
            <div className={`group ${card.color} rounded-2xl h-full backdrop-blur-md shadow-md p-4 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition duration-300`}>
              <img src={card.img} alt={card.desc} className="w-16 h-16 mb-4 group-hover:scale-110 transition"/>
              <p className="font-bold text-xl text-white">{card.desc}</p>
              <p className="font-medium text-white">{card.subDesc}</p>
            </div>
          </Link>
        ))}

      </div>
    </div>
  )
}


export default DashCard