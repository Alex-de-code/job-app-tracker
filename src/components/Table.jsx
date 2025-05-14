import JobCard from "./JobCard.jsx";
import { MdAddBox } from "react-icons/md";
import { useEffect, useState } from "react";
import JobAppForm from "./JobAppForm.jsx";

const Table = () => {
  // need to create dummy data array
  const [jobApps, setJobApps] = useState([]); // store all applications

  const [isModalOpen, setIsModalOpen] = useState(false);

  // this will fire for the onClick event of the submit bttn after form submission
  const AddJobApp = () => {
    setIsModalOpen(true);
  };

  // this useEffect will refresh/update the jobApps array
  // useEffect(() => {}, []);

  // useEffect(() => {}, [isModalOpen]);

  // TODO: Create Form component that's seperate from table.jsx and jobCard.jsx, the submit bttn will trigger the addjobapp even handler, which we'll then put into useEffect

  // Quality of life features: Should add a function/bttn that reverses order of array based on most recent & latest job apps in array

  return (
    <>
      <div className="flex flex-row p-10">
        <div className="mr-1 mt-1 hover:opacity-75">
          {/* this will open the form for users to input a new job application */}
          <button onClick={AddJobApp}>
            <MdAddBox className="size-9" />
          </button>
        </div>
        <div className="">
          <table className=" bg-slate-100 rounded-lg shadow-sm">
            <thead className="border-b-2 border-slate-200">
              <tr className="">
                <th className="text-sm p-3 tracking-wide text-left">
                  Company Title
                </th>
                <th className=" text-sm p-3 tracking-wide text-left">Role</th>
                <th className="text-sm p-3 tracking-wide text-left">
                  Description
                </th>
                <th className=" text-sm p-3 tracking-wide text-left">Status</th>
                <th className=" text-sm p-3 tracking-wide text-left">
                  Date Added
                </th>
                <th className=" text-sm p-3 tracking-wide text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* will need to map through an array of job apps, and pass through the props to jobCard component */}
              <JobCard />
            </tbody>
          </table>
          <JobAppForm isModalOpen={isModalOpen} />
        </div>
      </div>
    </>
  );
};

export default Table;
