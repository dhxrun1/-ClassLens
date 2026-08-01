"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRole } from "../../context/RoleContext";

type DetectedFace = {
  bbox: [number, number, number, number];
  student_id: string;
  name: string;
  confidence: number;
  distance: number;
  image_index?: number;
};

type ProcessResult = {
  detected: DetectedFace[];
  unknown_count: number;
  total_images: number;
  total_faces_detected: number;
};

type ImageEntry = {
  id: string;
  file: File;
  url: string;
  source: 'upload' | 'webcam';
};

export default function AttendancePage() {
  const { role } = useRole();
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [selectedPreview, setSelectedPreview] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processed' | 'confirming' | 'success' | 'error'>('idle');
  const [results, setResults] = useState<ProcessResult | null>(null);
  const [courseName, setCourseName] = useState('');
  const [message, setMessage] = useState('');
  const [imageScale, setImageScale] = useState({ x: 1, y: 1 });
  const [showWebcam, setShowWebcam] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const updateScale = useCallback(() => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight, clientWidth, clientHeight } = imageRef.current;
      if (naturalWidth && naturalHeight) {
        setImageScale({
          x: clientWidth / naturalWidth,
          y: clientHeight / naturalHeight,
        });
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  // Cleanup webcam on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.url));
    };
  }, []);

  if (role !== "lecturer") {
    return (
      <div className="min-h-screen p-8 md:p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mb-4 text-rose-600">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500 max-w-sm mb-6">You must be logged in as a Lecturer to capture attendance and process classroom scans.</p>
        <button
          onClick={() => window.location.href = "/dashboard"}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const addFiles = (fileList: FileList | File[]) => {
    const newEntries: ImageEntry[] = [];
    for (const file of Array.from(fileList)) {
      if (!file.type.startsWith('image/')) continue;
      newEntries.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        file,
        url: URL.createObjectURL(file),
        source: 'upload',
      });
    }
    if (newEntries.length > 0) {
      setImages(prev => {
        const updated = [...prev, ...newEntries];
        if (selectedPreview === null && updated.length > 0) {
          setSelectedPreview(0);
        }
        return updated;
      });
      setResults(null);
      setStatus('idle');
      setMessage('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      addFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index].url);
      if (selectedPreview !== null) {
        if (index < selectedPreview) setSelectedPreview(selectedPreview - 1);
        else if (index === selectedPreview) setSelectedPreview(updated.length > 0 ? 0 : null);
        else setSelectedPreview(selectedPreview);
      }
      return updated;
    });
  };

  // --- Webcam ---
  const startWebcam = async () => {
    setShowWebcam(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setShowWebcam(false);
      setMessage('Could not access webcam. Please allow camera permissions.');
      setStatus('error');
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setShowWebcam(false);
  };

  const captureWebcam = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `webcam-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const entry: ImageEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        file,
        url: URL.createObjectURL(blob),
        source: 'webcam',
      };
      setImages(prev => {
        const updated = [...prev, entry];
        if (selectedPreview === null) setSelectedPreview(0);
        return updated;
      });
      setResults(null);
      setStatus('idle');
      setMessage('');
    }, 'image/jpeg', 0.92);
  };

  // --- Process ---
  const handleProcessImages = async () => {
    if (images.length === 0) return;

    setStatus('uploading');
    setMessage('');

    const formData = new FormData();
    images.forEach(img => {
      formData.append('files', img.file);
    });

    try {
      const response = await fetch('/api/v1/process-class-photo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process images');
      }

      const responseData = await response.json();
      setResults(responseData.result);
      setStatus('processed');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An error occurred while processing');
    }
  };

  // --- Confirm ---
  const handleConfirmAttendance = async () => {
    if (!results || results.detected.length === 0) return;

    setStatus('confirming');
    setMessage('');

    if (!courseName) {
      setStatus('error');
      setMessage('Please enter a course name');
      return;
    }

    const studentIds = results.detected.map(d => d.student_id);

    try {
      const response = await fetch('/api/v1/confirm-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_ids: studentIds, course_name: courseName }),
      });

      if (!response.ok) {
        throw new Error('Failed to confirm attendance');
      }

      setStatus('success');
      setMessage('Attendance confirmed successfully!');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An error occurred while confirming attendance');
    }
  };

  const resetAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.url));
    setImages([]);
    setSelectedPreview(null);
    setResults(null);
    setStatus('idle');
    setMessage('');
    setCourseName('');
    stopWebcam();
  };

  const previewUrl = selectedPreview !== null ? images[selectedPreview]?.url ?? null : null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900">
      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-10 flex flex-col items-center overflow-y-auto">
        <div className="w-full max-w-4xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Class Attendance</h1>
              <p className="text-slate-600">Upload class photos or capture from webcam to take attendance.</p>
            </div>
            
            {status === 'processed' && results && (
              <div className="flex gap-3 items-center w-full md:w-auto">
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="Course Name (e.g. CS101)"
                  className="px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-900 placeholder-slate-400 w-full md:w-48"
                />
                <button
                  onClick={handleConfirmAttendance}
                  disabled={!courseName}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg shadow-sm transition-all flex items-center gap-2 shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Confirm
                </button>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
            {images.length === 0 && !showWebcam ? (
              /* Empty state: upload zone + webcam button */
              <div className="text-center w-full max-w-md relative z-10">
                <div
                  className={`relative group cursor-pointer ${dragOver ? 'scale-[1.02]' : ''} transition-transform`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <div className={`w-full px-4 py-16 border-2 border-dashed rounded-xl transition-all duration-300 flex flex-col items-center justify-center bg-slate-50 ${
                    dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 group-hover:border-indigo-400 group-hover:bg-indigo-50/50'
                  }`}>
                    <div className="bg-white p-4 rounded-full mb-4 shadow-sm border border-slate-200 group-hover:border-indigo-200 group-hover:scale-110 transition-all duration-300">
                      <svg className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-700 group-hover:text-indigo-700 transition-colors">Upload Class Photos</h3>
                    <p className="text-sm text-slate-500 mt-2">Click or drag and drop to upload multiple images</p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3 justify-center">
                  <div className="h-px flex-1 bg-slate-200"></div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">or</span>
                  <div className="h-px flex-1 bg-slate-200"></div>
                </div>

                <button
                  onClick={startWebcam}
                  className="mt-6 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg shadow-sm transition-all flex items-center gap-2 mx-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  Open Webcam
                </button>
              </div>
            ) : showWebcam ? (
              /* Webcam view */
              <div className="w-full flex flex-col items-center gap-4 relative z-10">
                <div className="relative rounded-lg overflow-hidden border border-slate-200 shadow-sm max-w-full">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="max-h-[50vh] max-w-full object-contain bg-black"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={captureWebcam}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition-all flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    Capture
                  </button>
                  <button
                    onClick={stopWebcam}
                    className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-all"
                  >
                    Close Webcam
                  </button>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            ) : (
              /* Images loaded: thumbnail strip + main preview */
              <div className="w-full flex flex-col items-center gap-6 relative z-10">
                {/* Thumbnail strip */}
                <div className="w-full flex gap-2 overflow-x-auto pb-2 px-1">
                  {images.map((img, idx) => (
                    <div
                      key={img.id}
                      className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                        selectedPreview === idx ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200 hover:border-slate-400'
                      }`}
                      onClick={() => setSelectedPreview(idx)}
                    >
                      <img src={img.url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        &times;
                      </button>
                      {img.source === 'webcam' && (
                        <div className="absolute bottom-0.5 left-0.5 bg-black/60 text-white text-[9px] px-1 py-0.5 rounded font-medium">
                          CAM
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add more button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="shrink-0 w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 hover:border-indigo-400 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 transition-all bg-slate-50 hover:bg-indigo-50/50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    <span className="text-[10px] font-medium mt-0.5">Add</span>
                  </button>
                  <button
                    onClick={startWebcam}
                    className="shrink-0 w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 hover:border-slate-600 flex flex-col items-center justify-center text-slate-400 hover:text-slate-700 transition-all bg-slate-50 hover:bg-slate-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    <span className="text-[10px] font-medium mt-0.5">Webcam</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Main preview image */}
                {previewUrl && (
                  <div className="relative inline-block max-w-full">
                    <img
                      ref={imageRef}
                      src={previewUrl}
                      alt="Class Preview"
                      className="max-w-full h-auto max-h-[50vh] object-contain rounded-lg border border-slate-200 shadow-sm"
                      onLoad={updateScale}
                    />
                    
                    {results?.detected
                      .filter(f => (f.image_index ?? 0) === selectedPreview)
                      .map((face, idx) => (
                        <div
                          key={idx}
                          className="absolute group transition-all duration-300 ease-in-out hover:z-10 cursor-crosshair"
                          style={{
                            left: face.bbox[0] * imageScale.x,
                            top: face.bbox[1] * imageScale.y,
                            width: face.bbox[2] * imageScale.x,
                            height: face.bbox[3] * imageScale.y,
                            border: '2px solid #10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: '4px'
                          }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 pointer-events-none">
                            <span>{face.name}</span>
                            <span className="bg-emerald-800/50 px-1 py-0.5 rounded text-[10px]">{(face.confidence * 100).toFixed(0)}%</span>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-emerald-600"></div>
                          </div>
                        </div>
                      ))
                    }

                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded">
                      {selectedPreview !== null ? selectedPreview + 1 : 0} / {images.length}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-3">
                  {status === 'idle' && (
                    <button
                      onClick={handleProcessImages}
                      className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition-all flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      Process {images.length > 1 ? `All ${images.length} Photos` : 'Photo'}
                    </button>
                  )}
                  
                  {status === 'uploading' && (
                    <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-200">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="font-medium text-sm">Analyzing faces...</span>
                    </div>
                  )}
                  
                  {status === 'confirming' && (
                    <div className="flex items-center gap-3 text-indigo-700 bg-indigo-50 px-6 py-3 rounded-full border border-indigo-200">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="font-medium text-sm">Confirming attendance...</span>
                    </div>
                  )}

                  {status !== 'idle' && status !== 'uploading' && status !== 'confirming' && (
                    <button
                      onClick={resetAll}
                      className="px-5 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-all text-sm"
                    >
                      Start Over
                    </button>
                  )}
                </div>

                {message && status !== 'idle' && status !== 'uploading' && status !== 'confirming' && (
                  <div className={`px-4 py-3 rounded-lg flex items-center gap-3 w-full max-w-md ${
                    status === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {status === 'error' ? (
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ) : (
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    )}
                    <span className="font-medium text-sm">{message}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar for Results */}
      <div className="w-full md:w-80 lg:w-96 bg-white border-t md:border-t-0 md:border-l border-slate-200 p-6 flex flex-col h-auto md:h-screen sticky top-0 overflow-y-auto">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
          Detection Results
        </h2>
        
        {!results ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center py-12 px-4">
            <div className="bg-slate-50 p-4 rounded-full mb-4 border border-slate-200">
              <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <p className="text-sm">Upload or capture images and process them to see recognized students here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col relative overflow-hidden">
                <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">Recognized</span>
                <span className="text-3xl font-bold text-emerald-600">{results.detected.length}</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col relative overflow-hidden">
                <span className="text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">Unknown</span>
                <span className="text-3xl font-bold text-amber-600">{results.unknown_count}</span>
              </div>
            </div>

            {results.total_images > 1 && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-center gap-3">
                <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <div className="text-xs text-indigo-700">
                  <span className="font-bold">{results.total_images}</span> photos processed &middot; <span className="font-bold">{results.total_faces_detected}</span> total faces found
                </div>
              </div>
            )}

            <div className="flex-1">
              <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider border-b border-slate-200 pb-2">Identified Students</h3>
              {results.detected.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4 bg-slate-50 rounded-lg border border-slate-200">No faces recognized.</p>
              ) : (
                <ul className="space-y-3">
                  {results.detected.map((face, idx) => (
                    <li key={idx} className="bg-white hover:bg-slate-50 transition-colors border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                          {face.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{face.name}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{face.student_id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] uppercase font-bold px-2 py-1 rounded-full">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          {(face.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
