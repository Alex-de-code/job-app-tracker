import React from "react";
import { MdOutlineEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const JobCard = ({ jobApps, onEdit, onDelete }) => {
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
        <tr
          key={jobApp.id}
          onClick={() =>
            // this will be where we set the handler to adjust the table view and open up the full view of a job app entry, could make it a pop up modal or set up conditional logic to replace table view with a view of the job, maybe it becomes it's own view???
            console.log(
              `Show me full detailed view for job application ${jobApp.id}`
            )
          }
          className="hover:bg-slate-200  border-slate-200 border-t-2"
        >
          <td className="py-2 px-3 text-sm">{jobApp.companyTitle}</td>
          <td className="py-2 px-3 text-sm truncate">{jobApp.role}</td>
          <td className="hidden lg:table-cell py-2 px-3 text-sm truncate">
            {jobApp.description}
          </td>
          {/* be cool for user to click on application status and toggle it that way or click through a slider animation */}
          <td className="py-2 px-3 text-sm">
            {" "}
            <div
              className={`inline-block md:w-full rounded-lg py-1 px-2 shadow text-center ${
                getStatusTagColor(jobApp.status).backgroundColor
              }`}
            >
              {jobApp.status}
            </div>
          </td>
          <td className=" py-2 px-3 text-sm">
            {formatDate(jobApp.created_at)}
          </td>
          <td className="py-2 px-3">
            <div className="flex flex-row items-center">
              {" "}
              <div className="opacity-70 hover:opacity-100 hover:outline-2 hover:animate-pulse mr-2">
                <button
                  onClick={() => {
                    console.log("Clicked Edit Job Application");
                    onEdit(jobApp);
                  }}
                >
                  <MdOutlineEdit className="size-5.5" />
                </button>
              </div>
              <div className="opacity-70 hover:opacity-100 hover:outline-2 hover:animate-pulse">
                <button
                  onClick={() => {
                    console.log("Clicked Delete Job Application");
                    onDelete(jobApp.id);
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
