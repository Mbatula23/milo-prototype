import React, { useState } from "react";

/* MILO V7 — Integrated HelloFresh Accruals Flow + Prepare
 * Zero external icon deps — inline SVGs only */

const t = {
  bg: "#fafafa", card: "#ffffff", fg: "#0f172a", fgMuted: "#64748b", fgFaint: "#94a3b8",
  border: "#e2e8f0", borderLight: "#f1f5f9", muted: "#f1f5f9",
  primary: "#1e293b", primaryFg: "#f8fafc",
  success: "#22c55e", successBg: "rgba(34,197,94,0.1)", successBorder: "rgba(34,197,94,0.3)",
  warning: "#eab308", warningBg: "rgba(234,179,8,0.1)", warningBorder: "rgba(234,179,8,0.3)",
  error: "#ef4444", errorBg: "rgba(239,68,68,0.1)",
  info: "#3b82f6", infoBg: "rgba(59,130,246,0.1)", infoBorder: "rgba(59,130,246,0.3)",
  sidebar: "#f8fafc", sidebarBorder: "#e2e8f0", r: 8,
};
const ff = { sans: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', mono: 'ui-monospace,"SF Mono","Fira Mono",monospace' };

const Ic = ({ d, size = 16, color = "currentColor", style: sx }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: "inline-block", verticalAlign: "middle", ...sx }}>
    {d}
  </svg>
);

const ic = {
  bot: (p = {}) => <Ic {...p} d={<><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><line x1="12" y1="7" x2="12" y2="11"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></>}/>,
  inbox: (p = {}) => <Ic {...p} d={<><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></>}/>,
  history: (p = {}) => <Ic {...p} d={<><path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></>}/>,
  settings: (p = {}) => <Ic {...p} d={<><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2m-9-11h2m18 0h2m-3.3-6.7l-1.4 1.4M6.7 17.3l-1.4 1.4m0-13.4l1.4 1.4m10.6 10.6l1.4 1.4"/></>}/>,
  users: (p = {}) => <Ic {...p} d={<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>}/>,
  chevR: (p = {}) => <Ic {...p} d={<polyline points="9 18 15 12 9 6"/>}/>,
  chevD: (p = {}) => <Ic {...p} d={<polyline points="6 9 12 15 18 9"/>}/>,
  arwL: (p = {}) => <Ic {...p} d={<><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>}/>,
  check: (p = {}) => <Ic {...p} d={<><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>}/>,
  xCirc: (p = {}) => <Ic {...p} d={<><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>}/>,
  alert: (p = {}) => <Ic {...p} d={<><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>}/>,
  clock: (p = {}) => <Ic {...p} d={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}/>,
  play: (p = {}) => <Ic size={10} {...p} d={<polygon points="5 3 19 12 5 21 5 3"/>}/>,
  pause: (p = {}) => <Ic size={10} {...p} d={<><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>}/>,
  plus: (p = {}) => <Ic {...p} d={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>}/>,
  search: (p = {}) => <Ic {...p} d={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>}/>,
  trend: (p = {}) => <Ic {...p} d={<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>}/>,
  ext: (p = {}) => <Ic {...p} d={<><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>}/>,
  file: (p = {}) => <Ic {...p} d={<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></>}/>,
  bar: (p = {}) => <Ic {...p} d={<><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></>}/>,
  shield: (p = {}) => <Ic {...p} d={<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>}/>,
  refresh: (p = {}) => <Ic {...p} d={<><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></>}/>,
  upload: (p = {}) => <Ic {...p} d={<><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>}/>,
  checkCirc: (p = {}) => <Ic {...p} d={<><circle cx="12" cy="12" r="10"/><polyline points="9 12 12 15 16 10"/></>}/>,
  trash: (p = {}) => <Ic {...p} d={<><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></>}/>,
  loader: (p = {}) => <Ic {...p} d={<><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></>}/>,
  calendar: (p = {}) => <Ic {...p} d={<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>}/>,
};

const Badge = ({ children, variant = "outline" }) => {
  const s = { outline: { border: `1px solid ${t.border}`, color: t.fgMuted, background: "transparent" }, secondary: { background: t.muted, color: t.fgMuted, border: "none" }, success: { border: `1px solid ${t.successBorder}`, color: t.success, background: t.successBg }, warning: { border: `1px solid ${t.warningBorder}`, color: "#a16207", background: t.warningBg }, error: { border: "1px solid rgba(239,68,68,0.3)", color: t.error, background: t.errorBg }, info: { border: `1px solid ${t.infoBorder}`, color: t.info, background: t.infoBg } };
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 9999, fontSize: 11, fontWeight: 500, whiteSpace: "nowrap", lineHeight: "18px", ...s[variant] }}>{children}</span>;
};

