import { useEffect, useState } from "react";
import "./App.css";
import Table from "./components/Table.jsx";
import { supabase } from "./supabase-client.js";

function App() {
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

  useEffect(() => {
    fetchJobApplications();
  }, []);

  console.log(jobApps);

  return (
    <>
      <div className="min-h-screen bg-gray-200">
        <Table jobApps={jobApps} setJobApps={setJobApps} />
      </div>
    </>
  );
}

export default App;
