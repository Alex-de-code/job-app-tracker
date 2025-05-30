import { useEffect, useState } from "react";
import "./App.css";
import Table from "./components/Table.jsx";
import { supabase } from "./supabase-client.js";

function App() {
  // need to create dummy data array
  const [jobApps, setJobApps] = useState([
    // {
    //   id: 1,
    //   companyTitle: "Blackheart",
    //   role: "Software Engineer",
    //   status: "Denied",
    //   description: "Front end dev work",
    //   dateAdded: new Date("2023-02-04T14:30").getTime(), // will serve as timestamp
    // },
    // {
    //   id: 2,
    //   companyTitle: "Figma",
    //   role: "UI/UX Researcher",
    //   status: "Interviewing",
    //   description: "Component designing",
    //   dateAdded: new Date("2025-04-05T09:15").getTime(),
    // },
    // {
    //   id: 3,
    //   companyTitle: "Coinbase",
    //   role: "Backend Engineer",
    //   status: "Applied",
    //   description: "API Design and testing",
    //   dateAdded: new Date("2025-06-05T01:15").getTime(),
    // },
  ]); // store all applications

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
