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
        <div><div style={{ fontSize:16, fontWeight:600, color:t.fg }}>Milo</div><div style={{ fontSize:10, color:t.fgFaint, marginTop:-2 }}>AI Finance Ops</div></div>
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

// ─── Workers (empty state → populated after worker creation) ─────────────────
const WorkersPage = ({ onNavigate, hasWorker }) => {
  const workers = hasWorker ? [
    { id:"hf", name:"Month-End Accruals", desc:"Budget vs actuals reconciliation + accrual journal", cat:"finance", icon:ic.bar, lastRun:"2 min ago", rate:94.2 },
    { id:"po", name:"PO Matching", desc:"Three-way matching: PO → Packing List → Invoice", cat:"finance", icon:ic.file, lastRun:"2 min ago", rate:95.0 },
    { id:"reg", name:"Regulatory Monitor", desc:"EU regulatory changes affecting packaging & labeling", cat:"compliance", icon:ic.shield, lastRun:"1 hour ago", rate:100 },
  ] : [];
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:16, borderBottom:`1px solid ${t.border}` }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:hasWorker?16:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>{ic.bot({ size:20, color:t.fgMuted })}<h1 style={{ fontSize:18, fontWeight:600, margin:0 }}>Workers</h1></div>
          <Btn onClick={()=>onNavigate("create-worker")}>{ic.plus({ size:16 })} New Worker</Btn>
        </div>
        {hasWorker && <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}>{ic.search({ size:16, color:t.fgFaint })}</div>
          <input placeholder="Search workers..." style={{ width:"100%", padding:"8px 12px 8px 36px", background:t.muted, border:"none", borderRadius:t.r, fontSize:14, fontFamily:ff.sans, color:t.fg, outline:"none", boxSizing:"border-box" }}/>
        </div>}
      </div>
      {hasWorker ? (
        <div style={{ flex:1, overflow:"auto", padding:16 }}>
          {[{k:"finance",l:"Finance"},{k:"compliance",l:"Compliance"}].map(cat => {
            const cw = workers.filter(w => w.cat===cat.k);
            if(!cw.length) return null;
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
      ) : (
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ textAlign:"center", maxWidth:480 }}>
            <div style={{ width:56, height:56, borderRadius:12, background:t.muted, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>{ic.bot({ size:28, color:t.fgFaint })}</div>
            <h2 style={{ fontSize:18, fontWeight:600, color:t.fg, margin:"0 0 6px" }}>Create your first worker</h2>
            <p style={{ fontSize:14, color:t.fgMuted, margin:"0 0 24px", lineHeight:1.5 }}>Workers automate repetitive finance tasks. Describe what you need in plain English and Milo will build it.</p>
            <Btn onClick={()=>onNavigate("create-worker")} style={{ padding:"10px 20px", fontSize:14 }}>{ic.plus({ size:16 })} New Worker</Btn>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Create Worker (Builder) ─────────────────────────────────────────────────
const CreateWorkerPage = ({ onNavigate, onWorkerCreated }) => {
  const [phase, setPhase] = useState("prompt"); // prompt | configuring | done
  const [promptText, setPromptText] = useState("");

  const samplePrompt = "Each month, reconcile our budget against general ledger actuals for HelloFresh Nordic Sweden (Entity 029 + 055), calculate accrual amounts by account and supplier, and generate a review journal for approval.";

  const templates = [
    { name:"Month-End Accruals", desc:"Budget vs actuals reconciliation + journal generation", icon:ic.bar },
    { name:"PO Matching", desc:"Three-way matching for invoices, POs, and packing lists", icon:ic.file },
    { name:"Legislation Tracker", desc:"Monitor regulatory changes across jurisdictions", icon:ic.shield },
    { name:"Spend Analytics", desc:"Categorise and analyse company spending", icon:ic.trend },
  ];

  const handleSubmit = () => {
    if(!promptText.trim()) return;
    setPhase("configuring");
    setTimeout(() => setPhase("done"), 3500);
  };

  const handleSelectTemplate = (tmpl) => {
    if(tmpl.name === "Month-End Accruals") {
      setPromptText(samplePrompt);
      setTimeout(() => {
        setPhase("configuring");
        setTimeout(() => setPhase("done"), 3500);
      }, 400);
    }
  };

  const configSteps = [
    "Understanding scope and requirements",
    "Identifying data sources and inputs",
    "Configuring calculation logic",
    "Setting up output format and review flow",
    "Finalising worker configuration",
  ];

  if(phase === "configuring" || phase === "done") {
    const doneCount = phase === "done" ? configSteps.length : 3;
    return (
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"12px 16px", borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
          <Btn variant="ghost" onClick={()=>{ setPhase("prompt"); }} style={{ padding:6 }}>{ic.arwL({ size:16 })}</Btn>
          <div>
            <div style={{ fontSize:15, fontWeight:600, color:t.fg }}>Milo Builder</div>
            <div style={{ fontSize:12, color:t.fgMuted }}>Creating: Month-End Accruals</div>
          </div>
        </div>
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ textAlign:"center", maxWidth:400 }}>
            {phase === "done" ? (
              <div style={{ width:56, height:56, borderRadius:"50%", background:t.successBg, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>{ic.checkCirc({ size:28, color:t.success })}</div>
            ) : (
              <div style={{ width:56, height:56, borderRadius:"50%", background:t.infoBg, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
                <div style={{ animation:"spin 1.5s linear infinite" }}>{ic.loader({ size:28, color:t.info })}</div>
              </div>
            )}
            <h2 style={{ fontSize:18, fontWeight:600, color:t.fg, margin:"0 0 4px" }}>{phase==="done" ? "Worker ready" : "Setting up your worker…"}</h2>
            <p style={{ fontSize:13, color:t.fgMuted, margin:"0 0 28px" }}>{phase==="done" ? "Month-End Accruals is configured and ready to run." : "Milo is analysing your requirements and configuring the worker."}</p>
            <div style={{ textAlign:"left", maxWidth:320, margin:"0 auto" }}>
              {configSteps.map((step,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", fontSize:13 }}>
                  {i < doneCount
                    ? <>{ic.checkCirc({ size:16, color:t.success })}<span style={{ color:t.fgMuted }}>{step}</span></>
                    : i === doneCount
                      ? <><div style={{ width:16, height:16, borderRadius:"50%", border:`2px solid ${t.info}`, borderTopColor:"transparent", animation:"spin 0.8s linear infinite", flexShrink:0 }}/><span style={{ color:t.fg, fontWeight:500 }}>{step}</span></>
                      : <><div style={{ width:16, height:16, borderRadius:"50%", border:`2px solid ${t.border}`, flexShrink:0 }}/><span style={{ color:t.fgFaint }}>{step}</span></>
                  }
                </div>
              ))}
            </div>
            {phase === "done" && (
              <div style={{ marginTop:28 }}>
                <Btn onClick={() => { onWorkerCreated(); onNavigate("worker-detail"); }} style={{ padding:"10px 24px", fontSize:14 }}>
                  Open Worker
                </Btn>
              </div>
            )}
          </div>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:"12px 16px", borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <Btn variant="ghost" onClick={()=>onNavigate("workers")} style={{ padding:6 }}>{ic.arwL({ size:16 })}</Btn>
        <span style={{ fontSize:15, fontWeight:600, color:t.fg }}>Milo</span>
        <span style={{ fontSize:15, color:t.fgMuted }}>Builder</span>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", overflow:"auto" }}>
        <div style={{ textAlign:"center", maxWidth:560, padding:"24px 16px", width:"100%" }}>
          <div style={{ width:56, height:56, borderRadius:12, background:t.muted, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>{ic.bot({ size:28, color:t.fgFaint })}</div>
          <h2 style={{ fontSize:20, fontWeight:600, color:t.fg, margin:"0 0 6px" }}>Create a new worker</h2>
          <p style={{ fontSize:14, color:t.fgMuted, margin:"0 0 24px" }}>Describe what you want to automate in plain English</p>

          <div style={{ position:"relative", textAlign:"left", marginBottom:24 }}>
            <textarea
              value={promptText}
              onChange={(e)=>setPromptText(e.target.value)}
              placeholder="e.g. Each month, reconcile our budget against actuals and generate an accrual journal for review..."
              rows={4}
              style={{ width:"100%", padding:"14px 48px 14px 14px", fontSize:14, fontFamily:ff.sans, border:`1px solid ${t.border}`, borderRadius:t.r+2, resize:"none", outline:"none", color:t.fg, background:t.card, lineHeight:1.5, boxSizing:"border-box" }}
            />
            <div style={{ position:"absolute", left:12, bottom:12, display:"flex", gap:6 }}>
              <button style={{ background:"none", border:"none", cursor:"pointer", padding:4, display:"flex" }}>{ic.upload({ size:16, color:t.fgFaint })}</button>
            </div>
            <button onClick={handleSubmit} style={{ position:"absolute", right:12, bottom:12, width:32, height:32, borderRadius:8, background:promptText.trim()?t.primary:t.muted, border:"none", cursor:promptText.trim()?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {ic.arwL({ size:16, color:promptText.trim()?t.primaryFg:t.fgFaint, style:{ transform:"rotate(180deg)" } })}
            </button>
          </div>

          <div style={{ fontSize:11, fontWeight:500, color:t.fgFaint, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:12 }}>Or start from a template</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {templates.map(tmpl => (
              <Card key={tmpl.name} style={{ cursor:"pointer", transition:"box-shadow 0.15s" }}>
                <button onClick={()=>handleSelectTemplate(tmpl)} style={{ display:"flex", alignItems:"flex-start", gap:10, width:"100%", textAlign:"left", padding:14, background:"none", border:"none", cursor:"pointer", fontFamily:ff.sans }}>
                  <div style={{ width:32, height:32, borderRadius:t.r, background:t.muted, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>{tmpl.icon({ size:16, color:t.fgMuted })}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:500, color:t.fg, marginBottom:2 }}>{tmpl.name}</div>
                    <div style={{ fontSize:11, color:t.fgMuted, lineHeight:1.4 }}>{tmpl.desc}</div>
                  </div>
                </button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Worker Detail with Prepare Flow ────────────────────────────────────────
const WorkerDetailPage = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState("output");
  const [prepareState, setPrepareState] = useState("idle"); // idle | uploading | processing | done
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
      {/* Header */}
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

      {/* Tabs */}
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

      {/* Content */}
      <div style={{ flex:1, overflow:"auto", padding:16 }}>

        {/* ── Prepare: Idle CTA ── */}
        {prepareState === "idle" && activeTab === "output" && (
          <Card style={{ marginBottom:16, background:`${t.infoBg}`, borderColor:t.infoBorder }}>
            <div style={{ padding:16, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                {ic.calendar({ size:20, color:t.info })}
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:t.fg }}>Ready to prepare February 2026</div>
                  <div style={{ fontSize:12, color:t.fgMuted, marginTop:2 }}>Upload data and generate the next accrual journal.</div>
                </div>
              </div>
              <Btn onClick={()=>setPrepareState("uploading")} style={{ flexShrink:0 }}>Prepare New Period</Btn>
            </div>
          </Card>
        )}

        {/* ── Prepare: Upload Step ── */}
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
                  <div key={ef.key} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:t.r, border:`1px dashed ${uploaded ? t.successBorder : t.border}`, background: uploaded ? `${t.successBg}` : t.card, marginBottom:8, transition:"all 0.2s" }}>
                    {uploaded
                      ? <div style={{ width:32, height:32, borderRadius:t.r, background:t.successBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{ic.checkCirc({ size:16, color:t.success })}</div>
                      : <div style={{ width:32, height:32, borderRadius:t.r, background:t.muted, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{ic.upload({ size:16, color:t.fgFaint })}</div>
                    }
                    <div style={{ flex:1, minWidth:0 }}>
                      {uploaded ? (
                        <>
                          <div style={{ fontSize:13, fontWeight:500, color:t.fg }}>{uploaded.name}</div>
                          <div style={{ fontSize:11, color:t.fgMuted }}>{uploaded.size} · uploaded {uploaded.time}</div>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize:13, fontWeight:500, color:t.fg }}>{ef.label}</div>
                          <div style={{ fontSize:11, color:t.fgFaint }}>{ef.hint}</div>
                        </>
                      )}
                    </div>
                    {uploaded ? (
                      <button onClick={() => setUploadedFiles(prev => prev.filter(u => u.key !== ef.key))} style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>{ic.trash({ size:14, color:t.fgFaint })}</button>
                    ) : (
                      <Btn variant="outline" onClick={() => simulateUpload(ef.key)} style={{ fontSize:12, padding:"4px 10px" }}>{ic.upload({ size:12 })} Upload</Btn>
                    )}
                  </div>
                );
              })}

              {/* Progress + action */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:16, paddingTop:12, borderTop:`1px solid ${t.borderLight}` }}>
                <div style={{ fontSize:12, color:t.fgMuted }}>
                  {uploadedFiles.length} of {expectedFiles.length} files uploaded
                  <div style={{ width:120, height:4, background:t.muted, borderRadius:2, overflow:"hidden", marginTop:6 }}>
                    <div style={{ width:`${(uploadedFiles.length/expectedFiles.length)*100}%`, height:"100%", background: allUploaded ? t.success : t.fgFaint, borderRadius:2, transition:"width 0.3s" }}/>
                  </div>
                </div>
                <Btn onClick={startPrepare} disabled={!allUploaded}>
                  Prepare Accruals
                </Btn>
              </div>
            </div>
          </Card>
        )}

        {/* ── Prepare: Processing ── */}
        {prepareState === "processing" && (
          <Card style={{ marginBottom:16, overflow:"hidden" }}>
            <div style={{ padding:24, display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center" }}>
              <div style={{ width:48, height:48, borderRadius:"50%", background:t.infoBg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
                <div style={{ animation:"spin 1.5s linear infinite" }}>{ic.loader({ size:24, color:t.info })}</div>
              </div>
              <div style={{ fontSize:15, fontWeight:600, color:t.fg, marginBottom:4 }}>Preparing February accruals…</div>
              <div style={{ fontSize:13, color:t.fgMuted, marginBottom:20, maxWidth:400 }}>Milo is matching accounts, calculating budget variance, and generating the proposed journal.</div>
              <div style={{ width:"100%", maxWidth:320 }}>
                {["Parsing uploaded files", "Matching to chart of accounts", "Calculating budget variance", "Generating journal entries"].map((step,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0", fontSize:12 }}>
                    {i < 2
                      ? <>{ic.checkCirc({ size:14, color:t.success })}<span style={{ color:t.fgMuted }}>{step}</span></>
                      : i === 2
                        ? <><div style={{ width:14, height:14, borderRadius:"50%", border:`2px solid ${t.info}`, borderTopColor:"transparent", animation:"spin 0.8s linear infinite" }}/><span style={{ color:t.fg, fontWeight:500 }}>{step}</span></>
                        : <><div style={{ width:14, height:14, borderRadius:"50%", border:`2px solid ${t.border}` }}/><span style={{ color:t.fgFaint }}>{step}</span></>
                    }
                  </div>
                ))}
              </div>
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </Card>
        )}

        {/* ── Prepare: Done ── */}
        {prepareState === "done" && (
          <Card style={{ marginBottom:16, overflow:"hidden", borderColor:t.successBorder }}>
            <div style={{ padding:20, display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ width:44, height:44, borderRadius:"50%", background:t.successBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{ic.checkCirc({ size:24, color:t.success })}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:600, color:t.fg, marginBottom:2 }}>February accruals ready for review</div>
                <div style={{ fontSize:13, color:t.fgMuted }}>18 journal lines · 872,415 SEK proposed · 1 flagged for low confidence</div>
              </div>
              <Btn onClick={() => { setPrepareState("idle"); setUploadedFiles([]); onNavigate("accruals-output"); }}>
                Open Review
              </Btn>
            </div>
          </Card>
        )}

        {/* ── Past Outputs ── */}
        {activeTab === "output" && (
          <>
            {prepareState !== "idle" && <div style={{ fontSize:11, fontWeight:500, color:t.fgFaint, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:10, marginTop:8 }}>Past periods</div>}
            {pastOutputs.map(po => (
              <Card key={po.id} style={{ marginBottom:8, cursor: po.status==="review" ? "pointer" : "default" }}>
                <button onClick={() => { if(po.status==="review") onNavigate("accruals-output"); }} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:16, background:"none", border:"none", textAlign:"left", fontFamily:ff.sans, cursor: po.status==="review" ? "pointer" : "default" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:t.r, background: po.status==="review" ? t.infoBg : t.muted, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {po.status==="review" ? ic.alert({ size:16, color:t.info }) : ic.checkCirc({ size:16, color:t.fgFaint })}
                    </div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:500, color:t.fg, marginBottom:2 }}>{po.period}</div>
                      <div style={{ fontSize:12, color:t.fgMuted }}>
                        {po.lines} lines · {fmt(po.total)} SEK
                        {po.flagged > 0 && <span style={{ color:t.warning }}> · {po.flagged} flagged</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                    <div style={{ textAlign:"right" }}>
                      <Badge variant={po.status==="review" ? "info" : "outline"}>{po.status==="review" ? "Needs review" : "Posted"}</Badge>
                      <div style={{ fontSize:11, color:t.fgFaint, marginTop:4 }}>{po.time}</div>
                    </div>
                    {po.status==="review" && ic.chevR({ size:16, color:t.fgFaint })}
                  </div>
                </button>
              </Card>
            ))}
          </>
        )}

        {activeTab === "logs" && (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:200, color:t.fgFaint, fontSize:14 }}>Execution logs</div>
        )}
        {activeTab === "config" && (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:200, color:t.fgFaint, fontSize:14 }}>Worker configuration</div>
        )}
      </div>
    </div>
  );
};

// ─── Inbox ──────────────────────────────────────────────────────────────────
const InboxPage = ({ onNavigate }) => {
  const [expandedId, setExpandedId] = useState("hf-jan");
  const items = [
    { id:"hf-jan", type:"accruals", agent:"Month-End Accruals", title:"Jan 2026 Accrual Journal — ready for review", subtitle:"HelloFresh Nordic", issue:"18 journal lines. 859,231 SEK proposed. 2 flagged for low confidence.", rec:"REVIEW", reasoning:"High-confidence run (91%). Review 2 flagged: Payroll service, Other consulting.", conf:91, time:"08:47", priority:"high" },
    { id:"reg-1", type:"regulatory", agent:"Regulatory Monitor", title:"New EU packaging regulation", subtitle:"Bloom & Wild · P1", issue:"Sustainable packaging requirements effective Q3 2026", rec:"REVIEW", reasoning:"High relevance. Recommend legal assessment within 7 days.", conf:92, time:"4h ago", priority:"high" },
    { id:"po-1", type:"invoice", agent:"PO Matching", title:"INV-4521 — Quantity mismatch", subtitle:"Baby Mori / Jellycat", issue:"Invoice 520 units vs PO 500 (+20). Previous order short by 20.", rec:"APPROVE", reasoning:"PO-2024-1798 short 20 units. Likely catch-up shipment.", conf:87, time:"1h ago", priority:"normal" },
  ];
  const rcfg = { APPROVE:{ color:t.success, bg:t.successBg, icon:ic.check }, REVIEW:{ color:t.info, bg:t.infoBg, icon:ic.alert } };
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:16, borderBottom:`1px solid ${t.border}`, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>{ic.inbox({ size:20, color:t.primary })}<h1 style={{ fontSize:18, fontWeight:600, margin:0 }}>Inbox</h1><Badge variant="secondary">{items.length} pending</Badge></div>
      </div>
      <div style={{ flex:1, overflow:"auto", padding:16 }}>
        {items.map(item => {
          const cfg = rcfg[item.rec]||rcfg.REVIEW; const isE = expandedId===item.id;
          return <Card key={item.id} style={{ marginBottom:12, borderLeft:item.priority==="high"?`3px solid ${t.warning}`:undefined, ...(isE?{boxShadow:"0 0 0 1px rgba(30,41,59,0.12)"}:{}) }}>
            <button onClick={()=>setExpandedId(isE?null:item.id)} style={{ display:"flex", alignItems:"flex-start", gap:16, width:"100%", textAlign:"left", padding:16, background:"none", border:"none", cursor:"pointer", fontFamily:ff.sans }}>
              <div style={{ marginTop:2, width:32, height:32, borderRadius:t.r, background:cfg.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{cfg.icon({ size:16, color:cfg.color })}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, color:t.fgFaint, marginBottom:4 }}>{item.agent}</div>
                <div style={{ fontSize:14, fontWeight:500, color:t.fg, marginBottom:2 }}>{item.title}</div>
                <div style={{ fontSize:13, color:t.fgMuted }}>{item.subtitle}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
                <span style={{ fontSize:12, color:t.fgFaint }}>{item.time}</span>
                <div style={{ transform:isE?"rotate(90deg)":"none", transition:"transform 0.15s", display:"flex" }}>{ic.chevR({ size:16, color:t.fgFaint })}</div>
              </div>
            </button>
            {isE && <div style={{ padding:"0 16px 16px", borderTop:`1px solid ${t.borderLight}` }}>
              <div style={{ padding:12, background:`${t.muted}cc`, borderRadius:t.r, margin:"16px 0 12px", fontSize:13 }}><span style={{ fontSize:11, color:t.fgFaint, display:"block", marginBottom:4 }}>Issue</span>{item.issue}</div>
              <div style={{ padding:12, background:cfg.bg, borderRadius:t.r, marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}><span style={{ fontSize:11, fontWeight:500, color:t.fgFaint, textTransform:"uppercase", letterSpacing:"0.05em" }}>AI Recommendation</span><Badge variant={item.rec==="APPROVE"?"success":"info"}>{item.rec}</Badge></div>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ fontSize:11, color:t.fgFaint }}>Confidence</span><div style={{ width:56, height:5, background:"rgba(255,255,255,0.6)", borderRadius:3, overflow:"hidden" }}><div style={{ width:`${item.conf}%`, height:"100%", background:t.fgFaint, borderRadius:3 }}/></div><span style={{ fontFamily:ff.mono, fontSize:11 }}>{item.conf}%</span></div>
                </div>
                <div style={{ fontSize:13, color:t.fg }}>{item.reasoning}</div>
              </div>
              <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
                <Btn variant="destructive">{ic.xCirc({ size:14 })} Reject</Btn>
                {item.type==="accruals"?<Btn onClick={()=>onNavigate("accruals-output")}>Open Accruals Review</Btn>:<Btn>{ic.check({ size:14 })} Approve</Btn>}
              </div>
            </div>}
          </Card>;
        })}
      </div>
    </div>
  );
};

// ─── Accrual Lines ──────────────────────────────────────────────────────────
const aLines = [
  { id:1, acc:"6316", nm:"Equipment rental", cc:"3499", sup:"WBG-Pooling GmbH", b:150000, a:120675, p:29325, tr:[148200,151300,149800], cf:"high", mt:"straight-line" },
  { id:2, acc:"6325", nm:"Utilities", cc:"3499", sup:"Öresundskraft", b:310000, a:249395, p:60605, tr:[298400,315200,307100], cf:"high", mt:"historical-avg" },
  { id:3, acc:"6325", nm:"Utilities", cc:"3499", sup:"AICT EUR Re PropCo AB", b:60000, a:48270, p:11730, tr:[58900,61200,59500], cf:"medium", mt:"straight-line" },
  { id:4, acc:"6330", nm:"Cleaning", cc:"3499", sup:"FHS AB", b:75000, a:60338, p:14662, tr:[74100,76200,73900], cf:"high", mt:"historical-avg" },
  { id:5, acc:"6330", nm:"Cleaning", cc:"3499", sup:"Elis Textil Service AB", b:125000, a:100563, p:24437, tr:[123800,126100,124300], cf:"high", mt:"historical-avg" },
  { id:6, acc:"6330", nm:"Cleaning", cc:"3499", sup:"Carepa AB", b:75000, a:60338, p:14662, tr:[73200,76800,74500], cf:"medium", mt:"straight-line" },
  { id:7, acc:"6335", nm:"Repairs & maint.", cc:"3499", sup:"FH support AB", b:75000, a:60338, p:14662, tr:[71400,78200,74900], cf:"medium", mt:"historical-avg" },
  { id:8, acc:"6345", nm:"Other property costs", cc:"3499", sup:"FHS AB", b:240000, a:193080, p:46920, tr:[238100,242300,239700], cf:"high", mt:"straight-line" },
  { id:9, acc:"6345", nm:"Other property costs", cc:"3499", sup:"Avarn Security", b:120000, a:96540, p:23460, tr:[118500,121200,119800], cf:"high", mt:"straight-line" },
  { id:10, acc:"6560", nm:"Vehicle leases", cc:"3499", sup:"Jungheinrich AB", b:100000, a:80450, p:19550, tr:[98700,101300,99200], cf:"high", mt:"straight-line" },
  { id:11, acc:"6540", nm:"Other G&A", cc:"8990", sup:"Various", b:113269, a:0, p:113269, tr:[82100,84200,80700], cf:"medium", mt:"budget-based" },
  { id:12, acc:"6832", nm:"Payroll service", cc:"8499", sup:"Flex Applications", b:85000, a:0, p:85000, tr:[83200,87100,84600], cf:"low", mt:"budget-based" },
  { id:13, acc:"6827", nm:"Audit fees", cc:"8599", sup:"PwC", b:77500, a:0, p:77500, tr:[75000,75000,80000], cf:"medium", mt:"budget-based" },
  { id:14, acc:"6351", nm:"Rubbish removal", cc:"3499", sup:"Stena Recycling AB", b:70000, a:56315, p:13685, tr:[69200,71100,69800], cf:"high", mt:"historical-avg" },
  { id:15, acc:"6400", nm:"Insurances", cc:"3499", sup:"FidesSecur", b:52966, a:42611, p:10355, tr:[52966,52966,52966], cf:"high", mt:"straight-line" },
  { id:16, acc:"6824", nm:"Other consulting", cc:"5999", sup:"Chris Shields", b:30000, a:0, p:30000, tr:[0,15000,15000], cf:"low", mt:"budget-based" },
  { id:17, acc:"6825", nm:"Legal fees", cc:"8699", sup:"Legal Fees", b:25000, a:0, p:25000, tr:[24200,24800,25100], cf:"high", mt:"historical-avg" },
  { id:18, acc:"6845", nm:"Minor tools", cc:"3499", sup:"Other supplier(s)", b:100000, a:80450, p:19550, tr:[95400,103200,98100], cf:"medium", mt:"historical-avg" },
];

// ─── Accruals Output ────────────────────────────────────────────────────────
const AccrualsOutput = ({ onBack }) => {
  const [exp, setExp] = useState(null);
  const [statuses, setStatuses] = useState({});
  const gs = (id) => statuses[id] || "pending";
  const ss = (id, s) => setStatuses(p => ({...p,[id]:s}));

  const fl = aLines;
  const totP = fl.reduce((s,l)=>s+l.p,0);
  const nFlag = fl.filter(l=>l.cf==="low").length;
  const nApp = Object.values(statuses).filter(s=>s==="approved").length;
  const nRej = Object.values(statuses).filter(s=>s==="rejected").length;

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:16, borderBottom:`1px solid ${t.border}`, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
          <Btn variant="ghost" onClick={onBack} style={{ padding:6 }}>{ic.arwL({ size:16 })}</Btn>
          <div>
            <h1 style={{ fontSize:16, fontWeight:600, margin:0 }}>Jan 2026 Accrual Journal</h1>
            <p style={{ fontSize:12, color:t.fgMuted, margin:0 }}>HelloFresh Nordic · Sweden (Entity 029 + 055)</p>
          </div>
        </div>
        <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
          {[
            { label:"Lines", value:fl.length },
            { label:"Proposed total", value:`${fmt(totP)} SEK`, mono:true },
            { label:"Flagged", value:nFlag, warn:nFlag>0 },
            { label:"Approved", value:`${nApp}/${fl.length}` },
            { label:"Rejected", value:nRej, err:nRej>0 },
          ].map(s=>(
            <div key={s.label} style={{ padding:"8px 14px", background:t.muted, borderRadius:t.r, minWidth:80 }}>
              <div style={{ fontSize:11, color:t.fgFaint, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:2 }}>{s.label}</div>
              <div style={{ fontSize:15, fontWeight:600, color:s.warn?t.warning:s.err?t.error:t.fg, ...(s.mono?{fontFamily:ff.mono}:{}) }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex:1, overflow:"auto", background:t.card }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead style={{ position:"sticky", top:0, zIndex:1 }}>
            <tr style={{ background:`${t.muted}cc` }}>
              {["","Account","CC","Supplier","Budget","Actuals","Proposed","Trend","Conf.",""].map((h,i)=><th key={i} style={{ textAlign:[4,5,6].includes(i)?"right":"left", fontSize:11, fontWeight:500, color:t.fgFaint, textTransform:"uppercase", letterSpacing:"0.05em", padding:"10px 12px", borderBottom:`1px solid ${t.border}`, whiteSpace:"nowrap" }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {fl.map(line => {
              const status=gs(line.id), isE=exp===line.id;
              return <React.Fragment key={line.id}>
                <tr onClick={()=>setExp(isE?null:line.id)} style={{ cursor:"pointer", background:status==="approved"?"#f0fdf480":status==="rejected"?"#fef2f280":isE?t.muted:t.card, borderBottom:`1px solid ${t.borderLight}` }}>
                  <td style={{ padding:"10px 12px", width:20 }}><div style={{ transform:isE?"rotate(90deg)":"none", transition:"transform 0.15s", display:"flex" }}>{ic.chevR({ size:12, color:t.fgFaint })}</div></td>
                  <td style={{ padding:"10px 12px" }}><div style={{ fontFamily:ff.mono, fontSize:13, fontWeight:600, color:t.fg }}>{line.acc}</div><div style={{ fontSize:11, color:t.fgMuted }}>{line.nm}</div></td>
                  <td style={{ padding:"10px 12px", fontFamily:ff.mono, fontSize:12, color:t.fgMuted }}>{line.cc}</td>
                  <td style={{ padding:"10px 12px", fontSize:13, maxWidth:170, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{line.sup}</td>
                  <td style={{ padding:"10px 12px", textAlign:"right", fontFamily:ff.mono, fontSize:13, color:t.fgMuted }}>{fmt(line.b)}</td>
                  <td style={{ padding:"10px 12px", textAlign:"right" }}><div style={{ fontFamily:ff.mono, fontSize:13 }}>{fmt(line.a)}</div><TinyBar value={line.a} max={line.b}/></td>
                  <td style={{ padding:"10px 12px", textAlign:"right", fontFamily:ff.mono, fontSize:13, fontWeight:600, color:t.info }}>{fmt(line.p)}</td>
                  <td style={{ padding:"10px 12px" }}><Spark data={line.tr} proposed={line.a+line.p}/></td>
                  <td style={{ padding:"10px 12px", textAlign:"center" }}><Badge variant={line.cf==="high"?"success":line.cf==="medium"?"warning":"error"}>{line.cf==="high"?"High":line.cf==="medium"?"Med":"Low"}</Badge></td>
                  <td style={{ padding:"10px 6px", textAlign:"right" }} onClick={e=>e.stopPropagation()}>
                    {status==="pending"?<div style={{ display:"flex", gap:4, justifyContent:"flex-end" }}>
                      <button onClick={()=>ss(line.id,"approved")} style={{ width:28, height:28, borderRadius:6, border:`1px solid ${t.border}`, background:t.card, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>{ic.check({ size:14, color:t.success })}</button>
                      <button onClick={()=>ss(line.id,"rejected")} style={{ width:28, height:28, borderRadius:6, border:`1px solid ${t.border}`, background:t.card, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>{ic.xCirc({ size:14, color:t.error })}</button>
                    </div>:<Badge variant={status==="approved"?"success":"error"}>{status==="approved"?"✓ Approved":"✕ Rejected"}</Badge>}
                  </td>
                </tr>
                {isE && <tr><td colSpan={10} style={{ padding:"0 12px 16px 44px", background:t.muted, borderBottom:`1px solid ${t.border}` }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, paddingTop:12 }}>
                    <Card style={{ padding:12, fontSize:12 }}>
                      <div style={{ fontSize:11, fontWeight:500, color:t.fgFaint, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>Budget vs Actuals</div>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ color:t.fgMuted }}>Budget</span><span style={{ fontFamily:ff.mono, fontWeight:600 }}>{fmt(line.b)}</span></div>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ color:t.fgMuted }}>Posted</span><span style={{ fontFamily:ff.mono }}>{fmt(line.a)}</span></div>
                      <div style={{ borderTop:`1px solid ${t.border}`, paddingTop:6, display:"flex", justifyContent:"space-between" }}><span style={{ fontWeight:500 }}>Open</span><span style={{ fontFamily:ff.mono, fontWeight:600, color:t.error }}>{fmt(line.b-line.a)}</span></div>
                    </Card>
                    <Card style={{ padding:12, fontSize:12 }}>
                      <div style={{ fontSize:11, fontWeight:500, color:t.fgFaint, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>3-Month Trend</div>
                      {["Oct","Nov","Dec"].map((m,i)=><div key={m} style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}><span style={{ color:t.fgMuted }}>{m}</span><span style={{ fontFamily:ff.mono }}>{fmt(line.tr[i])}</span></div>)}
                      <div style={{ borderTop:`1px solid ${t.border}`, paddingTop:6, display:"flex", justifyContent:"space-between" }}><span style={{ fontWeight:500 }}>Avg</span><span style={{ fontFamily:ff.mono, fontWeight:600 }}>{fmt(line.tr.reduce((a,b)=>a+b,0)/3)}</span></div>
                    </Card>
                    <Card style={{ padding:12, fontSize:12 }}>
                      <div style={{ fontSize:11, fontWeight:500, color:t.fgFaint, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>Calculation</div>
                      <div style={{ marginBottom:4 }}><span style={{ color:t.fgMuted }}>Method: </span>{line.mt}</div>
                      <div style={{ marginBottom:4 }}><span style={{ color:t.fgMuted }}>Proposed: </span><span style={{ fontFamily:ff.mono, fontWeight:600 }}>{fmt(line.p)} SEK</span></div>
                    </Card>
                  </div>
                </td></tr>}
              </React.Fragment>;
            })}
          </tbody>
        </table>
      </div>
      <div style={{ background:t.muted, borderTop:`1px solid ${t.border}`, padding:"8px 16px", fontSize:11, color:t.fgFaint, display:"flex", justifyContent:"space-between", flexShrink:0 }}>
        <span>Worker: <strong style={{ color:t.fgMuted }}>Month-End Accruals</strong> · Run: MILO-WKR-20260212-0847</span>
        <span style={{ color:t.fgMuted, cursor:"pointer" }}>Audit log →</span>
      </div>
    </div>
  );
};

// ─── App ────────────────────────────────────────────────────────────────────
export default function MiloPrototype() {
  const [page, setPage] = useState("workers");
  const [workerCreated, setWorkerCreated] = useState(false);
  const sk = page==="accruals-output"?"inbox":page==="worker-detail"?"workers":page==="create-worker"?"workers":page;
  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:ff.sans, color:t.fg, background:t.bg }}>
      <Sidebar activePage={sk} onNavigate={setPage}/>
      {page==="workers"&&<WorkersPage onNavigate={setPage} hasWorker={workerCreated}/>}
      {page==="create-worker"&&<CreateWorkerPage onNavigate={setPage} onWorkerCreated={()=>setWorkerCreated(true)}/>}
      {page==="worker-detail"&&<WorkerDetailPage onNavigate={setPage}/>}
      {page==="inbox"&&<InboxPage onNavigate={setPage}/>}
      {page==="accruals-output"&&<AccrualsOutput onBack={()=>setPage("worker-detail")}/>}
      {page==="activity"&&<div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:t.fgFaint }}>Activity log</div>}
      {page==="settings"&&<div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:t.fgFaint }}>Settings</div>}
    </div>
  );
}
