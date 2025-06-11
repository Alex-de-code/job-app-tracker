import { VscSignOut } from "react-icons/vsc";
import { MdListAlt } from "react-icons/md";

const Nav = ({ logout }) => {
  return (
    <>
      <div className="fixed top-0 left-0 right-0">
        <div className="bg-black/75 p-3 w-full shadow">
          <div className="flex flex-row items-center">
            <div className=" rounded-xl flex justify-center">
              <span className="flex flex-row items-center text-white">
                <MdListAlt className="size-7 text-white text-shadow-2xs" />
                <h3 className="text-lg ml-1  text-shadow-2xs">JTrack</h3>
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
