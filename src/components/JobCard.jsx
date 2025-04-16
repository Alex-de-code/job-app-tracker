import React from "react";
import { MdOutlineEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const JobCard = () => {
  return (
    <>
      {/* Remember: Change hard coded data to variables based on schema design in Table.jsx + form component */}
      {/* Remember: to make the table scrollable, so the component doesn't stretch the page infinitely */}
      <tr>
        <td className="py-2 px-3 text-sm">Blackheart</td>
        <td className="py-2 px-3 text-sm">Software Engineer</td>
        <td className="py-2 px-3 text-sm">Front end dev work</td>
        {/* be cool for user to click on application status and toggle it that way or click through a slider animation */}
        <td className="py-2 px-3 text-sm">
          {" "}
          <div className="bg-yellow-200 rounded-lg py-1 px-2 shadow hover:opacity-75">
            Interviewing
          </div>
        </td>
        <td className="py-2 px-3 text-sm">22-04-23</td>
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
  );
};

export default JobCard;
