import React from "react";

const JobCard = () => {
  return (
    <>
      <tr>
        <td className="p-3">Blackheart</td>
        <td className="p-3">Software Engineer</td>
        <td className="p-3">Front end dev work</td>
        <td className="p-3">
          {" "}
          <div className="bg-yellow-200 rounded-lg py-1 px-2 shadow hover:opacity-75">
            Interviewing
          </div>
        </td>
        <td className="p-3">Edit</td>
      </tr>
    </>
  );
};

export default JobCard;
