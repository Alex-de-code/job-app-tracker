import { useState } from "react";
import { supabase } from "./supabase-client.js";
import undraw_stepping from "./assets/undraw_stepping-up.svg";
import { MdListAlt } from "react-icons/md";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // adding loading state to prevent duplicate submissions

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      console.error(authError);
    }
  };

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
                {isSignUp ? "Create your account" : "Log in to continue"}
              </h4>

              {error && (
                <div className="px-24 mb-4 text-red-100 bg-red-500/50 p-2 rounded">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4 px-24">
                <div className="flex flex-col">
                  {/* <label htmlFor="email" className="mb-1">
                  Email
                </label> */}
                  <input
                    id="email"
                    type="email"
                    className="p-2 bg-slate-100 rounded-lg shadow-sm hover:bg-slate-200"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  {/* <label htmlFor="email" className="mb-1">
                  Email
                </label> */}
                  <input
                    id="password"
                    type="password"
                    className="p-2 bg-slate-100 rounded-lg shadow-sm hover:bg-slate-200"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full px-4 py-2 ${
                    isSignUp ? "bg-green-400" : "bg-blue-400"
                  } text-black rounded-lg shadow-sm hover:${
                    isSignUp ? "bg-green-500" : "bg-blue-500"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Processing..." : isSignUp ? "Sign up" : "Log in"}
                </button>
              </form>
              <div className="text-center mt-4 px-24">
                <p className="text-slate-100">
                  {isSignUp
                    ? "Already have an account? "
                    : "Don't have an account? "}

                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError("");
                    }}
                    className="text-white underline hover:text-blue-500 focus:outline-none"
                    disabled={loading}
                  >
                    {isSignUp ? "Log in here" : "Sign up here"}
                  </button>
                </p>
              </div>
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
