import { FaMagnifyingGlass } from "react-icons/fa6";

const Search = () => {
  return (
    <div>
      <form action="">
        <div className="flex flex-row items-center mb-3">
          <div className="flex flex-row items-center rounded-lg mr-3 ml-13 flex-1 bg-white shadow">
            <div className="ml-2 mr-2">
              <FaMagnifyingGlass className="text-black opacity-75" size={24} />
            </div>
            <input
              type="text"
              className=" rounded-tr-lg rounded-br-lg p-2  w-full"
            />
          </div>
          <div className="ml-auto">
            <button
              type="submit"
              className="cursor-pointer px-3 py-2 bg-black opacity-75 text-white rounded-md hover:opacity-50 shadow"
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