const Btn = ({ children, variant = "default", onClick, disabled, style: sx }) => {
  const v = { default: { background: t.primary, color: t.primaryFg, border: "none" }, outline: { background: t.card, color: t.fg, border: `1px solid ${t.border}` }, ghost: { background: "transparent", color: t.fgMuted, border: "none" }, destructive: { background: t.card, color: t.error, border: `1px solid ${t.border}` } };
  return <button onClick={onClick} disabled={disabled} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", fontSize: 13, fontWeight: 500, fontFamily: ff.sans, borderRadius: t.r, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.5 : 1, ...v[variant], ...sx }}>{children}</button>;
};

const Card = ({ children, style: sx }) => <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: t.r + 2, ...sx }}>{children}</div>;
const TinyBar = ({ value, max }) => <div style={{ width: 56, height: 4, background: t.muted, borderRadius: 2, overflow: "hidden", marginTop: 3 }}><div style={{ width: `${Math.min((value/max)*100,100)}%`, height: "100%", background: t.fgFaint, borderRadius: 2 }}/></div>;
const fmt = (n) => new Intl.NumberFormat("sv-SE").format(Math.round(n));

const Spark = ({ data, proposed }) => {
  const all = [...data, proposed]; const max = Math.max(...all); const min = Math.min(...all)*0.9;
  const rng = max-min||1; const w=52, h=16;
  const pts = data.map((v,i) => `${(i/3)*w},${h-((v-min)/rng)*h}`).join(" ");
  return <svg width={w} height={h}><polyline points={pts} fill="none" stroke={t.fgFaint} strokeWidth="1.5"/><circle cx={w} cy={h-((proposed-min)/rng)*h} r="2" fill={t.info}/><line x1={(2/3)*w} y1={h-((data[2]-min)/rng)*h} x2={w} y2={h-((proposed-min)/rng)*h} stroke={t.info} strokeWidth="1.5" strokeDasharray="3,2"/></svg>;
};

