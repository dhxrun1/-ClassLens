"use client";

import React, { useState, useEffect } from "react";
import { useRole } from "../../context/RoleContext";
import Link from "next/link";

type Lecture = {
  id: string;
  name: string;
  date: string;
  present_count: number;
  attendance_rate: number;
};

export default function HistoryPage() {
  const { role } = useRole();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchLectures = () => {
    setLoading(true);
    fetch("/api/v1/lectures")
      .then((res) => res.json())
      .then((data) => {
        setLectures(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLectures();
  }, []);

  if (role !== "lecturer") {
    return (
      <div className="min-h-screen p-8 md:p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mb-4 text-rose-600">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500 max-w-sm mb-6">You must be logged in as a Lecturer to review class history logs.</p>
        <button
          onClick={() => window.location.href = "/dashboard"}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch(`/api/v1/lectures/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLectures(lectures.filter((l) => l.id !== id));
        setDeletingId(null);
      } else {
        alert("Failed to delete session history");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting session");
    }
  };

  const filteredLectures = lectures.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Attendance History</h1>
          <p className="text-slate-600">Browse previous lectures, check attendance rates, edit list members, or trigger integration syncs.</p>
        </div>
      </header>

      {/* Filter and stats */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by course name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="text-sm font-semibold text-slate-600">
          {filteredLectures.length} session{filteredLectures.length === 1 ? "" : "s"} tracked
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <svg className="animate-spin h-8 w-8 text-indigo-600 mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Loading session logs...</p>
        </div>
      ) : filteredLectures.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-center bg-white border border-slate-200 rounded-xl">
          <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-4 text-slate-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No Attendance Sessions</h3>
          <p className="max-w-xs text-sm mb-4">Go to the "Take Attendance" section to scan a class photo and generate reports.</p>
          <Link href="/attendance" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors">
            Log Attendance
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLectures.map((lecture) => (
            <Link
              key={lecture.id}
              href={`/history/${lecture.id}`}
              className="group block bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {lecture.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">{formatDate(lecture.date)}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  {deletingId === lecture.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleDelete(lecture.id, e)}
                        className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold hover:bg-rose-700 z-20"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeletingId(null);
                        }}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] hover:bg-slate-200 z-20"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeletingId(lecture.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all z-10"
                      title="Delete session record"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-end justify-between mt-6">
                <div>
                  <span className="text-slate-400 text-xs font-semibold block mb-0.5">Present Count</span>
                  <span className="text-2xl font-bold text-slate-900">{lecture.present_count} students</span>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 text-xs font-semibold block mb-1">Attendance Rate</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    lecture.attendance_rate >= 85
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : lecture.attendance_rate >= 70
                      ? "bg-amber-50 text-amber-700 border border-amber-100"
                      : "bg-rose-50 text-rose-700 border border-rose-100"
                  }`}>
                    {lecture.attendance_rate}%
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
