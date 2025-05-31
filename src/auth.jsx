import undraw_stepping from "./assets/undraw_stepping-up.svg";
import { MdListAlt } from "react-icons/md";

const Auth = () => {
  return (
    <>
      <div className="min-h-screen flex justify-center items-center">
        {" "}
        <div className="flex flex-row justify-evenly">
          <div className="md:w-1/3 w-1/2">
            <div className=" rounded-2xl flex justify-center">
              <span className="flex flex-row items-center">
                <MdListAlt className="size-12 text-slate-400" />
                <h3 className="text-3xl ml-2 my-5">JTrack</h3>
              </span>
            </div>
            <div className="  p-4 h-148 bg-slate-400 rounded-xl shadow-sm">
              <div className=" pt-8 pb-10">
                {/* <h1 className="text-4xl text-white">Welcome Job Hunter!</h1> */}
                <h2 className="text-xl text-slate-100 inline-block p-4 my-2 mx-12 border-2 border-slate-200 bg-slate-500 rounded-xl ">
                  {/* Welcome to JTrack, a no fuss job application management
                  system, designed by job seekers for job seekers. */}
                  {/* Join the no-fuss job application system designed by job
                  seekers, for job seekers. */}
                  Welcome to JTrack, the{" "}
                  <span className="font-medium text-white">no-fuss</span> job
                  application organizer designed by job seekers, for job
                  seekers.
                </h2>
              </div>
              <h4 className="px-24 text-2xl mb-5 text-slate-100">
                Create an account
              </h4>
              <form action="" className="space-y-4 px-24">
                <div className="flex flex-col">
                  {/* <label htmlFor="email" className="mb-1">
                  Email
                </label> */}
                  <input
                    id="email"
                    type="email"
                    className="p-2 bg-slate-100 rounded-lg shadow-sm hover:bg-slate-200"
                    placeholder="Email"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-400 text-black rounded-lg shadow-sm hover:bg-green-500"
                >
                  Sign up
                </button>
              </form>
            </div>
          </div>
          <div className="flex items-center">
            <img
              src={undraw_stepping}
              alt="landing-pg-img"
              className="size-124 p-5 m-5 rounded-xl shadow-sm border-2 border-slate-100"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
