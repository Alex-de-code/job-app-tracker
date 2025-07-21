import { useState, useEffect } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

const Search = ({ onSearch }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(localSearchTerm.trim()); // Immediately trigger search on submit
  };

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     onSearch(localSearchTerm); // Trigger the parent's search
  //   }, 500);

  //   return () => clearTimeout(timer);
  // }, [localSearchTerm, onSearch]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row items-center mb-3">
          <div className="flex flex-row items-center rounded-lg mr-3 ml-11 md:ml-12.5 flex-1 bg-white shadow">
            <div className="ml-2 mr-2">
              <FaMagnifyingGlass className="text-black opacity-75" size={24} />
            </div>
            <input
              type="text"
              placeholder="Search jobs..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className=" rounded-tr-lg rounded-br-lg p-2  w-full focus:outline-none"
            />
          </div>
          <div className="ml-auto">
            <button
              type="submit"
              className="cursor-pointer px-3 py-2 bg-black opacity-75 text-white rounded-md hover:opacity-50 shadow"
              disabled={!localSearchTerm.trim()} // Disable when empty
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Search;
