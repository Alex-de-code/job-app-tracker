import { FaMagnifyingGlass } from "react-icons/fa6";

const Search = () => {
  return (
    <div>
      <form action="">
        <div className="flex flex-row items-center mb-3">
          <div className="flex flex-row items-center rounded-xl ml-2 mr-3 flex-1">
            <FaMagnifyingGlass className="mr-2" size={24} />
            <input
              type="text"
              className=" d bg-slate-50 rounded-lg p-2  shadow-sm w-full"
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
