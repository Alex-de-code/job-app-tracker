import { useState, useEffect } from "react";
import { supabase } from "./supabase-client.js";
import undraw_stepping from "./assets/undraw_stepping-up.svg";
import { MdListAlt, MdInfo } from "react-icons/md";

// In the future should handle debugging vs. production more elegantly, could have a "dev" environment check that'll automatically filter off/on logic and logs for checking auth

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // adding loading state to prevent duplicate submissions
  const [needsVerification, setNeedsVerification] = useState(false); // state for verification banner aftr sign up

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // **** For PRODUCTION, comment out for debugging!!!
    // --> --> --->

    // const { error: authError } = isSignUp
    //   ? await supabase.auth.signUp({ email, password })
    //   : await supabase.auth.signInWithPassword({ email, password });

    // ------------------------------------------------------------

    //**** For DEBUGGING, comment this out for production!!!
    // --> --> --->
    const { data: authData, error: authError } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    console.log("Auth data:", authData); // For Debugging, Comment out for production!!!
    console.log("Auth error:", authError); // For Debugging, Comment out for production!!!

    const {
      data: { session },
    } = await supabase.auth.getSession(); // For DEBUGGING, comment out for production
    console.log("Post-auth session:", session); // For DEBUGGING, comment out for production

    // ---------------------------------------------------------

    // Create public user record after successful signup
    if (isSignUp && authData?.user) {
      setNeedsVerification(true); // update verification banner state
      // setError(`Verification email sent to ${email}. Please check your inbox.`);
      await supabase.from("users").insert({
        id: authData.user.id,
        email: authData.user.email,
        created_at: new Date().toISOString(),
      });
    }

    setLoading(false);

    if (authError) {
      setError(authError.message);
      console.error(authError);
    }
  };

  // **** For PRODUCTION only, comment out for debugging
  // ---> -----> ---->

  // useEffect(() => {
  //   // Production: Keep listener but remove logs
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((event, session) => {
  //     // PROD: Silent handling
  //     if (event === "SIGNED_OUT") {
  //       // Clear user data
  //     }
  //   });

  //   return () => subscription.unsubscribe();
  // }, []);

  //------------------------------------------------

  // **** For DEBUGGING auth only, comment out for production
  // ---> ---> --->
  useEffect(() => {
    // check if a session exists
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("CURRENT SESSION:", session);
    });

    //setup listener for all future auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("AUTH EVENT:", event, session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setNeedsVerification(user && !user.email_confirmed_at);
    };
    check();
  }, []);

  // ---------------------------------------------------------------
  return (
    <>
      <div className="min-h-screen flex justify-center items-center">
        {needsVerification && (
          <div className="fixed top-0 left-0 right-0 bg-amber-100 p-3 text-center border-b-2 border-amber-200 flex items-center justify-center">
            <MdInfo className="size-6 mr-1" />
            <span className="font-medium mr-1">
              Verification Required:{" "}
            </span>{" "}
            Please check your email for the confirmation link to complete
            registration
          </div>
        )}
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
