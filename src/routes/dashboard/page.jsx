import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { overviewData, recentSalesData, topProducts } from "@/constants";
import { Footer } from "@/layouts/footer";
import { CreditCard, DollarSign, Package, Users } from "lucide-react";

const COLORS = ["#4285F4", "#FBBC05", "#34A853", "#EA4335"];

import PropTypes from "prop-types";

const StatCard = ({ icon: Icon, title, value, change, bgColor }) => (
    <div className={`card rounded-xl shadow-lg p-4 text-white`} style={{ background: bgColor }}>
        <div className="flex justify-between items-center">
            <Icon size={28} />
            <span className="text-sm">{change}</span>
        </div>
        <p className="text-lg font-semibold mt-2">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
    </div>
);

StatCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    change: PropTypes.string.isRequired,
    bgColor: PropTypes.string.isRequired,
};

const DashboardPage = () => {
    const { theme } = useTheme();
    const pieData = [
        { name: "America", value: 43.8 },
        { name: "Asia", value: 31.3 },
        { name: "Europe", value: 18.8 },
        { name: "Africa", value: 6.3 },
    ]
    
    const barData = [
        { name: "Jan", men: 40, women: 50 },
        { name: "Feb", men: 30, women: 70 },
        { name: "Mar", men: 20, women: 40 },
        { name: "Apr", men: 50, women: 30 },
        { name: "May", men: 70, women: 40 },
        { name: "Jun", men: 60, women: 30 },
        { name: "Jul", men: 30, women: 20 },
        { name: "Aug", men: 20, women: 70 },
        { name: "Sep", men: 50, women: 30 },
    ];


    return (
        <div className="flex flex-col gap-y-6 p-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={Package} title="Weekly Users" value="714k" change="+2.6%" bgColor="#4A90E2" />
                <StatCard icon={Users} title="Length of interaction" value="1.35m" change="-0.1%" bgColor="#AB47BC" />
                <StatCard icon={DollarSign} title="Person in front of the screen" value="1.72m" change="+2.8%" bgColor="#FBC02D" />
                <StatCard icon={CreditCard} title="Hand gesture interactions" value="234" change="+3.6%" bgColor="#E57373" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7 text-slate-900 dark:text-white">
                <div className="card col-span-1 md:col-span-2 lg:col-span-3 bg-white shadow-md p-4 rounded-xl">
                    <p className="text-lg font-semibold mb-2">Current Visits</p>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Tooltip contentStyle={{ backgroundColor: theme === "light" ? "white" : "#1e293b", borderRadius: "10px", color: theme === "light" ? "black" : "white" }} />
                            <Legend verticalAlign="bottom" align="center" />
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={0} outerRadius={90} fill="#8884d8" dataKey="value" label>
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="card col-span-1 md:col-span-2 lg:col-span-4 bg-white shadow-md p-4 rounded-xl text-slate-900 dark:text-white">
                    <p className="text-lg font-semibold mb-2">Visits (+43% than last year)</p>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={barData} barSize={30}>
                            <XAxis dataKey="name" stroke={theme === "light" ? "#475569" : "#94a3b8"} />
                            <YAxis />
                            <Tooltip cursor={{ fill: "#f0f0f0" }} contentStyle={{ backgroundColor: theme === "light" ? "white" : "#1e293b", borderRadius: "10px", color: theme === "light" ? "black" : "white" }} />
                            <Legend verticalAlign="top" align="right" />
                            <Bar dataKey="men" fill="#2563eb" radius={[10, 10, 0, 0]} />
                            <Bar dataKey="women" fill="#60a5fa" radius={[10, 10, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="card bg-white shadow-md p-4 rounded-xl mt-4 text-slate-900 dark:text-white">
                <p className="text-lg font-semibold mb-2">User Overview</p>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={overviewData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip cursor={false} formatter={(value) => `$${value}`} />
                        <XAxis dataKey="name" strokeWidth={0} stroke={theme === "light" ? "#475569" : "#94a3b8"} tickMargin={6} />
                        <YAxis dataKey="total" strokeWidth={0} stroke={theme === "light" ? "#475569" : "#94a3b8"} tickFormatter={(value) => `$${value}`} tickMargin={6} />
                        <Area type="monotone" dataKey="total" stroke="#2563eb" fillOpacity={1} fill="url(#colorTotal)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardPage;
