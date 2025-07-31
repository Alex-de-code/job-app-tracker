import { useState, useEffect } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { GiCancel } from "react-icons/gi";
import { MdCached, MdCancel } from "react-icons/md";

const Search = ({ onSearch }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(localSearchTerm.trim()); // Immediately trigger search on submit
  };

  const handleClearSearch = (e) => {
    e.preventDefault();
    setLocalSearchTerm("");
    onSearch(""); // This clears the search in parent component
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
          <div className="flex flex-row items-center rounded-lg mr-3 ml-11 flex-1 bg-white shadow">
            <div className="ml-2 mr-2">
              <FaMagnifyingGlass className="text-black opacity-75" size={24} />
            </div>
            <input
              type="text"
              placeholder="Search jobs..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className=" rounded-tr-lg rounded-br-lg p-2 w-full focus:outline-none"
            />
            {localSearchTerm && ( // Only show clear button when there's text
              <button
                type="button"
                onClick={handleClearSearch}
                className=" hover:opacity-75"
              >
                <div className="mr-2">
                  <MdCancel className="text-black opacity-25" size={24} />
                </div>
              </button>
            )}
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
