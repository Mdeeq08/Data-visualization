import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { overviewData, recentSalesData, topProducts } from "@/constants";
import { Footer } from "@/layouts/footer";

const COLORS = ["#4285F4", "#FBBC05", "#34A853", "#EA4335"];

import PropTypes from "prop-types";

// Analytics.js



const Analytics = () => {
  const { theme } = useTheme();

  const pieData = [
    { name: "America", value: 1500 },
    { name: "Asia", value: 1200 },
    { name: "Europe", value: 900 },
    { name: "Africa", value: 300 },
  ];
  
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
    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7 text-slate-900 dark:text-white">
      <div className="card col-span-1 md:col-span-2 lg:col-span-3 bg-white dark:bg-slate-800 shadow-md p-4 rounded-xl">
        <p className="text-lg font-semibold mb-2">Current Visits</p>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Tooltip contentStyle={{ backgroundColor: theme === "light" ? "white" : "#1e293b", borderRadius: "10px" }} />
            <Legend verticalAlign="bottom" align="center" wrapperStyle={{ color: theme === "light" ? "#000" : "#fff" }} />
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} fill="#8884d8" dataKey="value" label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="card col-span-1 md:col-span-2 lg:col-span-4 bg-white dark:bg-slate-800 shadow-md p-4 rounded-xl">
        <p className="text-lg font-semibold mb-2">Website Visits (+43% than last year)</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData} barSize={20}>
            <XAxis dataKey="name" stroke={theme === "light" ? "#475569" : "#94a3b8"} />
            <YAxis stroke={theme === "light" ? "#475569" : "#94a3b8"} />
            <Tooltip contentStyle={{ backgroundColor: theme === "light" ? "white" : "#1e293b", borderRadius: "10px" }} />
            <Legend verticalAlign="top" align="right" wrapperStyle={{ color: theme === "light" ? "#000" : "#fff" }} />
            <Bar dataKey="men" fill="#2563eb" radius={[10, 10, 0, 0]} />
            <Bar dataKey="women" fill="#60a5fa" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
     </div>
     <Footer />
    </div>
  );
};

export default Analytics;
