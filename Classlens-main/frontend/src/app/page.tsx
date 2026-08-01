"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

type DemoState = "idle" | "scanning" | "completed";

// Preset sample images for sandbox demo
const SAMPLE_PHOTOS = [
  {
    id: "lecture-hall",
    name: "Lecture Hall A (4 Students)",
    icon: "🏛️",
    studentsDetected: 4,
    matchedCount: 3,
    unknownCount: 1,
    detectedFaces: [
      { name: "Sarah Jenkins", id: "STU-9982", conf: 99.4, box: { top: "20%", left: "15%", width: "22%", height: "28%" }, status: "MATCHED" },
      { name: "Marcus Chen", id: "STU-4821", conf: 98.7, box: { top: "18%", left: "42%", width: "20%", height: "26%" }, status: "MATCHED" },
      { name: "Elena Rostova", id: "STU-3104", conf: 97.9, box: { top: "22%", left: "68%", width: "21%", height: "27%" }, status: "MATCHED" },
      { name: "Unrecognized Visitor", id: "UNKNOWN", conf: 0, box: { top: "52%", left: "40%", width: "22%", height: "28%" }, status: "UNKNOWN" },
    ]
  },
  {
    id: "lab-session",
    name: "CS Lab Session (3 Students)",
    icon: "💻",
    studentsDetected: 3,
    matchedCount: 3,
    unknownCount: 0,
    detectedFaces: [
      { name: "David Kim", id: "STU-1029", conf: 99.8, box: { top: "25%", left: "12%", width: "24%", height: "32%" }, status: "MATCHED" },
      { name: "Aisha Patel", id: "STU-7741", conf: 99.1, box: { top: "20%", left: "42%", width: "24%", height: "32%" }, status: "MATCHED" },
      { name: "Lucas Vance", id: "STU-6552", conf: 98.5, box: { top: "24%", left: "70%", width: "22%", height: "30%" }, status: "MATCHED" },
    ]
  },
  {
    id: "seminar-room",
    name: "Seminar Room (2 Students)",
    icon: "👥",
    studentsDetected: 2,
    matchedCount: 2,
    unknownCount: 0,
    detectedFaces: [
      { name: "Zoe Taylor", id: "STU-8831", conf: 99.6, box: { top: "22%", left: "22%", width: "26%", height: "36%" }, status: "MATCHED" },
      { name: "Jordan Reed", id: "STU-5520", conf: 98.9, box: { top: "20%", left: "58%", width: "26%", height: "36%" }, status: "MATCHED" },
    ]
  }
];

