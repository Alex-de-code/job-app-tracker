import { useState, useEffect } from "react";
import { supabase } from "./supabase-client.js";
import undraw_stepping from "./assets/undraw_stepping-up.svg";
import { MdListAlt, MdInfo } from "react-icons/md";
import { GiPieChart } from "react-icons/gi";

// In the future should handle debugging vs. production more elegantly, could have a "dev" environment check that'll automatically filter off/on logic and logs for checking auth

// TODO: Clean up aesthetic of sign up sign in, doesn't feel quite right

const Auth = () => {
  // const [isSignUp, setIsSignUp] = useState(true);
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [username, setUsername] = useState("");
  // const [error, setError] = useState("");
  // const [loading, setLoading] = useState(false); // adding loading state to prevent duplicate submissions
  // const [needsVerification, setNeedsVerification] = useState(false); // state for verification banner aftr sign up

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);

  //   const { data: authData, error: authError } = isSignUp
  //     ? await supabase.auth.signUp({ email, password })
  //     : await supabase.auth.signInWithPassword({ email, password });

  //   // Create public user record after successful signup
  //   if (isSignUp && authData?.user) {
  //     setNeedsVerification(true); // update verification banner state
  //     // setError(`Verification email sent to ${email}. Please check your inbox.`);
  //     // Create profile and goals in a transaction
  //     const { error: dbError } = await supabase.from("users").insert({
  //       id: authData.user.id,
  //       email: authData.user.email,
  //       created_at: new Date().toISOString(),
  //     });

  //     if (!dbError) {
  //       // Create default goals
  //       await supabase.from("user_goals").upsert(
  //         {
  //           id: authData.user.id,
  //           weekly_target: 25,
  //           daily_target: 5,
  //           updated_at: new Date().toISOString(),
  //         },
  //         {
  //           onConflict: "id",
  //         }
  //       );
  //     }
  //   }

  //   setLoading(false);

  //   if (authError) {
  //     setError(authError.message);
  //     console.error(authError);
  //   }
  // };

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

  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(""); // 'available', 'taken', 'checking', 'invalid'

  // Validate username format (3-20 chars, letters, numbers, underscores)
  const validateUsernameFormat = (username) => {
    return /^[a-zA-Z0-9_]{3,20}$/.test(username);
  };

  // Check username availability
  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 3) {
      setUsernameStatus("");
      return false;
    }

    if (!validateUsernameFormat(username)) {
      setUsernameStatus("invalid");
      return false;
    }

    setUsernameStatus("checking");

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .maybeSingle();

      if (error) throw error;

      const available = !data;
      setUsernameStatus(available ? "available" : "taken");
      return available;
    } catch (err) {
      console.error("Username check error:", err);
      setUsernameStatus("error");
      return false;
    }
  };

  // Real-time username validation
  useEffect(() => {
    const timer = setTimeout(() => {
      checkUsernameAvailability(username);
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        // Validate username
        if (!validateUsernameFormat(username)) {
          throw new Error(
            "Username must be 3-20 characters (letters, numbers, underscores)"
          );
        }

        // Final availability check
        const isAvailable = await checkUsernameAvailability(username);
        if (!isAvailable) {
          throw new Error(
            usernameStatus === "taken"
              ? "Username is already taken"
              : "Could not verify username availability"
          );
        }

        // Sign up with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email,
            password,
            options: {
              data: {
                username, // Store in auth.user_metadata
                email_verified: false,
              },
            },
          }
        );

        if (authError) throw authError;

        // Create profile in profiles table
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: authData.user.id,
          email,
          username,
          updated_at: new Date().toISOString(),
        });

        if (profileError) throw profileError;

        setNeedsVerification(true);
      } else {
        // Sign in existing user
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
      }
    } catch (err) {
      setError(err.message);
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auth state listener
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setUsername("");
        setEmail("");
        setPassword("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
                <GiPieChart className="size-12 text-slate-400" />
                {/* <MdListAlt className="size-12 text-slate-400" /> */}
                <h3 className="text-3xl ml-2 my-5">JTrax</h3>
              </span>
            </div>
            <div className="p-4 h-148 bg-slate-400 rounded-xl shadow-sm">
              <div className=" pt-8 pb-10">
                {/* <h2 className="text-xl text-slate-100 inline-block p-4 my-2 mx-12 border-2 border-slate-200 bg-slate-500 rounded-xl ">
                  Welcome to JTrax, the{" "}
                  <span className="font-medium text-white">no-fuss</span> job
                  application organizer designed by job seekers, for job
                  seekers.
                </h2> */}
                <h2 className="text-xl text-slate-100 inline-block p-4 my-2 mx-12 border-2 border-slate-200 bg-slate-500 rounded-xl">
                  Welcome to <strong>JTrax</strong>, the{" "}
                  <span className="font-medium text-white">
                    visual command center
                  </span>{" "}
                  for optimizing your job hunt—
                  <span className="italic">see more, apply smarter</span>.
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
                  {isSignUp && (
                    <input
                      id="username"
                      type="text"
                      className="p-2 bg-slate-100 rounded-lg shadow-sm hover:bg-slate-200"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      minLength={3}
                      maxLength={20}
                      pattern="[a-zA-Z0-9]+" // Only allow alphanumeric
                      title="Letters and numbers only, no spaces"
                    />
                  )}
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
