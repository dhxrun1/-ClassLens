"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRole } from "../../../context/RoleContext";
import Link from "next/link";

type AttendanceRecord = {
  student_id: string;
  name: string;
  level: string;
  department: string;
  present: boolean;
  confidence: number | null;
  distance: number | null;
  timestamp: string | null;
};

type LectureDetails = {
  id: string;
  name: string;
  date: string;
  records: AttendanceRecord[];
  attendance_rate: number;
  present_count: number;
  absent_count: number;
};

type Integration = {
  id: number;
  system_name: string;
  endpoint_url: string;
  is_active: boolean;
};

export default function LectureDetailsPage() {
  const { role } = useRole();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [details, setDetails] = useState<LectureDetails | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ status: string; message: string } | null>(null);
  const [filter, setFilter] = useState<'all' | 'present' | 'absent'>('all');
  const [search, setSearch] = useState("");

  const fetchDetails = () => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/v1/lectures/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Session not found");
        return res.json();
      })
      .then((data) => {
        setDetails(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchIntegrations = () => {
    fetch("/api/v1/integrations")
      .then((res) => res.json())
      .then((data) => {
        const active = data.filter((i: Integration) => i.is_active);
        setIntegrations(active);
        if (active.length > 0) {
          setSelectedIntegration(active[0].id.toString());
        }
      })
      .catch((err) => console.error("Error fetching integrations:", err));
  };

  useEffect(() => {
    fetchDetails();
    fetchIntegrations();
  }, [id]);

  if (role !== "lecturer") {
    return (
      <div className="min-h-screen p-8 md:p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mb-4 text-rose-600">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500 max-w-sm mb-6">You must be logged in as a Lecturer to review class session details.</p>
        <button
          onClick={() => window.location.href = "/dashboard"}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const handleToggleAttendance = async (studentId: string, currentPresent: boolean) => {
    try {
      const res = await fetch(`/api/v1/lectures/${id}/attendance/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          present: !currentPresent,
        }),
      });
      if (res.ok) {
        // Refetch details to update rates and count
        fetchDetails();
      } else {
        alert("Failed to update record");
      }
    } catch (err) {
      console.error(err);
      alert("Error toggling attendance");
    }
  };

  const handleSync = async () => {
    if (!selectedIntegration) return;
    setSyncing(true);
    setSyncResult(null);

    try {
      const res = await fetch(`/api/v1/integrations/sync/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          integration_id: parseInt(selectedIntegration, 10),
        }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setSyncResult({
          status: "SUCCESS",
          message: `Synced successfully! External response: ${data.response || "Logged success."}`
        });
      } else {
        setSyncResult({
          status: "FAILED",
          message: data.detail || "Sync failed. Check API endpoint."
        });
      }
    } catch (err) {
      console.error(err);
      setSyncResult({
        status: "FAILED",
        message: "Network error occurred during external sync."
      });
    } finally {
      setSyncing(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-slate-500">
        <svg className="animate-spin h-8 w-8 text-indigo-600 mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p>Loading session details...</p>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="p-12 text-center text-slate-500 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Session Not Found</h2>
        <p className="mb-6">The requested lecture session could not be retrieved from the database.</p>
        <Link href="/history" className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm transition-colors">
          Back to History
        </Link>
      </div>
    );
  }

  const filteredRecords = details.records
    .filter((r) => {
      if (filter === "present") return r.present;
      if (filter === "absent") return !r.present;
      return true;
    })
    .filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.student_id.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/history" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Sessions
        </Link>
      </div>

      <header className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
            {details.name}
          </h1>
          <p className="text-slate-500 font-medium">{formatDate(details.date)}</p>
        </div>

        {/* Sync panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3 self-start lg:self-auto w-full sm:w-auto">
          {integrations.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-1.5 px-3">
              No active API integrations. Configure them in <Link href="/integrations" className="text-indigo-600 font-bold underline">API settings</Link> to sync data.
            </div>
          ) : (
            <>
              <div className="w-full sm:w-auto">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select SIS Target</label>
                <select
                  value={selectedIntegration}
                  onChange={(e) => setSelectedIntegration(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {integrations.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.system_name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleSync}
                disabled={syncing}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 self-end"
              >
                {syncing ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Syncing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    Sync Attendance
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </header>

      {/* Sync Status Banner */}
      {syncResult && (
        <div className={`mb-6 p-4 rounded-lg border flex items-start gap-3 text-sm ${
          syncResult.status === "SUCCESS"
            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
            : "bg-rose-50 text-rose-800 border-rose-200"
        }`}>
          {syncResult.status === "SUCCESS" ? (
            <svg className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          ) : (
            <svg className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
          <div>
            <p className="font-bold">{syncResult.status === "SUCCESS" ? "External Sync Successful" : "External Sync Failed"}</p>
            <p className="mt-1 font-mono text-xs opacity-90">{syncResult.message}</p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold block mb-0.5 uppercase tracking-wider">Attendance Rate</span>
            <span className="text-3xl font-bold text-slate-900">{details.attendance_rate}%</span>
          </div>
          <div className={`px-3 py-3 rounded-full ${
            details.attendance_rate >= 85
              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
              : details.attendance_rate >= 70
              ? "bg-amber-50 text-amber-600 border border-amber-100"
              : "bg-rose-50 text-rose-600 border border-rose-100"
          }`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold block mb-0.5 uppercase tracking-wider">Present Students</span>
            <span className="text-3xl font-bold text-emerald-600">{details.present_count} present</span>
          </div>
          <div className="px-3 py-3 rounded-full bg-emerald-50 text-emerald-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold block mb-0.5 uppercase tracking-wider">Absent Students</span>
            <span className="text-3xl font-bold text-rose-600">{details.absent_count} absent</span>
          </div>
          <div className="px-3 py-3 rounded-full bg-rose-50 text-rose-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
          </div>
        </div>
      </div>

      {/* Filter and search menu */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filter === "all"
                ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            All Students ({details.records.length})
          </button>
          <button
            onClick={() => setFilter("present")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filter === "present"
                ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Present ({details.present_count})
          </button>
          <button
            onClick={() => setFilter("absent")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filter === "absent"
                ? "bg-rose-600 border-rose-600 text-white shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Absent ({details.absent_count})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Record list */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-16 text-slate-500 bg-white">No records match the current filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Student ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Department & Level</th>
                  <th className="px-6 py-4">Verification Method</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredRecords.map((record) => (
                  <tr key={record.student_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-500">{record.student_id}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900">{record.name}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {record.department} ({record.level})
                    </td>
                    <td className="px-6 py-4">
                      {record.present ? (
                        record.confidence !== null && record.confidence !== undefined && record.confidence > 0 ? (
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-slate-700">Facial Scan (ArcFace)</span>
                            <span className="text-[10px] text-slate-400 font-medium">Confidence: {(record.confidence * 100).toFixed(0)}%</span>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">Manual Override</span>
                        )
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        record.present
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-rose-50 text-rose-700 border border-rose-100"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${record.present ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                        {record.present ? "Present" : "Absent"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleAttendance(record.student_id, record.present)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          record.present
                            ? "bg-white border-slate-300 text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                            : "bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                        }`}
                      >
                        {record.present ? "Mark Absent" : "Mark Present"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