export default function LandingPage() {
  // Demo states for Interactive Simulator
  const [activeTab, setActiveTab] = useState<"enroll" | "attendance" | "sync">("enroll");
  const [demoState, setDemoState] = useState<DemoState>("idle");
  const [progress, setProgress] = useState(0);
  
  // Interactive Sandbox states
  const [selectedSample, setSelectedSample] = useState(SAMPLE_PHOTOS[0]);
  const [isSandboxProcessing, setIsSandboxProcessing] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);
  const [sandboxResult, setSandboxResult] = useState<typeof SAMPLE_PHOTOS[0] | null>(SAMPLE_PHOTOS[0]);

  // Pricing calculator states
  const [studentCount, setStudentCount] = useState(650);
  const [lecturesPerWeek, setLecturesPerWeek] = useState(12);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Trigger demo scan animation
  const runDemoScan = () => {
    if (demoState === "scanning") return;
    setDemoState("scanning");
    setProgress(0);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setDemoState("completed");
      }
    }, 90);
  };

  // Run scan automatically when tab changes
  useEffect(() => {
    runDemoScan();
  }, [activeTab]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Run Sandbox detection simulation
  const handleSampleChange = (sample: typeof SAMPLE_PHOTOS[0]) => {
    setSelectedSample(sample);
    setCustomPhotoUrl(null);
    setIsSandboxProcessing(true);
    setTimeout(() => {
      setSandboxResult(sample);
      setIsSandboxProcessing(false);
    }, 600);
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCustomPhotoUrl(url);
    setIsSandboxProcessing(true);

    setTimeout(() => {
      setSandboxResult({
        id: "custom-uploaded",
        name: file.name,
        icon: "📷",
        studentsDetected: 2,
        matchedCount: 2,
        unknownCount: 0,
        detectedFaces: [
          { name: "Alex Mercer", id: "STU-9901", conf: 99.2, box: { top: "25%", left: "20%", width: "26%", height: "35%" }, status: "MATCHED" },
          { name: "Chloe Bennett", id: "STU-8412", conf: 98.6, box: { top: "22%", left: "55%", width: "26%", height: "35%" }, status: "MATCHED" },
        ]
      });
      setIsSandboxProcessing(false);
    }, 800);
  };

  // Pricing math
  const minutesSavedPerWeek = Math.round(studentCount * (lecturesPerWeek / 5) * 4); // 4 mins saved per lecture
  const hoursSavedPerMonth = Math.round((minutesSavedPerWeek * 4) / 60);
  const moneySavedPerMonth = Math.round(hoursSavedPerMonth * 35); // $35/hr average teaching staff value
  const paperSheetsSaved = Math.round(studentCount * lecturesPerWeek * 4);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* Dynamic Background Glow Elements */}
      <div className="fixed top-0 left-1/4 w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[180px] pointer-events-none z-0"></div>
      <div className="fixed top-[600px] right-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none z-0"></div>
      <div className="fixed bottom-0 left-1/3 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[200px] pointer-events-none z-0"></div>

      {/* Top Banner Notice */}
      <div className="relative z-50 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-500/20 py-2.5 px-4 text-center text-xs font-semibold text-indigo-200 flex items-center justify-center gap-2">
        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/30">
          v2.4 Ready
        </span>
        <span>Fast & Lightweight dlib Face Recognition Engine active on port 8000</span>
        <a href="#sandbox" className="underline font-bold text-white hover:text-indigo-300 transition-colors ml-1">
          Test Live Sandbox →
        </a>
      </div>

      {/* Navigation Header */}
      <nav className="relative z-50 border-b border-slate-800/80 bg-[#07090e]/90 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-600/25 group-hover:scale-105 transition-all">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-white flex items-center gap-1.5">
                Lens <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 font-extrabold">FaceID</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest -mt-1">
                Attendance Intelligence
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">Interactive Scanner</a>
            <a href="#sandbox" className="hover:text-white transition-colors">Test Sandbox</a>
            <a href="#calculator" className="hover:text-white transition-colors">ROI Calculator</a>
            <a href="#integrations" className="hover:text-white transition-colors">Integrations</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>API Ready</span>
            </div>

            <Link
              href="/dashboard"
              className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl transition-all shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] flex items-center gap-2"
            >
              <span>Console Access</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-16 pb-24 px-6 max-w-7xl mx-auto z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Hero Content */}
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-8">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Deep Learning 128-D Facial Biometric Recognition
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white mb-6">
              Automate Class Attendance. <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Zero Roll Calls. Instant Sync.
              </span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0 font-normal">
              Capture a single classroom snapshot. Our deep learning engine identifies all present students, extracts encrypted 128-dimensional vector embeddings, and automatically syncs verified rosters to Canvas LMS and Ellucian Banner.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 hover:scale-[1.02] group"
              >
                <span>Launch Lecturer Console</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <a
                href="#sandbox"
                className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 border border-slate-800 text-slate-200 hover:border-slate-700 hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-slate-800/80"
              >
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Try Live Upload Demo</span>
              </a>
            </div>

            {/* Key Platform Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white flex items-center gap-1">
                  <span>99.8%</span>
                </div>
                <div className="text-slate-400 text-xs font-semibold mt-1">Verification Accuracy</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                  &lt; 2.5s
                </div>
                <div className="text-slate-400 text-xs font-semibold mt-1">Full Classroom Scan</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">100%</div>
                <div className="text-slate-400 text-xs font-semibold mt-1">Automated LMS Sync</div>
              </div>
            </div>
          </div>

          {/* Right Hero Content - Interactive Scanner Simulator */}
          <div id="demo" className="flex-1 w-full max-w-[560px] lg:max-w-none relative">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl relative z-10 ring-1 ring-white/10">
              
              {/* Simulator Header Bar */}
              <div className="px-6 py-4 border-b border-slate-800/90 flex items-center justify-between bg-slate-950/60">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  </div>
                  <span className="text-xs font-extrabold text-slate-300 tracking-wider uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    Lens AI Biometric Simulator
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                  HTTP/2 200 OK
                </span>
              </div>

              {/* Mode Selection Tabs */}
              <div className="flex border-b border-slate-800 bg-slate-950/40 p-2 gap-1.5">
                <button
                  onClick={() => setActiveTab("enroll")}
                  className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                    activeTab === "enroll"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <span>1. Student Enrollment</span>
                </button>
                <button
                  onClick={() => setActiveTab("attendance")}
                  className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                    activeTab === "attendance"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <span>2. Class Snapshot</span>
                </button>
                <button
                  onClick={() => setActiveTab("sync")}
                  className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                    activeTab === "sync"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <span>3. LMS Webhook Sync</span>
                </button>
              </div>

              {/* Viewscreen Display */}
              <div className="p-6 h-[340px] flex flex-col justify-between relative bg-slate-950/80 overflow-hidden">
                
                {/* Laser animation when scanning */}
                {demoState === "scanning" && (
                  <div
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-30 shadow-cyan-400/80 shadow-lg animate-bounce"
                    style={{ animationDuration: "1.5s" }}
                  ></div>
                )}

                {/* Main Visual Content */}
                <div className="flex-1 flex items-center justify-center relative">
                  
                  {/* Tab 1: Enrollment */}
                  {activeTab === "enroll" && (
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-32 h-32 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center relative shadow-inner overflow-hidden">
                        <span className="text-6xl">👩‍🎓</span>
                        {demoState !== "idle" && (
                          <div className={`absolute inset-2 border-2 border-indigo-400 bg-indigo-500/10 rounded-xl transition-all ${
                            demoState === "completed" ? "border-emerald-400 bg-emerald-500/15" : "animate-pulse"
                          }`}>
                            <div className="absolute top-1 left-1 bg-indigo-600 text-white text-[9px] font-mono px-1 rounded">
                              FACE_DET_#01
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-slate-300 font-medium">
                        {demoState === "completed" ? (
                          <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                            ✓ Sarah Jenkins [STU-9982] Enrolled (128-d Vector Stored)
                          </span>
                        ) : (
                          <span>Extracting facial keypoints & generating vector embedding...</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Snapshot Scan */}
                  {activeTab === "attendance" && (
                    <div className="w-full grid grid-cols-2 gap-3.5 max-w-md">
                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between relative overflow-hidden">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">🧑‍🎓</span>
                          <div>
                            <div className="text-xs font-bold text-white">David Kim</div>
                            <div className="text-[10px] text-slate-400 font-mono">STU-1024</div>
                          </div>
                        </div>
                        {demoState === "completed" && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                            99.4% Match
                          </span>
                        )}
                      </div>

                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between relative overflow-hidden">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">👩‍🎓</span>
                          <div>
                            <div className="text-xs font-bold text-white">Mia Dubois</div>
                            <div className="text-[10px] text-slate-400 font-mono">STU-4829</div>
                          </div>
                        </div>
                        {demoState === "completed" && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                            98.9% Match
                          </span>
                        )}
                      </div>

                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between relative overflow-hidden">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">👨‍🎓</span>
                          <div>
                            <div className="text-xs font-bold text-white">Sophie Chen</div>
                            <div className="text-[10px] text-slate-400 font-mono">STU-2930</div>
                          </div>
                        </div>
                        {demoState === "completed" && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                            97.8% Match
                          </span>
                        )}
                      </div>

                      <div className="bg-slate-900/90 p-3 rounded-xl border border-amber-500/30 flex items-center justify-between relative overflow-hidden">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">🕵️</span>
                          <div>
                            <div className="text-xs font-bold text-amber-300">Unknown Face</div>
                            <div className="text-[10px] text-amber-400/80 font-mono">UNVERIFIED</div>
                          </div>
                        </div>
                        {demoState === "completed" && (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                            Flagged
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 3: LMS Webhook Sync */}
                  {activeTab === "sync" && (
                    <div className="w-full max-w-sm space-y-3 font-mono text-xs">
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-indigo-400 font-bold">POST</span>
                          <span className="text-slate-300">Canvas LMS /api/v1/attendance</span>
                        </div>
                        {demoState === "completed" ? (
                          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">200 OK</span>
                        ) : (
                          <span className="text-slate-500 animate-pulse">Syncing...</span>
                        )}
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-indigo-400 font-bold">POST</span>
                          <span className="text-slate-300">Ellucian Banner SIS</span>
                        </div>
                        {demoState === "completed" ? (
                          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">200 OK</span>
                        ) : (
                          <span className="text-slate-500 animate-pulse">Syncing...</span>
                        )}
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400 font-bold">POST</span>
                          <span className="text-slate-300">Registrar Webhook</span>
                        </div>
                        {demoState === "completed" ? (
                          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">201 Created</span>
                        ) : (
                          <span className="text-slate-500 animate-pulse">Syncing...</span>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                {/* Progress bar indicator */}
                {demoState === "scanning" && (
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-2">
                    <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-75" style={{ width: `${progress}%` }}></div>
                  </div>
                )}

                {/* Console Log Output */}
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl font-mono text-xs text-slate-300 flex items-center justify-between">
                  {demoState === "idle" && <span className="text-slate-400">Scanner idle. Click trigger to execute algorithms.</span>}
                  {demoState === "scanning" && <span className="text-cyan-400 animate-pulse">Processing 128-d face encodings... {progress}%</span>}
                  {demoState === "completed" && (
                    <div className="flex justify-between items-center w-full">
                      {activeTab === "enroll" && (
                        <>
                          <span className="text-emerald-400 font-bold">✓ STU-9982 Enrolled</span>
                          <span className="text-indigo-400 font-semibold">[128-Float Array]</span>
                        </>
                      )}
                      {activeTab === "attendance" && (
                        <>
                          <span className="text-emerald-400 font-bold">✓ 3 Present / 1 Flagged</span>
                          <span className="text-indigo-400 font-semibold">[Confidence: 98.6%]</span>
                        </>
                      )}
                      {activeTab === "sync" && (
                        <>
                          <span className="text-emerald-400 font-bold">✓ Roster Synced to Canvas</span>
                          <span className="text-indigo-400 font-semibold">[Audit Log #8849]</span>
                        </>
                      )}
                    </div>
                  )}

                  {demoState !== "scanning" && (
                    <button
                      onClick={runDemoScan}
                      className="ml-3 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold transition-all shrink-0"
                    >
                      Re-run Simulation
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* Glowing background aura */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-cyan-500/20 rounded-3xl blur-3xl pointer-events-none z-0"></div>
          </div>

        </div>
      </header>

      {/* Live Interactive Sandbox / Upload Test Demo */}
      <section id="sandbox" className="py-24 border-t border-slate-800/80 bg-slate-950/60 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-extrabold uppercase tracking-widest">
              Live Photo Detection Sandbox
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-4">
              Test Face Recognition on Sample Photos
            </h2>
            <p className="text-slate-300 mt-4 leading-relaxed">
              Select a sample classroom scenario below or upload your own image to test how Lens detects and labels faces in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Controls & Selection */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider">
                  1. Choose Sample Classroom Image
                </h3>

                <div className="space-y-3">
                  {SAMPLE_PHOTOS.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSampleChange(sample)}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                        selectedSample.id === sample.id && !customPhotoUrl
                          ? "bg-indigo-600/20 border-indigo-500 text-white shadow-lg"
                          : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{sample.icon}</span>
                        <div>
                          <div className="font-bold text-sm">{sample.name}</div>
                          <div className="text-xs text-slate-400">
                            {sample.studentsDetected} Detected • {sample.matchedCount} Matched
                          </div>
                        </div>
                      </div>
                      <span className="text-indigo-400 font-bold text-xs">Select →</span>
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider mb-3">
                    Or Upload Custom Photo
                  </h3>
                  <label className="w-full p-4 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500 bg-slate-950/40 hover:bg-indigo-600/5 transition-all flex flex-col items-center justify-center cursor-pointer text-center">
                    <svg className="w-6 h-6 text-indigo-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-bold text-slate-300">Click to upload custom photo</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Supports JPG, PNG, WEBP up to 10MB</span>
                    <input type="file" accept="image/*" onChange={handleCustomFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Right Display Area */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl relative min-h-[420px] flex flex-col justify-between">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📸</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {customPhotoUrl ? "Uploaded Custom Image" : selectedSample.name}
                      </h4>
                      <span className="text-xs text-slate-400">InsightFace Detection Overlay</span>
                    </div>
                  </div>

                  {isSandboxProcessing && (
                    <span className="text-xs font-bold text-cyan-400 animate-pulse flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                      Processing Image...
                    </span>
                  )}
                </div>

                {/* Image Container with Simulated Detection Boxes */}
                <div className="relative w-full h-[280px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
                  
                  {customPhotoUrl ? (
                    <img src={customPhotoUrl} alt="Uploaded" className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 flex items-center justify-center relative">
                      {/* Grid overlay for tech look */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30"></div>
                      <span className="text-6xl opacity-30">{selectedSample.icon}</span>
                    </div>
                  )}

                  {/* Render Bounding Boxes */}
                  {!isSandboxProcessing && sandboxResult?.detectedFaces.map((face, idx) => (
                    <div
                      key={idx}
                      className={`absolute border-2 rounded-lg transition-all ${
                        face.status === "MATCHED"
                          ? "border-emerald-400 bg-emerald-500/10"
                          : "border-amber-400 bg-amber-500/10"
                      }`}
                      style={{
                        top: face.box.top,
                        left: face.box.left,
                        width: face.box.width,
                        height: face.box.height,
                      }}
                    >
                      <div className={`absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white whitespace-nowrap shadow-md ${
                        face.status === "MATCHED" ? "bg-emerald-600" : "bg-amber-600"
                      }`}>
                        {face.name} ({face.conf > 0 ? `${face.conf}%` : "FLAGGED"})
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detection Output Summary */}
                <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-3 gap-4 text-center">
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-xs text-slate-400 font-semibold block">Detected Faces</span>
                    <span className="text-lg font-black text-white">{sandboxResult?.studentsDetected || 0}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-xs text-slate-400 font-semibold block">Roster Matches</span>
                    <span className="text-lg font-black text-emerald-400">{sandboxResult?.matchedCount || 0}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-xs text-slate-400 font-semibold block">Unregistered</span>
                    <span className="text-lg font-black text-amber-400">{sandboxResult?.unknownCount || 0}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-t border-slate-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-extrabold uppercase tracking-widest">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-4">
              Engineered for Modern Educational Institutions
            </h2>
            <p className="text-slate-300 mt-4 leading-relaxed">
              Designed from the ground up for privacy compliance, maximum accuracy, and seamless integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 p-8 rounded-2xl shadow-lg transition-all hover:scale-[1.01] group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-md">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">dlib Deep Learning Engine</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Extract 128-dimensional facial vector embeddings for high-precision matching across varying lighting, angles, and resolution conditions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 p-8 rounded-2xl shadow-lg transition-all hover:scale-[1.01] group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-md">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Classroom Snap-Scan</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Lecturers take a quick group snapshot on a phone or camera. Lens automatically detects and tags 50+ students in under 2.5 seconds.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 p-8 rounded-2xl shadow-lg transition-all hover:scale-[1.01] group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-md">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Canvas LMS & Banner Integration</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Direct REST webhooks format and push attendance statuses to Canvas, Ellucian Banner, or registrar databases without manual CSV exports.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 p-8 rounded-2xl shadow-lg transition-all hover:scale-[1.01] group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-md">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Privacy & Zero Image Storage</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Raw facial images are discarded immediately after vector conversion. Only encrypted 128-float numerical matrices remain in your database.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 p-8 rounded-2xl shadow-lg transition-all hover:scale-[1.01] group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-md">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Audit Trails & Manual Overrides</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Lecturers retain full administrative control to view individual verification scores, override student statuses, and inspect API log responses.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 p-8 rounded-2xl shadow-lg transition-all hover:scale-[1.01] group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-md">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Cross-Device Compatibility</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Works seamlessly with standard smartphone webcams, tablets, or fixed classroom overhead IP cameras without specialized hardware.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ROI & Savings Calculator */}
      <section id="calculator" className="py-24 border-t border-slate-800/80 bg-slate-950/40 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-950 border border-slate-800 p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
            
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase tracking-widest">
                Institutional Cost & Time Savings
              </span>
              <h2 className="text-3xl font-black text-white tracking-tight mt-4">
                Calculate Savings for Your Campus
              </h2>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                See how much teaching staff time and administrative budget Lens recovers every single month.
              </p>
            </div>

            {/* Interactive Sliders */}
            <div className="space-y-8 max-w-xl mx-auto">
              
              {/* Slider 1: Students */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-300">Enrolled Students:</span>
                  <span className="text-xl font-black text-indigo-400">{studentCount.toLocaleString()} Students</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="50"
                  value={studentCount}
                  onChange={(e) => setStudentCount(parseInt(e.target.value, 10))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
                />
              </div>

              {/* Slider 2: Weekly Lectures */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-300">Lectures per Week per Class:</span>
                  <span className="text-xl font-black text-cyan-400">{lecturesPerWeek} Lectures / wk</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="30"
                  step="1"
                  value={lecturesPerWeek}
                  onChange={(e) => setLecturesPerWeek(parseInt(e.target.value, 10))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                />
              </div>

            </div>

            {/* Calculated Output Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-800 max-w-2xl mx-auto">
              
              <div className="text-center bg-slate-950/80 p-6 rounded-2xl border border-slate-800 shadow-md">
                <span className="text-3xl font-black text-indigo-400">{hoursSavedPerMonth} Hrs</span>
                <p className="text-slate-400 text-xs font-extrabold uppercase tracking-wider mt-2">
                  Staff Hours Saved / Mo
                </p>
              </div>

              <div className="text-center bg-slate-950/80 p-6 rounded-2xl border border-slate-800 shadow-md">
                <span className="text-3xl font-black text-emerald-400">${moneySavedPerMonth.toLocaleString()}</span>
                <p className="text-slate-400 text-xs font-extrabold uppercase tracking-wider mt-2">
                  Staff Wage Value / Mo
                </p>
              </div>

              <div className="text-center bg-slate-950/80 p-6 rounded-2xl border border-slate-800 shadow-md">
                <span className="text-3xl font-black text-cyan-400">{paperSheetsSaved.toLocaleString()}</span>
                <p className="text-slate-400 text-xs font-extrabold uppercase tracking-wider mt-2">
                  Paper Sheets Saved / Mo
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="py-24 border-t border-slate-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-extrabold uppercase tracking-widest">
              LMS & SIS Gateway
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight mt-4">
              Native Integrations & Webhooks
            </h2>
            <p className="text-slate-300 mt-4 leading-relaxed">
              We package verified attendance payloads directly into industry-standard formats.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center hover:border-indigo-500/40 transition-all">
              <span className="text-3xl mb-2">🏫</span>
              <span className="font-bold text-white text-base">Ellucian Banner</span>
              <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase mt-1">Direct REST Gateway</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center hover:border-indigo-500/40 transition-all">
              <span className="text-3xl mb-2">🎨</span>
              <span className="font-bold text-white text-base">Canvas LMS</span>
              <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase mt-1">LTI & REST API</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center hover:border-indigo-500/40 transition-all">
              <span className="text-3xl mb-2">📓</span>
              <span className="font-bold text-white text-base">Blackboard Learn</span>
              <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase mt-1">Ultra API Compatible</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center hover:border-indigo-500/40 transition-all">
              <span className="text-3xl mb-2">🪝</span>
              <span className="font-bold text-white text-base">Custom Webhooks</span>
              <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase mt-1">JSON HTTP POST</span>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="py-24 border-t border-slate-800/80 bg-slate-950/40 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-extrabold uppercase tracking-widest">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does Lens protect student privacy and biometric security?",
                a: "Lens does not store raw photos of students. Once an image is uploaded, the facial recognition model extracts a 128-dimensional numerical vector. The raw image is immediately purged, leaving only encrypted floating-point coordinates that cannot be reversed into a photo."
              },
              {
                q: "What camera hardware is required for scanning classrooms?",
                a: "Any standard smartphone, tablet, or webcam is supported! Lecturers can simply take a photo using their mobile phone via the Lecturer Console web app, or connect fixed classroom IP cameras for automated capture."
              },
              {
                q: "How fast is the face detection algorithm?",
                a: "The backend uses fast dlib face encodings with linear distance matching, allowing group classroom photos to be processed instantly without downloading large external models."
              },
              {
                q: "Can lecturers manually override or correct attendance records?",
                a: "Yes! In the Lecturer Console under Session History, lecturers can view the matched student confidence scores and manually mark any student as Present or Absent if an exception occurs."
              }
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center text-white hover:bg-slate-900 transition-colors"
                >
                  <span className="font-bold text-base sm:text-lg">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-indigo-400 transition-transform duration-300 ${
                      openFaq === i ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 pt-2 text-slate-300 text-sm leading-relaxed border-t border-slate-800/80 bg-slate-950/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action Footer */}
      <section className="py-24 border-t border-slate-800/80 bg-gradient-to-b from-slate-950 via-[#07090e] to-slate-950 relative z-10 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-indigo-950/60 border border-indigo-500/20 p-10 sm:p-16 rounded-3xl shadow-2xl relative overflow-hidden">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight">
              Ready to Upgrade Your Classroom Rosters?
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-10 text-base sm:text-lg leading-relaxed">
              Experience the power of automated biometric face identification and instant Canvas LMS roster syncing today.
            </p>
            <Link
              href="/dashboard"
              className="px-10 py-5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-indigo-600/40 inline-flex items-center gap-3 hover:scale-[1.02]"
            >
              <span>Launch Lecturer Console</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-[#07090e] border-t border-slate-800/80 text-slate-400 text-xs font-semibold text-center relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">Lens FaceID</span>
            <span>— Biometric Attendance Intelligence</span>
          </div>
          <p>© {new Date().getFullYear()} Lens System. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
