import React from 'react'
import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────
const C = {
  ink: "#0A0A0F",
  inkSoft: "#1C1C28",
  inkMid: "#2E2E42",
  slate: "#64647A",
  muted: "#9898AA",
  border: "#E8E8F0",
  borderSoft: "#F2F2F8",
  cream: "#FAFAF7",
  white: "#FFFFFF",
  green: "#00C57A",
  greenDark: "#009960",
  greenPale: "#E6FBF3",
  greenSoft: "#CCFAE6",
  amber: "#F59E0B",
  red: "#EF4444",
  blue: "#3B82F6",
  bluePale: "#EFF6FF",
};

const FONT = {
  display: "'Cormorant Garamond', 'Georgia', serif",
  body: "'Outfit', 'DM Sans', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
};

// ─── DATA ────────────────────────────────────────────────────────
const SERVICES = [
  { id: "cleaning", label: "Cleaning", icon: "✦", tagline: "Home & office", from: 18 },
  { id: "plumbing", label: "Plumbing", icon: "◈", tagline: "Leaks & boilers", from: 55 },
  { id: "handyman", label: "Handyman", icon: "◉", tagline: "Repairs & installs", from: 30 },
  { id: "electrical", label: "Electrical", icon: "⚡", tagline: "Wiring & faults", from: 60 },
  { id: "gardening", label: "Gardening", icon: "❋", tagline: "Lawn & pruning", from: 25 },
  { id: "painting", label: "Painting", icon: "◐", tagline: "Interior & exterior", from: 28 },
];

const WORKERS = [
  { id: 1, name: "Marcus T.", initials: "MT", service: "cleaning", rating: 4.9, jobs: 312, price: 18, eta: "Now", badge: "Top Rated", verified: true, bio: "10 years experience. Eco-friendly products only.", city: "Sheffield", phone: "07700900001" },
  { id: 2, name: "Priya S.", initials: "PS", service: "plumbing", rating: 4.8, jobs: 187, price: 55, eta: "2 hrs", badge: "ID Verified", verified: true, bio: "Gas Safe registered. Boilers & emergency callouts.", city: "Sheffield", phone: "07700900002" },
  { id: 3, name: "Danny R.", initials: "DR", service: "handyman", rating: 4.7, jobs: 94, price: 35, eta: "Now", badge: "Fast Response", verified: true, bio: "Flatpack, shelving, general repairs. No job too small.", city: "Sheffield", phone: "07700900003" },
  { id: 4, name: "Aisha K.", initials: "AK", service: "cleaning", rating: 5.0, jobs: 421, price: 20, eta: "Now", badge: "⭐ Elite", verified: true, bio: "5-star rated. Deep cleans, end-of-tenancy specialist.", city: "Sheffield", phone: "07700900004" },
  { id: 5, name: "Tom B.", initials: "TB", service: "electrical", rating: 4.9, jobs: 256, price: 65, eta: "3 hrs", badge: "ID Verified", verified: true, bio: "NICEIC certified. Fuse boards, rewires, EV chargers.", city: "Sheffield", phone: "07700900005" },
  { id: 6, name: "Zoe L.", initials: "ZL", service: "painting", rating: 4.8, jobs: 143, price: 28, eta: "Tomorrow", badge: "Reliable", verified: true, bio: "Interior painting specialist. Clean, tidy, precise.", city: "Sheffield", phone: "07700900006" },
  { id: 7, name: "Sam O.", initials: "SO", service: "gardening", rating: 4.6, jobs: 78, price: 25, eta: "Now", badge: "New Star", verified: true, bio: "Lawn care, hedge trimming, garden clearances.", city: "Sheffield", phone: "07700900007" },
];

const INITIAL_BOOKINGS = [
  { id: "TL-001", customer: "James P.", service: "Plumbing", worker: "Priya S.", status: "active", time: "Today 2pm", address: "14 Broomhill Rd, Sheffield", value: 120, created: "10:32am" },
  { id: "TL-002", customer: "Sarah M.", service: "Cleaning", worker: "Aisha K.", status: "completed", time: "Today 10am", address: "3 Ecclesall Rd, Sheffield", value: 80, created: "09:15am" },
  { id: "TL-003", customer: "Rachel H.", service: "Handyman", worker: null, status: "pending", time: "Tomorrow 9am", address: "7 Abbeydale Rd, Sheffield", value: 70, created: "11:45am" },
  { id: "TL-004", customer: "David W.", service: "Electrical", worker: "Tom B.", status: "active", time: "Today 4pm", address: "22 London Rd, Sheffield", value: 150, created: "08:50am" },
  { id: "TL-005", customer: "Emma T.", service: "Gardening", worker: null, status: "pending", time: "Thu 11am", address: "9 Fulwood Rd, Sheffield", value: 60, created: "12:10pm" },
];

const REVIEWS = [
  { name: "James P.", stars: 5, text: "Booked a plumber in 4 minutes. She was brilliant. Completely stress-free.", service: "Plumbing" },
  { name: "Sarah M.", stars: 5, text: "Finally a service where I actually trust who's coming into my home.", service: "Cleaning" },
  { name: "Rachel H.", stars: 5, text: "Danny fixed everything in under an hour. Will use every time.", service: "Handyman" },
];

const JOB_STAGES = [
  { label: "Booking Confirmed", done: true, time: "10:32am" },
  { label: "Worker Notified", done: true, time: "10:33am" },
  { label: "Worker En Route", done: true, time: "1:45pm" },
  { label: "Job In Progress", done: false, time: "--" },
  { label: "Job Complete", done: false, time: "--" },
];

