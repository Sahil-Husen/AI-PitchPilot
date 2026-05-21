import React from "react";
import { NavLink, Link } from "react-router-dom";
import { HomeIcon, Square2StackIcon } from "@heroicons/react/24/outline";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">MailGen AI</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50"}`
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
            />
          </svg>
          Dashboard
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50"}`
          }
        >
          <HomeIcon className="w-5 h-5 mr-3" />
          Home
        </NavLink>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-center text-gray-500">
          Built with React & MERN
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
