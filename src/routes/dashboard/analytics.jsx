// Analytics.js

import { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const YEARS = [2022, 2023, 2024];

const Analytics = () => {
  const [year, setYear] = useState(2023);
  const [dataByYear, setDataByYear] = useState({});
  const data = dataByYear[year] || [];

  useEffect(() => {
    fetch("/mock/analytics-mock.json")
      .then((res) => res.json())
      .then(setDataByYear)
      .catch((err) => console.error("Failed to load analytics data", err));
  }, []);

  const totals = data.reduce(
    (acc, item) => {
      acc.Asia += item.Asia;
      acc.Europe += item.Europe;
      acc.Americas += item.Americas;
      return acc;
    },
    { Asia: 0, Europe: 0, Americas: 0 }
  );

  const formatK = (n) => `${(n / 1000).toFixed(2)}k`;

  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-lg font-semibold">Area installed</p>
          <p className="text-sm text-slate-400">(+43%) than last year</p>
          <div className="flex gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-teal-500" />
              <span>Asia</span>
              <strong>{formatK(totals.Asia)}</strong>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <span>Europe</span>
              <strong>{formatK(totals.Europe)}</strong>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400" />
              <span>Americas</span>
              <strong>{formatK(totals.Americas)}</strong>
            </div>
          </div>
        </div>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="bg-slate-800 border border-slate-600 text-white rounded px-3 py-1"
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" stroke="#cbd5e1" />
          <YAxis stroke="#cbd5e1" />
          <Tooltip contentStyle={{ borderRadius: "8px", border: "none" }} />
          <Legend wrapperStyle={{ color: "white" }} />
          <Bar dataKey="Asia" stackId="a" fill="#14b8a6" />
          <Bar dataKey="Europe" stackId="a" fill="#facc15" />
          <Bar dataKey="Americas" stackId="a" fill="#22d3ee" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Analytics;
