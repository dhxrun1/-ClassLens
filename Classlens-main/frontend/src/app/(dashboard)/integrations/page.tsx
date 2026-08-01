"use client";

import React, { useState, useEffect } from "react";
import { useRole } from "../../context/RoleContext";

type Integration = {
  id?: number;
  system_name: string;
  endpoint_url: string;
  api_key: string;
  is_active: boolean;
};

type SyncLog = {
  id: number;
  lecture_id: string;
  lecture_name: string;
  system_name: string;
  status: string;
  response_payload: string;
  timestamp: string;
};

export default function IntegrationsPage() {
  const { role } = useRole();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [systemName, setSystemName] = useState("Canvas LMS");
  const [endpointUrl, setEndpointUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchIntegrations = () => {
    fetch("/api/v1/integrations")
      .then((res) => res.json())
      .then((data) => {
        setIntegrations(data);
      })
      .catch((err) => console.error("Error fetching integrations:", err));
  };

  const fetchLogs = () => {
    fetch("/api/v1/integrations/logs")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching logs:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchIntegrations();
    fetchLogs();
  }, []);

  if (role !== "admin") {
    return (
      <div className="min-h-screen p-8 md:p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mb-4 text-rose-600">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500 max-w-sm mb-6">You must be logged in as an Administrator to view and edit external API integrations.</p>
        <button
          onClick={() => window.location.href = "/dashboard"}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const handleEdit = (integration: Integration) => {
    setSystemName(integration.system_name);
    setEndpointUrl(integration.endpoint_url);
    setApiKey(integration.api_key || "");
    setIsActive(integration.is_active);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/v1/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_name: systemName,
          endpoint_url: endpointUrl,
          api_key: apiKey,
          is_active: isActive,
        }),
      });

      if (res.ok) {
        // Reset and refresh
        setEndpointUrl("");
        setApiKey("");
        setIsActive(true);
        fetchIntegrations();
      } else {
        alert("Failed to save integration config");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving integration config");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">API Connections & Integrations</h1>
        <p className="text-slate-600">Sync class attendance data with external Student Information Systems (SIS) or Learning Management Systems (LMS).</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Connection Setup Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Setup SIS Gateway</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">External Target System</label>
                <select
                  value={systemName}
                  onChange={(e) => setSystemName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Canvas LMS">Canvas LMS</option>
                  <option value="Ellucian Banner (SIS)">Ellucian Banner (SIS)</option>
                  <option value="Registrar Custom Webhook">Registrar Custom Webhook</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">API Endpoint URL</label>
                <input
                  type="text"
                  required
                  value={endpointUrl}
                  onChange={(e) => setEndpointUrl(e.target.value)}
                  placeholder="https://api.university.edu/sync"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Bearer API Key / Token (Optional)</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-slate-700 select-none cursor-pointer">
                  Activate Sync Endpoint
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
              >
                {saving ? "Saving..." : "Save Connection Gateway"}
              </button>
            </form>
          </div>
        </div>

        {/* Configurations List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Configured Connections</h2>
            
            {integrations.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">No connections configured. Configure one using the form.</p>
            ) : (
              <div className="space-y-4">
                {integrations.map((i) => (
                  <div key={i.id} className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 transition-all">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-bold text-slate-900 text-base">{i.system_name}</span>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          i.is_active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${i.is_active ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}></span>
                          {i.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono break-all">{i.endpoint_url}</p>
                    </div>

                    <button
                      onClick={() => handleEdit(i)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all self-start md:self-auto shrink-0 shadow-sm"
                    >
                      Modify Settings
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sync logs history */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">External API Sync Audit Logs</h2>
          <button
            onClick={fetchLogs}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title="Refresh logs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <svg className="animate-spin h-8 w-8 text-indigo-600 mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p>Loading synchronization history...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-white">
            <p className="font-bold text-slate-800 mb-1">No API synchronization records found.</p>
            <p className="text-sm max-w-xs mx-auto">Sync reports will populate once you trigger sync events on individual lecture detail screens.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Lecture Session</th>
                  <th className="px-6 py-4">Target System</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Gateway Response Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{formatDate(log.timestamp)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{log.lecture_name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{log.lecture_id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{log.system_name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${
                        log.status === "SUCCESS"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-rose-50 text-rose-700 border-rose-100"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-md font-mono text-xs text-slate-500 truncate" title={log.response_payload}>
                      {log.response_payload}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
