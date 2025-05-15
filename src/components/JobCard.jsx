import React from "react";
import { MdOutlineEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const JobCard = ({ jobApps }) => {
  const getStatusTagColor = (status) => {
    switch (status) {
      case "Applied":
        return {
          backgroundColor: "bg-slate-300",
        };
      case "Interviewing":
        return {
          backgroundColor: "bg-yellow-200",
        };
      case "Accepted":
        return {
          backgroundColor: "bg-green-300",
        };
      case "Denied":
        return {
          backgroundColor: "bg-red-300",
        };

      default:
        return {
          backgroundColor: "bg-gray-300",
        };
    }
  };
  return (
    <>
      {/* Remember: Change hard coded data to variables based on schema design in Table.jsx + form component */}
      {/* Remember: to make the table scrollable, so the component doesn't stretch the page infinitely */}

      {jobApps.map(({ companyTitle, role, description, status, dateAdded }) => (
        <>
          <tr>
            <td className="py-2 px-3 text-sm">{companyTitle}</td>
            <td className="py-2 px-3 text-sm">{role}</td>
            <td className="py-2 px-3 text-sm">{description}</td>
            {/* be cool for user to click on application status and toggle it that way or click through a slider animation */}
            <td className="py-2 px-3 text-sm">
              {" "}
              <div
                className={`rounded-lg py-1 px-2 shadow hover:opacity-75 text-center ${
                  getStatusTagColor(status).backgroundColor
                }`}
              >
                {status}
              </div>
            </td>
            <td className="py-2 px-3 text-sm">{dateAdded}</td>
            <td className="py-2 px-3">
              <div className="flex flex-row items-center justify-around">
                {" "}
                <div className="hover:opacity-75">
                  <button
                    onClick={() => {
                      console.log("Clicked Edit Job Application");
                    }}
                  >
                    <MdOutlineEdit className="size-5.5" />
                  </button>
                </div>
                <div className="hover:opacity-75">
                  <button
                    onClick={() => {
                      console.log("Clicked Delete Job Application");
                    }}
                  >
                    <MdDelete className="size-5.5" />
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </>
      ))}
    </>
  );
};

export default JobCard;
