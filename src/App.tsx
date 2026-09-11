import React, { useState, useEffect } from 'react';
import {
  Compass,
  FileText,
  Send,
  Database,
  CheckCircle2,
  ExternalLink,
  Code2,
  Users,
  Mail,
  PhoneCall,
  Heart,
  Calendar,
  Layers,
  Sparkles,
  Terminal,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface SystemHealth {
  status: string;
  service: string;
  version: string;
  database: {
    connected: boolean;
    engine: string;
    postgresConfigured: boolean;
    targetHost?: string;
    targetDatabase?: string;
    lastError?: string | null;
    activeRecords: {
      safari_enquiries: number;
      custom_safari_requests: number;
      b2b_agent_applications: number;
      newsletter_subscribers: number;
      quick_contact_leads: number;
      blog_feedbacks: number;
    };
  };
}

const DEFAULT_PAYLOADS = {
  cta1: {
    packageTitle: "7-Day Serengeti & Ngorongoro Classic Migration Safari",
    packageId: "tanzania-classic-7d",
    travelerName: "Dr. Sarah Jenkins",
    travelerEmail: "sarah.jenkins@example.com",
    travelerPhone: "+1 (555) 234-5678",
    guestCount: 2,
    travelMonth: "July 2026",
    safariStyle: "Luxury Tented Lodge & Bush Camp",
    specialNotes: "Celebrating our 10th anniversary. Interested in hot air balloon safari.",
    currency: "USD",
    estimatedPrice: 4500,
    leadSource: "SafariModal_EnquiryTab"
  },
  cta2: {
    fullName: "Marcus Vance",
    email: "m.vance@company.com",
    phone: "+44 7700 900077",
    country: "United Kingdom",
    travelStyle: "Private Group Safari",
    destinations: ["Serengeti National Park", "Ngorongoro Crater", "Tarangire National Park", "Zanzibar Island"],
    duration: "8 - 10 Days",
    travelers: "4 Adults",
    travelDate: "August 2026",
    budgetPreference: "Luxury Tented Camps ($4,500 - $6,500 / person)",
    accommodationType: "Luxury Tented Safari Lodges",
    specialRequests: "Private photographic guide and interconnected tents.",
    howHeard: "Recommendation / Referral",
    subject: "Private Family Great Migration & Zanzibar Extension",
    message: "We would like to land at Kilimanjaro (JRO) and depart from Zanzibar (ZNZ)."
  },
  cta3: {
    agencyName: "Apex Luxury Travel Ltd",
    contactPerson: "Elena Rostova",
    email: "elena@apextravel.de",
    phone: "+49 89 1234567",
    country: "Germany",
    businessType: "Tour Operator",
    annualClients: "11-50 clients",
    message: "Seeking ground handling partner for East African safari bookings."
  },
  cta4: {
    email: "wildlife.photographer@nature.org",
    source: "Footer_Savannah_Journal"
  },
  cta5: {
    channel: "WhatsApp_Direct",
    phoneNumberDialed: "+255682801818",
    pageOrigin: "/blog?article=tanzania-southern-circuit-vs-northern-circuit"
  },
  cta6: {
    interactionType: "helpful_upvote"
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'tester' | 'leads' | 'schema'>('tester');
  const [selectedCta, setSelectedCta] = useState<string>('cta1');
  const [payloadText, setPayloadText] = useState<string>(JSON.stringify(DEFAULT_PAYLOADS.cta1, null, 2));
  const [articleSlug, setArticleSlug] = useState<string>('tanzania-southern-circuit-vs-northern-circuit');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseBody, setResponseBody] = useState<any>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [selectedRecordsTable, setSelectedRecordsTable] = useState<string>('safari');

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      }
    } catch (e) {
      console.warn('Health fetch error:', e);
    }
  };

  const fetchTableRecords = async (tableKey: string) => {
    try {
      let endpoint = '/api/safari/enquiries';
      if (tableKey === 'custom-safari') endpoint = '/api/custom-safari/quotes';
      if (tableKey === 'partnerships') endpoint = '/api/partnerships/applications';
      if (tableKey === 'newsletter') endpoint = '/api/newsletter/subscribers';
      if (tableKey === 'leads') endpoint = '/api/leads/quick-contact';
      if (tableKey === 'blog') endpoint = '/api/blog/feedback';

      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setRecords(data.data || []);
      }
    } catch (e) {
      console.warn('Records fetch error:', e);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === 'leads') {
      fetchTableRecords(selectedRecordsTable);
    }
  }, [activeTab, selectedRecordsTable]);

  const handleSelectCta = (key: string) => {
    setSelectedCta(key);
    // @ts-ignore
    setPayloadText(JSON.stringify(DEFAULT_PAYLOADS[key], null, 2));
    setResponseStatus(null);
    setResponseBody(null);
  };

  const executeApiCall = async () => {
    setIsLoading(true);
    setResponseStatus(null);
    setResponseBody(null);

    let url = '/api/safari/enquiry';
    let method = 'POST';

    if (selectedCta === 'cta2') url = '/api/custom-safari/quote';
    if (selectedCta === 'cta3') url = '/api/partnerships/apply';
    if (selectedCta === 'cta4') url = '/api/newsletter/subscribe';
    if (selectedCta === 'cta5') url = '/api/leads/quick-contact';
    if (selectedCta === 'cta6') url = `/api/blog/${encodeURIComponent(articleSlug || 'tanzania-classic')}/feedback`;

    try {
      const parsedBody = JSON.parse(payloadText);
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedBody),
      });

      setResponseStatus(res.status);
      const data = await res.json();
      setResponseBody(data);
      fetchHealth();
    } catch (err: any) {
      setResponseStatus(500);
      setResponseBody({
        success: false,
        error: 'Client Request Error',
        message: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ctaList = [
    { id: 'cta1', title: 'CTA 1: Safari Enquiry', endpoint: 'POST /api/safari/enquiry', table: 'safari_enquiries', icon: Compass },
    { id: 'cta2', title: 'CTA 2: Custom Safari Quote', endpoint: 'POST /api/custom-safari/quote', table: 'custom_safari_requests', icon: Sparkles },
    { id: 'cta3', title: 'CTA 3: B2B Agent Form', endpoint: 'POST /api/partnerships/apply', table: 'b2b_agent_applications', icon: Users },
    { id: 'cta4', title: 'CTA 4: Newsletter Opt-In', endpoint: 'POST /api/newsletter/subscribe', table: 'newsletter_subscribers', icon: Mail },
    { id: 'cta5', title: 'CTA 5: Quick Contact Logger', endpoint: 'POST /api/leads/quick-contact', table: 'quick_contact_leads', icon: PhoneCall },
    { id: 'cta6', title: 'CTA 6: Blog Article Feedback', endpoint: 'POST /api/blog/:id/feedback', table: 'blog_feedbacks', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="border-b border-stone-800 bg-stone-900/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-600/20">
              <Compass className="w-6 h-6 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-stone-100">Lion Track Safari</span>
                <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-mono">
                  CTA Engine v1.0
                </span>
              </div>
              <p className="text-xs text-stone-400">PostgreSQL Lead Capture & REST API</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              id="swagger-docs-btn"
              href="/api-docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs transition shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>Swagger UI Docs</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
            </a>

            <a
              id="openapi-json-btn"
              href="/api/docs.json"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition border border-stone-700"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>OpenAPI JSON</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Status Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-stone-400">API Status</div>
              <div className="text-sm font-semibold text-stone-200">Express 4.21 Active</div>
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-stone-400">Database Engine</div>
              <div className="text-sm font-semibold text-stone-200">
                {health?.database.engine || 'PostgreSQL (pg pool)'}
              </div>
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-stone-400">Registered Tables</div>
              <div className="text-sm font-semibold text-stone-200">6 CTA Lead Tables</div>
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-stone-400">Documentation</div>
              <a href="/api-docs" target="_blank" className="text-sm font-semibold text-amber-400 hover:underline flex items-center gap-1">
                Swagger at /api-docs <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Database Configuration Diagnostic Banner */}
        {health?.database.postgresConfigured && (
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
            health.database.connected
              ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
              : 'bg-amber-950/20 border-amber-800/40 text-amber-300'
          }`}>
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded bg-stone-900 border border-stone-800 text-stone-300 font-mono text-[11px]">
                ENV
              </div>
              <div>
                <div className="font-semibold text-stone-200 flex items-center gap-2">
                  <span>Database Target: <span className="font-mono text-amber-400">{health.database.targetDatabase || 'tripwithus_safari'}</span> on <span className="font-mono text-stone-300">{health.database.targetHost || 'localhost:5432'}</span></span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    health.database.connected
                      ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                      : 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                  }`}>
                    {health.database.connected ? 'Live DB Active' : 'Ready for cPanel'}
                  </span>
                </div>
                <div className="text-stone-400 mt-0.5">
                  {health.database.connected
                    ? 'Successfully connected to PostgreSQL database.'
                    : 'Target is set to localhost:5432. In this remote cloud preview container, localhost has no running database (ECONNREFUSED). When deployed on your cPanel server where Node and Postgres share localhost, this will connect directly.'}
                </div>
              </div>
            </div>
            <button
              onClick={fetchHealth}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded border border-stone-700 text-xs flex items-center gap-1.5 whitespace-nowrap transition"
            >
              <RefreshCw className="w-3 h-3" />
              Re-check Status
            </button>
          </div>
        )}

        {/* View Switcher Tabs */}
        <div className="border-b border-stone-800 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('tester')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
                activeTab === 'tester'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Interactive CTA API Tester</span>
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
                activeTab === 'leads'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Captured Leads Viewer</span>
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
                activeTab === 'schema'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>PostgreSQL DDL & Architecture</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={fetchHealth}
              title="Refresh Health"
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TAB 1: API TESTER */}
        {activeTab === 'tester' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* CTA Endpoint Selector Sidebar */}
            <div className="lg:col-span-4 space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400 px-1 mb-2">
                Available CTA Endpoints
              </h2>
              {ctaList.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedCta === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectCta(item.id)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-3 ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500/50 text-stone-100 shadow-md shadow-amber-900/10'
                        : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:bg-stone-900 hover:text-stone-200'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mt-0.5 ${isSelected ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate text-stone-200">{item.title}</div>
                      <div className="text-xs font-mono text-amber-400/80 mt-0.5 truncate">{item.endpoint}</div>
                      <div className="text-[10px] text-stone-500 mt-1 flex items-center gap-1 font-mono">
                        <Database className="w-3 h-3" /> {item.table}
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Database notice */}
              <div className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800 text-xs space-y-1.5 text-stone-400">
                <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                  <Database className="w-3.5 h-3.5" />
                  <span>PostgreSQL Ready</span>
                </div>
                <p>
                  To attach live Supabase or Neon PostgreSQL, configure <code className="text-stone-200">DATABASE_URL</code> in <code className="text-stone-200">.env</code> and run <code className="text-stone-200">npm run init-db</code>.
                </p>
              </div>
            </div>

            {/* Request & Response Playground */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-stone-800 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded font-mono font-bold text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      POST
                    </span>
                    <span className="font-mono text-xs sm:text-sm text-stone-200">
                      {ctaList.find(c => c.id === selectedCta)?.endpoint.replace('POST ', '')}
                    </span>
                  </div>

                  <button
                    id="execute-cta-btn"
                    onClick={executeApiCall}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-bold text-xs transition"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>{isLoading ? 'Executing...' : 'Send Request'}</span>
                  </button>
                </div>

                {/* Optional path parameter for CTA 6 */}
                {selectedCta === 'cta6' && (
                  <div className="px-4 py-3 bg-stone-950/60 border-b border-stone-800 flex items-center gap-3">
                    <label className="text-xs text-stone-400 whitespace-nowrap font-mono">
                      URL Param :id (article_slug):
                    </label>
                    <input
                      type="text"
                      value={articleSlug}
                      onChange={(e) => setArticleSlug(e.target.value)}
                      className="flex-1 bg-stone-900 border border-stone-700 text-stone-200 px-3 py-1 text-xs rounded font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span className="font-medium">JSON Request Body (Editable)</span>
                    <button
                      onClick={() => {
                        // @ts-ignore
                        setPayloadText(JSON.stringify(DEFAULT_PAYLOADS[selectedCta], null, 2));
                      }}
                      className="text-[11px] text-amber-400 hover:underline"
                    >
                      Reset to Default Spec
                    </button>
                  </div>
                  <textarea
                    value={payloadText}
                    onChange={(e) => setPayloadText(e.target.value)}
                    rows={10}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 font-mono text-xs text-stone-200 focus:outline-none focus:border-amber-500 resize-y"
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Response Panel */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Server Response
                  </span>
                  {responseStatus && (
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${
                        responseStatus >= 200 && responseStatus < 300
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      HTTP {responseStatus} {responseStatus === 201 ? 'Created' : responseStatus === 200 ? 'OK' : 'Error'}
                    </span>
                  )}
                </div>

                {responseBody ? (
                  <pre className="p-4 rounded-lg bg-stone-950 border border-stone-800 text-xs font-mono text-emerald-400 overflow-x-auto">
                    {JSON.stringify(responseBody, null, 2)}
                  </pre>
                ) : (
                  <div className="py-8 text-center text-stone-500 text-xs">
                    Click "Send Request" to test this CTA endpoint and view the live response payload.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LEADS VIEWER */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {[
                  { key: 'safari', label: 'Safari Enquiries' },
                  { key: 'custom-safari', label: 'Custom Quotes' },
                  { key: 'partnerships', label: 'B2B Applications' },
                  { key: 'newsletter', label: 'Newsletter' },
                  { key: 'leads', label: 'Quick Leads' },
                  { key: 'blog', label: 'Blog Feedback' },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setSelectedRecordsTable(t.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedRecordsTable === t.key
                        ? 'bg-amber-600 text-stone-950 font-semibold'
                        : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => fetchTableRecords(selectedRecordsTable)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs text-stone-300 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Records</span>
              </button>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-stone-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-300">
                  Total Records: {records.length}
                </span>
                <span className="text-[11px] text-stone-500 font-mono">
                  Table: {selectedRecordsTable}
                </span>
              </div>

              {records.length > 0 ? (
                <div className="divide-y divide-stone-800 max-h-[600px] overflow-y-auto">
                  {records.map((rec, idx) => (
                    <div key={rec.id || idx} className="p-4 hover:bg-stone-850 transition">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {rec.reference_code || rec.id || `Item #${idx + 1}`}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          {rec.created_at || rec.subscribed_at || rec.clicked_at || 'Recently'}
                        </span>
                      </div>
                      <pre className="text-xs font-mono text-stone-300 bg-stone-950 p-3 rounded-lg overflow-x-auto">
                        {JSON.stringify(rec, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-stone-500 text-xs">
                  No records recorded yet in this table. Submit a test payload using the CTA tester!
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SCHEMA VIEWER */}
        {activeTab === 'schema' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                <Database className="w-4 h-4" />
                <span>PostgreSQL Database Architecture</span>
              </div>
              <p>
                The Lion Track Safari CTA engine uses 6 dedicated tables configured for high durability, audit tracking, unique reference generation, and JSONB destination arrays.
              </p>
              <div className="flex gap-2 pt-1">
                <a
                  href="/init.sql"
                  download="init.sql"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-mono"
                >
                  <FileText className="w-3.5 h-3.5" /> Download init.sql
                </a>
              </div>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
              <h3 className="text-xs font-semibold uppercase text-stone-400 mb-3">
                SQL Schema DDL (init.sql)
              </h3>
              <pre className="p-4 rounded-lg bg-stone-950 text-stone-300 font-mono text-xs overflow-x-auto leading-relaxed">
{`-- 1. Direct Safari & Route Enquiries (From SafariModal)
CREATE TABLE safari_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code VARCHAR(30) UNIQUE NOT NULL,
    package_title VARCHAR(255) NOT NULL,
    package_id VARCHAR(100),
    traveler_name VARCHAR(150) NOT NULL,
    traveler_email VARCHAR(150) NOT NULL,
    traveler_phone VARCHAR(50) NOT NULL,
    guest_count INT DEFAULT 2,
    travel_month VARCHAR(50),
    safari_style VARCHAR(100),
    special_notes TEXT,
    currency VARCHAR(10) DEFAULT 'USD',
    estimated_price NUMERIC(10, 2),
    lead_source VARCHAR(100) DEFAULT 'SafariModal_EnquiryTab',
    status VARCHAR(50) DEFAULT 'New Lead',
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Bespoke Tailor-Made Safari Quotes (From /contact Builder)
CREATE TABLE custom_safari_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    country_of_residence VARCHAR(100),
    travel_style VARCHAR(100),
    destinations JSONB NOT NULL,
    duration VARCHAR(50),
    travelers VARCHAR(50),
    travel_date_window VARCHAR(100),
    budget_preference VARCHAR(100),
    accommodation_type VARCHAR(100),
    special_requests TEXT,
    referral_source VARCHAR(100),
    subject VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'Pending Review',
    assigned_director VARCHAR(100) DEFAULT 'Arusha Head Specialist',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. B2B Travel Agent Partnership Applications
CREATE TABLE b2b_agent_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code VARCHAR(30) UNIQUE NOT NULL,
    agency_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    country VARCHAR(100) NOT NULL,
    business_type VARCHAR(100) NOT NULL,
    annual_clients VARCHAR(100),
    message TEXT,
    wholesale_rate_sent BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'Under Review',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Savannah Journal Newsletter Opt-Ins
CREATE TABLE newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    source VARCHAR(100) DEFAULT 'Footer_Savannah_Journal',
    tags TEXT[] DEFAULT ARRAY['Bush Journal', 'Great Migration Updates'],
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Quick Contact & WhatsApp Call Clicks
CREATE TABLE quick_contact_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel VARCHAR(50) NOT NULL,
    phone_number_dialed VARCHAR(50) DEFAULT '+255682801818',
    page_origin VARCHAR(255),
    user_location_hint VARCHAR(100),
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Blog Reader Helpful Upvotes & Social Shares
CREATE TABLE blog_feedbacks (
    id SERIAL PRIMARY KEY,
    article_slug VARCHAR(150) NOT NULL,
    interaction_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800 py-6 mt-8 bg-stone-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-500" />
            <span>Lion Track Safari • Arusha, Tanzania</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/api-docs" target="_blank" className="hover:text-amber-400 transition">Swagger Documentation</a>
            <span>•</span>
            <a href="/api/health" target="_blank" className="hover:text-amber-400 transition">API Health</a>
            <span>•</span>
            <a href="/api/docs.json" target="_blank" className="hover:text-amber-400 transition">OpenAPI JSON</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
