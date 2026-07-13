import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {

  const navigate = useNavigate();
  const[query , setQuery] = useState("");

  const handleSearch = async () => {
    if(!query.trim()) return;
    navigate(`/search?q=${query}`);
  }

  const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <div className=" w-full flex items-center justify-between max-h-[150px]  px-2 py-2 rounded-3xl shadow-xl hover:shadow-green-100">
        <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className=" w-full border-none focus:border-transparent p-2 rounded-3xl font-medium outline-none focus:outline-none focus:ring-0" 
        placeholder="Search based on your location or Clinic , Doctor..."
        />
        <img 
        src="./icons/search.png" 
        alt="searchimg" 
        className=" h-6 w-6 cursor-pointer xs:h-4 s:w-4 mr-4"
        onClick={handleSearch}  
        />
    </div>
  )
}

export default Search