// ─── GLOBAL STYLES ───────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 16px; }
  body { font-family: ${FONT.body}; background: ${C.cream}; color: ${C.ink}; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
  button { font-family: ${FONT.body}; cursor: pointer; }
  input, textarea, select { font-family: ${FONT.body}; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes slideUp { from { transform:translateY(100%); opacity:0; } to { transform:translateY(0); opacity:1; } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
  @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  @keyframes ripple { 0% { transform:scale(0.8); opacity:1; } 100% { transform:scale(2); opacity:0; } }

  .fadeUp { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
  .d1 { animation-delay: 0.05s; }
  .d2 { animation-delay: 0.1s; }
  .d3 { animation-delay: 0.15s; }
  .d4 { animation-delay: 0.2s; }
  .d5 { animation-delay: 0.25s; }
  .d6 { animation-delay: 0.3s; }
  .d7 { animation-delay: 0.35s; }

  .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.1); }

  .nav-btn { transition: all 0.15s; }
  .nav-btn:hover { background: ${C.borderSoft}; }
  .nav-btn:active { transform: scale(0.96); }

  .pill-tab { transition: all 0.2s; }
  .pill-tab:hover { background: ${C.borderSoft}; }
`;

// ─── SHARED COMPONENTS ───────────────────────────────────────────

function Avatar({ initials, size = 44, color = C.ink }) {
  const colors = { MT: "#2E7D32", PS: "#1565C0", DR: "#B45309", AK: "#7C3AED", TB: "#0369A1", ZL: "#BE185D", SO: "#15803D" };
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: colors[initials] || color,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, fontSize: size * 0.35,
      fontFamily: FONT.display, letterSpacing: "0.5px", flexShrink: 0
    }}>{initials}</div>
  );
}

function Badge({ text, variant = "default" }) {
  const styles = {
    default: { bg: C.ink, color: "#fff" },
    green: { bg: C.greenPale, color: C.greenDark },
    amber: { bg: "#FFFBEB", color: "#92400E" },
    red: { bg: "#FEF2F2", color: "#991B1B" },
    blue: { bg: C.bluePale, color: "#1D4ED8" },
  };
  const s = styles[variant] || styles.default;
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: 10, fontWeight: 700, letterSpacing: "1.2px",
      padding: "3px 9px", borderRadius: 4,
      textTransform: "uppercase", fontFamily: FONT.mono,
      whiteSpace: "nowrap"
    }}>{text}</span>
  );
}

function Stars({ rating }) {
  return (
    <span style={{ color: C.amber, fontSize: 12, letterSpacing: 1 }}>
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
    </span>
  );
}

function Btn({ children, onClick, variant = "primary", style: sx = {}, disabled }) {
  const base = {
    border: "none", borderRadius: 10, fontWeight: 600,
    fontSize: 14, padding: "13px 22px", transition: "all 0.18s",
    cursor: disabled ? "not-allowed" : "pointer", letterSpacing: "0.2px",
    opacity: disabled ? 0.5 : 1,
  };
  const variants = {
    primary: { background: C.ink, color: "#fff" },
    green: { background: C.green, color: "#fff" },
    outline: { background: "transparent", color: C.ink, border: `1.5px solid ${C.border}` },
    ghost: { background: "transparent", color: C.slate, padding: "10px 16px" },
    danger: { background: "#FEF2F2", color: C.red, border: `1.5px solid #FECACA` },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...sx }}>{children}</button>
  );
}

function Input({ label, placeholder, value, onChange, type = "text", rows }) {
  const shared = {
    width: "100%", padding: "12px 14px",
    border: `1.5px solid ${C.border}`, borderRadius: 10,
    fontSize: 14, color: C.ink, background: C.white,
    outline: "none", transition: "border 0.15s",
    fontFamily: FONT.body,
  };
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: C.slate, display: "block", marginBottom: 7, textTransform: "uppercase", fontFamily: FONT.mono }}>{label}</label>}
      {rows
        ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{ ...shared, resize: "vertical" }} />
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={shared} />
      }
    </div>
  );
}

