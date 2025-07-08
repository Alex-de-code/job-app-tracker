import { useState } from "react";
import { supabase } from "../supabase-client";

const JobAppForm = ({
  isModalOpen,
  setIsModalOpen,
  newJobApp,
  setNewJobApp,
  AddNewJobApp,
  isEditing,
  setIsEditing,
  UpdateJobApp,
  currentEditId,
  setCurrentEditId,
  onPageChange,
  jobApps,
  itemsPerPage,
  currentPage,
  onApplicationSubmit,
}) => {
  // SHould set this up like a modal pop up
  // think Z index overlayed atop the intial table

  // need to pass down a prop from parent component in this case, Table.jsx that turns modal visibility for this form on/off

  // need to send form submission to update dummy data array

  /// ----> ----> ----> ----->

  // TODO: Should Update modal so that it's over the UI, think a Z-index, right now the way form is set up it will always be below all job app entries which is a no no!!!

  const modalVisibility = (isModalOpen) => {
    return isModalOpen ? "visible" : "invisible";
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setNewJobApp((prev) => ({ ...prev, [id]: value }));
  };

  const handleCancel = () => {
    // Reset form and close modal
    setNewJobApp({
      companyTitle: "",
      role: "",
      description: "",
      status: "",
      created_at: "",
    });
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentEditId(null);
  };

  //update logic for handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !newJobApp.companyTitle.trim() ||
      !newJobApp.role.trim() ||
      !newJobApp.description.trim() ||
      !newJobApp.status.trim()
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      if (isEditing) {
        // Update existing job
        await UpdateJobApp({
          ...newJobApp,
          id: currentEditId,
        });
      } else {
        // Add new job
        await AddNewJobApp(newJobApp);
        await onApplicationSubmit();

        // Check if current page is now over capacity, this is to update table view if count of entries reaches of view limit to create new table page
        if (jobApps && jobApps.length % itemsPerPage === 0) {
          onPageChange(currentPage + 1); // Move to next page
        }
      }

      // Reset form and close modal
      setNewJobApp({
        companyTitle: "",
        role: "",
        description: "",
        status: "",
        created_at: "",
      });
      setCurrentEditId(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving job:", error.message);
    }
  };

  return (
    <>
      <div className={`${modalVisibility(isModalOpen)} `}>
        <div className="fixed inset-0 bg-blur-sm bg-opacity-50 backdrop-blur-sm z-40"></div>
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-200 bg-opacity-50 p-4 rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div className="">
              {/* Dynamic title for form */}
              {!isEditing ? (
                <h3 className="text-xl font-semibold border-b-3 border-slate-800 mb-4">
                  Add New Job Application
                </h3>
              ) : (
                <h3 className="text-xl font-semibold border-b-3 border-slate-800 mb-4">
                  Edit Job Application
                </h3>
              )}

              {/* <hr className="mb-3 rounded hei" /> */}
            </div>
            <form onSubmit={handleSubmit}>
              {/* <label htmlFor="companyTitle">Company Title:</label> */}
              <div className={`shadow-sm bg-slate-50 rounded-lg`}>
                <input
                  type="text"
                  id="companyTitle"
                  value={newJobApp.companyTitle || ""} // added fallback value to emptry string w/o this error pops up when program hits trim() in handleSubmit()
                  onChange={handleChange}
                  className="hover:bg-slate-200 rounded text-sm p-3 w-1/6 mr-2"
                  placeholder="Company Title"
                  required
                />
                {/* <label htmlFor="role">Role:</label> */}
                <input
                  type="text"
                  id="role"
                  value={newJobApp.role || ""}
                  onChange={handleChange}
                  className="hover:bg-slate-200 rounded text-sm p-3 w-1/6 mr-5"
                  placeholder="Role"
                  required
                />
                {/* <label htmlFor="description">Description:</label> */}
                <input
                  type="text"
                  id="description"
                  value={newJobApp.description || ""}
                  onChange={handleChange}
                  className="hover:bg-slate-200 rounded text-sm p-3 w-1/6 mr-9"
                  placeholder="Description"
                  required
                />

                <select
                  id="status"
                  value={newJobApp.status || ""}
                  onChange={handleChange}
                  className="hover:bg-slate-300 rounded p-3 text-sm opacity-50"
                  required
                >
                  <option disabled value="">
                    Select Status
                  </option>
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Denied">Denied</option>
                </select>

                {/* <input type="date" id="date p/> */}

                {/* Add a live date feature so users can see the date they applied to a job, this could be used for metrics later  */}
              </div>
              <div className=" mt-3 flex flex-row gap-2">
                <div className="inline-block px-2 border-2 py-1 rounded hover:bg-slate-300">
                  <button type="submit" className="cursor-pointer">
                    Submit
                  </button>
                </div>
                <div className="inline-block text-white border-2 border-black bg-black px-2 py-1 rounded hover:border-stone-200 hover:border-2  hover:rounded-lg">
                  <button onClick={handleCancel} className="cursor-pointer">
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobAppForm;