// ─── Sidebar ────────────────────────────────────────────────────────────────
const Sidebar = ({ activePage, onNavigate }) => {
  const nav = [{ key:"workers", icon:ic.bot, label:"Workers" }, { key:"inbox", icon:ic.inbox, label:"Inbox", badge:3 }, { key:"activity", icon:ic.history, label:"Activity" }, { key:"settings", icon:ic.settings, label:"Settings" }];
  return (
    <div style={{ width:224, background:t.sidebar, borderRight:`1px solid ${t.sidebarBorder}`, display:"flex", flexDirection:"column", height:"100vh", flexShrink:0 }}>
      <div style={{ padding:"16px 16px 20px", display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:36, height:36, borderRadius:t.r, background:t.primary, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ color:t.primaryFg, fontSize:14, fontWeight:700 }}>M</span></div>
        <span style={{ fontSize:16, fontWeight:600, color:t.fg }}>Milo</span>
      </div>
      <nav style={{ flex:1, padding:"0 12px" }}>
        {nav.map(item => {
          const a = activePage===item.key;
          return <button key={item.key} onClick={()=>onNavigate(item.key)} style={{ display:"flex", alignItems:"center", gap:12, width:"100%", padding:"8px 12px", borderRadius:t.r, border:"none", cursor:"pointer", fontSize:14, fontWeight:500, fontFamily:ff.sans, marginBottom:1, background:a?"rgba(30,41,59,0.08)":"transparent", color:a?t.primary:t.fgMuted }}>
            {item.icon({ size:20, color:a?t.primary:t.fgMuted })}<span>{item.label}</span>
            {item.badge && <span style={{ marginLeft:"auto", background:"#fef3c7", color:"#92400e", fontSize:11, fontWeight:500, padding:"1px 7px", borderRadius:10 }}>{item.badge}</span>}
          </button>;
        })}
        <div style={{ marginTop:32, paddingLeft:12, marginBottom:8 }}><span style={{ fontSize:11, fontWeight:500, color:t.fgFaint, textTransform:"uppercase", letterSpacing:"0.05em" }}>Team</span></div>
        <button style={{ display:"flex", alignItems:"center", gap:12, width:"100%", padding:"8px 12px", borderRadius:t.r, border:"none", cursor:"pointer", fontSize:14, fontWeight:500, fontFamily:ff.sans, background:"transparent", color:t.fgMuted }}>{ic.users({ size:20, color:t.fgMuted })}<span>Members</span></button>
      </nav>
      <div style={{ padding:12, borderTop:`1px solid ${t.borderLight}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", borderRadius:t.r }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:"#dbeafe", display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ color:"#2563eb", fontSize:11, fontWeight:600 }}>MS</span></div>
          <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:500, color:t.fg }}>Michael Saunders</div><div style={{ fontSize:11, color:t.fgFaint }}>Finance Ops</div></div>
          {ic.chevD({ size:14, color:t.fgFaint })}
        </div>
      </div>
    </div>
  );
};

// ─── Workers ────────────────────────────────────────────────────────────────
const WorkersPage = ({ onNavigate }) => {
  const workers = [
    { id:"hf", name:"Month-End Accruals", desc:"Budget vs actuals reconciliation + accrual journal", cat:"finance", icon:ic.bar, lastRun:"2 min ago", rate:94.2 },
    { id:"po", name:"PO Matching", desc:"Three-way matching: PO → Packing List → Invoice", cat:"finance", icon:ic.file, lastRun:"2 min ago", rate:95.0 },
    { id:"reg", name:"Regulatory Monitor", desc:"EU regulatory changes affecting packaging & labeling", cat:"compliance", icon:ic.shield, lastRun:"1 hour ago", rate:100 },
  ];
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:16, borderBottom:`1px solid ${t.border}` }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>{ic.bot({ size:20, color:t.fgMuted })}<h1 style={{ fontSize:18, fontWeight:600, margin:0 }}>Workers</h1></div>
          <Btn>{ic.plus({ size:16 })} New Worker</Btn>
        </div>
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}>{ic.search({ size:16, color:t.fgFaint })}</div>
          <input placeholder="Search workers..." style={{ width:"100%", padding:"8px 12px 8px 36px", background:t.muted, border:"none", borderRadius:t.r, fontSize:14, fontFamily:ff.sans, color:t.fg, outline:"none", boxSizing:"border-box" }}/>
        </div>
      </div>
      <div style={{ flex:1, overflow:"auto", padding:16 }}>
        {[{k:"finance",l:"Finance"},{k:"compliance",l:"Compliance"}].map(cat => {
          const cw = workers.filter(w => w.cat===cat.k);
          return <div key={cat.k} style={{ marginBottom:24 }}>
            <div style={{ fontSize:11, fontWeight:500, color:t.fgFaint, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:10, paddingLeft:4 }}>{cat.l} ({cw.length})</div>
            {cw.map(w => <Card key={w.id} style={{ marginBottom:8, cursor:w.id==="hf"?"pointer":"default" }}>
              <button onClick={()=>{if(w.id==="hf")onNavigate("worker-detail")}} style={{ display:"flex", alignItems:"flex-start", gap:12, width:"100%", textAlign:"left", padding:16, background:"none", border:"none", cursor:"inherit", fontFamily:ff.sans }}>
                <div style={{ width:40, height:40, borderRadius:t.r, background:t.muted, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{w.icon({ size:20, color:t.fgMuted })}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}><span style={{ fontSize:14, fontWeight:500, color:t.fg }}>{w.name}</span><Badge variant="success">{ic.play({})} Active</Badge></div>
                  <p style={{ fontSize:12, color:t.fgMuted, margin:0 }}>{w.desc}</p>
                  <div style={{ display:"flex", gap:12, marginTop:8, fontSize:12, color:t.fgFaint }}><span style={{ display:"flex", alignItems:"center", gap:4 }}>{ic.clock({ size:12, color:t.fgFaint })} {w.lastRun}</span><span style={{ display:"flex", alignItems:"center", gap:4 }}>{ic.trend({ size:12, color:t.fgFaint })} {w.rate}%</span></div>
                </div>
              </button>
            </Card>)}
          </div>;
        })}
      </div>
    </div>
  );
};

// ─── Worker Detail with Prepare Flow ────────────────────────────────────────
const WorkerDetailPage = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState("output");
  const [prepareState, setPrepareState] = useState("idle");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const expectedFiles = [
    { key: "budget", label: "Budget file", hint: "FY 2026 budget by account + cost centre", example: "Budget_2026.xlsx" },
    { key: "ledger1", label: "General ledger — Entity 029", hint: "Jan 2026 posted transactions", example: "GL_029_Jan2026.xlsx" },
    { key: "ledger2", label: "General ledger — Entity 055", hint: "Jan 2026 posted transactions", example: "GL_055_Jan2026.xlsx" },
  ];

  const simulateUpload = (fileKey) => {
    const names = { budget: "Budget_2026.xlsx", ledger1: "GL_029_Feb2026.xlsx", ledger2: "GL_055_Feb2026.xlsx" };
    setUploadedFiles(prev => [...prev, { key: fileKey, name: names[fileKey], size: Math.floor(Math.random()*800+200)+"KB", time: "just now" }]);
  };

  const startPrepare = () => {
    setPrepareState("processing");
    setTimeout(() => setPrepareState("done"), 3000);
  };

  const allUploaded = expectedFiles.every(f => uploadedFiles.find(u => u.key === f.key));

  const pastOutputs = [
    { id: "jan-26", period: "January 2026", status: "review", lines: 18, total: 859231, flagged: 2, time: "Today 08:47" },
    { id: "dec-25", period: "December 2025", status: "posted", lines: 17, total: 812450, flagged: 0, time: "Jan 3, 2026" },
    { id: "nov-25", period: "November 2025", status: "posted", lines: 18, total: 841100, flagged: 1, time: "Dec 2, 2025" },
  ];

  const tabs = [
    { key: "output", label: "Output", count: pastOutputs.length },
    { key: "logs", label: "Logs" },
    { key: "config", label: "Config" },
  ];

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:16, borderBottom:`1px solid ${t.border}`, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:12 }}>
          <Btn variant="ghost" onClick={()=>onNavigate("workers")} style={{ padding:6 }}>{ic.arwL({ size:16 })}</Btn>
          <div style={{ width:40, height:40, borderRadius:t.r, background:t.muted, display:"flex", alignItems:"center", justifyContent:"center" }}>{ic.bar({ size:20, color:t.fgMuted })}</div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}><h1 style={{ fontSize:18, fontWeight:600, margin:0 }}>Month-End Accruals</h1><Badge variant="success">{ic.play({})} Active</Badge></div>
            <p style={{ fontSize:13, color:t.fgMuted, margin:0 }}>HelloFresh Nordic · Sweden (Entity 029 + 055)</p>
          </div>
          {prepareState === "idle" && (
            <Btn onClick={() => setPrepareState("uploading")}>{ic.plus({ size:14 })} Prepare February</Btn>
          )}
        </div>
        <div style={{ display:"flex", gap:24, fontSize:13 }}>
          <span><span style={{ color:t.fgMuted }}>Data source: </span>Manual upload</span>
          <span><span style={{ color:t.fgMuted }}>Last prepared: </span>Today 08:47</span>
          <span><span style={{ color:t.fgMuted }}>Schedule: </span>1st business day</span>
        </div>
      </div>

      <div style={{ padding:"0 16px", borderBottom:`1px solid ${t.border}`, flexShrink:0, display:"flex", gap:16 }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding:"12px 0", fontSize:14, fontWeight:isActive?500:400, color:isActive?t.primary:t.fgMuted, borderBottom:`2px solid ${isActive?t.primary:"transparent"}`, background:"none", border:"none", borderBottomStyle:"solid", borderBottomWidth:2, borderBottomColor:isActive?t.primary:"transparent", cursor:"pointer", fontFamily:ff.sans }}>
              {tab.label}
              {tab.count != null && <span style={{ marginLeft:6, fontSize:11, padding:"1px 6px", borderRadius:4, background:t.muted, color:t.fgMuted }}>{tab.count}</span>}
            </button>
          );
        })}
      </div>

      <div style={{ flex:1, overflow:"auto", padding:16 }}>

        {prepareState === "uploading" && (
          <Card style={{ marginBottom:16, overflow:"hidden" }}>
            <div style={{ padding:"16px 16px 12px", borderBottom:`1px solid ${t.borderLight}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                {ic.calendar({ size:18, color:t.primary })}
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:t.fg }}>Prepare February 2026 Accruals</div>
                  <div style={{ fontSize:12, color:t.fgMuted, marginTop:2 }}>Upload this period's data. Milo will match accounts, calculate accruals, and generate the journal.</div>
                </div>
              </div>
              <Btn variant="ghost" onClick={() => { setPrepareState("idle"); setUploadedFiles([]); }} style={{ padding:6, color:t.fgFaint }}>{ic.xCirc({ size:16 })}</Btn>
            </div>

            <div style={{ padding:16 }}>
              <div style={{ fontSize:11, fontWeight:500, color:t.fgFaint, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:12 }}>Required files</div>

              {expectedFiles.map(ef => {
                const uploaded = uploadedFiles.find(u => u.key === ef.key);
                return (
                  <div key={ef.key} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:t.r, border:`1px dashed ${uploaded ?