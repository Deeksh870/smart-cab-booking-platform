"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { useState } from "react";

export default function ProfilePage() {

  const { user } = useUser();

  const [name, setName] = useState(user?.firstName || "");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Bangalore");
  const [payment, setPayment] = useState("Card");
  const [emergency, setEmergency] = useState("");

  const email = user?.primaryEmailAddress?.emailAddress || "";

  const handleSave = () => {
    alert("Profile updated successfully!");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        :root {
          --bg:           #07090f;
          --surface:      #0d1120;
          --surface2:     #121827;
          --surface3:     #171f30;
          --border:       rgba(255,255,255,0.07);
          --border-focus: rgba(124,106,247,0.45);
          --violet:       #7c6af7;
          --violet-soft:  rgba(124,106,247,0.14);
          --violet-glow:  rgba(124,106,247,0.28);
          --pink:         #f472b6;
          --pink-soft:    rgba(244,114,182,0.12);
          --cyan:         #22d3ee;
          --amber:        #fbbf24;
          --green:        #10b981;
          --text:         #e2e8f4;
          --muted:        rgba(226,232,244,0.42);
          --muted2:       rgba(226,232,244,0.2);
        }

        .prof-root {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* ambient blobs */
        .prof-root::before {
          content: '';
          position: fixed; inset: 0;
          background:
            radial-gradient(ellipse 60% 45% at 10% 15%, rgba(124,106,247,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 45% 40% at 90% 85%, rgba(244,114,182,0.08) 0%, transparent 55%);
          pointer-events: none; z-index: 0;
        }
        .prof-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px);
          background-size: 52px 52px;
        }

        .prof-inner {
          position: relative; z-index: 1;
          max-width: 560px;
          margin: 0 auto;
          padding: 36px 24px 72px;
          animation: profFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }

        /* ── HEADER ── */
        .prof-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 36px;
        }
        .prof-header-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.7rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #fff;
        }

        /* ── AVATAR SECTION ── */
        .avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 36px 24px 28px;
          position: relative;
        }

        .avatar-ring-outer {
          position: relative;
          width: 96px; height: 96px;
          margin-bottom: 16px;
        }

        /* spinning gradient ring */
        .avatar-ring-outer::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: conic-gradient(
            var(--violet) 0deg,
            var(--pink) 120deg,
            var(--cyan) 240deg,
            var(--violet) 360deg
          );
          animation: spinRing 4s linear infinite;
          z-index: 0;
        }
        @keyframes spinRing {
          to { transform: rotate(360deg); }
        }

        /* inner mask */
        .avatar-ring-outer::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: var(--bg);
          z-index: 1;
          margin: 2px;
        }

        .avatar-circle {
          position: relative; z-index: 2;
          width: 88px; height: 88px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--violet), var(--pink));
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 2.2rem;
          font-weight: 800;
          color: #fff;
          margin: 4px;
          box-shadow: 0 0 28px var(--violet-glow);
        }

        .avatar-name {
          font-family: 'Syne', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #fff;
          margin-bottom: 4px;
        }
        .avatar-email {
          font-size: 0.82rem;
          color: var(--muted);
          letter-spacing: 0.02em;
        }

        /* member badge */
        .member-badge {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 12px;
          background: var(--violet-soft);
          border: 1px solid rgba(124,106,247,0.22);
          border-radius: 999px;
          padding: 4px 13px;
          font-size: 0.73rem;
          font-weight: 600;
          color: #a78bfa;
          letter-spacing: 0.06em;
        }

        /* ── CARD ── */
        .prof-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.5);
        }

        /* section divider inside card */
        .card-section {
          padding: 24px 28px;
          border-bottom: 1px solid var(--border);
        }
        .card-section:last-child { border-bottom: none; }

        .section-heading {
          font-family: 'Syne', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: var(--muted2);
          margin-bottom: 16px;
        }

        /* ── FORM ── */
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .form-grid .full { grid-column: 1 / -1; }

        .field { display: flex; flex-direction: column; gap: 6px; }

        .field-label {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: var(--muted2);
        }

        .field-input {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 11px;
          padding: 11px 14px;
          color: var(--text);
          font-family: inherit;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
          box-sizing: border-box;
        }
        .field-input::placeholder { color: var(--muted2); }
        .field-input:focus {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px rgba(124,106,247,0.1);
        }

        .field-input-readonly {
          background: var(--surface3);
          border: 1px solid var(--border);
          border-radius: 11px;
          padding: 11px 14px;
          color: var(--muted);
          font-size: 0.9rem;
          font-family: inherit;
          display: flex; align-items: center; gap: 8px;
        }

        .field-select {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 11px;
          padding: 11px 14px;
          color: var(--text);
          font-family: inherit;
          font-size: 0.9rem;
          outline: none;
          width: 100%;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.3)' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .field-select:focus {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px rgba(124,106,247,0.1);
        }
        .field-select option { background: #1a1f35; color: var(--text); }

        /* payment method pills */
        .payment-pills {
          display: flex; gap: 8px;
        }
        .pay-pill {
          flex: 1;
          padding: 10px 8px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 600;
          text-align: center;
          cursor: pointer;
          border: 1px solid var(--border);
          background: var(--surface2);
          color: var(--muted);
          transition: all 0.2s;
          font-family: 'Syne', sans-serif;
        }
        .pay-pill.active {
          background: var(--violet-soft);
          border-color: rgba(124,106,247,0.35);
          color: #a78bfa;
        }
        .pay-pill:hover:not(.active) {
          border-color: var(--border-focus);
          color: var(--text);
        }

        /* ── STATS ── */
        .stats-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .stat-tile {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 16px 18px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
        }
        .stat-tile:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-2px); }

        .stat-tile::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          border-radius: 14px 14px 0 0;
        }
        .stat-tile.t-violet::before { background: linear-gradient(90deg, var(--violet), transparent); }
        .stat-tile.t-pink::before   { background: linear-gradient(90deg, var(--pink),   transparent); }

        .stat-tile-icon { font-size: 1.3rem; margin-bottom: 8px; }
        .stat-tile-val {
          font-family: 'Syne', sans-serif;
          font-size: 1.8rem;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #fff;
          line-height: 1;
          margin-bottom: 4px;
        }
        .stat-tile-label { font-size: 0.74rem; color: var(--muted); font-weight: 500; letter-spacing: 0.04em; }

        /* ── SAVE BUTTON ── */
        .save-btn {
          width: 100%;
          padding: 15px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--violet), var(--pink));
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          border: none;
          cursor: pointer;
          box-shadow: 0 10px 28px var(--violet-glow);
          transition: transform 0.15s, opacity 0.15s, box-shadow 0.15s;
          position: relative;
          overflow: hidden;
        }
        .save-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          transition: left 0.5s ease;
        }
        .save-btn:hover { transform: translateY(-2px); opacity: 0.93; box-shadow: 0 16px 36px var(--violet-glow); }
        .save-btn:hover::before { left: 150%; }
        .save-btn:active { transform: translateY(0); }

        /* ── DANGER ZONE ── */
        .danger-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 0;
        }
        .danger-label { font-size: 0.86rem; color: var(--muted); }
        .danger-link {
          font-size: 0.8rem; font-weight: 600;
          color: #f87171;
          background: rgba(248,113,113,0.1);
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 8px;
          padding: 6px 13px;
          cursor: pointer;
          transition: background 0.2s;
          font-family: 'Syne', sans-serif;
          letter-spacing: 0.03em;
        }
        .danger-link:hover { background: rgba(248,113,113,0.18); }

        @keyframes profFadeUp {
          from { opacity:0; transform: translateY(24px); }
          to   { opacity:1; transform: none; }
        }
      `}</style>

      <div className="prof-root">
        <div className="prof-grid" />

        <div className="prof-inner">

          {/* ── HEADER ── */}
          <div className="prof-header">
            <div className="prof-header-title">My Profile</div>
            <UserButton afterSignOutUrl="/" />
          </div>

          {/* ── CARD ── */}
          <div className="prof-card">

            {/* Avatar section */}
            <div className="avatar-section">
              <div className="avatar-ring-outer">
                <div className="avatar-circle">
                  {name.charAt(0) || "?"}
                </div>
              </div>
              <div className="avatar-name">{name || "Your Name"}</div>
              <div className="avatar-email">{email}</div>
              <div className="member-badge">✦ Member since 2025</div>
            </div>

            {/* Personal info */}
            <div className="card-section">
              <div className="section-heading">Personal Info</div>
              <div className="form-grid">
                <div className="field full">
                  <label className="field-label">Full Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="field-input"
                    placeholder="Your name"
                  />
                </div>

                <div className="field full">
                  <label className="field-label">Email Address</label>
                  <div className="field-input-readonly">
                    <span style={{ opacity: 0.4, fontSize: "0.85rem" }}>✉</span>
                    {email}
                  </div>
                </div>

                <div className="field">
                  <label className="field-label">Phone</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="field-input"
                  />
                </div>

                <div className="field">
                  <label className="field-label">City</label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="field-input"
                  />
                </div>

                <div className="field full">
                  <label className="field-label">Emergency Contact</label>
                  <input
                    value={emergency}
                    onChange={(e) => setEmergency(e.target.value)}
                    placeholder="Emergency contact number"
                    className="field-input"
                  />
                </div>
              </div>
            </div>

            {/* Payment preference */}
            <div className="card-section">
              <div className="section-heading">Payment Preference</div>
              <div className="payment-pills">
                {["Card", "UPI", "Cash"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setPayment(opt)}
                    className={`pay-pill ${payment === opt ? "active" : ""}`}
                  >
                    {opt === "Card" && "💳 "}
                    {opt === "UPI"  && "⚡ "}
                    {opt === "Cash" && "💵 "}
                    {opt}
                  </button>
                ))}
              </div>
              {/* keep hidden select for form value */}
              <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                style={{ display: "none" }}
              >
                <option>Card</option>
                <option>UPI</option>
                <option>Cash</option>
              </select>
            </div>

            {/* Stats */}
            <div className="card-section">
              <div className="section-heading">Your Stats</div>
              <div className="stats-row">
                <div className="stat-tile t-violet">
                  <div className="stat-tile-icon">🏁</div>
                  <div className="stat-tile-val">12</div>
                  <div className="stat-tile-label">Total Rides</div>
                </div>
                <div className="stat-tile t-pink">
                  <div className="stat-tile-icon">📅</div>
                  <div className="stat-tile-val">2025</div>
                  <div className="stat-tile-label">Member Since</div>
                </div>
              </div>
            </div>

            {/* Save */}
            <div className="card-section">
              <button onClick={handleSave} className="save-btn">
                Save Profile →
              </button>
            </div>

            {/* Danger zone */}
            <div className="card-section">
              <div className="section-heading">Account</div>
              <div className="danger-row">
                <span className="danger-label">Delete your account and all data</span>
                <span className="danger-link">Delete Account</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
