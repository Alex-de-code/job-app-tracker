import { useState } from "react";

const JobAppForm = ({
  jobApps,
  isModalOpen,
  setIsModalOpen,
  newJobApp,
  setNewJobApp,
  AddNewJobApp,
  isEditing,
  UpdateJobApp,
  currentEditId,
  setCurrentEditId,
}) => {
  // SHould set this up like a modal pop up
  // think Z index overlayed atop the intial table

  // need to pass down a prop from parent component in this case, Table.jsx that turns modal visibility for this form on/off

  // need to send form submission to update dummy data array

  const modalVisibility = (isModalOpen) => {
    return isModalOpen ? "visible" : "invisible";
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setNewJobApp((prev) => ({ ...prev, [id]: value }));
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentEditId(null);
  };

  //update logic for handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      // check if there are any missing input fields / blnak fields in form
      !newJobApp.companyTitle.trim() ||
      !newJobApp.role.trim() ||
      !newJobApp.description.trim() ||
      !newJobApp.status.trim()
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (isEditing) {
      // Get the original job to preserve its date
      const originalJob = jobApps.find((job) => job.id === currentEditId);
      UpdateJobApp({
        ...newJobApp,
        id: currentEditId,
        dateAdded: originalJob?.dateAdded || new Date().getTime(),
      });
    } else {
      AddNewJobApp({
        ...newJobApp,
        dateAdded: newJobApp.dateAdded || new Date().getTime(),
      });
    }

    // reset form
    setNewJobApp({
      ompanyTitle: "",
      role: "",
      description: "",
      status: "",
      dateAdded: new Date().getTime(),
    });

    setCurrentEditId(null);
    setIsModalOpen(false);
    // Close modal
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={`${modalVisibility(isModalOpen)}`}>
        <div className="mt-3">
          {/* Dynamic title for form */}
          {!isEditing ? (
            <h3 className="font-semibold border-b-3 border-slate-800 mb-4">
              Add New Job Application
            </h3>
          ) : (
            <h3 className="font-semibold border-b-3 border-slate-800 mb-4">
              Edit Job Application
            </h3>
          )}

          {/* <hr className="mb-3 rounded hei" /> */}
        </div>
        <form onSubmit={handleSubmit}>
          {/* <label htmlFor="companyTitle">Company Title:</label> */}
          <div className={`shadow-sm bg-slate-100 rounded-lg`}>
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
              className="hover:border-2 border-slate-200 rounded p-1 text-sm opacity-50"
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
            <div className="inline-block text-white border-2 border-black bg-black px-2 py-1 rounded hover:bg-slate-300 hover:text-black hover:border-slate-300 hover:border-2">
              <button onClick={handleCancel} className="cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default JobAppForm;
