const JobAppForm = ({ isModalOpen }) => {
  // SHould set this up like a modal pop up
  // think Z index overlayed atop the intial table

  // need to pass down a prop from parent component in this case, Table.jsx that turns modal visibility for this form on/off

  // need to send form submission to update dummy data array
  //update logic for handle submit
  const handleSubmit = () => {};

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
              className="hover:bg-slate-200 rounded text-sm p-3 w-1/6 mr-2"
              placeholder="Company Title"
            />
            {/* <label htmlFor="role">Role:</label> */}
            <input
              type="text"
              id="role"
              className="hover:bg-slate-200 rounded text-sm p-3 w-1/6 mr-5"
              placeholder="Role"
            />
            {/* <label htmlFor="description">Description:</label> */}
            <input
              type="text"
              id="description"
              className="hover:bg-slate-200 rounded text-sm p-3 w-1/6 mr-9"
              placeholder="Description"
            />

            <select
              name=""
              id="status"
              className="hover:border-2 border-slate-200 rounded p-1 text-sm opacity-50"
            >
              <option disabled value="">
                Select Status
              </option>
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="accepted">Accepted</option>
              <option value="denied">Denied</option>
            </select>

            {/* Add a live date feature so users can see the date they applied to a job, this could be used for metrics later  */}
          </div>
          <div className=" mt-3 flex flex-row gap-2">
            <div className="inline-block bg-blue-200 px-2 py-1 rounded hover:opacity-75">
              <button type="submit" className="cursor-pointer">
                Submit
              </button>
            </div>
            <div className="inline-block bg-red-200 px-2 py-1 rounded hover:opacity-75">
              <button className="cursor-pointer">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default JobAppForm;
