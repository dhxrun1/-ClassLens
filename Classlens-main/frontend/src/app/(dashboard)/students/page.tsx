"use client";

import React, { useState, useEffect } from "react";
import { useRole } from "../../context/RoleContext";
import Link from "next/link";

type Student = {
  id: string;
  name: string;
  level: string;
  department: string;
  embedding_count: number;
};

export default function StudentsPage() {
  const { role } = useRole();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editLevel, setEditLevel] = useState("");
  const [editDepartment, setEditDepartment] = useState("");

  const handleStartEdit = (student: Student) => {
    setEditingId(student.id);
    setEditName(student.name);
    setEditLevel(student.level);
    setEditDepartment(student.department);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName || !editLevel || !editDepartment) {
      alert("All fields are required");
      return;
    }
    try {
      const res = await fetch(`/api/v1/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          level: editLevel,
          department: editDepartment
        })
      });
      if (res.ok) {
        setStudents(students.map(s => s.id === id ? { ...s, name: editName, level: editLevel, department: editDepartment } : s));
        setEditingId(null);
      } else {
        alert("Failed to update student details");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving edits");
    }
  };

  const fetchStudents = () => {
    setLoading(true);
    fetch("/api/v1/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (role !== "admin") {
    return (
      <div className="min-h-screen p-8 md:p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mb-4 text-rose-600">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500 max-w-sm mb-6">You must be logged in as an Administrator to view the student directory database.</p>
        <button
          onClick={() => window.location.href = "/dashboard"}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/students/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setStudents(students.filter((s) => s.id !== id));
        setDeletingId(null);
      } else {
        alert("Failed to delete student");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting student");
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Student Directory</h1>
          <p className="text-slate-600">Manage enrolled students, view registered facial templates, and remove records.</p>
        </div>
      </header>

      {/* Search and stats bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, ID, department..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="text-sm font-semibold text-slate-600">
          Showing {filteredStudents.length} of {students.length} students
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <svg className="animate-spin h-8 w-8 text-indigo-600 mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p>Loading student database...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-4 text-slate-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No Students Found</h3>
            <p className="max-w-xs text-sm">Create a new student record to get started with facial attendance tracking.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Student ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Academic Level</th>
                  <th className="px-6 py-4">Bio-templates</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-600">{student.id}</td>
                    <td className="px-6 py-4">
                      {editingId === student.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="px-2 py-1 border border-slate-300 rounded text-sm text-slate-900 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                        />
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-900">{student.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {editingId === student.id ? (
                        <input
                          type="text"
                          value={editDepartment}
                          onChange={(e) => setEditDepartment(e.target.value)}
                          className="px-2 py-1 border border-slate-300 rounded text-sm text-slate-900 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                        />
                      ) : (
                        student.department
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {editingId === student.id ? (
                        <input
                          type="text"
                          value={editLevel}
                          onChange={(e) => setEditLevel(e.target.value)}
                          className="px-2 py-1 border border-slate-300 rounded text-sm text-slate-900 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-24"
                        />
                      ) : (
                        `${student.level} Level`
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {student.embedding_count} face{student.embedding_count > 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingId === student.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSaveEdit(student.id)}
                            className="px-2.5 py-1 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-xs hover:bg-slate-200"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : deletingId === student.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="px-2.5 py-1 bg-rose-600 text-white rounded text-xs font-bold hover:bg-rose-700"
                          >
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-xs hover:bg-slate-200"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleStartEdit(student)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Edit student"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeletingId(student.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete student"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
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
