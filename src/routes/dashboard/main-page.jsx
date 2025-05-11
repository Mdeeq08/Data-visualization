// src/routes/dashboard/main-page.jsx
import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Cell, Legend, CartesianGrid } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import PropTypes from "prop-types";
import { getBarChartData, getPieChartData, getAreaChartData, fetchRawData } from "@/data/chartDataService";
import { motion } from "framer-motion"; // Ensure this import exists at the top of the file
import Loader from "@/layouts/Loader";

// Component for each filter card at the top of the dashboard
const StatCard = ({ imageSrc, title, value, change, bgColor }) => (
    <motion.div
        initial={{ opacity: 0, y: 1 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.0 }}
        className="card flex flex-col justify-between rounded-xl p-4 text-white shadow-lg"
        style={{ background: bgColor }}
    >
        <div className="flex items-start justify-between">
            <div>
                <p className="text-white/s90 mb-1 text-3xl font-bold">{title}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
            <span className="text-sm text-white/80">{change}</span>
        </div>
        <div className="mt-4 flex flex-col items-center">
            <img
                src={imageSrc}
                alt={title}
                className="w-30 h-30 rounded-full object-contain"
            />
        </div>
    </motion.div>
);

StatCard.propTypes = {
    icon: PropTypes.elementType,
    imageSrc: PropTypes.string,
    title: PropTypes.string.isRequired,
    value: PropTypes.string,
    change: PropTypes.string,
    bgColor: PropTypes.string.isRequired,
};

// Main dashboard page
const DashboardPage = () => {
    const { theme } = useTheme();
    const [barData, setBarData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [overviewData, setOverviewData] = useState([]);
    const [loading, setLoading] = useState(true);
    const COLORS = ["#4A90E2", "#AB47BC", "#FBC02D", "#E57373"];

    // Fetch all data for the dashboard
  useEffect(() => {
  const loadWithDelay = async () => {
    const dataPromise = fetchRawData();
    const delayPromise = new Promise((resolve) => setTimeout(resolve, 1000));

    const [data] = await Promise.all([dataPromise, delayPromise]);

    setBarData(getBarChartData(data));
    setPieData(getPieChartData(data));
    setOverviewData(getAreaChartData(data));
    setLoading(false);
  };

  loadWithDelay();
}, []);


 if (loading) return <Loader message="Loading dashboard..." />;
      
    return (
        <div className="flex flex-col gap-y-6 p-6">
            {/* Page title */}
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>

            {/* Filter statistic cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Filter 1"
                    imageSrc="/filters/flowers.png"
                    change="+2.6%"
                    bgColor="#4A90E2"
                />
                <StatCard
                    title="Filter 2"
                    imageSrc="/filters/flowers.png"
                    bgColor="#AB47BC"
                />
                <StatCard
                    title="Filter 3"
                    imageSrc="/filters/flowers.png"
                    bgColor="#FBC02D"
                />
                <StatCard
                    title="Filter 4"
                    imageSrc="/filters/flowers.png"
                    bgColor="#E57373"
                />
            </div>

            {/* Pie and Bar Charts */}
            <div className="grid grid-cols-1 gap-4 text-slate-900 dark:text-white md:grid-cols-2 lg:grid-cols-7">
                {/* Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.0 }}
                    className="card col-span-1 rounded-xl bg-white p-4 shadow-md md:col-span-2 lg:col-span-3"
                >
                    <p className="text-lg font-semibold">Filters</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Interactions By Filter Engagement</p>
                    <ResponsiveContainer
                        width="100%"
                        height={250}
                    >
                        <PieChart>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: theme === "light" ? "white" : "#1e293b",
                                    borderRadius: "10px",
                                    color: theme === "light" ? "black" : "white",
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                            />
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                fill="#8884d8"
                                dataKey="value"
                                label
                                stroke="none"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.0 }}
                    className="card col-span-1 rounded-xl bg-white p-4 text-slate-900 shadow-md dark:text-white md:col-span-2 lg:col-span-4"
                >
                    <p className="text-lg font-semibold">User Engagement</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Interactions By Age</p>
                    <ResponsiveContainer
                        width="100%"
                        height={250}
                    >
                        <BarChart
                            data={barData}
                            barSize={40}
                        >
                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="3 3"
                                stroke={theme === "light" ? "#e2e8f0" : "#334155"}
                            />
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(date) => date.slice(5)} // Shows MM-DD
                                stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                style={{ fontSize: "0.85rem" }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                style={{ fontSize: "0.85rem" }}
                            />
                            <Tooltip
                                cursor={{ fill: "#0000" }}
                                contentStyle={{
                                    backgroundColor: theme === "light" ? "white" : "#1e293b",
                                    borderRadius: "10px",
                                    color: theme === "light" ? "black" : "white",
                                }}
                            />
                            <Legend
                                verticalAlign="top"
                                align="right"
                            />
                            <Bar
                                dataKey="Over25M"
                                stackId="a"
                                fill="#6366f1"
                            />
                            <Bar
                                dataKey="Under25M"
                                stackId="a"
                                fill="#10b981"
                            />
                            <Bar
                                dataKey="Over25F"
                                stackId="a"
                                fill="#f59e0b"
                            />
                            <Bar
                                dataKey="Under25F"
                                stackId="a"
                                fill="#f43f5e"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Area Chart */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="card mt-4 rounded-xl bg-white p-4 text-slate-900 shadow-md dark:text-white"
            >
                <p className="text-lg font-semibold">User Engagement</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Interactions tracked over the week</p>
                <ResponsiveContainer
                    width="100%"
                    height={300}
                >
                    <div className="flex gap-6 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: "#6366f1" }}
                            ></div>
                            <span>Interacted</span>
                            <span className="font-bold text-green-600">{overviewData.reduce((sum, d) => sum + d.Interacted, 0)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: "#10b981" }}
                            ></div>
                            <span>Not Interacted</span>
                            <span className="font-bold text-red-600">{overviewData.reduce((sum, d) => sum + d.NotInteracted, 0)}</span>
                        </div>
                    </div>
                    <AreaChart data={overviewData}>
                        <CartesianGrid
                            vertical={false}
                            strokeDasharray="3 3"
                            stroke={theme === "light" ? "#e2e8f0" : "#334155"}
                        />
                        <defs>
                            <linearGradient
                                id="colorInteracted"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#6366f1"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#6366f1"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                            <linearGradient
                                id="colorNot"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#10b981"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#10b981"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="day"
                            tickFormatter={(date) => date.slice(5)} // Shows MM-DD
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="Interacted"
                            stroke="#6366f1"
                            fill="url(#colorInteracted)"
                        />
                        <Area
                            type="monotone"
                            dataKey="NotInteracted"
                            stroke="#10b981"
                            fill="url(#colorNot)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    );
};

export default DashboardPage;
