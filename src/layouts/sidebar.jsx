import { forwardRef } from "react";
import { NavLink } from "react-router-dom";

import { navbarLinks } from "@/constants";

import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";

import { cn } from "@/utils/cn";

import PropTypes from "prop-types";

export const Sidebar = forwardRef(({ className }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          // Always collapsed width & alignment
          "fixed z-[100] flex h-full w-[70px] flex-col items-center overflow-x-hidden border-r border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900",
          // Slide in/out on mobile
          "transition-all duration-300 md:left-0",
          "max-md:top-0 max-md:bottom-0 max-md:z-50 max-md:w-[70px]",
          className // allows mobile left shift to be passed from Layout
        )}
      >
        <div className="flex justify-center p-3">
          <img src={logoLight} alt="TELLAR" className="dark:hidden w-6 h-6" />
          <img src={logoDark} alt="TELLAR" className="hidden dark:block w-6 h-6" />
        </div>
  
        <div className="flex flex-col gap-y-4 overflow-y-auto p-3 text-slate-900 dark:text-white">
          {navbarLinks.map((navbarLink) => (
            <nav key={navbarLink.title} className="flex flex-col items-center">
              {/* Hide section titles when collapsed */}
              {/* <p className="sidebar-group-title text-xs text-center text-slate-500 dark:text-slate-400">
                {navbarLink.title}
              </p> */}
              {navbarLink.links.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.path}
                  className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <link.icon size={22} />
                </NavLink>
              ))}
            </nav>
          ))}
        </div>
      </aside>
    );
  });
  

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
    className: PropTypes.string,
};
