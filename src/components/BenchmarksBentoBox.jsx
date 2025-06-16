import React from "react";
import { GiAchievement } from "react-icons/gi";
import { PieChart, Pie, Sector, ResponsiveContainer, Legend } from "recharts";

const BenchmarksBentoBox = () => {
  // TODO: setup business logic in supabase for handling counters and sending back info so most up-to-date info is shown to the user -- & replace hard coded data with this

  // TODO: Create conditional logic that when a user's target goal is reached they unlock this badge -- can set a default of 10 - 25 jobs

  // TODO: rethink table columns, should be responsive and when screen is small only essentials, role, date, state, edit, delete

  // Stretch goal: build a secret game, or a dopamine reward after entering 15 + jobs in one day or reaching weekly goal users can play a mini game in the benchmarksbentobox as a reward, the game won't be secret but maybe I can implement a leaderboard that's only accessible in brief time window after users play game, maybe they get 3 tries to play and then the game is gone until next weeks -- this could be fun incentive to consistently use app and a treat to the user --very exciting

  // Should I add progress bar for users to see if they've reached goal? Or is counter enough? maybe counter changes color to green once reached? or I keep badge?

  // Should I add a heat map like Github so users know how many weeks they reached weekly goal, or everyday they applied to jobs????

  // once pie chart is live will need a condiitional rednder for when there is no data yet in system of user job apps

  //DUmmy data for pie chart
  const data = [
    { name: "Accepted", value: 300, fill: "#43a047" },
    { name: "Interviewing", value: 200, fill: "#fdd835" },
    { name: "Denied", value: 500, fill: "#e53935" },
    { name: "Applied", value: 100, fill: "#90a4ae" },
  ];

  return (
    <>
      <div className="h-full grid gri-cols-1 lg:grid-cols-2 grid-rows-8 lg:grid-rows-4 gap-3">
        <div className="bg-white col-span-1 row-span-1 rounded-xl p-4 shadow">
          <div className="text-gray-500 text-sm">Weekly Applications</div>
          <div className="flex flex-row ">
            <div className="text-4xl font-bold mt-2">25</div>
            {/* TODO: Create conditional logic that when a user's target goal is reached they unlock this badge -- can set a default of 10 - 25 jobs  */}
            <GiAchievement className="size-10 mt-2 text-amber-400" />
          </div>
        </div>

        <div className="bg-white col-span-1 row-span-1 border border-gray-200 rounded-xl p-4 shadow">
          <div className="text-gray-500 text-sm">Interview Rate</div>
          <div className="text-4xl mt-2 font-bold text-emerald-600">32%</div>
        </div>
        <div className="bg-white col-span-1 row-span-1 rounded-xl p-4 shadow">
          <div className="text-gray-500 text-sm">Avg. Reply Time</div>
          <div className="text-4xl font-bold mt-2">8d</div>
        </div>
        <div className="bg-white col-span-1 row-span-1 rounded-xl p-4 shadow">
          <div className="text-gray-500 text-sm">Total Applications</div>
          <div className="text-4xl font-bold mt-2">234</div>
        </div>
        <div className="col-span-2 row-span-2 bg-slate-50 rounded-xl p-4 shadow">
          <div className="text-gray-500 text-sm">Application Status</div>

          {/* <div className="bg-white border border-gray-200 rounded-xl p-4 shadow"> */}
          {/* <div className="text-gray-500 text-sm">Interview Rate</div>
            <div className="text-4xl font-bold text-emerald-600">32%</div> */}
          {/* </div> */}
          {/* </div> */}
          <ResponsiveContainer width="100%" height={227}>
            <PieChart
              width={300}
              height={230}
              // margin={{ top: 10, right: 0, left: 50, bottom: 0 }}
            >
              <Pie
                // activeIndex={this.state.activeIndex}
                // activeShape={renderActiveShape}
                data={data}
                cx="49%"
                cy="47%"
                innerRadius={53}
                outerRadius={70}
                // fill="#8894d8"
                // fill="ffffff"
                dataKey="value"
                paddingAngle={3}
                strokeWidth={1}
                label
                // labelLine={false}
              />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default BenchmarksBentoBox;
