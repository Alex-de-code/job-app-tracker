import JobCard from "./JobCard.jsx";
import { MdAddBox } from "react-icons/md";
import { useEffect, useState } from "react";
import JobAppForm from "./JobAppForm.jsx";
import { supabase } from "../supabase-client.js";
import Pagination from "./Pagination.jsx";

const Table = ({
  jobApps,
  setJobApps,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  isLoading,
}) => {
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
    // get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("job_applications")
      .insert([
        // insert a new row w/ our data
        {
          ...newJob,
          user_id: user.id, // authenticated user ID
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
    // get current user for security
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("job_applications")
      .update(updatedJob)
      .eq("id", updatedJob.id)
      .eq("user_id", user.id) // ensure user cans only update their own records
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
      // Get current user for security check
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Delete from Supabase
      const { error } = await supabase
        .from("job_applications")
        .delete()
        .eq("id", selectedJobID)
        .eq("user_id", user.id); // Ensure user can only delete their own records

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

  // Quality of life features: Should add a function/bttn that reverses order of array based on most recent & latest job apps in array

  // --> --> ---> --->

  // TODO: Add pagination to job applications table, could be 10 entries, 15 or 25, but this is essential so that UI doesn't break b/c of too many entries!!!!

  //TODO: Add filtering bttns to side of table under add job bttn, think oldest to newest, newest to oldest, alphabetical order, etc

  // TODO: WIll need to add feature where job application cards in table are clickable and open a view above page or new view altogether of all information of job application entry, this could be extensive info where table shows only essentials at a glance, maybe recruiter info, interview date, a hyperlink of actual job listing,

  // Stretch goal: Build a web scraper or so users can paste a link to the job they applied to and then just update status, but have the app cover all inputs from link

  return (
    <>
      <div className="flex">
        <div className="mr-1 mt-1">
          {/* this will open the form for users to input a new job application */}
          <button onClick={() => handleAddNew()}>
            <MdAddBox className="size-9 hover:opacity-75" />
          </button>
        </div>
        <div className="">
          <table className=" bg-slate-50 rounded-lg shadow-sm w-full table-fixed">
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
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : (
                <JobCard
                  jobApps={jobApps}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={onPageChange}
            onItemsPerPageChange={onItemsPerPageChange}
          />
          <JobAppForm
            isModalOpen={isModalOpen}
            newJobApp={newJobApp}
            setNewJobApp={setNewJobApp}
            setIsModalOpen={setIsModalOpen}
            AddNewJobApp={AddNewJobApp}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
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
