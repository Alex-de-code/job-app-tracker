import JobCard from "./JobCard.jsx";
import { MdAddBox } from "react-icons/md";
import { RiSortAlphabetDesc, RiSortAlphabetAsc } from "react-icons/ri";

import { useEffect, useState } from "react";
import JobAppForm from "./JobAppForm.jsx";
import { supabase } from "../supabase-client.js";
import Pagination from "./Pagination.jsx";

const Table = ({
  jobApps,
  setJobApps,
  currentPage,
  itemsPerPage,
  setTotalItems,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  isLoading,
  sortConfig,
  onSort,
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

    // Update frontend state of total job app entries from user for faster UI
    setTotalItems((prev) => prev + 1); // Increment count

    // Update frontend state with data from Supabase
    setJobApps((prev) => [...prev, data]);

    return data; // could potentially use this for a toast message
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

      // Get current state before deletion for pagination logic
      const currentJobCount = jobApps.length;
      const isLastItemOnPage =
        currentJobCount % itemsPerPage === 1 ||
        currentJobCount ===
          // Update React state IMMEDIATELY (remove the deleted job)
          setJobApps((prevJobs) =>
            prevJobs.filter((job) => job.id !== selectedJobID)
          );

      // Update frontend state of total job app entries from user for faster UI
      setTotalItems((prev) => prev - 1); // Decrement count

      // Handle pagination after deletion
      if (isLastItemOnPage && isLastPage && currentPage > 1) {
        onPageChange(currentPage - 1); // Move to previous page if we deleted the last item on the current page
      }
    } catch (error) {
      console.error("Delete failed:", error.message);
    }
  };

  // const handleSortAlphabetically = async (sortField, ascending = true) => {
  //   try {
  //     // Get current user for security
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();

  //     // Fetch data sorted alphabetically by the specified field
  //     const { data, error } = await supabase
  //       .from("job_applications")
  //       .select("*")
  //       .eq("user_id", user.id)
  //       .order(sortField, { ascending: true });

  //     if (error) throw error;

  //     // Update state with sorted data
  //     setJobApps(data);
  //     setTotalItems(data.length);
  //     onPageChange(1); // Reset to first page after sorting
  //   } catch (error) {
  //     console.error("Error sorting alphabetically:", error);
  //   }
  // };

  // this useEffect will refresh/update the jobApps array
  useEffect(() => {}, [jobApps, itemsPerPage, onPageChange]);

  // Quality of life features: Should add a function/bttn that reverses order of array based on most recent & latest job apps in array

  // --> --> ---> --->

  // TODO: Add pagination to job applications table, could be 10 entries, 15 or 25, but this is essential so that UI doesn't break b/c of too many entries!!!!

  //TODO: Add filtering bttns to side of table under add job bttn, think oldest to newest, newest to oldest, alphabetical order, etc

  // TODO: WIll need to add feature where job application cards in table are clickable and open a view above page or new view altogether of all information of job application entry, this could be extensive info where table shows only essentials at a glance, maybe recruiter info, interview date, a hyperlink of actual job listing,

  // Stretch goal: Build a web scraper or so users can paste a link to the job they applied to and then just update status, but have the app cover all inputs from link

  return (
    <>
      <div className="flex">
        <div className="flex flex-col">
          <div className="mr-1 mt-1">
            {/* this will open the form for users to input a new job application */}
            <button onClick={() => handleAddNew()}>
              <MdAddBox className="size-9 hover:opacity-75" />
            </button>
          </div>
          <div className="ml-0.5">
            {/* this will open the form for users to input a new job application */}
            <button onClick={() => onSort("companyTitle")}>
              {sortConfig.key === "companyTitle" &&
                (sortConfig.direction === "desc" ? (
                  <RiSortAlphabetAsc className="size-8 hover:opacity-75" />
                ) : (
                  <RiSortAlphabetDesc className="size-8 hover:opacity-75" />
                ))}
            </button>
          </div>
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
                // Skeleton Loader to fill table while we call data
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="hover:bg-slate-200">
                    <td className="py-2 px-3 text-sm">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
                    </td>
                    <td className="py-2 px-3 text-sm">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3"></div>
                    </td>
                    <td className="py-2 px-3 text-sm">
                      <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                    </td>
                    <td className="py-2 px-3 text-sm">
                      <div className="rounded-md py-2 px-2 shadow bg-slate-200 animate-pulse w-20"></div>
                    </td>
                    <td className="py-2 px-3 text-sm">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-24"></div>
                    </td>
                    <td className="py-2 px-3 flex">
                      <div className="h-5 bg-slate-200 rounded animate-pulse w-6 mr-2"></div>{" "}
                      <div className="h-5 bg-slate-200 rounded animate-pulse w-6"></div>{" "}
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <JobCard
                    jobApps={jobApps}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                  {/* Row fills so length of table stays the same */}
                  {jobApps.length < itemsPerPage && // here we check if we have fewer jobs than items per page
                    Array.from({ length: itemsPerPage - jobApps.length }).map(
                      // Array.from() ===> converts to an array we can map over
                      // { length: X } ====> creates an array-like object with X empty slots
                      //
                      (
                        _,
                        index // we use an underscore to ignore 1st param
                      ) => (
                        <tr key={`filler-${index}`} className="">
                          {/* `filler-${index}` ===> apparently a more robust way of handling children, good to consider especially for lists that may experience reordering and that aren't static */}
                          <td className="py-2 px-3 text-sm">&nbsp;</td>
                          <td className="py-2 px-3 text-sm">&nbsp;</td>
                          <td className="py-2 px-3 text-sm">&nbsp;</td>
                          <td className="py-2 px-3 text-sm">
                            <div className="rounded-lg py-1 px-2 invisible">
                              —
                            </div>
                          </td>
                          <td className="py-2 px-3 text-sm">&nbsp;</td>
                          <td className="py-2 px-3">&nbsp;</td>
                        </tr>
                      )
                    )}
                </>
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
            currentPage={currentPage}
            onPageChange={onPageChange} // Pass down pagination control
            jobApps={jobApps}
            itemsPerPage={itemsPerPage}
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
