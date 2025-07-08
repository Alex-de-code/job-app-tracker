import { useEffect, useState } from "react";
import { supabase } from "../../supabase-client.js";
import JobAppForm from "../JobAppForm.jsx";
import JobCard from "./JobCard.jsx";
import Pagination from "./Pagination.jsx";
import { MdAddBox } from "react-icons/md";
import { RiSortAlphabetDesc, RiSortAlphabetAsc } from "react-icons/ri";
import {
  PiClockClockwiseBold,
  PiClockCounterClockwiseBold,
} from "react-icons/pi";

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
  onApplicationSubmit,
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

  // state for determing which piece of logic will run in form (add an entry vs. edit an entry)
  const [isEditing, setIsEditing] = useState(false);

  //state for tracking edit mode
  const [currentEditId, setCurrentEditId] = useState(null);

  // adds job app information filled out in form to supabase backend + updates jobApps & totalItems
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

    onApplicationSubmit();

    return data; // could potentially use this for a toast message
  };
  // update an existing entry in our table and send those edits to supabase
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

  // handler to open job app form modal + reset it's state for a new entry
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

  // handle editing a job app entry in our form
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

  // deletes an entry in supabase + frontend
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

      onApplicationSubmit();

      // Handle pagination after deletion
      if (isLastItemOnPage && isLastPage && currentPage > 1) {
        onPageChange(currentPage - 1); // Move to previous page if we deleted the last item on the current page
      }
    } catch (error) {
      console.error("Delete failed:", error.message);
    }
  };

  // this useEffect will refresh/update the jobApps array
  useEffect(() => {}, [jobApps, itemsPerPage, onPageChange]);

  // TODO: WIll need to add feature where job application cards in table are clickable and open a view above page or new view altogether of all information of job application entry, this could be extensive info where table shows only essentials at a glance, maybe recruiter info, interview date, a hyperlink of actual job listing,

  // Stretch goal: Build a web scraper or so users can paste a link to the job they applied to and then just update status, but have the app cover all inputs from link

  return (
    <>
      <div className="flex">
        <div className="flex flex-col gap-2 items-center">
          <div className="mr-2">
            {/* this will open the form for users to input a new job application */}
            <button onClick={() => handleAddNew()}>
              <MdAddBox className="text-black opacity-85 size-9 hover:opacity-75" />
            </button>
          </div>
          <div className="mr-2">
            {/* sort buttons based on alphabetical order */}
            <button onClick={() => onSort("companyTitle")}>
              {sortConfig.key === "companyTitle" &&
              sortConfig.direction === "desc" ? (
                <span className="flex flex-col items-center hover:opacity-75">
                  <RiSortAlphabetAsc className="text-black opacity-65 size-7 " />
                  <p className="text-xs font-medium text-gray-500">Descend</p>
                </span>
              ) : (
                <span className="flex flex-col items-center hover:opacity-75">
                  <RiSortAlphabetDesc className="text-black opacity-65 size-7 " />
                  <p className="text-xs font-medium text-gray-500">Ascend</p>
                </span>
              )}
            </button>
          </div>
          <div className="mr-2">
            {/* sort buttons based on entry date */}
            <button
              onClick={() => onSort("created_at")}
              className="flex items-center gap-1"
            >
              {sortConfig.key === "created_at" &&
              sortConfig.direction === "desc" ? (
                <span className="flex flex-col items-center hover:opacity-75">
                  <PiClockClockwiseBold className="text-black opacity-65 size-6 " />
                  <p className="text-xs font-medium text-gray-500">Latest</p>
                </span>
              ) : (
                <span className="flex flex-col items-center hover:opacity-75">
                  <PiClockCounterClockwiseBold className="text-black opacity-65 size-6 " />
                  <p className="text-xs font-medium text-gray-500">Earliest</p>
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="">
          <table className=" bg-slate-50 rounded-lg shadow-sm w-full table-fixed ">
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
                    onApplicationSubmit={onApplicationSubmit}
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
            onApplicationSubmit={onApplicationSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default Table;