// ─── TOP NAV ─────────────────────────────────────────────────────
function TopNav({ screen, setScreen, adminMode, setAdminMode }) {
  return (
    <div style={{
      background: C.ink, padding: "0 20px",
      position: "sticky", top: 0, zIndex: 200,
      boxShadow: "0 2px 20px rgba(0,0,0,0.15)"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <span style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>
            Trust<span style={{ color: C.green }}>Local</span>
          </span>
        </button>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {[
            { id: "home", label: "Home" },
            { id: "book", label: "Book" },
            { id: "track", label: "Track" },
            { id: "join", label: "Join Us" },
          ].map(n => (
            <button key={n.id} onClick={() => { setScreen(n.id); setAdminMode(false); }}
              className="nav-btn"
              style={{
                background: screen === n.id ? "rgba(255,255,255,0.12)" : "transparent",
                border: "none", color: screen === n.id ? "#fff" : "rgba(255,255,255,0.5)",
                padding: "6px 12px", borderRadius: 7, fontSize: 13, fontWeight: 600,
                transition: "all 0.15s"
              }}>{n.label}</button>
          ))}
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)", margin: "0 4px" }} />
          <button onClick={() => { setScreen("admin"); setAdminMode(true); }}
            className="nav-btn"
            style={{
              background: adminMode ? C.green : "rgba(0,197,122,0.15)",
              border: "none", color: adminMode ? "#fff" : C.green,
              padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 700,
              letterSpacing: "0.5px", transition: "all 0.15s"
            }}>⚙ Admin</button>
        </div>
      </div>
    </div>
  );
}

// ─── BOTTOM NAV (mobile feel) ────────────────────────────────────
function BottomNav({ screen, setScreen }) {
  const tabs = [
    { id: "home", icon: "⌂", label: "Home" },
    { id: "book", icon: "＋", label: "Book" },
    { id: "track", icon: "◎", label: "Track" },
    { id: "join", icon: "◉", label: "Join" },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 480,
      background: C.white, borderTop: `1px solid ${C.border}`,
      display: "flex", zIndex: 150,
      boxShadow: "0 -4px 20px rgba(0,0,0,0.06)"
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setScreen(t.id)} style={{
          flex: 1, padding: "10px 4px 12px", border: "none",
          background: "transparent", display: "flex", flexDirection: "column",
          alignItems: "center", gap: 3,
          color: screen === t.id ? C.ink : C.muted, transition: "color 0.15s"
        }}>
          <span style={{ fontSize: t.id === "book" ? 22 : 18, lineHeight: 1, fontWeight: screen === t.id ? 700 : 400 }}>{t.icon}</span>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", fontFamily: FONT.mono }}>{t.label}</span>
          {screen === t.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.green, marginTop: 1 }} />}
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCREEN 1 — HOME / LANDING
// ═══════════════════════════════════════════════════════════════════
function HomeScreen({ setScreen }) {
  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(160deg, ${C.ink} 0%, ${C.inkMid} 100%)`,
        padding: "48px 24px 52px", position: "relative", overflow: "hidden"
      }}>
        {/* Background decoration */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(0,197,122,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(0,197,122,0.05)", pointerEvents: "none" }} />

        <div className="fadeUp" style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, animation: "pulse 2s infinite" }} />
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: FONT.mono, letterSpacing: "1.5px", fontWeight: 500 }}>SHEFFIELD · LIVE NOW</span>
        </div>

        <h1 className="fadeUp d1" style={{
          fontFamily: FONT.display, fontSize: 44, fontWeight: 700,
          color: "#fff", lineHeight: 1.1, marginBottom: 16, letterSpacing: "-0.5px"
        }}>
          Trusted help,<br /><span style={{ color: C.green, fontStyle: "italic" }}>today.</span>
        </h1>

        <p className="fadeUp d2" style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 1.7, marginBottom: 28, maxWidth: 320 }}>
          Verified cleaners, plumbers & handymen in Sheffield — booked in minutes, paid when done.
        </p>

        <div className="fadeUp d3" style={{ display: "flex", gap: 10 }}>
          <Btn onClick={() => setScreen("book")} variant="green" style={{ fontSize: 15, padding: "14px 28px", borderRadius: 12, fontWeight: 700 }}>
            Book Now →
          </Btn>
          <Btn onClick={() => setScreen("join")} variant="outline" style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", borderRadius: 12 }}>
            Join as Worker
          </Btn>
        </div>
      </div>

      {/* Trust strip */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "12px 20px", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 12, minWidth: "max-content" }}>
          {[["✓ ID Verified Workers", C.greenPale, C.greenDark], ["⭐ 4.9 Avg Rating", "#FFFBEB", "#92400E"], ["🔒 Secure Escrow Pay", C.bluePale, "#1D4ED8"], ["⚡ Same-Day Available", "#FEF3C7", "#92400E"]].map(([t, bg, col]) => (
            <div key={t} style={{ background: bg, color: col, padding: "7px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: "0.3px", whiteSpace: "nowrap" }}>{t}</div>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 20px" }}>
        {/* Services grid */}
        <h2 className="fadeUp" style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, color: C.ink, marginBottom: 4 }}>
          What do you need?
        </h2>
        <p className="fadeUp d1" style={{ color: C.slate, fontSize: 13, marginBottom: 18 }}>All workers verified, insured & reviewed</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 32 }}>
          {SERVICES.map((s, i) => (
            <div key={s.id} className={`fadeUp hover-lift d${Math.min(i + 1, 7)}`}
              onClick={() => setScreen("book")}
              style={{
                background: C.white, border: `1.5px solid ${C.border}`,
                borderRadius: 14, padding: "18px 16px", cursor: "pointer",
                transition: "all 0.2s"
              }}>
              <div style={{ fontSize: 26, marginBottom: 10, color: C.ink }}>{s.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.ink, marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: C.slate, marginBottom: 8 }}>{s.tagline}</div>
              <div style={{ fontFamily: FONT.mono, fontSize: 12, color: C.green, fontWeight: 700 }}>From £{s.from}/hr</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div style={{ background: C.inkSoft, borderRadius: 16, padding: "24px 20px", marginBottom: 28 }}>
          <h3 style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 20 }}>How it works</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              ["01", "Choose your service", "Pick from cleaning, plumbing, handyman & more"],
              ["02", "Pick your worker", "Browse verified profiles, ratings & live availability"],
              ["03", "Book & pay securely", "Payment held until the job is done perfectly"],
            ].map(([n, t, d]) => (
              <div key={n} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ fontFamily: FONT.mono, fontSize: 11, fontWeight: 700, color: C.green, width: 24, flexShrink: 0, paddingTop: 2 }}>{n}</div>
                <div>
                  <div style={{ fontWeight: 600, color: "#fff", fontSize: 14, marginBottom: 3 }}>{t}</div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, lineHeight: 1.5 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <h2 style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, color: C.ink, marginBottom: 16 }}>What customers say</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {REVIEWS.map((r, i) => (
            <div key={i} style={{ background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, color: C.ink, fontSize: 14 }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: C.muted, fontFamily: FONT.mono }}>{r.service}</div>
                </div>
                <Stars rating={r.stars} />
              </div>
              <p style={{ color: C.slate, fontSize: 13, lineHeight: 1.65, fontStyle: "italic" }}>"{r.text}"</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`, borderRadius: 16, padding: "28px 24px", marginTop: 28, textAlign: "center" }}>
          <h3 style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Ready to book?</h3>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginBottom: 20 }}>Join 2,000+ Sheffield residents who trust TrustLocal</p>
          <Btn onClick={() => setScreen("book")} style={{ background: "#fff", color: C.greenDark, fontWeight: 700, padding: "14px 32px", borderRadius: 12, fontSize: 15 }}>
            Book a Service →
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCREEN 2 — BOOKING FLOW
// ═══════════════════════════════════════════════════════════════════
function BookingScreen({ onBooked }) {
  const [step, setStep] = useState(0);
  const [service, setService] = useState(null);
  const [worker, setWorker] = useState(null);
  const [form, setForm] = useState({ date: "today", time: "ASAP", hours: 2, address: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const workers = service ? WORKERS.filter(w => w.service === service.id) : [];
  const subtotal = worker ? worker.price * form.hours : 0;
  const fee = Math.round(subtotal * 0.1);
  const total = subtotal + fee;
  const fee = 0;
  const stepLabels = ["Service", "Worker", "Details"];

  const handleConfirm = () => {
    setSubmitting(true);
    setTimeout(() => {
      onBooked({ worker, service, ...form, total, id: `TL-00${Math.floor(Math.random() * 900 + 100)}` });
    }, 1200);
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Progress header */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: 0 }}>
          {stepLabels.map((l, i) => (
            <div key={l} style={{ flex: 1 }}>
              <div style={{ height: 3, background: i <= step ? C.ink : C.border, transition: "background 0.3s", borderRadius: 2 }} />
              <div style={{
                fontSize: 10, fontFamily: FONT.mono, fontWeight: 700, letterSpacing: "1px",
                color: i === step ? C.ink : C.muted, padding: "6px 0 2px",
                textTransform: "uppercase", textAlign: "center"
              }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>

        {/* STEP 0 — Pick Service */}
        {step === 0 && (
          <div className="fadeUp">
            <h2 style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 700, color: C.ink, marginBottom: 6 }}>What do you need?</h2>
            <p style={{ color: C.slate, fontSize: 13, marginBottom: 20 }}>Select a service to see available workers near you</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {SERVICES.map(s => (
                <div key={s.id} className="hover-lift"
                  onClick={() => { setService(s); setStep(1); }}
                  style={{
                    background: service?.id === s.id ? C.ink : C.white,
                    border: `1.5px solid ${service?.id === s.id ? C.ink : C.border}`,
                    borderRadius: 14, padding: "20px 16px", cursor: "pointer", transition: "all 0.2s"
                  }}>
                  <div style={{ fontSize: 28, marginBottom: 10, color: service?.id === s.id ? C.green : C.ink }}>{s.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: service?.id === s.id ? "#fff" : C.ink, marginBottom: 3 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: service?.id === s.id ? "rgba(255,255,255,0.5)" : C.muted }}>{s.tagline}</div>
                  <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.green, fontWeight: 700, marginTop: 8 }}>From £{s.from}/hr</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1 — Pick Worker */}
        {step === 1 && (
          <div className="fadeUp">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <button onClick={() => setStep(0)} style={{ background: C.borderSoft, border: "none", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: C.slate, fontWeight: 600, cursor: "pointer" }}>← Back</button>
              <div>
                <h2 style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 700, color: C.ink }}>{service?.label} Workers</h2>
                <p style={{ fontSize: 12, color: C.muted, fontFamily: FONT.mono }}>{workers.length} available in Sheffield</p>
              </div>
            </div>

            <div style={{ background: C.greenPale, border: `1px solid ${C.greenSoft}`, borderRadius: 12, padding: "12px 16px", marginBottom: 18, display: "flex", gap: 10 }}>
              <span>🔒</span>
              <p style={{ fontSize: 12, color: C.greenDark, lineHeight: 1.5 }}><strong>Payment held in escrow</strong> until you mark the job complete.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {workers.map(w => (
                <div key={w.id} className="hover-lift"
                  onClick={() => { setWorker(w); setStep(2); }}
                  style={{
                    background: C.white, border: `1.5px solid ${C.border}`,
                    borderRadius: 14, padding: "18px", cursor: "pointer", transition: "all 0.2s"
                  }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <Avatar initials={w.initials} size={50} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: C.ink }}>{w.name}</span>
                        {w.verified && <span style={{ fontSize: 14, color: C.green }}>✓</span>}
                      </div>
                      <div style={{ marginBottom: 6 }}><Badge text={w.badge} /></div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <Stars rating={w.rating} />
                        <span style={{ fontSize: 11, color: C.muted, fontFamily: FONT.mono }}>{w.rating} · {w.jobs} jobs</span>
                      </div>
                      <p style={{ fontSize: 12, color: C.slate, marginTop: 6, lineHeight: 1.5 }}>{w.bio}</p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 18, color: C.ink }}>£{w.price}<span style={{ fontSize: 11, fontWeight: 400, color: C.muted }}>/hr</span></div>
                      <div style={{ fontSize: 10, color: C.green, fontWeight: 700, marginTop: 4, fontFamily: FONT.mono }}>{w.eta === "Now" ? "● Available now" : `● In ${w.eta}`}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — Details & Pay */}
        {step === 2 && (
          <div className="fadeUp">
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
              <button onClick={() => setStep(1)} style={{ background: C.borderSoft, border: "none", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: C.slate, fontWeight: 600, cursor: "pointer" }}>← Back</button>
              <div>
                <h2 style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 700, color: C.ink }}>Booking Details</h2>
                <p style={{ fontSize: 12, color: C.muted }}>With {worker?.name}</p>
              </div>
            </div>

            {/* Worker summary card */}
            <div style={{ background: C.ink, borderRadius: 14, padding: "16px", marginBottom: 20, display: "flex", gap: 14, alignItems: "center" }}>
              <Avatar initials={worker?.initials} size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>{worker?.name}</div>
                <Stars rating={worker?.rating} />
              </div>
              <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 16, color: C.green }}>£{worker?.price}/hr</div>
            </div>

            {/* Date */}
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: C.slate, display: "block", marginBottom: 8, textTransform: "uppercase", fontFamily: FONT.mono }}>When?</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {["today", "tomorrow", "this week"].map(d => (
                <button key={d} onClick={() => setForm(f => ({ ...f, date: d }))} style={{
                  flex: 1, padding: "10px 6px", border: `1.5px solid ${form.date === d ? C.ink : C.border}`,
                  borderRadius: 10, background: form.date === d ? C.ink : C.white,
                  color: form.date === d ? "#fff" : C.ink, fontWeight: 600, fontSize: 12,
                  cursor: "pointer", textTransform: "capitalize", transition: "all 0.15s"
                }}>{d}</button>
              ))}
            </div>

            {/* Time */}
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: C.slate, display: "block", marginBottom: 8, textTransform: "uppercase", fontFamily: FONT.mono }}>Time Slot</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {["ASAP", "Morning", "Afternoon", "Evening"].map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, time: t }))} style={{
                  flex: 1, padding: "10px 4px", border: `1.5px solid ${form.time === t ? C.ink : C.border}`,
                  borderRadius: 10, background: form.time === t ? C.ink : C.white,
                  color: form.time === t ? "#fff" : C.ink, fontWeight: 600, fontSize: 11,
                  cursor: "pointer", transition: "all 0.15s"
                }}>{t}</button>
              ))}
            </div>

            {/* Hours */}
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: C.slate, display: "block", marginBottom: 8, textTransform: "uppercase", fontFamily: FONT.mono }}>Hours needed</label>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <button onClick={() => setForm(f => ({ ...f, hours: Math.max(1, f.hours - 1) }))}
                style={{ width: 38, height: 38, border: `1.5px solid ${C.border}`, borderRadius: "50%", background: C.white, fontSize: 20, fontWeight: 700, color: C.ink, cursor: "pointer" }}>−</button>
              <span style={{ fontFamily: FONT.mono, fontSize: 24, fontWeight: 700, minWidth: 48, textAlign: "center" }}>{form.hours}h</span>
              <button onClick={() => setForm(f => ({ ...f, hours: Math.min(8, f.hours + 1) }))}
                style={{ width: 38, height: 38, border: "none", borderRadius: "50%", background: C.ink, fontSize: 20, fontWeight: 700, color: "#fff", cursor: "pointer" }}>+</button>
            </div>

            <Input label="Your address" placeholder="e.g. 12 Broomhill Road, Sheffield, S10 2AA"
              value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            <Input label="Special instructions (optional)" placeholder="Access codes, pets, specific tasks…"
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />

            {/* Price breakdown */}
            <div style={{ background: C.borderSoft, borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: C.slate }}>£{worker?.price}/hr × {form.hours}h</span>
                <span style={{ fontFamily: FONT.mono, fontWeight: 600 }}>£{subtotal}</span>
              </div>
              <div style={{ height: 1, background: C.border, marginBottom: 10 }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 800, fontSize: 16, fontFamily: FONT.display }}>Total</span>
                <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 18 }}>£{total}</span>
              </div>
              <p style={{ fontSize: 11, color: C.green, fontWeight: 700, textAlign: "center", marginTop: 10 }}>
                🔒 Payment held securely until job is marked complete
              </p>
            </div>

            <Btn onClick={handleConfirm} variant="green" disabled={submitting || !form.address}
              style={{ width: "100%", fontSize: 16, padding: "16px", borderRadius: 12, fontWeight: 700 }}>
              {submitting ? "Confirming…" : "Confirm & Pay →"}
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCREEN 3 — JOB TRACKER
// ═══════════════════════════════════════════════════════════════════
function TrackScreen({ latestBooking }) {
  const [activeJob] = useState(latestBooking || {
    id: "TL-002", worker: WORKERS[3], service: SERVICES[0],
    date: "today", time: "ASAP", hours: 2, total: 44, address: "3 Ecclesall Rd, Sheffield"
  });

  return (
    <div style={{ padding: "20px 20px 100px" }}>
      <h2 className="fadeUp" style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 700, color: C.ink, marginBottom: 4 }}>Track Your Job</h2>
      <p className="fadeUp d1" style={{ color: C.slate, fontSize: 13, marginBottom: 20 }}>Real-time updates on your booking</p>

      {/* Job card */}
      <div className="fadeUp d2" style={{ background: C.ink, borderRadius: 16, padding: "20px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: FONT.mono, fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4, letterSpacing: "1px" }}>BOOKING ID</div>
            <div style={{ fontFamily: FONT.mono, fontWeight: 700, color: C.green, fontSize: 16 }}>{activeJob.id}</div>
          </div>
          <Badge text="In Progress" variant="green" />
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <Avatar initials={activeJob.worker?.initials || "AK"} size={48} />
          <div>
            <div style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>{activeJob.worker?.name || "Aisha K."}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{activeJob.service?.label || "Cleaning"} · {activeJob.address || "3 Ecclesall Rd, Sheffield"}</div>
          </div>
        </div>
      </div>

      {/* Live map placeholder */}
      <div className="fadeUp d3" style={{
        background: `linear-gradient(135deg, #E8F5E9, #E3F2FD)`,
        borderRadius: 14, height: 160, marginBottom: 20,
        display: "flex", alignItems: "center", justifyContent: "center",
        border: `1.5px solid ${C.border}`, position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 50%, rgba(0,197,122,0.15) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(59,130,246,0.1) 0%, transparent 60%)" }} />
        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📍</div>
          <div style={{ fontWeight: 700, color: C.inkMid, fontSize: 14 }}>Worker is 0.8 miles away</div>
          <div style={{ color: C.slate, fontSize: 12, marginTop: 3 }}>Estimated arrival: 12 minutes</div>
        </div>
      </div>

      {/* Progress stages */}
      <div className="fadeUp d4" style={{ background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "20px", marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 15, color: C.ink, marginBottom: 18 }}>Job Progress</h3>
        {JOB_STAGES.map((stage, i) => (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: i < JOB_STAGES.length - 1 ? 16 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: stage.done ? C.green : C.borderSoft,
                border: `2px solid ${stage.done ? C.green : C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, color: stage.done ? "#fff" : C.muted, fontWeight: 700,
                flexShrink: 0
              }}>
                {stage.done ? "✓" : i + 1}
              </div>
              {i < JOB_STAGES.length - 1 && (
                <div style={{ width: 2, height: 24, background: stage.done ? C.green : C.border, marginTop: 4 }} />
              )}
            </div>
            <div style={{ paddingTop: 4 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: stage.done ? C.ink : C.muted }}>{stage.label}</div>
              <div style={{ fontSize: 11, color: C.muted, fontFamily: FONT.mono, marginTop: 2 }}>{stage.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="fadeUp d5" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <Btn variant="outline" style={{ width: "100%", textAlign: "center", borderRadius: 12 }}>💬 Message Worker</Btn>
        <Btn variant="outline" style={{ width: "100%", textAlign: "center", borderRadius: 12 }}>📞 Call Worker</Btn>
      </div>
      <Btn variant="green" style={{ width: "100%", fontSize: 15, padding: "15px", borderRadius: 12, fontWeight: 700 }}>
        ✓ Mark Job Complete & Release Payment
      </Btn>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCREEN 4 — WORKER ONBOARDING
// ═══════════════════════════════════════════════════════════════════
function JoinScreen() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", city: "Sheffield", bio: "", rate: "", idUploaded: false, agreed: false });
  const [submitted, setSubmitted] = useState(false);

  const steps = ["Personal Info", "Your Service", "Verification"];

  if (submitted) {
    return (
      <div style={{ padding: "40px 24px 100px", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, background: C.greenPale, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 24px" }}>✓</div>
        <h2 style={{ fontFamily: FONT.display, fontSize: 30, fontWeight: 700, color: C.ink, marginBottom: 10 }}>Application Submitted!</h2>
        <p style={{ color: C.slate, lineHeight: 1.7, marginBottom: 28 }}>We'll review your details and get back to you within 24 hours. Once verified, you'll start receiving job requests in Sheffield.</p>
        <div style={{ background: C.ink, borderRadius: 14, padding: 20, textAlign: "left", marginBottom: 24 }}>
          {[["Name", form.name || "Marcus T."], ["Service", form.service || "Cleaning"], ["City", form.city], ["Rate", `£${form.rate || "20"}/hr`]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: FONT.mono }}>{k}</span>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{v}</span>
            </div>
          ))}
        </div>
        <Btn onClick={() => { setSubmitted(false); setStep(0); setForm({ name: "", email: "", phone: "", service: "", city: "Sheffield", bio: "", rate: "", idUploaded: false, agreed: false }); }}
          variant="outline" style={{ borderRadius: 12 }}>Start Another Application</Btn>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.inkSoft}, ${C.ink})`, padding: "32px 24px 28px" }}>
        <h1 style={{ fontFamily: FONT.display, fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
          Join as a<br /><span style={{ color: C.green, fontStyle: "italic" }}>Trusted Worker</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.6 }}>Set your own hours. Get paid same day. Build your reputation in Sheffield.</p>
        <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
          {[["£500+", "Avg weekly earnings"], ["24h", "Verification time"], ["0%", "Signup fee"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 18, fontWeight: 700, color: C.green }}>{v}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2, lineHeight: 1.3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "12px 20px" }}>
        <div style={{ display: "flex" }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex: 1 }}>
              <div style={{ height: 3, background: i <= step ? C.green : C.border, transition: "background 0.3s", borderRadius: 2 }} />
              <div style={{ fontSize: 10, fontFamily: FONT.mono, fontWeight: 700, letterSpacing: "1px", color: i <= step ? C.green : C.muted, padding: "6px 0 2px", textTransform: "uppercase", textAlign: "center" }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 20px" }}>

        {step === 0 && (
          <div className="fadeUp">
            <h3 style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 700, marginBottom: 20, color: C.ink }}>Personal Information</h3>
            <Input label="Full name" placeholder="Your full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input label="Email" placeholder="your@email.com" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <Input label="Phone" placeholder="07700 900 000" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: C.slate, display: "block", marginBottom: 7, textTransform: "uppercase", fontFamily: FONT.mono }}>City</label>
              <select value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, color: C.ink, background: C.white, outline: "none", fontFamily: FONT.body }}>
                {["Sheffield", "Leeds", "Manchester"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <Btn onClick={() => setStep(1)} variant="green" disabled={!form.name || !form.email || !form.phone} style={{ width: "100%", padding: "15px", borderRadius: 12, fontWeight: 700, fontSize: 15 }}>
              Continue →
            </Btn>
          </div>
        )}

        {step === 1 && (
          <div className="fadeUp">
            <h3 style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 700, marginBottom: 20, color: C.ink }}>Your Service</h3>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: C.slate, display: "block", marginBottom: 10, textTransform: "uppercase", fontFamily: FONT.mono }}>I offer…</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {SERVICES.map(s => (
                <button key={s.id} onClick={() => setForm(f => ({ ...f, service: s.label }))}
                  style={{
                    padding: "14px 10px", border: `1.5px solid ${form.service === s.label ? C.ink : C.border}`,
                    borderRadius: 12, background: form.service === s.label ? C.ink : C.white,
                    color: form.service === s.label ? "#fff" : C.ink, fontWeight: 600,
                    fontSize: 13, cursor: "pointer", transition: "all 0.15s", textAlign: "left"
                  }}>
                  <div style={{ fontSize: 20, marginBottom: 4, color: form.service === s.label ? C.green : C.slate }}>{s.icon}</div>
                  {s.label}
                </button>
              ))}
            </div>
            <Input label="Your hourly rate (£)" placeholder="e.g. 18" type="number" value={form.rate} onChange={e => setForm(f => ({ ...f, rate: e.target.value }))} />
            <Input label="Short bio" placeholder="Tell customers about your experience…" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} />
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={() => setStep(0)} variant="outline" style={{ flex: 1, borderRadius: 12 }}>← Back</Btn>
              <Btn onClick={() => setStep(2)} variant="green" disabled={!form.service || !form.rate} style={{ flex: 2, borderRadius: 12, fontWeight: 700 }}>Continue →</Btn>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fadeUp">
            <h3 style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 700, marginBottom: 8, color: C.ink }}>Verification</h3>
            <p style={{ color: C.slate, fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>We verify all workers to keep customers safe. Upload your ID — takes 2 minutes.</p>

            <div onClick={() => setForm(f => ({ ...f, idUploaded: !f.idUploaded }))}
              style={{
                border: `2px dashed ${form.idUploaded ? C.green : C.border}`,
                borderRadius: 14, padding: "28px", textAlign: "center", cursor: "pointer",
                background: form.idUploaded ? C.greenPale : C.borderSoft, marginBottom: 16, transition: "all 0.2s"
              }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{form.idUploaded ? "✅" : "📄"}</div>
              <div style={{ fontWeight: 700, color: form.idUploaded ? C.greenDark : C.ink, fontSize: 14, marginBottom: 4 }}>
                {form.idUploaded ? "ID Uploaded!" : "Upload Photo ID"}
              </div>
              <div style={{ fontSize: 12, color: C.muted }}>{form.idUploaded ? "Tap to change" : "Passport, driving licence, or national ID"}</div>
            </div>

            <div style={{ background: C.borderSoft, borderRadius: 12, padding: 16, marginBottom: 20 }}>
              {[["Background check", "Basic DBS check completed within 48hrs"], ["ID verification", "Automated ID scan — instant"], ["Profile review", "Our team reviews your bio & rates"]].map(([t, d]) => (
                <div key={t} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.greenPale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: C.green, flexShrink: 0, fontWeight: 700 }}>✓</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: C.ink }}>{t}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>

            <div onClick={() => setForm(f => ({ ...f, agreed: !f.agreed }))}
              style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20, cursor: "pointer" }}>
              <div style={{ width: 20, height: 20, border: `2px solid ${form.agreed ? C.green : C.border}`, borderRadius: 5, background: form.agreed ? C.green : C.white, flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, transition: "all 0.15s" }}>
                {form.agreed ? "✓" : ""}
              </div>
              <p style={{ fontSize: 12, color: C.slate, lineHeight: 1.6 }}>I agree to TrustLocal's <span style={{ color: C.ink, fontWeight: 600, textDecoration: "underline" }}>Worker Terms</span>, and confirm all information is accurate.</p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={() => setStep(1)} variant="outline" style={{ flex: 1, borderRadius: 12 }}>← Back</Btn>
              <Btn onClick={() => setSubmitted(true)} variant="green" disabled={!form.idUploaded || !form.agreed}
                style={{ flex: 2, borderRadius: 12, fontWeight: 700, fontSize: 15 }}>Submit Application →</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCREEN 5 — ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════
