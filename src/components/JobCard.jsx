import React from "react";
import { MdOutlineEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const JobCard = ({ jobApps, handleEdit, handleDelete }) => {
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

  const formatDate = (timestamp) => {
    return new Date(timestamp)
      .toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
        // hour: "2-digit",
        // minute: "2-digit",
        // hour12: false,
      })
      .replace(/,/g, "")
      .replace(/\//g, "-");
  };
  return (
    <>
      {/* Remember: to make the table scrollable, so the component doesn't stretch the page infinitely */}

      {jobApps.map((jobApp) => (
        <tr key={jobApp.id} className="hover:bg-slate-200">
          <td className="py-2 px-3 text-sm">{jobApp.companyTitle}</td>
          <td className="py-2 px-3 text-sm">{jobApp.role}</td>
          <td className="py-2 px-3 text-sm">{jobApp.description}</td>
          {/* be cool for user to click on application status and toggle it that way or click through a slider animation */}
          <td className="py-2 px-3 text-sm">
            {" "}
            <div
              className={`rounded-lg py-1 px-2 shadow hover:opacity-75 text-center ${
                getStatusTagColor(jobApp.status).backgroundColor
              }`}
            >
              {jobApp.status}
            </div>
          </td>
          <td className="py-2 px-3 text-sm">{formatDate(jobApp.created_at)}</td>
          <td className="py-2 px-3">
            <div className="flex flex-row items-center justify-around">
              {" "}
              <div className="opacity-70 hover:opacity-100 hover:outline-2 hover:animate-pulse">
                <button
                  onClick={() => {
                    console.log("Clicked Edit Job Application");
                    handleEdit(jobApp);
                  }}
                >
                  <MdOutlineEdit className="size-5.5" />
                </button>
              </div>
              <div className="opacity-70 hover:opacity-100 hover:outline-2 hover:animate-pulse">
                <button
                  onClick={() => {
                    console.log("Clicked Delete Job Application");
                    handleDelete(jobApp.id);
                  }}
                >
                  <MdDelete className="size-5.5" />
                </button>
              </div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default JobCard;
