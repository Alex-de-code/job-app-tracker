import JobCard from "./JobCard.jsx";
import { MdAddBox } from "react-icons/md";

const Table = () => {
  return (
    <>
      <div className="flex flex-row p-10">
        <div className="mr-1 mt-1 hover:opacity-75">
          <MdAddBox className="size-9" />
        </div>
        <div className="">
          <table className=" bg-slate-100 rounded-lg shadow-sm">
            <thead className="border-b-2 border-slate-200">
              <tr className="">
                <th className="text-sm p-3 tracking-wide text-left">
                  Company Title
                </th>
                <th className=" text-sm p-3 tracking-wide text-left">Role</th>
                <th className="text-sm p-3 tracking-wide text-left">
                  Description
                </th>
                <th className=" text-sm p-3 tracking-wide text-left">Status</th>
                <th className=" text-sm p-3 tracking-wide text-left">
                  Date Added
                </th>
                <th className=" text-sm p-3 tracking-wide text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <JobCard />
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Table;