function AdminScreen() {
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [tab, setTab] = useState("bookings");
  const [assigning, setAssigning] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);

  const stats = {
    total: bookings.length,
    active: bookings.filter(b => b.status === "active").length,
    pending: bookings.filter(b => b.status === "pending").length,
    completed: bookings.filter(b => b.status === "completed").length,
    revenue: bookings.filter(b => b.status !== "cancelled").reduce((s, b) => s + b.value * 0.1, 0),
  };

  const assignWorker = (bookingId, worker) => {
    setBookings(bs => bs.map(b => b.id === bookingId ? { ...b, worker: worker.name, status: "active" } : b));
    setAssigning(null);
    setSelectedWorker(null);
  };

  const statusColor = { active: "green", pending: "amber", completed: "blue", cancelled: "red" };

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Admin header */}
      <div style={{ background: C.ink, padding: "20px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: FONT.mono, fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "2px", marginBottom: 4 }}>ADMIN · SHEFFIELD</div>
            <h1 style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, color: "#fff" }}>Dashboard</h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "1px" }}>TODAY'S REVENUE</div>
            <div style={{ fontFamily: FONT.mono, fontSize: 22, fontWeight: 700, color: C.green }}>£{stats.revenue.toFixed(0)}</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
          {[
            ["Total Jobs", stats.total, C.white],
            ["Active", stats.active, C.green],
            ["Pending", stats.pending, C.amber],
            ["Done", stats.completed, C.blue],
          ].map(([l, v, col]) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 16px", minWidth: 80, textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 22, fontWeight: 700, color: col }}>{v}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 3, fontFamily: FONT.mono, letterSpacing: "0.5px" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0 }}>
          {[["bookings", "Bookings"], ["workers", "Workers"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              flex: 1, padding: "10px", border: "none", background: "transparent",
              color: tab === id ? "#fff" : "rgba(255,255,255,0.35)",
              fontWeight: 700, fontSize: 13, cursor: "pointer",
              borderBottom: `2px solid ${tab === id ? C.green : "transparent"}`,
              transition: "all 0.15s"
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 16px" }}>

        {tab === "bookings" && (
          <div>
            {bookings.map(b => (
              <div key={b.id} style={{
                background: C.white, border: `1.5px solid ${C.border}`,
                borderRadius: 14, padding: "16px", marginBottom: 10
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontFamily: FONT.mono, fontSize: 12, fontWeight: 700, color: C.ink }}>{b.id}</span>
                      <Badge text={b.status} variant={statusColor[b.status] || "default"} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.ink }}>{b.customer}</div>
                    <div style={{ fontSize: 12, color: C.slate }}>{b.service} · {b.time}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{b.address}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 16, color: C.ink }}>£{b.value}</div>
                    <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.green, fontWeight: 700 }}>+£{(b.value * 0.1).toFixed(0)} fee</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {b.worker
                    ? <div style={{ flex: 1, background: C.greenPale, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: C.greenDark, fontWeight: 600 }}>👤 Assigned: {b.worker}</div>
                    : <div style={{ flex: 1, background: "#FFFBEB", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#92400E", fontWeight: 600 }}>⚠ Needs worker assignment</div>
                  }
                  {!b.worker && (
                    <Btn onClick={() => setAssigning(b.id)} variant="green" style={{ padding: "8px 14px", fontSize: 12, borderRadius: 8 }}>
                      Assign →
                    </Btn>
                  )}
                </div>

                {assigning === b.id && (
                  <div style={{ marginTop: 12, background: C.borderSoft, borderRadius: 10, padding: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 10 }}>Select a worker:</div>
                    {WORKERS.filter(w => w.service === b.service.toLowerCase()).map(w => (
                      <div key={w.id} onClick={() => setSelectedWorker(w)}
                        style={{
                          display: "flex", gap: 10, alignItems: "center", padding: "10px", marginBottom: 6,
                          background: selectedWorker?.id === w.id ? C.ink : C.white,
                          borderRadius: 10, cursor: "pointer", border: `1.5px solid ${selectedWorker?.id === w.id ? C.ink : C.border}`,
                          transition: "all 0.15s"
                        }}>
                        <Avatar initials={w.initials} size={32} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: selectedWorker?.id === w.id ? "#fff" : C.ink }}>{w.name}</div>
                          <div style={{ fontSize: 11, color: selectedWorker?.id === w.id ? "rgba(255,255,255,0.5)" : C.muted }}>
                            <Stars rating={w.rating} /> {w.rating} · {w.eta === "Now" ? "Available now" : `Available in ${w.eta}`}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <Btn onClick={() => { setAssigning(null); setSelectedWorker(null); }} variant="outline" style={{ flex: 1, fontSize: 12, padding: "9px" }}>Cancel</Btn>
                      <Btn onClick={() => selectedWorker && assignWorker(b.id, selectedWorker)} variant="green" disabled={!selectedWorker} style={{ flex: 2, fontSize: 12, padding: "9px" }}>
                        Confirm Assignment
                      </Btn>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "workers" && (
          <div>
            <div style={{ background: C.borderSoft, borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 18, color: C.ink }}>{WORKERS.length}</div>
                <div style={{ fontSize: 11, color: C.muted }}>Total</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 18, color: C.green }}>5</div>
                <div style={{ fontSize: 11, color: C.muted }}>Active today</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 18, color: C.amber }}>2</div>
                <div style={{ fontSize: 11, color: C.muted }}>Pending verify</div>
              </div>
            </div>

            {WORKERS.map(w => (
              <div key={w.id} style={{ background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 10, display: "flex", gap: 14 }}>
                <Avatar initials={w.initials} size={46} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: C.ink, marginBottom: 3 }}>{w.name}</div>
                      <Badge text={w.badge} variant="green" />
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: FONT.mono, fontSize: 14, fontWeight: 700, color: C.ink }}>£{w.price}/hr</div>
                      <div style={{ fontSize: 10, color: C.green, fontWeight: 700, fontFamily: FONT.mono }}>{w.jobs} jobs done</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                    <Stars rating={w.rating} />
                    <span style={{ fontSize: 11, color: C.muted, fontFamily: FONT.mono }}>{w.rating}</span>
                    <span style={{ fontSize: 11, color: w.eta === "Now" ? C.green : C.amber, fontWeight: 600, marginLeft: 4 }}>
                      {w.eta === "Now" ? "● Available now" : `● In ${w.eta}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// BOOKING CONFIRMED SCREEN
// ═══════════════════════════════════════════════════════════════════
function ConfirmedScreen({ booking, onTrack, onHome }) {
  return (
    <div style={{ minHeight: "100vh", background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
      <div style={{ textAlign: "center", maxWidth: 380, animation: "fadeIn 0.5s ease" }}>
        <div style={{ width: 80, height: 80, background: C.green, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 28px", boxShadow: `0 0 60px ${C.green}44` }}>✓</div>
        <h2 style={{ fontFamily: FONT.display, fontSize: 34, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Booking Confirmed!</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 28, fontSize: 14 }}>
          <strong style={{ color: "#fff" }}>{booking?.worker?.name}</strong> has been notified. Payment of <strong style={{ color: C.green }}>£{booking?.total}</strong> is held securely.
        </p>

        <div style={{ background: "#1C1C28", borderRadius: 16, padding: 20, marginBottom: 24, textAlign: "left" }}>
          {[
            ["Booking ID", booking?.id || "TL-009"],
            ["Service", booking?.service?.label || "Cleaning"],
            ["When", `${booking?.date || "Today"}, ${booking?.time || "ASAP"}`],
            ["Duration", `${booking?.hours || 2} hours`],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontFamily: FONT.mono }}>{k}</span>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          <Btn onClick={onTrack} style={{ background: C.green, color: "#fff", borderRadius: 12, fontWeight: 700 }}>📍 Track Job</Btn>
          <Btn variant="outline" style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", borderRadius: 12 }}>💬 Message</Btn>
        </div>
        <Btn onClick={onHome} variant="ghost" style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>← Back to Home</Btn>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════
export default function TrustLocalApp() {
  const [screen, setScreen] = useState("home");
  const [adminMode, setAdminMode] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [latestBooking, setLatestBooking] = useState(null);

  const handleBooked = (booking) => {
    setConfirmedBooking(booking);
    setLatestBooking(booking);
    setScreen("confirmed");
  };

  const isAdmin = screen === "admin";

  return (
    <div style={{ minHeight: "100vh", background: C.cream, maxWidth: isAdmin ? "100%" : 480, margin: "0 auto", position: "relative" }}>
      <style>{globalStyles}</style>

      <TopNav screen={screen} setScreen={setScreen} adminMode={adminMode} setAdminMode={setAdminMode} />

      {screen === "home" && <HomeScreen setScreen={setScreen} />}
      {screen === "book" && <BookingScreen onBooked={handleBooked} />}
      {screen === "confirmed" && <ConfirmedScreen booking={confirmedBooking} onTrack={() => setScreen("track")} onHome={() => setScreen("home")} />}
      {screen === "track" && <TrackScreen latestBooking={latestBooking} />}
      {screen === "join" && <JoinScreen />}
      {screen === "admin" && <AdminScreen />}

      {!isAdmin && screen !== "confirmed" && <BottomNav screen={screen} setScreen={setScreen} />}
    </div>
  );
}
