import { useCallback, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { supabase } from "./supabase-client.js"; // entrypoint to interact with the Supabase ecosystem
import Nav from "./components/Nav.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import Settings from "./components/Settings.jsx";
import Auth from "./auth.jsx";
import "./App.css";

function App() {
  const [session, setSession] = useState(null); // state for JWT access token + refresh token on user signin
  const [jobApps, setJobApps] = useState([]); // store all job applications
  const [currentPage, setCurrentPage] = useState(1); // need a state for current page for rendering right job apps for pagination
  const [itemsPerPage, setItemsPerPage] = useState(10); // store # of job apps on page
  const [totalItems, setTotalItems] = useState(0); // count for all job apps
  const [isLoading, setIsLoading] = useState(false); // this state provides us with visibility on system status and allows us to implement spinners or any necessary indicators to users to show transitioning states (moments where data is being retrived) + UI updates
  // state for storing our sorting for jobs apps in table
  const [sortConfig, setSortConfig] = useState(() => {
    const savedSort = localStorage.getItem("jobAppsSort");
    return savedSort
      ? JSON.parse(savedSort) // here we parse a JSON str & convert it to an obj
      : { key: "created_at", direction: "desc" };
  });
  //

  // We will memoize with useCallback so f(x) isn't rerendered unecessarily
  const fetchJobApplications = useCallback(async () => {
    if (!session?.user?.id) return; // Only fetch if user is logged in

    setIsLoading(true);
    try {
      const { error, data, count } = await supabase
        .from("job_applications") // from this table in Supabase backend
        .select("*", { count: "exact" }) // select all  + --> this also gives a count for all job apps at bttm left of pagination component
        .eq("user_id", session.user.id) // Only get current user's jobs
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1) // gives range we need for pagination
        .order(sortConfig.key, { ascending: sortConfig.direction === "asc" });
      // .order("created_at"); // order based on creation time

      if (error) throw error;

      setJobApps(data || []);
      setTotalItems(count || 0);
    } catch (error) {
      console.error("Error reading task: ", error.message);
      return;
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, currentPage, itemsPerPage, sortConfig]);

  // we will use useCallback to memoize, store a cache so that React can reuse the cached value instead of recalculating -- for the sake of impoving performance and not having alot of rerenders for this function
  // specifically useCallback is used to cache a function definition between re-renders
  const fetchSession = useCallback(async () => {
    const currentSession = await supabase.auth.getSession();
    // console.log(currentSession); // only comment in to debug
    setSession(currentSession.data.session);
  }, []); // no reactive elements so there's an empty dependency array for our useCallback, in other cases, we'd add the reactive element so the function is re-rendered else the f(x) in memory will be rendered

  const logout = async () => {
    await supabase.auth.signOut();
    setJobApps([]); // Clear jobs on logout
  };

  // handler for sorting
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          ...prev,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
    setCurrentPage(1); // Reset to first page when sorting changes
    console.log(sortConfig);
  };

  // itemsPerPage handler
  const handleItemsPerPageChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  useEffect(() => {
    fetchSession(); // listener to check for any state changes in user authentication status

    // const { data: authListener } = supabase.auth.onAuthStateChange(
    //   (_event, session) => {
    //     setSession(session);
    //   }
    // );
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);

      // Handle email verification
      if (event === "USER_UPDATED" && session?.user?.email_confirmed_at) {
        await supabase.from("profiles").upsert({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || "",
        });
      }

      // Refresh jobs when auth state changes
      if (["SIGNED_IN", "USER_UPDATED"].includes(event)) {
        fetchJobApplications();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchSession]); // b/c fetchSession is memoized and has no dependency array it is stable and will not cause infinite loop
  // always good to include all used variables as dependencies, state, props, etc

  useEffect(() => {
    if (session) {
      fetchJobApplications();
    }
  }, [session?.user?.id, currentPage, itemsPerPage, sortConfig]);

  // This useEffect is for persisting sort config
  useEffect(() => {
    localStorage.setItem("jobAppsSort", JSON.stringify(sortConfig));
  }, [sortConfig]);

  // for seeing rerenders when jobApps changes
  useEffect(() => {
    console.log("jobApps updated:", jobApps);

    return () => {
      console.log("Where the magic happens");
    };
  }, [jobApps]);

  return (
    <>
      <div className="min-h-screen bg-gray-200">
        {session ? (
          <>
            <Nav logout={logout} />
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    jobApps={jobApps}
                    setJobApps={setJobApps}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItems}
                    setTotalItems={setTotalItems}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    isLoading={isLoading}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                }
              />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </>
        ) : (
          <Auth />
        )}
      </div>
    </>
  );
}

export default App;
