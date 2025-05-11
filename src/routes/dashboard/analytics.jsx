// src/routes/analytics.jsx
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { fetchRawData } from "@/data/chartDataService";
import Loader from "@/layouts/Loader";

const Analytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWithDelay = async () => {
      const dataPromise = fetchRawData();
      const delay = new Promise((res) => setTimeout(res, 1000));
      const [fetched] = await Promise.all([dataPromise, delay]);
      setData(fetched);
      setLoading(false);
    };

    loadWithDelay();
  }, []);

  if (loading) return <Loader message="Analyzing interaction patterns..." />;

  const dimensions = [
    {
      label: "Age",
      values: data.map((d) => d.age),
    },
    {
      label: "Interacted",
      values: data.map((d) => (d.interacted ? 1 : 0)),
      tickvals: [0, 1],
      ticktext: ["No", "Yes"],
    },
    {
      label: "Hand Gestures",
      values: data.map((d) => (d.handGestures ? 1 : 0)),
      tickvals: [0, 1],
      ticktext: ["No", "Yes"],
    },
    {
      label: "Time (Hour)",
      values: data.map((d) => new Date(d.endTime).getHours()),
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <h1 className="mb-4 text-2xl font-semibold text-slate-900 dark:text-white">
        Parallel Axis Analysis
      </h1>
      <div className="rounded-xl bg-white p-4 shadow-md dark:bg-slate-900">
        <Plot
          data={[{
            type: "parcoords",
            line: {
              color: data.map((d) => d.age),
              colorscale: "Viridis",
            },
            dimensions,
          }]}
          layout={{
            autosize: true,
            height: 700,
            margin: { t: 50, l: 50, r: 50, b: 50 },
            plot_bgcolor: "transparent",
            paper_bgcolor: "transparent",
            font: {
              color: "#0f172a",
            },
          }}
          config={{ responsive: true }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};

export default Analytics;
