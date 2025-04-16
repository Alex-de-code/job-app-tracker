import { useState } from "react";
import JobCard from "./Components/JobCard";
import "./App.css";

function App() {
  return (
    <>
      <div className="m-5">
        <table className=" bg-slate-100 rounded-lg shadow-sm">
          <thead className="border-b-2 border-slate-200">
            <tr className="">
              <th className="text-md p-3 tracking-wide text-left">
                Company Title
              </th>
              <th className=" text-md p-3 tracking-wide text-left">Role</th>
              <th className="text-md p-3 tracking-wide text-left">
                Description
              </th>
              <th className=" text-md p-3 tracking-wide text-left">Status</th>
              <th className=" text-md p-3 tracking-wide text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <JobCard />
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
