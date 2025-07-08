import { Link } from "react-router-dom";
import { useStat, useEffect, useState } from "react";
import { supabase } from "../supabase-client";

const Settings = () => {
  const [weeklyGoal, setWeeklyGoal] = useState(25);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // test to verify auth state
  const verifySession = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error || !session) {
      console.error("No active session:", error);
      // Redirect to login or handle as needed
      return false;
    }
    return true;
  };

  // Fetch current goal when component mounts
  useEffect(() => {
    const fetchCurrentGoal = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
          .from("user_goals")
          .select("weekly_target")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setWeeklyGoal(data.weekly_target);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentGoal();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");
      // DEBUGGING LOGS
      // console.log("Attempting to update goals for user:", user.id);
      // console.log("New weekly goal:", weeklyGoal);

      // to use upsert, an UPDATE + INSERT RLS Policy must exist in supabase backend
      const { error } = await supabase.from("user_goals").upsert(
        {
          id: user.id,
          weekly_target: weeklyGoal,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id", // This ensures we update if record exists
        }
      );

      if (error) throw error;

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !weeklyGoal) {
    return <div>Loading settings...</div>;
  }

  return (
    <>
      <div className="">
        <div className="pt-18 px-10">
          <div className=" bg-white rounded-lg shadow-sm w-1/2 p-6">
            <h3 className="text-2xl">Settings</h3>
            <hr className="text-gray-500 border-2 rounded-full mt-0.5" />

            {error && (
              <div className="my-3 p-3 bg-red-100 text-red-500 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="my-3 p-3 bg-green-100 text-green-500 rounded-md">
                Settings saved successfully!
              </div>
            )}

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
                  {[10, 15, 20, 25, 30, 35, 40, 45, 50].map((num) => (
                    <option key={num} value={num}>
                      {num} applications
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
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
