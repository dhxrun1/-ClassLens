"use client";

import Link from "next/link";
import React from "react";
import { useRole } from "../context/RoleContext";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, setRole } = useRole();
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Sidebar Navigation */}
      <aside className="w-64 fixed inset-y-0 left-0 bg-white border-r border-slate-200 flex flex-col z-50">
        
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">Lens Attendance</span>
        </div>

        {/* Premium Role Selector */}
        <div className="px-4 pt-4 pb-2">
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200">
            <button
              onClick={() => setRole("admin")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                role === "admin"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Admin
            </button>
            <button
              onClick={() => setRole("lecturer")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                role === "lecturer"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
              Lecturer
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="px-4 py-2 border-b border-slate-100">
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              {role === "admin" ? "A" : "L"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                {role === "admin" ? "System Admin" : "Prof.Sarah Jenkins"}
              </p>
              <p className="text-[10px] text-slate-400 font-semibold truncate uppercase tracking-wider">
                {role === "admin" ? "IT Department" : "Computer Science"}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Sidebar Links */}
        <div className="px-4 py-4 space-y-1 flex-1 overflow-y-auto">
          <p className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Navigation</p>
          
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group font-medium ${
              pathname === "/dashboard"
                ? "bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100/50"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-sm">Dashboard Overview</span>
          </Link>

          {role === "admin" ? (
            <>
              <Link
                href="/enroll"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group font-medium ${
                  pathname === "/enroll"
                    ? "bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100/50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span className="text-sm">Enroll Student</span>
              </Link>

              <Link
                href="/students"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group font-medium ${
                  pathname === "/students"
                    ? "bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100/50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-sm">Student Directory</span>
              </Link>

              <Link
                href="/integrations"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group font-medium ${
                  pathname === "/integrations"
                    ? "bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100/50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span className="text-sm">API Integrations</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/attendance"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group font-medium ${
                  pathname === "/attendance"
                    ? "bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100/50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Take Attendance</span>
              </Link>

              <Link
                href="/history"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group font-medium ${
                  pathname.startsWith("/history")
                    ? "bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100/50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Attendance History</span>
              </Link>
            </>
          )}
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gateways Status</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-600">Integrations Online</span>
            </div>
          </div>
          <div className="mt-3">
             <Link href="/" className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-500 w-full border border-slate-200 shadow-sm">
               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
               Return to Landing
             </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
