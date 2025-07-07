import { Link } from "react-router-dom";
import { useState } from "react";

const Settings = () => {
  const [weeklyGoal, setWeeklyGoal] = useState(25);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving weekly goal:", weeklyGoal);
  };
  return (
    <>
      <div className="">
        <div className="pt-18 px-10">
          <div className=" bg-white rounded-lg shadow-sm w-1/2 p-6">
            <h3 className="text-2xl">Settings</h3>
            <hr className="text-gray-500 border-2 rounded-full mt-0.5" />
            <form onSubmit={handleSubmit}>
              <div className="my-3 border-2 border-slate-100 p-2 rounded-xl">
                <label
                  htmlFor="weeklyGoal"
                  className="block text-sm font-medium text-gray-700"
                >
                  Weekly Application Goal
                </label>
                <select
                  id="weeklyGoal"
                  name="weeklyGoal"
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                  className="mt-1 block w-full p-2 text-base border-gray-300 sm:text-sm rounded-md hover:bg-slate-300"
                >
                  {[5, 10, 15, 20, 25, 30].map((num) => (
                    <option key={num} value={num}>
                      {num} applications
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-black opacity-75 text-white rounded-md hover:opacity-50 shadow"
              >
                Save Settings
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
