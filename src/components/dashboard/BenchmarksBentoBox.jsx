import { useState, useEffect } from "react";
import { supabase } from "../../supabase-client";
import { PieChart, Pie, Sector, ResponsiveContainer, Legend } from "recharts";
import { GiAchievement } from "react-icons/gi";

const BenchmarksBentoBox = ({ refreshKey }) => {
  const [weeklyGoal, setWeeklyGoal] = useState(25); // Default
  const [currentApplications, setCurrentApplications] = useState(0);
  const [totalApps, setTotalApps] = useState(0); // counter of all job applications
  const [interviewRate, setInterviewRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's weekly goal and current application count
  // useEffect(() => {
  //   const fetchUserGoals = async () => {
  //     try {
  //       setLoading(true);
  //       const {
  //         data: { user },
  //       } = await supabase.auth.getUser();

  //       if (!user) return;

  //       // Get weekly target ----> SHOULD MIGRATE THIS LOGIC FOR CALCULATING COUNT TO BACKEND IN POSTGRESQL FOR PRODUCTION + SCALING
  //       const { data: goalsData } = await supabase
  //         .from("user_goals")
  //         .select("weekly_target")
  //         .eq("id", user.id)
  //         .single();

  //       if (goalsData) {
  //         setWeeklyGoal(goalsData.weekly_target);
  //       }

  //       // Get current week's applications count (you'll need to implement this)
  //       // This assumes you have an applications table with timestamps
  //       const { count } = await supabase
  //         .from("applications")
  //         .select("*", { count: "exact" })
  //         .gte("created_at", getStartOfWeek()) // You need a helper function
  //         .lte("created_at", getEndOfWeek()); // For the current week's range

  //       setCurrentApplications(count || 0);
  //     } catch (error) {
  //       console.error("Error fetching goals:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserGoals();
  // }, []);

  // Calculate start/end of week directly in component
  const getWeekRange = () => {
    const now = new Date();
    const day = now.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    const start = new Date(now.setDate(diff));
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return {
      start: start.toISOString().split("T")[0], // YYYY-MM-DD
      end: end.toISOString().split("T")[0],
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Get authenticated user
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user)
          throw new Error(authError?.message || "Not logged in");

        // 2. Get user's weekly goal
        const { data: goalData, error: goalError } = await supabase
          .from("user_goals")
          .select("weekly_target")
          .eq("id", user.id)
          .single();

        if (goalError) throw goalError;
        if (goalData) setWeeklyGoal(goalData.weekly_target);

        // 3. Get this week's applications
        const { start, end } = getWeekRange();
        const { count, error: countError } = await supabase
          .from("job_applications")
          .select("*", { count: "exact" })
          .eq("user_id", user.id) // Critical for security
          .gte("created_at", `${start}T00:00:00`)
          .lte("created_at", `${end}T23:59:59`);

        if (countError) throw countError;
        setCurrentApplications(count || 0);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);

  useEffect(() => {
    const fetchCount = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { count } = await supabase
        .from("job_applications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      setTotalApps(count || 0);
    };

    fetchCount();
  }, [refreshKey]);

  useEffect(() => {
    const calculateRates = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      try {
        // 1. Get counts in a single query (most efficient)
        const { count: totalApps } = await supabase
          .from("job_applications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        const { count: interviewingApps } = await supabase
          .from("job_applications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .ilike("status", "%interview%"); // Case-insensitive match

        // 2. Compute percentage
        const rate =
          totalApps > 0 ? Math.round((interviewingApps / totalApps) * 100) : 0;

        setInterviewRate(rate);
      } catch (err) {
        console.error("Calculation failed:", err);
        setInterviewRate(null);
      } finally {
        setLoading(false);
      }
    };

    calculateRates();

    // Refresh every 2 minutes (adjust as needed)
    // const pollInterval = setInterval(calculateRates, 120000);
    // return () => clearInterval(pollInterval);
  }, [refreshKey]);
  // this useEffect will refresh/update the benchmarkbento
  // useEffect(() => {}, [jobApps]);

  // TODO: setup business logic in supabase for handling counters and sending back info so most up-to-date info is shown to the user -- & replace hard coded data with this

  // TODO: Create conditional logic that when a user's target goal is reached they unlock this badge -- can set a default of 10 - 25 jobs

  // TODO: rethink table columns, should be responsive and when screen is small only essentials, role, date, state, edit, delete

  // Stretch goal: build a secret game, or a dopamine reward after entering 15 + jobs in one day or reaching weekly goal users can play a mini game in the benchmarksbentobox as a reward, the game won't be secret but maybe I can implement a leaderboard that's only accessible in brief time window after users play game, maybe they get 3 tries to play and then the game is gone until next weeks -- this could be fun incentive to consistently use app and a treat to the user --very exciting

  // Should I add progress bar for users to see if they've reached goal? Or is counter enough? maybe counter changes color to green once reached? or I keep badge?

  // Should I add a heat map like Github so users know how many weeks they reached weekly goal, or everyday they applied to jobs????

  // once pie chart is live will need a condiitional rednder for when there is no data yet in system of user job apps

  //DUmmy data for pie chart
  const data = [
    { name: "Accepted", value: 300, fill: "#05df72" },
    { name: "Interviewing", value: 200, fill: "#ffdf20" },
    { name: "Denied", value: 500, fill: "#ff6467" },
    { name: "Applied", value: 100, fill: "#90a4ae" },
  ];

  // DUMMY data for daily reminder, in future can set this up in supabase to pull from there
  // these quotes + future ones will be stored in a state in near future
  const motivationalQuotes = [
    "Remember: 10 minutes a day will make a world of a difference in 6 months.",
    "Progress is progress, no matter how small. Keep going!",
    "Every 'no' brings you closer to the right 'yes.' Stay persistent.",
    "Your value isn’t defined by outcomes—it’s defined by your effort and resilience.",
    "Small steps every day lead to big leaps over time. Trust the process.",
    "Rejection is redirection. The right opportunity is coming.",
    "You are more than your job search. Celebrate your growth along the way.",
    "Consistency beats intensity. Keep showing up for yourself.",
    "Your journey is unique. Don’t compare your chapter 1 to someone else’s chapter 20.",
    "Believe in the version of you that’s on the other side of this grind.",
    "Opportunities don’t happen by chance—you create them with action.",
  ];

  // need to add some logic so on rerenders the reminder of day doesn't change until next day
  // think local storage, a daily seed based on date, will need a useeffect to handle as well
  function RandomQuote() {
    const randomQuote =
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    return <p>"{randomQuote}"</p>;
  }

  return (
    <>
      <div className="h-full grid gri-cols-1 lg:grid-cols-2 grid-rows-8 lg:grid-rows-4 gap-3">
        <div className="bg-white col-span-1 row-span-1 rounded-xl p-4 shadow">
          <div className="text-gray-500 text-sm">Weekly Applications</div>
          <div className="flex flex-row ">
            <div className="text-4xl font-bold mt-2">
              {loading ? "--" : currentApplications}
              <span className="text-lg text-gray-500 ml-1">/ {weeklyGoal}</span>
            </div>
            {/* <div className="text-4xl font-bold mt-2">{weeklyGoal}</div> */}
            {/* TODO: Create conditional logic that when a user's target goal is reached they unlock this badge -- can set a default of 10 - 25 jobs  */}
            {/* <GiAchievement className="size-10 mt-2 text-amber-400" /> */}
          </div>
        </div>

        <div className="bg-white col-span-1 row-span-1 border border-gray-200 rounded-xl p-4 shadow">
          <div className="text-slate-500 text-sm">Interview Rate</div>
          <div className="text-4xl mt-2 font-bold text-emerald-600">
            <span>
              {interviewRate}
              <span className="ml-0.5 text-2xl">%</span>{" "}
            </span>
          </div>
        </div>
        {/* <div className="bg-white col-span-1 row-span-1 rounded-xl p-4 shadow">
          <div className="text-gray-500 text-sm">Avg. Reply Time</div>
          <div className="text-4xl font-bold mt-2">8d</div>
        </div> */}
        <div className="bg-white col-span-1 row-span-1 rounded-xl p-4 shadow">
          <div className="text-gray-500 text-sm">Total Applications</div>
          <div className="text-4xl font-bold mt-2">{totalApps}</div>
        </div>
        <div className="bg-white col-span-1 row-span-1 rounded-xl p-4 shadow">
          <div className="text-gray-500 text-sm">Daily Reminder</div>
          <div className="text-md font-semibold mt-2">{RandomQuote()}</div>
        </div>
        <div className="col-span-2 row-span-2 bg-slate-50 rounded-xl p-4 shadow">
          <div className="text-gray-500 text-sm">Application Status</div>

          {/* <div className="bg-white border border-gray-200 rounded-xl p-4 shadow"> */}
          {/* <div className="text-gray-500 text-sm">Interview Rate</div>
            <div className="text-4xl font-bold text-emerald-600">32%</div> */}
          {/* </div> */}
          {/* </div> */}
          <ResponsiveContainer width="100%" height="90%">
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
