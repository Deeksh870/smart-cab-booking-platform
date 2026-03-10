"use client";

import { useState, useEffect } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

export default function SupportPage() {
  const { user } = useUser();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [showSOS, setShowSOS] = useState(false);
  const [sosLoading, setSosLoading] = useState(false);

  const fetchTickets = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setTickets(data || []);
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  const submitTicket = async () => {
    if (!subject || !message || !user) return;
    setLoading(true);
    await supabase.from("support_tickets").insert([
      {
        user_id: user.id,
        name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
        subject,
        message,
        status: "open",
      },
    ]);
    setLoading(false);
    alert("Support request submitted!");
    setSubject("");
    setMessage("");
    fetchTickets();
  };

  const sendSOS = async () => {
    if (!user) return;
    setSosLoading(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const locationLink = `https://maps.google.com/?q=${lat},${lng}`;
      await supabase.from("sos_alerts").insert([
        {
          user_email: user.primaryEmailAddress?.emailAddress,
          message: `SOS triggered. Location: ${locationLink}`,
        },
      ]);
      const phone = "918762822004";
      const text = `🚨 SOS ALERT!\n\nI may be in danger during a ride.\n\nMy location:\n${locationLink}`;
      const whatsappURL = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
      window.open(whatsappURL, "_blank");
    } catch (err) {
      alert("Please allow location access.");
    }
    setSosLoading(false);
    setShowSOS(false);
  };

  const statusColors: Record<string, { color: string; bg: string; border: string }> = {
    open:     { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.22)"  },
    pending:  { color: "#fb923c", bg: "rgba(251,146,60,0.1)",  border: "rgba(251,146,60,0.22)"  },
    resolved: { color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.22)"  },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .sp-root {
          min-height: 100vh;
          background: #080810;
          background-image:
            radial-gradient(ellipse 90% 55% at 50% -5%,  rgba(120,80,255,0.11) 0%, transparent 60%),
            radial-gradient(ellipse 55% 40% at 92% 98%,  rgba(220,50,50,0.08)  0%, transparent 55%),
            radial-gradient(ellipse 40% 35% at 5%  60%,  rgba(34,211,238,0.04) 0%, transparent 50%);
          font-family: 'DM Sans', sans-serif;
          color: #e8e4dc;
          padding: 48px 24px 100px;
        }

        /* subtle dot grid */
        .sp-root::before {
          content: '';
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 36px 36px;
        }

        .sp-container {
          max-width: 880px;
          margin: 0 auto;
          position: relative; z-index: 1;
        }

        /* ── HEADER ── */
        .sp-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 52px;
          padding-bottom: 28px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          animation: spFadeDown 0.65s cubic-bezier(0.22,1,0.36,1) both;
        }

        .sp-header-left { display: flex; flex-direction: column; gap: 6px; }

        .sp-eyebrow {
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(180,150,255,0.65);
        }

        .sp-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px;
          font-weight: 300;
          letter-spacing: -0.015em;
          color: #f2ede6;
          line-height: 1;
        }

        /* ── LAYOUT ── */
        .sp-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
          animation: spFadeUp 0.65s 0.1s cubic-bezier(0.22,1,0.36,1) both;
        }
        @media (max-width: 720px) { .sp-layout { grid-template-columns: 1fr; } }

        /* ── CARDS ── */
        .sp-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 22px;
          padding: 34px 36px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s ease;
        }
        .sp-card::before {
          content: '';
          position: absolute; top:0; left:0; right:0; height:1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        }
        .sp-card:hover { border-color: rgba(255,255,255,0.11); }

        .sp-section-label {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(232,228,220,0.25);
          margin-bottom: 6px;
          font-weight: 500;
        }

        .sp-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 500;
          color: #f2ede6;
          margin-bottom: 22px;
          letter-spacing: 0.01em;
        }

        .sp-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin-bottom: 26px;
        }

        /* quick topic chips */
        .sp-chips {
          display: flex; gap: 7px; flex-wrap: wrap;
          margin-bottom: 16px;
        }
        .sp-chip {
          padding: 5px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          font-size: 11.5px;
          color: rgba(232,228,220,0.45);
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          white-space: nowrap;
          letter-spacing: 0.02em;
        }
        .sp-chip:hover {
          border-color: rgba(150,120,255,0.4);
          color: rgba(200,180,255,0.85);
          background: rgba(120,80,255,0.08);
        }

        .sp-input, .sp-textarea {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 13px 16px;
          color: #e8e4dc;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 300;
          margin-bottom: 12px;
          outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
        }
        .sp-input::placeholder, .sp-textarea::placeholder { color: rgba(232,228,220,0.22); }
        .sp-input:focus, .sp-textarea:focus {
          border-color: rgba(150,120,255,0.45);
          background: rgba(255,255,255,0.05);
          box-shadow: 0 0 0 3px rgba(120,80,255,0.08);
        }
        .sp-textarea { height: 120px; resize: none; margin-bottom: 20px; }

        .sp-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 26px;
          background: linear-gradient(135deg, #7c5cfc, #9b7bff);
          color: #fff;
          border: none; border-radius: 11px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 22px rgba(124,92,252,0.28);
        }
        .sp-btn-primary:hover:not(:disabled) {
          opacity: 0.9; transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(124,92,252,0.42);
        }
        .sp-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

        /* ── SOS CARD (full-width) ── */
        .sp-card-sos {
          background: rgba(200,30,30,0.04);
          border: 1px solid rgba(220,50,50,0.18);
          border-radius: 22px;
          padding: 34px 36px;
          margin-bottom: 20px;
          position: relative; overflow: hidden;
          animation: spFadeUp 0.65s 0.2s cubic-bezier(0.22,1,0.36,1) both;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
        }
        .sp-card-sos::before {
          content: '';
          position: absolute; top:0; left:0; right:0; height:1px;
          background: linear-gradient(90deg, transparent, rgba(220,60,60,0.32), transparent);
        }
        /* pulsing red corner glow */
        .sp-card-sos::after {
          content: '';
          position: absolute; bottom:-40px; right:-40px;
          width: 160px; height: 160px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(220,40,40,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        @media (max-width: 640px) { .sp-card-sos { flex-direction: column; align-items: flex-start; } }

        .sp-sos-left { flex: 1; }

        .sp-sos-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 500;
          color: #ff7070;
          margin-bottom: 8px;
          display: flex; align-items: center; gap: 10px;
          letter-spacing: 0.01em;
        }

        /* pulsing red dot beside title */
        .sos-pulse {
          width: 9px; height: 9px; border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 12px rgba(239,68,68,0.7);
          animation: sosPulse 1.5s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes sosPulse {
          0%,100% { transform: scale(1);   opacity: 1; box-shadow: 0 0 8px rgba(239,68,68,0.6); }
          50%      { transform: scale(1.5); opacity: .6; box-shadow: 0 0 18px rgba(239,68,68,0.9); }
        }

        .sp-sos-desc {
          font-size: 13px; font-weight: 300;
          color: rgba(232,228,220,0.48);
          line-height: 1.65; max-width: 500px;
        }

        .sp-btn-sos {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px;
          background: linear-gradient(135deg, #c0392b, #e74c3c);
          color: #fff;
          border: none; border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer; white-space: nowrap; flex-shrink: 0;
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 22px rgba(199,0,0,0.28);
        }
        .sp-btn-sos:hover:not(:disabled) {
          opacity: 0.9; transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(199,0,0,0.45);
        }
        .sp-btn-sos:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── TICKETS CARD (full-width) ── */
        .sp-card-tickets {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 22px;
          padding: 34px 36px;
          position: relative; overflow: hidden;
          animation: spFadeUp 0.65s 0.3s cubic-bezier(0.22,1,0.36,1) both;
        }
        .sp-card-tickets::before {
          content: '';
          position: absolute; top:0; left:0; right:0; height:1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        }

        /* summary mini stats */
        .sp-ticket-stats {
          display: flex; gap: 10px; margin-bottom: 24px;
        }
        .sp-tstat {
          flex:1; background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px; padding: 12px 14px; text-align: center;
        }
        .sp-tstat-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem; font-weight: 500; color: #f2ede6; line-height:1;
          margin-bottom: 4px;
        }
        .sp-tstat-label { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(232,228,220,0.28); }

        .sp-ticket-empty {
          text-align: center; padding: 36px 0 16px;
          color: rgba(232,228,220,0.25);
          font-size: 13.5px; font-weight: 300;
          letter-spacing: 0.05em;
          font-style: italic;
        }

        .sp-ticket-item {
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 15px;
          padding: 20px 22px;
          margin-bottom: 12px;
          background: rgba(255,255,255,0.015);
          display: flex; justify-content: space-between; align-items: flex-start; gap: 14px;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
        }
        .sp-ticket-item:last-child { margin-bottom: 0; }
        .sp-ticket-item:hover {
          border-color: rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          transform: translateY(-1px);
        }
        .sp-ticket-left { flex:1; min-width:0; }
        .sp-ticket-right { flex-shrink:0; display:flex; flex-direction:column; align-items:flex-end; gap:8px; }

        .sp-ticket-subject {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px; font-weight: 500;
          color: #f0ece4; margin-bottom: 5px;
          letter-spacing: 0.01em;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .sp-ticket-message {
          font-size: 12.5px; font-weight: 300;
          color: rgba(232,228,220,0.45);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .sp-ticket-time {
          font-size: 10.5px; letter-spacing: 0.08em;
          color: rgba(232,228,220,0.22); font-weight: 300;
          margin-top: 8px;
        }

        .sp-ticket-badge {
          font-size: 10px; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 3px 10px;
          border-radius: 99px; font-weight: 500;
          white-space: nowrap;
        }

        /* ── SOS MODAL ── */
        .sp-overlay {
          position: fixed; inset: 0;
          background: rgba(4,4,10,0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.22s ease;
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        .sp-modal {
          background: #100f18;
          border: 1px solid rgba(220,40,40,0.22);
          border-radius: 26px;
          padding: 48px 44px;
          max-width: 420px; width: 90%;
          text-align: center; position: relative;
          animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow:
            0 40px 80px rgba(0,0,0,0.65),
            0 0 0 1px rgba(255,255,255,0.04),
            0 0 60px rgba(200,30,30,0.08);
        }
        .sp-modal::before {
          content:''; position:absolute; top:0; left:0; right:0; height:1px;
          border-radius: 26px 26px 0 0;
          background: linear-gradient(90deg, transparent, rgba(220,60,60,0.38), transparent);
        }
        @keyframes slideUp {
          from { opacity:0; transform: translateY(24px) scale(0.96); }
          to   { opacity:1; transform: none; }
        }

        .sp-modal-icon { font-size: 40px; margin-bottom: 18px; display: block; }

        .sp-modal-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 27px; font-weight: 400;
          color: #f2ede6; margin-bottom: 12px; letter-spacing: -0.01em;
        }
        .sp-modal-desc {
          font-size: 13px; font-weight: 300;
          color: rgba(232,228,220,0.48);
          line-height: 1.7; margin-bottom: 34px;
        }

        .sp-modal-actions { display: flex; gap: 12px; justify-content: center; }

        .sp-btn-cancel {
          padding: 12px 22px;
          background: rgba(255,255,255,0.05);
          color: rgba(232,228,220,0.6);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 11px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 400;
          cursor: pointer; letter-spacing: 0.02em;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .sp-btn-cancel:hover {
          background: rgba(255,255,255,0.09);
          color: #e8e4dc; border-color: rgba(255,255,255,0.16);
        }

        @keyframes spFadeDown { from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:none} }
        @keyframes spFadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
      `}</style>

      <div className="sp-root">
        <div className="sp-container">

          {/* HEADER */}
          <div className="sp-header">
            <div className="sp-header-left">
              <span className="sp-eyebrow">Help &amp; Safety</span>
              <h1 className="sp-title">Support Center</h1>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>

          {/* FORM + TICKETS side by side */}
          <div className="sp-layout">

            {/* SUPPORT FORM */}
            <div className="sp-card">
              <p className="sp-section-label">New Request</p>
              <h2 className="sp-card-title">Submit a Ticket</h2>
              <div className="sp-divider" />

              {/* quick topic chips */}
              <div className="sp-chips">
                {["Payment issue", "Driver behaviour", "Wrong fare", "App bug"].map((t) => (
                  <span key={t} className="sp-chip" onClick={() => setSubject(t)}>{t}</span>
                ))}
              </div>

              <input
                className="sp-input"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <textarea
                className="sp-textarea"
                placeholder="Describe your issue in detail…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="sp-btn-primary" onClick={submitTicket} disabled={loading}>
                {loading ? "Submitting…" : "Submit Request →"}
              </button>
            </div>

            {/* TICKETS HISTORY (right column) */}
            <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
              <div className="sp-card-tickets" style={{ height:"100%" }}>
                <p className="sp-section-label">History</p>
                <h2 className="sp-card-title">My Tickets</h2>
                <div className="sp-divider" />

                {/* mini stats */}
                {tickets.length > 0 && (
                  <div className="sp-ticket-stats">
                    {[
                      { key:"open",     label:"Open"     },
                      { key:"pending",  label:"Pending"  },
                      { key:"resolved", label:"Resolved" },
                    ].map(({ key, label }) => (
                      <div className="sp-tstat" key={key}>
                        <div className="sp-tstat-val">{tickets.filter(t => (t.status || "open") === key).length}</div>
                        <div className="sp-tstat-label">{label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {tickets.length === 0 ? (
                  <p className="sp-ticket-empty">— No support requests yet —</p>
                ) : (
                  <div style={{ maxHeight:"340px", overflowY:"auto", scrollbarWidth:"thin", scrollbarColor:"rgba(255,255,255,0.06) transparent" }}>
                    {tickets.map((ticket) => {
                      const s = statusColors[ticket.status] || statusColors["open"];
                      return (
                        <div key={ticket.id} className="sp-ticket-item">
                          <div className="sp-ticket-left">
                            <p className="sp-ticket-subject">{ticket.subject}</p>
                            <p className="sp-ticket-message">{ticket.message}</p>
                            <p className="sp-ticket-time">{new Date(ticket.created_at).toLocaleString()}</p>
                          </div>
                          <div className="sp-ticket-right">
                            <span
                              className="sp-ticket-badge"
                              style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
                            >
                              {ticket.status || "open"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* SOS PANEL — full width */}
          <div className="sp-card-sos">
            <div className="sp-sos-left">
              <h2 className="sp-sos-title">
                <span className="sos-pulse" />
                Emergency SOS
              </h2>
              <p className="sp-sos-desc">
                If you feel unsafe during a ride, press the SOS button to immediately alert your emergency contact with your live location via WhatsApp.
              </p>
            </div>
            <button className="sp-btn-sos" onClick={() => setShowSOS(true)}>
              ⚡ Trigger SOS Alert
            </button>
          </div>

        </div>
      </div>

      {/* SOS MODAL */}
      {showSOS && (
        <div className="sp-overlay">
          <div className="sp-modal">
            <span className="sp-modal-icon">🚨</span>
            <h2 className="sp-modal-title">Send Emergency SOS?</h2>
            <p className="sp-modal-desc">
              This will share your real-time location with your emergency contact via WhatsApp. Only use this if you feel genuinely unsafe.
            </p>
            <div className="sp-modal-actions">
              <button className="sp-btn-cancel" onClick={() => setShowSOS(false)}>
                Cancel
              </button>
              <button className="sp-btn-sos" onClick={sendSOS} disabled={sosLoading}>
                {sosLoading ? "Sending…" : "⚡ Send SOS"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}