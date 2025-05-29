// src/routes/dashboard/filter-performance.jsx
import { useEffect, useState } from "react";
import { getPBUsers } from "@/data/pbDataService";
import Loader from "@/layouts/Loader";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";

// Color classes for filter cards
const FILTER_COLORS = ["bg-white dark:bg-slate-900", "bg-white dark:bg-slate-900", "bg-white dark:bg-slate-900", "bg-white dark:bg-slate-900"];
// Image paths for each filter
const FILTER_IMAGES = ["/filters/filter1.png", "/filters/filter2.png", "/filters/filter3.png", "/filters/filter4.png"];
// Color classes for filter badges
const FILTER_COLORS_UI = {
    1: "bg-blue-500",
    2: "bg-purple-500",
    3: "bg-yellow-400",
    4: "bg-red-500",
};

export default function FilterPerformancePage() {
    // State for user data
    const [users, setUsers] = useState([]);
    // Loading state
    const [loading, setLoading] = useState(true);
    // Currently selected filter for modal
    const [activeFilter, setActiveFilter] = useState(null);
    // Search input state
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch user data on mount
    useEffect(() => {
        const loadData = async () => {
            const data = await getPBUsers();
            setUsers(data);
            setLoading(false);
        };
        loadData();
    }, []);

    // Compute stats for a given filter
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

    // Show loader while fetching data
    if (loading) return <Loader message="Loading filter stats..." />;

    return (
        <div className="p-6">
            {/* Header and search bar */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Filter Performance</h1>
                <input
                    type="text"
                    placeholder="Search filters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white sm:w-64"
                />
            </div>
            {/* Filter cards grid */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                {Array.from({ length: 8 })
                    .map((_, index) => (index % 4) + 1)
                    .filter((filterId) => {
                        const search = searchTerm.toLowerCase().trim();
                        return search === "" || `filter ${filterId}`.includes(search) || filterId.toString().includes(search);
                    })
                    .map((filterId, index) => {
                        const stats = getStatsForFilter(filterId);
                        return (
                            // Card for each filter
                            <button
                                key={index}
                                onClick={() => setActiveFilter(filterId)}
                                className={`flex flex-col justify-between overflow-hidden rounded-xl text-slate-900 shadow-md hover:shadow-lg dark:text-white ${FILTER_COLORS[filterId - 1]}`}
                            >
                                <div className="h-65 w-full overflow-hidden bg-slate-200 dark:bg-slate-900">
                                    <img
                                        src={FILTER_IMAGES[filterId - 1]}
                                        alt="Filter"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="bg-[#6366f1] p-4 text-center">
                                    <p className="text-base font-semibold">Filter {filterId}</p>
                                    <p className="text-sm opacity-80">{stats.totalUsers} users</p>
                                </div>
                            </button>
                        );
                    })}
            </div>

            {/* Modal for filter details */}
            <AnimatePresence>
                {activeFilter && (
                    <Dialog
                        open={!!activeFilter}
                        onClose={() => setActiveFilter(null)}
                        className="relative z-50"
                    >
                        <div
                            className="fixed inset-0 bg-black/40"
                            aria-hidden="true "
                        />
                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Dialog.Panel className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
                                    {(() => {
                                        const stats = getStatsForFilter(activeFilter);
                                        const filtered = users.filter((u) => u.filters.includes(activeFilter));
                                        const maleCount = filtered.filter((u) => u.gender?.toLowerCase() === "male").length;
                                        const femaleCount = filtered.filter((u) => u.gender?.toLowerCase() === "female").length;
                                        const avgAge = filtered.length
                                            ? (filtered.reduce((sum, u) => sum + (u.age || 0), 0) / filtered.length).toFixed(1)
                                            : 0;

                                        // Data for radar chart
                                        const radarData = [
                                            { stat: "Interacted", value: stats.interacted },
                                            { stat: "Not Interacted", value: stats.notInteracted },
                                            { stat: "Male", value: maleCount },
                                            { stat: "Female", value: femaleCount },
                                            { stat: "Avg Age", value: parseFloat(avgAge) },
                                        ];

                                        return (
                                            <>
                                                <div className="flex flex-col gap-4">
                                                    {/* Filter image */}
                                                    <div className="bg-whites flex h-64 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-900">
                                                        <img
                                                            src={FILTER_IMAGES[activeFilter - 1]}
                                                            alt={`Filter ${activeFilter}`}
                                                            className="h-full w-full object-contain"
                                                        />
                                                    </div>

                                                    {/* Filter badge */}
                                                    <div className="flex items-center gap-4">
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-sm text-white ${FILTER_COLORS_UI[activeFilter]}`}
                                                        >
                                                            Filter {activeFilter}
                                                        </span>
                                                    </div>

                                                    {/* Stats and radar chart */}
                                                    <div className="space-y-2 divide-y divide-slate-300/20 text-sm text-slate-900 dark:text-white">
                                                        <h3 className="mb-4 text-center text-sm font-semibold text-white">Filter Overview</h3>
                                                        <ResponsiveContainer
                                                            width="100%"
                                                            height={300}
                                                        >
                                                            <RadarChart
                                                                cx="50%"
                                                                cy="50%"
                                                                outerRadius="80%"
                                                                data={radarData}
                                                            >
                                                                <PolarGrid stroke="#374151" />
                                                                <PolarAngleAxis
                                                                    dataKey="stat"
                                                                    stroke="#cbd5e1"
                                                                />
                                                                <PolarRadiusAxis
                                                                    angle={30}
                                                                    stroke="#475569"
                                                                />
                                                                <Radar
                                                                    name="Users"
                                                                    dataKey="value"
                                                                    stroke="#10b981"
                                                                    fill="#10b981"
                                                                    fillOpacity={0.4}
                                                                />
                                                                <Legend />
                                                            </RadarChart>
                                                        </ResponsiveContainer>
                                                        <div className="grid grid-cols-2 gap-3 pb-2 pt-2">
                                                            <div>Avg Duration</div>
                                                            <div className="text-right">{stats.avgDuration}s</div>
                                                        </div>

                                                        <div className="pt-2">
                                                            <div className="mb-1 opacity-70">Date Range</div>
                                                            <div className="flex flex-wrap gap-2 text-right text-xs">
                                                                {stats.dates.map((d, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="rounded bg-slate-100 px-2 py-0.5 dark:bg-slate-800"
                                                                    >
                                                                        {d}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Close button */}
                                                    <button
                                                        onClick={() => setActiveFilter(null)}
                                                        className="mt-4 w-full rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700"
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
