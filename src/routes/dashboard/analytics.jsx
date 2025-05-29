// src/routes/analytics.jsx
import { useEffect, useState } from "react";
import { fetchRawData } from "@/data/chartDataService";
import Loader from "@/layouts/Loader";

const Analytics = () => {
    // State to hold fetched data
    const [setData] = useState([]);
    // State to manage loading indicator
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetches data and simulates a delay for loading effect
        const loadWithDelay = async () => {
            const dataPromise = fetchRawData(); // Start fetching data
            const delay = new Promise((res) => setTimeout(res, 1000)); // Simulate 1s delay
            const [fetched] = await Promise.all([dataPromise, delay]); // Wait for both
            setData(fetched); // Store fetched data
            setLoading(false); // Hide loader
        };

        loadWithDelay(); // Trigger data load on mount
    }, []);

    // Show loader while data is being fetched
    if (loading) return <Loader message="Analyzing interaction patterns..." />;

    return (
        <div className="min-h-screen p-6">
            {/* Page title */}
            <h1 className="mb-4 text-2xl font-semibold text-slate-900 dark:text-white">Parallel Axis Analysis</h1>
            {/* Visualization would go here */}
        </div>
    );
};

export default Analytics;
