// src/routes/reports/page.jsx
import { useEffect, useState, useMemo } from "react";
import { getPBUsers } from "@/data/pbDataService";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Loader from "@/layouts/Loader";
const ROWS_PER_PAGE = 20;
const FILTER_COLORS = ["bg-[#4A90E2]", "bg-[#AB47BC]", "bg-[#FBC02D]", "bg-[#E57373]"];

const ReportsPage = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");
 const [loading, setLoading] = useState(true);

useEffect(() => {
    const loadWithDelay = async () => {
      const dataPromise = getPBUsers();
      const delay = new Promise((res) => setTimeout(res, 1000));
      const [data] = await Promise.all([dataPromise, delay]);

      const sorted = [...data]
        .filter((u) => u.gender && u.age > 0)
        .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))
        .map((user, i) => {
          const interacted = user.interacted;
          return {
            ...user,
            id: i + 1,
            filters: interacted ? assignRandomFilters() : [],
            duration: interacted ? assignRandomDuration() : 0,
            gender: capitalize(user.gender),
          };
        });

      setUsers(sorted);
      setLoading(false);
    };

    loadWithDelay();
  }, []);


  const assignRandomFilters = () => {
    const available = [1, 2, 3, 4];
    const count = Math.floor(Math.random() * 3) + 1;
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const assignRandomDuration = () => {
    const min = 60;
    const max = 300;
    return +(Math.random() * (max - min) + min).toFixed(2);
  };
  const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

  const filterConditions = {
    all: () => true,
    interacted: (u) => u.interacted,
    not_interacted: (u) => !u.interacted,
    male: (u) => u.gender.toLowerCase() === "male",
    female: (u) => u.gender.toLowerCase() === "female",
    age_above: (u) => u.age > 25,
    age_below: (u) => u.age <= 25,
    filter_1: (u) => u.filters.includes(1),
    filter_2: (u) => u.filters.includes(2),
    filter_3: (u) => u.filters.includes(3),
    filter_4: (u) => u.filters.includes(4),
  };

  const filterList = useMemo(
    () => [
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
    ],
    []
  );

  const filteredUsers = users.filter(filterConditions[activeFilter]);
  const totalPages = Math.ceil(filteredUsers.length / ROWS_PER_PAGE);
  const paginated = filteredUsers.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const getCount = (filter) => users.filter(filterConditions[filter]).length;

  const formatDate = (dateTime) => new Date(dateTime).toLocaleDateString();
  const formatTime = (dateTime) => new Date(dateTime).toLocaleTimeString();

  const exportCSV = () => {
    const rows = [
      ["ID", "Age", "Gender", "Duration (s)", "Interacted", "Hand Gestures", "Filters", "Date", "Time"],
      ...filteredUsers.map((u) => [
        u.id,
        u.age,
        u.gender,
        u.duration?.toFixed(2),
        u.interacted ? "Yes" : "No",
        u.handGestures ? "Yes" : "No",
        u.filters?.join(" | ") ?? "",
        formatDate(u.endTime),
        formatTime(u.endTime),
      ]),
    ];
    const csvContent = rows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `report_${activeFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Age", "Gender", "Duration (s)", "Interacted", "Hand Gestures", "Filters", "Date", "Time"]],
      body: filteredUsers.map((u) => [
        u.id,
        u.age,
        u.gender,
        u.duration?.toFixed(2),
        u.interacted ? "Yes" : "No",
        u.handGestures ? "Yes" : "No",
        u.filters?.join(" | ") ?? "",
        formatDate(u.endTime),
        formatTime(u.endTime),
      ]),
    });
    doc.save(`report_${activeFilter}.pdf`);
  };

  if (loading) return <Loader message="Generating All Data-list..." />;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6 overflow-x-hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reports</h1>
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-1 text-white hover:bg-indigo-700"
            >
              <Download size={16} /> CSV
            </button>
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-1 text-white hover:bg-indigo-700"
            >
              <Download size={16} /> PDF
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 rounded-xl border border-transparent bg-white p-3 dark:bg-slate-900">
          {filterList.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setActiveFilter(f.value);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 rounded-md px-3 py-1 text-sm font-medium transition ${
                activeFilter === f.value
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-white"
              }`}
            >
              {f.label}
              <span
                className={`rounded-md px-2 py-0.5 text-xs text-white ${
                  f.value.includes("filter") ? FILTER_COLORS[parseInt(f.value.split("_")[1]) - 1] : "bg-indigo-500"
                }`}
              >
                {getCount(f.value)}
              </span>
            </button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-200 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Age</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Duration (s)</th>
                <th className="p-3">Interacted</th>
                <th className="p-3">Hand Gestures</th>
                <th className="p-3">Filters</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
              </tr>
            </thead>
            <motion.tbody
              key={currentPage + activeFilter}
              transition={{ duration: 0.3 }}
              className="divide-y divide-slate-100 dark:divide-slate-800"
            >
              {paginated.map((user) => (
                <tr key={user.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="whitespace-nowrap p-3 text-slate-700 dark:text-slate-200">{user.id}</td>
                  <td className="whitespace-nowrap p-3 text-slate-700 dark:text-slate-200">{user.age}</td>
                  <td className="whitespace-nowrap p-3 text-slate-700 dark:text-slate-200">{user.gender}</td>
                  <td className="whitespace-nowrap p-3 text-slate-700 dark:text-slate-200">{user.duration?.toFixed(2)}</td>
                  <td className="whitespace-nowrap p-3">
                    <span className={`rounded-md px-2 py-1 text-xs font-medium ${
                      user.interacted ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    }`}>
                      {user.interacted ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap p-3">
                    <span className={`rounded-md px-2 py-1 text-xs font-medium ${
                      user.handGestures ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    }`}>
                      {user.handGestures ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap p-3 space-x-1">
                    {user.filters?.map((f, i) => (
                      <span key={i} className={`rounded-md px-2 py-0.5 text-xs font-medium text-white ${FILTER_COLORS[f - 1]}`}>
                        {f}
                      </span>
                    ))}
                  </td>
                  <td className="whitespace-nowrap p-3 text-slate-700 dark:text-slate-200">{formatDate(user.endTime)}</td>
                  <td className="whitespace-nowrap p-3 text-slate-700 dark:text-slate-200">{formatTime(user.endTime)}</td>
                </tr>
              ))}
            </motion.tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="p-2 text-slate-900 disabled:opacity-30 dark:text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm text-slate-900 dark:text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="p-2 text-slate-900 disabled:opacity-30 dark:text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportsPage;