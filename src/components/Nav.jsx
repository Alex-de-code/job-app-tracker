import { Link } from "react-router-dom";
import { VscSignOut } from "react-icons/vsc";
import { MdListAlt } from "react-icons/md";
import { MdOutlineSettings } from "react-icons/md";
import { GiPieChart } from "react-icons/gi";

const Nav = ({ logout }) => {
  return (
    <>
      <div className="fixed top-0 left-0 right-0">
        <div className="bg-black/75 p-3 w-full shadow">
          <div className="flex flex-row items-center">
            <Link to={"/"} className=" rounded-xl flex justify-center">
              <span className="flex flex-row items-center text-white">
                <GiPieChart className="size-7 text-white text-shadow-2xs" />
                {/* <MdListAlt className="size-7 text-white text-shadow-2xs" /> */}
                <h3 className="text-lg ml-1  text-shadow-2xs">JTrax</h3>
              </span>
            </Link>

            <div className="ml-auto flex items-center ">
              <p className="text-white">Welcome, Traxers!</p>
              <Link
                to={"/settings"}
                className="p-1 rounded  hover:border-y-2
                 hover:border-white mx-5 text-white"
              >
                <div className="flex justify-between">
                  <MdOutlineSettings className="size-5" />
                  <h3 className="text-sm ml-0.5">Settings</h3>
                </div>
              </Link>
              <button
                onClick={logout}
                className="p-1.5 bg-white rounded hover:bg-gray-200"
              >
                <div className="flex justify-between">
                  <VscSignOut className="size-5" />
                  <h3 className="text-sm ml-0.5">Logout</h3>
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
