import { useState } from "react";
import "./App.css";
import Table from "./components/Table.jsx";

function App() {
  // need to create dummy data array
  const [jobApps, setJobApps] = useState([
    {
      id: 1,
      companyTitle: "Blackheart",
      role: "Software Engineer",
      status: "Denied",
      description: "Front end dev work",
      dateAdded: new Date("2023-02-04T14:30").getTime(), // will serve as timestamp
    },
    {
      id: 2,
      companyTitle: "Figma",
      role: "UI/UX Researcher",
      status: "Interviewing",
      description: "Component designing",
      dateAdded: new Date("2025-04-05T09:15").getTime(),
    },
    {
      id: 3,
      companyTitle: "Coinbase",
      role: "Backend Engineer",
      status: "Applied",
      description: "API Design and testing",
      dateAdded: new Date("2025-06-05T01:15").getTime(),
    },
  ]); // store all applications
  return (
    <>
      <div className="min-h-screen bg-gray-200">
        <Table jobApps={jobApps} setJobApps={setJobApps} />
      </div>
    </>
  );
}

export default App;
