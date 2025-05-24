import JobCard from "./JobCard.jsx";
import { MdAddBox } from "react-icons/md";
import { useEffect, useState } from "react";
import JobAppForm from "./JobAppForm.jsx";

const Table = ({ jobApps, setJobApps }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  //state for form inputs
  const [newJobApp, setNewJobApp] = useState({
    companyTitle: "",
    role: "",
    description: "",
    status: "",
    dataAdded: new Date(), // set this up so it automatically saves date user added a job app
  });

  const [isEditing, setIsEditing] = useState(false);

  //state for tracking edit mode
  const [currentEditid, setCurrentEditId] = useState(null);

  // this will fire for the onClick event of the submit bttn after form submission
  const AddNewJobApp = (newJob) => {
    const maxId =
      jobApps.length > 0 ? Math.max(...jobApps.map((job) => job.id)) : 0; // this method works even if jobs get deleted

    const newJobApp = {
      ...newJob,
      id: maxId + 1,
      dateAdded: new Date().getTime(),
    };
    setJobApps((prev) => [...prev, newJobApp]);
  };

  const UpdateJobApp = (updatedJob) => {
    setJobApps((prev) =>
      prev.map((job) => (job.id === updatedJob.id ? updatedJob : job))
    );
  };

  const handleEdit = (jobAppToEditId) => {
    const jobAppToEdit = jobApps.find((jobApp) => jobApp.id === jobAppToEditId);

    if (!jobAppToEditId) {
      return;
    }
    // populate data from existing job App
    setNewJobApp({
      companyTitle: jobAppToEdit.companyTitle,
      role: jobAppToEdit.role,
      description: jobAppToEdit.description,
      status: jobAppToEdit.status,
      dateAdded: jobAppToEdit.dataAdded,
    });
    // activate "edit" mode + store ID of job App
    setIsEditing(true);
    setCurrentEditId(jobAppToEdit);

    setIsModalOpen(true);
  };

  // this useEffect will refresh/update the jobApps array
  useEffect(() => {}, [jobApps]);

  // useEffect(() => {}, [isModalOpen]);

  // TODO: Create Form component that's seperate from table.jsx and jobCard.jsx, the submit bttn will trigger the addjobapp even handler, which we'll then put into useEffect

  // Quality of life features: Should add a function/bttn that reverses order of array based on most recent & latest job apps in array

  return (
    <>
      <div className="flex flex-row p-10">
        <div className="mr-1 mt-1 ">
          {/* this will open the form for users to input a new job application */}
          <button onClick={() => setIsModalOpen(true)}>
            <MdAddBox className="size-9 hover:opacity-75" />
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
              <JobCard jobApps={jobApps} handleEdit={handleEdit} />
            </tbody>
          </table>
          <JobAppForm
            jobApps={jobApps}
            isModalOpen={isModalOpen}
            newJobApp={newJobApp}
            setNewJobApp={setNewJobApp}
            setIsModalOpen={setIsModalOpen}
            AddNewJobApp={AddNewJobApp}
            isEditing={isEditing}
            currentEditid={currentEditid}
            setCurrentEditId={setCurrentEditId}
            UpdateJobApp={UpdateJobApp}
          />
        </div>
      </div>
    </>
  );
};

export default Table;
