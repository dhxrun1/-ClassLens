"use client";

import React, { useState } from 'react';
import { useRole } from "../../context/RoleContext";
import Link from "next/link";

export default function EnrollPage() {
  const { role } = useRole();
  
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [department, setDepartment] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (role !== "admin") {
    return (
      <div className="min-h-screen p-8 md:p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mb-4 text-rose-600">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500 max-w-sm mb-6">You must be logged in as an Administrator to enroll new students into the system.</p>
        <button
          onClick={() => window.location.href = "/dashboard"}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !name || !level || !department || photos.length === 0) {
      setStatus('error');
      setMessage('Please fill all fields and select at least one photo.');
      return;
    }

    setStatus('loading');
    setMessage('');

    const formData = new FormData();
    formData.append('student_id', studentId);
    formData.append('name', name);
    formData.append('level', level);
    formData.append('department', department);
    photos.forEach((photo) => {
      formData.append('files', photo);
    });

    try {
      const response = await fetch('/api/v1/enroll-student', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to enroll student');
      }

      setStatus('success');
      setMessage('Student enrolled successfully!');
      setStudentId('');
      setName('');
      setLevel('');
      setDepartment('');
      setPhotos([]);
      
      // Reset after a delay
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen p-8 md:p-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        
        <div className="flex items-center justify-center mb-8">
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">Student Enrollment</h1>
        <p className="text-slate-500 text-sm text-center mb-8">Register a new student for facial recognition</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Student ID</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-900 placeholder-slate-400"
              placeholder="e.g. STU12345"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-900 placeholder-slate-400"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Level</label>
            <input
              type="text"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-900 placeholder-slate-400"
              placeholder="e.g. 100, 200, 300"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-900 placeholder-slate-400"
              placeholder="e.g. Computer Science"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Photos (Multiple allowed)</label>
            <div className="relative group cursor-pointer">
              <div className="w-full px-4 py-8 border-2 border-dashed border-slate-300 rounded-lg hover:border-indigo-500 transition-all duration-300 flex flex-col items-center justify-center bg-slate-50 group-hover:bg-indigo-50/50">
                <svg className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 mb-3 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="text-sm text-slate-500 group-hover:text-indigo-600 transition-colors duration-300 font-medium">
                  {photos.length > 0 ? (
                    <span className="text-indigo-600">{photos.length} photo{photos.length > 1 ? 's' : ''} selected</span>
                  ) : (
                    'Click to browse or drag & drop'
                  )}
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-3 text-rose-700 bg-rose-50 p-4 rounded-lg border border-rose-200">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium flex items-center justify-center transition-all shadow-sm mt-2"
          >
            {status === 'loading' ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Enroll Student'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
