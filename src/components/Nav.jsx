import { VscSignOut } from "react-icons/vsc";
import { MdListAlt } from "react-icons/md";

const Nav = ({ logout }) => {
  return (
    <>
      <div className="px-4 pt-2">
        <div className="bg-gray-50 border-2 border-black p-3 rounded-lg w-full">
          <div className="flex flex-row items-center">
            <div className=" rounded-xl flex justify-center">
              <span className="flex flex-row items-center ">
                <MdListAlt className="size-7 text-slate-400" />
                <h3 className="text-lg ml-1 ">JTrack</h3>
              </span>
            </div>

            <div className="ml-auto">
              <button
                onClick={logout}
                className="p-1 bg-white rounded hover:bg-gray-200"
              >
                <div className="flex justify-between">
                  <VscSignOut className="size-5" />
                  <span className="text-sm ml-1">Logout</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
