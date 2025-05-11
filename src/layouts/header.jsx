import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
import PropTypes from "prop-types";

export const Header = ({ setCollapsed }) => {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-10 flex h-[60px] items-center justify-between px-4 shadow-md transition-all ${
        isScrolled ? "bg-white/80 dark:bg-slate-900/80" : "bg-white dark:bg-slate-900"
      }`}
      style={{ backdropFilter: isScrolled ? "blur(8px)" : "none" }}
    >
      <div className="flex items-center gap-x-3">
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 md:hidden"
          aria-label="Toggle sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1
          className="text-3xl font-semibold tracking-wide text-slate-900 dark:text-white font-mono"
          style={{ letterSpacing: "0.1em" }}
        >
          TELLAR
        </h1>
      </div>

      <div className="flex items-center gap-x-3">
        <button
          className="btn-ghost size-10"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun size={20} className="dark:hidden" />
          <Moon size={20} className="hidden dark:block" />
        </button>
      </div>
    </header>
  );
};

Header.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};
