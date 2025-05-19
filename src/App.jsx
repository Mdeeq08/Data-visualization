import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/main-page";
import DashboardAnalytics from "@/routes/dashboard/analytics";
import ReportsPage from "@/routes/dashboard/reports";
import FilterPerformancePage from "@/routes/dashboard/filter-performance";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: <DashboardPage />,
                },
                {
                    path: "analytics",
                    element: <DashboardAnalytics />,
                },
                {
                    path: "reports",
                    element: <ReportsPage />,
                  },
                   {
                    path: "FilterPerformance",
                    element: <FilterPerformancePage />,
                  }    

            ],
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
