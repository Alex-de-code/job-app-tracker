import { useState } from "react";

const JobAppForm = ({ isModalOpen, setIsModalOpen, AddNewJobApp }) => {
  // SHould set this up like a modal pop up
  // think Z index overlayed atop the intial table

  // need to pass down a prop from parent component in this case, Table.jsx that turns modal visibility for this form on/off

  // need to send form submission to update dummy data array

  //state for form inputs
  const [newJobApp, setNewJobApp] = useState({
    companyTitle: "",
    role: "",
    description: "",
    status: "",
    dataAdded: new Date(), // set this up so it automatically saves date user added a job app
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setNewJobApp((prev) => ({ ...prev, [id]: value }));
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

    AddNewJobApp(newJobApp);

    // reset form
    setNewJobApp({
      ompanyTitle: "",
      role: "",
      description: "",
      status: "",
      dateAdded: new Date(),
    });

    // Close modal
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const modalVisibility = (isModalOpen) => {
    return isModalOpen ? "visible" : "invisible";
  };

  return (
    <>
      <div className={`${modalVisibility(isModalOpen)}`}>
        <div className="mt-3">
          <h3 className="font-semibold border-b-3 border-slate-800 mb-4">
            Add New Job Application
          </h3>
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
            <div className="inline-block bg-blue-200 px-2 py-1 rounded hover:opacity-75">
              <button type="submit" className="cursor-pointer">
                Submit
              </button>
            </div>
            <div className="inline-block bg-red-200 px-2 py-1 rounded hover:opacity-75">
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
