// src/routes/dashboard/filter-performance.jsx
import { useEffect, useState } from "react";
import { getPBUsers } from "@/data/pbDataService";
import Loader from "@/layouts/Loader";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";

const FILTER_COLORS = [
  "bg-white dark:bg-slate-800",
  "bg-white dark:bg-slate-800",
  "bg-white dark:bg-slate-800",
  "bg-white dark:bg-slate-800",
];
const FILTER_IMAGES = [
  "/filters/filter1.png",
  "/filters/filter2.png",
  "/filters/filter3.png",
  "/filters/filter4.png",
];
const FILTER_COLORS_UI = {
  1: "bg-blue-500",
  2: "bg-purple-500",
  3: "bg-yellow-400",
  4: "bg-red-500",
};

export default function FilterPerformancePage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");



  useEffect(() => {
    const loadData = async () => {
      const data = await getPBUsers();
      setUsers(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const getStatsForFilter = (filterId) => {
    const filtered = users.filter((u) => u.filters?.includes(filterId));
    const totalUsers = filtered.length;
    const totalDuration = filtered.reduce((sum, u) => sum + (u.duration || 0), 0);
    const avgDuration = totalUsers ? (totalDuration / totalUsers).toFixed(2) : 0;
    const interacted = filtered.filter((u) => u.interacted).length;

    return {
      totalUsers,
      avgDuration,
      interacted,
      notInteracted: totalUsers - interacted,
      dates: [...new Set(filtered.map((u) => new Date(u.endTime).toLocaleDateString()))],
    };
  };

  if (loading) return <Loader message="Loading filter stats..." />;

  return (
    <div className="p-6">
     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
  <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
    Filter Performance
  </h1>
  <input
    type="text"
    placeholder="Search filters..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full sm:w-64 px-4 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
</div>
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
  {Array.from({ length: 8 })
    .map((_, index) => (index % 4) + 1)
    .filter((filterId) => {
      const search = searchTerm.toLowerCase().trim();
      return (
        search === "" ||
        `filter ${filterId}`.includes(search) ||
        filterId.toString().includes(search)
      );
    })
    .map((filterId, index) => {
      const stats = getStatsForFilter(filterId);
      return (
        <button
          key={index}
          onClick={() => setActiveFilter(filterId)}
          className={`rounded-xl text-slate-900 dark:text-white flex flex-col justify-between shadow-md hover:shadow-lg overflow-hidden ${FILTER_COLORS[filterId - 1]}`}
        >
          <div className="w-full h-65 bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <img
              src={FILTER_IMAGES[filterId - 1]}
              alt="Filter"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 text-center">
            <p className="text-base font-semibold">Filter {filterId}</p>
            <p className="text-sm opacity-80">{stats.totalUsers} users</p>
          </div>
        </button>
      );
    })}
</div>


     <AnimatePresence>
  {activeFilter && (
    <Dialog open={!!activeFilter} onClose={() => setActiveFilter(null)} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true " />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
        <Dialog.Panel className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl">
  {(() => {
    const stats = getStatsForFilter(activeFilter);
    const maleCount = users.filter(
      (u) => u.filters.includes(activeFilter) && u.gender?.toLowerCase() === "male"
    ).length;
    const femaleCount = users.filter(
      (u) => u.filters.includes(activeFilter) && u.gender?.toLowerCase() === "female"
    ).length;

              return (
      <>
        <div className="flex flex-col gap-4">
          <div className="w-full h-64 bg-slate-200 rounded-xl overflow-hidden flex items-center justify-center bg-whites dark:bg-slate-900">
            <img
              src={FILTER_IMAGES[activeFilter - 1]}
              alt={`Filter ${activeFilter}`}
              className="object-contain h-full w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-white text-sm px-3 py-1 rounded-full ${FILTER_COLORS_UI[activeFilter]}`}
            >
              Filter {activeFilter}
            </span>
          </div>

          <div className="text-slate-700 dark:text-white space-y-2 divide-y divide-slate-300/20 text-sm">
            <div className="grid grid-cols-2 gap-3 pb-2">
              <div>Total Users</div>
              <div className="text-right font-semibold">{stats.totalUsers}</div>
              <div>Avg Duration</div>
              <div className="text-right">{stats.avgDuration}s</div>
              <div>Interacted</div>
              <div className="text-right">{stats.interacted}</div>
              <div>Not Interacted</div>
              <div className="text-right">{stats.notInteracted}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 pb-2">
              <div>Male Users</div>
              <div className="text-right">{maleCount}</div>
              <div>Female Users</div>
              <div className="text-right">{femaleCount}</div>
            </div>

            <div className="pt-2">
              <div className="opacity-70 mb-1">Date Range</div>
              <div className="flex flex-wrap gap-2 text-xs text-right">
                {stats.dates.map((d, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveFilter(null)}
            className="mt-4 rounded-lg w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 font-medium"
          >
            Close
          </button>
        </div>
      </>
    );
  })()}
</Dialog.Panel>
        </motion.div>
      </div>
    </Dialog>
  )}
</AnimatePresence>
    </div>
  );
}
