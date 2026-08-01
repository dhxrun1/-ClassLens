"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRole } from "../../context/RoleContext";

type Stats = {
  total_students: number;
  total_lectures: number;
  average_attendance_rate: number;
};

type SyncLog = {
  id: number;
  lecture_name: string;
  system_name: string;
  status: string;
  timestamp: string;
};

type Lecture = {
  id: string;
  name: string;
  date: string;
  present_count: number;
  attendance_rate: number;
};

export default function Home() {
  const { role } = useRole();
  const [stats, setStats] = useState<Stats | null>(null);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [recentLectures, setRecentLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch stats
    const fetchStats = fetch("/api/v1/stats").then((res) => res.json());
    
    // Fetch logs (for admin)
    const fetchLogs = fetch("/api/v1/integrations/logs")
      .then((res) => res.json())
      .catch(() => []);

    // Fetch lectures (for lecturer)
    const fetchLectures = fetch("/api/v1/lectures")
      .then((res) => res.json())
      .catch(() => []);

    Promise.all([fetchStats, fetchLogs, fetchLectures])
      .then(([statsData, logsData, lecturesData]) => {
        setStats(statsData);
        setSyncLogs(logsData.slice(0, 3)); // Get top 3 recent logs
        setRecentLectures(lecturesData.slice(0, 3)); // Get top 3 recent lectures
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading dashboard data:", err);
        setLoading(false);
      });
  }, [role]); // Reload when role switches to fetch fresh lists if needed

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (role === "admin") {
    // ==========================================
    // ADMIN DASHBOARD
    // ==========================================
    return (
      <div className="p-8 md:p-12 max-w-7xl mx-auto">
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            IT Administrator Panel
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">System Administration</h1>
          <p className="text-slate-600 max-w-2xl">
            Monitor biometric enrollment stats, audit external LMS/SIS API sync status logs, and configure active target endpoints.
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Enrolled Students</p>
                <h2 className="text-3xl font-extrabold text-slate-900">
                  {loading ? "..." : stats?.total_students}
                </h2>
              </div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md w-fit border border-emerald-100">
              Biometrics Database Online
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Integrated Systems</p>
                <h2 className="text-3xl font-extrabold text-slate-900">3</h2>
              </div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md w-fit border border-indigo-100">
              Canvas, Banner & Webhook
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Course Sessions</p>
                <h2 className="text-3xl font-extrabold text-slate-900">
                  {loading ? "..." : stats?.total_lectures}
                </h2>
              </div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md w-fit border border-emerald-100">
              Archived Logs Active
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Admin Shortcuts</h3>
            
            <div className="space-y-4">
              <Link href="/enroll" className="group block bg-white border border-slate-200 p-5 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-950">Enroll Student</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Register facial biometrics</p>
                  </div>
                </div>
              </Link>

              <Link href="/students" className="group block bg-white border border-slate-200 p-5 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-950">Student Directory</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Manage and remove database records</p>
                  </div>
                </div>
              </Link>

              <Link href="/integrations" className="group block bg-white border border-slate-200 p-5 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-950">API Gateway Panel</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Setup sync webhook credentials</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Right Column: Recent Sync Logs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recent Connection Gateway Syncs</h3>
              <Link href="/integrations" className="text-xs font-bold text-indigo-600 hover:underline">
                View Audit Trail →
              </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="text-center py-10 text-slate-500 text-sm">Loading logs...</div>
              ) : syncLogs.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">No sync logs recorded yet.</div>
              ) : (
                <div className="divide-y divide-slate-100 text-sm">
                  {syncLogs.map((log) => (
                    <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-all">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-950">{log.lecture_name}</span>
                          <span className="text-slate-400 text-xs">•</span>
                          <span className="text-xs text-slate-500 font-medium">{log.system_name}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{formatDate(log.timestamp)}</p>
                      </div>

                      <div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          log.status === "SUCCESS"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    // ==========================================
    // LECTURER DASHBOARD
    // ==========================================
    return (
      <div className="p-8 md:p-12 max-w-7xl mx-auto">
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Lecturer Console
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">Faculty Dashboard</h1>
          <p className="text-slate-600 max-w-2xl">
            Welcome, Dr. Sarah Jenkins. Take instant facial recognition class attendance or inspect previous session logs.
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Active Course Sessions</p>
                <h2 className="text-3xl font-extrabold text-slate-900">
                  {loading ? "..." : stats?.total_lectures}
                </h2>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md w-fit border border-emerald-100">
              Total Lectures Logged
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Average Attendance</p>
                <h2 className="text-3xl font-extrabold text-slate-900">
                  {loading ? "..." : `${stats?.average_attendance_rate}%`}
                </h2>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md w-fit border border-emerald-100">
              Term Presence Average
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Class Size Directory</p>
                <h2 className="text-3xl font-extrabold text-slate-900">
                  {loading ? "..." : stats?.total_students}
                </h2>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md w-fit border border-emerald-100">
              Enrolled Roster Count
            </div>
          </div>
        </div>

        {/* Shortcuts & Recent Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Faculty Shortcuts</h3>
            
            <div className="space-y-4">
              <Link href="/attendance" className="group block bg-white border border-slate-200 p-5 rounded-xl hover:border-emerald-300 hover:shadow-sm transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-950">Take Attendance</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Upload classroom photo scan</p>
                  </div>
                </div>
              </Link>

              <Link href="/history" className="group block bg-white border border-slate-200 p-5 rounded-xl hover:border-emerald-300 hover:shadow-sm transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-950">Attendance History</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Review and manual override logs</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Lectures */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recent Class Sessions</h3>
              <Link href="/history" className="text-xs font-bold text-emerald-600 hover:underline">
                View All History →
              </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="text-center py-10 text-slate-500 text-sm">Loading sessions...</div>
              ) : recentLectures.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">No class sessions recorded yet.</div>
              ) : (
                <div className="divide-y divide-slate-100 text-sm">
                  {recentLectures.map((lecture) => (
                    <Link
                      key={lecture.id}
                      href={`/history/${lecture.id}`}
                      className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-all cursor-pointer block"
                    >
                      <div>
                        <span className="font-bold text-slate-950 block">{lecture.name}</span>
                        <p className="text-[10px] text-slate-400 mt-1">{formatDate(lecture.date)}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">{lecture.present_count} present</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          lecture.attendance_rate >= 85
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}>
                          {lecture.attendance_rate}%
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
