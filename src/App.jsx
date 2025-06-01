import { useEffect, useState } from "react";
import "./App.css";
import Table from "./components/Table.jsx";
import { supabase } from "./supabase-client.js";
import Auth from "./auth.jsx";

function App() {
  const [session, setSession] = useState(null);
  const [jobApps, setJobApps] = useState([]); // store all job applications

  const fetchJobApplications = async () => {
    const { error, data } = await supabase
      .from("job_applications") // from this table in Supabase backend
      .select("*") // select all columns
      .order("created_at"); // order based on creation time

    if (error) {
      console.error("Error reading task: ", error.message);
      return;
    }
    setJobApps(data);
  };

  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession();
    console.log(currentSession);
    setSession(currentSession.data);
  };

  useEffect(() => {
    fetchSession(); // listener to check for any state changes in user authentication status
  }, []);

  useEffect(() => {
    fetchJobApplications();
  }, []);

  console.log(jobApps);

  return (
    <>
      <div className="min-h-screen bg-gray-200">
        <Auth />
        <Table jobApps={jobApps} setJobApps={setJobApps} />
      </div>
    </>
  );
}

export default App;
