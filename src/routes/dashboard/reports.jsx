// src/routes/reports/page.jsx
import { useEffect, useState, useMemo } from "react";
import { getAllUsers } from "@/data/chartDataService";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const ROWS_PER_PAGE = 20;
const FILTER_COLORS = ["bg-[#4A90E2]", "bg-[#AB47BC]", "bg-[#FBC02D]", "bg-[#E57373]"];

const ReportsPage = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    getAllUsers().then(data => {
      setUsers(data);
    });
  }, []);

  const filterConditions = {
    all: () => true,
    interacted: (u) => u.interacted,
    not_interacted: (u) => !u.interacted,
    male: (u) => u.gender === "Male",
    female: (u) => u.gender === "Female",
    age_above: (u) => u.age > 25,
    age_below: (u) => u.age <= 25,
    filter_1: (u) => u.filter === 1,
    filter_2: (u) => u.filter === 2,
    filter_3: (u) => u.filter === 3,
    filter_4: (u) => u.filter === 4,
  };

  const filterList = useMemo(() => [
    { label: "All", value: "all" },
    { label: "Interacted", value: "interacted" },
    { label: "Not Interacted", value: "not_interacted" },
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Age > 25", value: "age_above" },
    { label: "Age ≤ 25", value: "age_below" },
    { label: "Filter 1", value: "filter_1" },
    { label: "Filter 2", value: "filter_2" },
    { label: "Filter 3", value: "filter_3" },
    { label: "Filter 4", value: "filter_4" },
  ], []);

  const filteredUsers = users.filter(filterConditions[activeFilter]);
  const totalPages = Math.ceil(filteredUsers.length / ROWS_PER_PAGE);
  const paginated = filteredUsers.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const getCount = (filter) => users.filter(filterConditions[filter]).length;

  return (
    <div className="space-y-6 overflow-x-hidden">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User-List</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 bg-white dark:bg-slate-900 p-3 rounded-xl border border-transparent">
        {filterList.map((f) => (
          <button
            key={f.value}
            onClick={() => { setActiveFilter(f.value); setCurrentPage(1); }}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition ${
              activeFilter === f.value
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white"
            }`}
          >
            {f.label}
            <span className={`text-xs px-2 py-0.5 rounded-md text-white ${
              f.value.includes("filter") ? FILTER_COLORS[parseInt(f.value.split("_")[1]) - 1] : "bg-indigo-500"
            }`}>
              {getCount(f.value)}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 300 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        >
      <div className="overflow-x-auto rounded-xl shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700" >
        <table className="min-w-full text-sm text-left ">
          <thead className="bg-slate-200 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Age</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Duration (s)</th>
              <th className="p-3">Interacted</th>
              <th className="p-3">Hand Gestures</th>
              <th className="p-3">Filter</th>
            </tr>
          </thead>
          <motion.tbody
            key={currentPage + activeFilter}
           
            transition={{ duration: 0.3 }}
            className="divide-y divide-slate-100 dark:divide-slate-800"
          >
            {paginated.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                <td className="p-3 whitespace-nowrap text-slate-700 dark:text-slate-200">{user.id}</td>
                <td className="p-3 whitespace-nowrap text-slate-700 dark:text-slate-200">{user.age}</td>
                <td className="p-3 whitespace-nowrap text-slate-700 dark:text-slate-200">{user.gender}</td>
                <td className="p-3 whitespace-nowrap text-slate-700 dark:text-slate-200">{user.duration.toFixed(2)}</td>
                <td className="p-3 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    user.interacted ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}>
                    {user.interacted ? "Yes" : "No"}
                  </span>
                </td>
                <td className="p-3 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    user.handGestures ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}>
                    {user.handGestures ? "Yes" : "No"}
                  </span>
                </td>
                <td className="p-3 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium text-white ${
                    FILTER_COLORS[(user.filter || 1) - 1] || "bg-indigo-500"
                  }`}>
                    {user.filter}
                  </span>
                </td>
              </tr>
            ))}
          </motion.tbody>
        </table>
      </div>
      </motion.div>
      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="p-2 disabled:opacity-30 text-slate-900 dark:text-white"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm text-slate-900 dark:text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="p-2 disabled:opacity-30 text-slate-900 dark:text-white"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ReportsPage;
