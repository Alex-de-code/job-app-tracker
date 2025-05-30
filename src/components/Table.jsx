import JobCard from "./JobCard.jsx";
import { MdAddBox } from "react-icons/md";
import { useEffect, useState } from "react";
import JobAppForm from "./JobAppForm.jsx";
import { supabase } from "../supabase-client.js";

const Table = ({ jobApps, setJobApps }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  //state for form inputs
  const [newJobApp, setNewJobApp] = useState({
    companyTitle: "",
    role: "",
    description: "",
    status: "",
    created_at: null,
  });

  const [isEditing, setIsEditing] = useState(false);

  //state for tracking edit mode
  const [currentEditId, setCurrentEditId] = useState(null);

  const AddNewJobApp = async (newJob) => {
    const { data, error } = await supabase
      .from("job_applications")
      .insert([
        // insert a new row w/ our data
        {
          ...newJob,
          created_at: new Date().toISOString(), // Proper timestamp format
        },
      ])
      .select() // here Supabase will return newly inserted data
      .single(); //ensures we only get one record

    if (error) throw error;

    // Update frontend state with data from Supabase
    setJobApps((prev) => [...prev, data]);
  };

  const UpdateJobApp = async (updatedJob) => {
    const { data, error } = await supabase
      .from("job_applications")
      .update(updatedJob)
      .eq("id", updatedJob.id)
      .select()
      .single();

    if (error) throw error;

    // Update frontend state
    setJobApps((prev) =>
      prev.map((job) => (job.id === updatedJob.id ? data : job))
    );
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentEditId(null);
    setNewJobApp({
      companyTitle: "",
      role: "",
      description: "",
      status: "",
      created_at: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (selectedJob) => {
    const jobAppToEdit = jobApps.find((jobApp) => jobApp.id === selectedJob.id);

    if (!jobAppToEdit.id) {
      return;
    }
    // populate data from existing job App
    setNewJobApp({
      companyTitle: jobAppToEdit.companyTitle,
      role: jobAppToEdit.role,
      description: jobAppToEdit.description,
      status: jobAppToEdit.status,
      created_at: jobAppToEdit.created_at,
    });
    // activate "edit" mode + store ID of job App
    setIsEditing(true);
    setCurrentEditId(selectedJob.id);

    setIsModalOpen(true);
  };

  const handleDelete = async (selectedJobID) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from("job_applications")
        .delete()
        .eq("id", selectedJobID);

      if (error) throw error;

      // Update React state IMMEDIATELY (remove the deleted job)
      setJobApps((prevJobs) =>
        prevJobs.filter((job) => job.id !== selectedJobID)
      );
    } catch (error) {
      console.error("Delete failed:", error.message);
    }
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
          <button onClick={() => handleAddNew()}>
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
              <JobCard
                jobApps={jobApps}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            </tbody>
          </table>
          <JobAppForm
            isModalOpen={isModalOpen}
            newJobApp={newJobApp}
            setNewJobApp={setNewJobApp}
            setIsModalOpen={setIsModalOpen}
            AddNewJobApp={AddNewJobApp}
            isEditing={isEditing}
            currentEditId={currentEditId}
            setCurrentEditId={setCurrentEditId}
            UpdateJobApp={UpdateJobApp}
          />
        </div>
      </div>
    </>
  );
};

export default Table;
