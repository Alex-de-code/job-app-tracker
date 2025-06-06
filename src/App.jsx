import { useEffect, useState } from "react";
import "./App.css";
import Table from "./components/Table.jsx";
import { supabase } from "./supabase-client.js";
import Auth from "./auth.jsx";
import BenchmarksBentoBox from "./components/BenchmarksBentoBox.jsx";

function App() {
  const [session, setSession] = useState(null);
  const [jobApps, setJobApps] = useState([]); // store all job applications
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // store # of job apps on page
  const [totalItems, setTotalItems] = useState(0); // count for all job apps
  const [isLoading, setIsLoading] = useState(false);

  const fetchJobApplications = async () => {
    if (!session?.user?.id) return; // Only fetch if user is logged in

    setIsLoading(true);
    try {
      const { error, data, count } = await supabase
        .from("job_applications") // from this table in Supabase backend
        .select("*", { count: "exact" }) // select all  + --> this also gives a count for all job apps at bttm left of pagination component
        .eq("user_id", session.user.id) // Only get current user's jobs
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1) // gives range we need for pagination
        .order("created_at"); // order based on creation time

      if (error) throw error;

      setJobApps(data || []);
      setTotalItems(count || 0);
    } catch (error) {
      console.error("Error reading task: ", error.message);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession();
    console.log(currentSession);
    setSession(currentSession.data.session);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setJobApps([]); // Clear jobs on logout
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
  }, []);

  useEffect(() => {
    if (session) {
      fetchJobApplications();
    }
  }, [session?.user?.id, currentPage, itemsPerPage]);

  console.log(jobApps);

  return (
    <>
      <div className="min-h-screen bg-gray-200">
        {session ? (
          <>
            <button onClick={logout}>Log Out</button>
            <div className="flex w-full p-4 gap-4">
              <div className="w-2/3">
                <Table
                  jobApps={jobApps}
                  setJobApps={setJobApps}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                  isLoading={isLoading}
                />
              </div>
              <div className="w-1/3">
                <BenchmarksBentoBox />
              </div>
            </div>
          </>
        ) : (
          <Auth />
        )}
      </div>
    </>
  );
}

export default App;
