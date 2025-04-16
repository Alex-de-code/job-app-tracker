import React from "react";
import { MdOutlineEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const JobCard = () => {
  return (
    <>
      <tr>
        <td className="py-2 px-3 text-sm">Blackheart</td>
        <td className="py-2 px-3 text-sm">Software Engineer</td>
        <td className="py-2 px-3 text-sm">Front end dev work</td>
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
              <MdOutlineEdit className="size-5.5" />
            </div>
            <div className="hover:opacity-75">
              <MdDelete className="size-5.5" />
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};

export default JobCard;
