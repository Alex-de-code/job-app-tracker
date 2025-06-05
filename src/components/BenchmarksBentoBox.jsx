import React from "react";
import { GiAchievement } from "react-icons/gi";

const BenchmarksBentoBox = () => {
  // TODO: setup business logic in supabase for handling counters and sending back info so most up-to-date info is shown to the user -- & replace hard coded data with this

  // TODO: Create conditional logic that when a user's target goal is reached they unlock this badge -- can set a default of 10 - 25 jobs

  return (
    <>
      <div className="h-full grid gri-cols-1 lg:grid-cols-2 grid-rows-8 lg:grid-rows-4 gap-3">
        <div className="bg-white col-span-1 row-span-1 rounded-xl p-4 shadow">
          <div className="text-gray-500 text-sm">This Week</div>
          <div className="flex flex-row ">
            <div className="text-4xl font-bold mt-2">25</div>
            {/* TODO: Create conditional logic that when a user's target goal is reached they unlock this badge -- can set a default of 10 - 25 jobs  */}
            <GiAchievement className="size-10 mt-2 text-amber-400" />
          </div>
        </div>
        <div className="bg-white col-span-1 row-span-1 rounded-xl p-4 shadow">
          <div className="text-gray-500 text-sm">Interview Rate</div>
          <div className="text-4xl font-bold mt-2">23%</div>
        </div>
        <div className="bg-white col-span-1 row-span-1 rounded-xl p-4 shadow">
          <div className="text-gray-500 text-sm">Avg. Reply Time</div>
          <div className="text-4xl font-bold mt-2">8d</div>
        </div>
        <div className="bg-white col-span-1 row-span-1 rounded-xl p-4 shadow">
          <div className="text-gray-500 text-sm">Total Applications</div>
          <div className="text-4xl font-bold mt-2">234</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="text-gray-500 text-sm">Weekly Applications</div>
          <div className="text-4xl font-bold mt-1 text-gray-900">25</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow">
          <div className="text-gray-500 text-sm">Interview Rate</div>
          <div className="text-4xl font-bold text-emerald-600">32%</div>
        </div>
      </div>
    </>
  );
};

export default BenchmarksBentoBox;
