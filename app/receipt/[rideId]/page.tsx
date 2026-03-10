"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function ReceiptPage() {

  const { rideId } = useParams()
  const [ride, setRide] = useState<any>(null)

  useEffect(() => {
    fetchRide()
  }, [])

  const fetchRide = async () => {

    const { data } = await supabase
      .from("rides")
      .select("*")
      .eq("id", rideId)
      .single()

    setRide(data)
  }

  if (!ride) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
          .rec-loading {
            min-height: 100vh;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            background: #07090f;
            font-family: 'DM Sans', sans-serif;
            color: rgba(226,232,244,0.4);
            gap: 18px;
          }
          .rec-loading-ring {
            width: 44px; height: 44px;
            border-radius: 50%;
            border: 2px solid rgba(124,106,247,0.2);
            border-top-color: #7c6af7;
            animation: recSpin 0.8s linear infinite;
          }
          .rec-loading-text {
            font-size: 0.82rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
          }
          @keyframes recSpin { to { transform: rotate(360deg); } }
        `}</style>
        <div className="rec-loading">
          <div className="rec-loading-ring" />
          <span className="rec-loading-text">Loading receipt…</span>
        </div>
      </>
    )
  }

  const isPaid = ride.payment_status === "paid";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --bg:          #07090f;
          --surface:     #0d1120;
          --surface2:    #121827;
          --border:      rgba(255,255,255,0.07);
          --violet:      #7c6af7;
          --violet-soft: rgba(124,106,247,0.14);
          --violet-glow: rgba(124,106,247,0.3);
          --green:       #10b981;
          --green-soft:  rgba(16,185,129,0.12);
          --text:        #e2e8f4;
          --muted:       rgba(226,232,244,0.42);
          --muted2:      rgba(226,232,244,0.2);
        }

        .rec-root {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: var(--bg);
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        /* ambient glow */
        .rec-root::before {
          content: '';
          position: fixed; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 30% 30%, rgba(124,106,247,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 80% 80%, rgba(16,185,129,0.07) 0%, transparent 55%);
        }

        /* receipt card */
        .rec-card {
          position: relative; z-index: 1;
          width: 100%; max-width: 420px;
          animation: recUp 0.65s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes recUp {
          from { opacity:0; transform: translateY(28px) scale(0.97); }
          to   { opacity:1; transform: none; }
        }

        /* top brand strip */
        .rec-top-strip {
          background: linear-gradient(135deg, var(--violet), #a78bfa);
          border-radius: 20px 20px 0 0;
          padding: 22px 26px;
          display: flex; align-items: center; gap: 14px;
          position: relative; overflow: hidden;
        }
        .rec-top-strip::before {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 14px,
            rgba(255,255,255,0.035) 14px,
            rgba(255,255,255,0.035) 15px
          );
        }
        .rec-brand-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
          backdrop-filter: blur(4px);
          position: relative; z-index: 1;
        }
        .rec-brand-text { position: relative; z-index: 1; }
        .rec-brand-name {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
        }
        .rec-brand-sub {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.65);
          letter-spacing: 0.03em;
          margin-top: 1px;
        }

        /* paid stamp */
        .rec-paid-stamp {
          margin-left: auto;
          position: relative; z-index: 1;
          background: rgba(16,185,129,0.2);
          border: 1.5px solid rgba(16,185,129,0.5);
          border-radius: 8px;
          padding: 5px 12px;
          font-family: 'Syne', sans-serif;
          font-size: 0.72rem;
          font-weight: 800;
          color: #34d399;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transform: rotate(-2deg);
        }

        /* body */
        .rec-body {
          background: var(--surface);
          border: 1px solid var(--border);
          border-top: none;
          padding: 0 26px;
        }

        /* dashed tear line */
        .rec-tear {
          display: flex; align-items: center; gap: 0;
          margin: 0 -26px;
          position: relative;
        }
        .rec-tear-circle {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: var(--bg);
          flex-shrink: 0;
          border: 1px solid var(--border);
        }
        .rec-tear-line {
          flex: 1;
          border: none;
          border-top: 2px dashed rgba(255,255,255,0.08);
          margin: 0;
        }

        .rec-section { padding: 20px 0; border-bottom: 1px solid var(--border); }
        .rec-section:last-child { border-bottom: none; }

        .rec-section-label {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted2);
          margin-bottom: 14px;
        }

        /* route row */
        .rec-route {
          display: flex; gap: 12px; align-items: stretch;
        }
        .rec-route-dots {
          display: flex; flex-direction: column; align-items: center;
          padding-top: 3px;
          gap: 0;
        }
        .rdot {
          width: 10px; height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .rdot-green { background: var(--green); box-shadow: 0 0 8px rgba(16,185,129,0.5); }
        .rdot-red   { background: #f43f5e; box-shadow: 0 0 8px rgba(244,63,94,0.5); }
        .rline {
          width: 1px; flex: 1; min-height: 24px;
          background: linear-gradient(to bottom, var(--green), #f43f5e);
          opacity: 0.3;
          margin: 3px 0;
        }
        .rec-route-locs { flex: 1; display: flex; flex-direction: column; gap: 16px; }
        .rec-loc-label  { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted2); font-weight: 500; margin-bottom: 2px; }
        .rec-loc-value  { font-size: 0.92rem; color: var(--text); font-weight: 500; }

        /* fare breakdown */
        .fare-rows { display: flex; flex-direction: column; gap: 10px; }
        .fare-row  { display: flex; justify-content: space-between; align-items: center; }
        .fare-row-label { font-size: 0.85rem; color: var(--muted); }
        .fare-row-val   { font-size: 0.9rem;  color: var(--text);  font-weight: 500; }
        .fare-divider   { height: 1px; background: var(--border); margin: 4px 0; }
        .fare-total-label { font-family: 'Syne', sans-serif; font-size: 0.9rem; font-weight: 700; color: #fff; }
        .fare-total-val   {
          font-family: 'Syne', sans-serif;
          font-size: 1.4rem; font-weight: 900;
          letter-spacing: -0.03em;
          color: var(--green);
        }

        /* status + payment row */
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .meta-tile {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 11px;
          padding: 12px 14px;
        }
        .meta-tile-label { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted2); margin-bottom: 6px; font-weight: 600; }
        .meta-tile-val   { font-size: 0.85rem; font-weight: 600; }

        /* receipt id */
        .rec-id {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          color: var(--muted2);
          letter-spacing: 0.06em;
          text-align: center;
          padding: 14px 0 4px;
        }

        /* bottom card (rounded bottom) */
        .rec-bottom {
          background: var(--surface);
          border: 1px solid var(--border);
          border-top: none;
          border-radius: 0 0 20px 20px;
          padding: 0 26px 22px;
        }

        /* print / back buttons */
        .rec-actions {
          display: flex; gap: 10px;
          margin-top: 18px;
        }
        .rec-btn {
          flex: 1; padding: 12px;
          border-radius: 11px;
          font-family: 'Syne', sans-serif;
          font-size: 0.85rem; font-weight: 700;
          border: none; cursor: pointer;
          transition: transform 0.15s, opacity 0.15s;
          letter-spacing: 0.01em;
        }
        .rec-btn:hover { transform: translateY(-2px); opacity: 0.88; }

        .rec-btn-print {
          background: var(--violet-soft);
          border: 1px solid rgba(124,106,247,0.25);
          color: #a78bfa;
        }
        .rec-btn-home {
          background: linear-gradient(135deg, var(--violet), #a78bfa);
          color: #fff;
          box-shadow: 0 6px 20px var(--violet-glow);
        }
      `}</style>

      <div className="rec-root">
        <div className="rec-card">

          {/* top brand strip */}
          <div className="rec-top-strip">
            <div className="rec-brand-icon">🚖</div>
            <div className="rec-brand-text">
              <div className="rec-brand-name">RideApp</div>
              <div className="rec-brand-sub">Official Ride Receipt</div>
            </div>
            {isPaid && <div className="rec-paid-stamp">✓ Paid</div>}
          </div>

          {/* body */}
          <div className="rec-body">

            {/* tear line */}
            <div className="rec-tear">
              <div className="rec-tear-circle" />
              <div className="rec-tear-line" />
              <div className="rec-tear-circle" />
            </div>

            {/* route */}
            <div className="rec-section">
              <div className="rec-section-label">Route</div>
              <div className="rec-route">
                <div className="rec-route-dots">
                  <span className="rdot rdot-green" />
                  <div className="rline" />
                  <span className="rdot rdot-red" />
                </div>
                <div className="rec-route-locs">
                  <div>
                    <div className="rec-loc-label">Pickup</div>
                    <div className="rec-loc-value">{ride.pickup_location}</div>
                  </div>
                  <div>
                    <div className="rec-loc-label">Drop</div>
                    <div className="rec-loc-value">{ride.drop_location}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* fare */}
            <div className="rec-section">
              <div className="rec-section-label">Fare Breakdown</div>
              <div className="fare-rows">
                <div className="fare-row">
                  <span className="fare-row-label">Base Fare</span>
                  <span className="fare-row-val">₹{ride.fare}</span>
                </div>
                <div className="fare-row">
                  <span className="fare-row-label">Taxes & Fees</span>
                  <span className="fare-row-val">₹0</span>
                </div>
                <div className="fare-divider" />
                <div className="fare-row">
                  <span className="fare-total-label">Total Charged</span>
                  <span className="fare-total-val">₹{ride.fare}</span>
                </div>
              </div>
            </div>

            {/* meta */}
            <div className="rec-section">
              <div className="rec-section-label">Details</div>
              <div className="meta-grid">
                <div className="meta-tile">
                  <div className="meta-tile-label">Ride Status</div>
                  <div
                    className="meta-tile-val"
                    style={{ color: ride.status === "completed" ? "#10b981" : "#fbbf24" }}
                  >
                    {ride.status}
                  </div>
                </div>
                <div className="meta-tile">
                  <div className="meta-tile-label">Payment</div>
                  <div
                    className="meta-tile-val"
                    style={{ color: isPaid ? "#10b981" : "#fb923c" }}
                  >
                    {ride.payment_status}
                  </div>
                </div>
              </div>
            </div>

            {/* receipt id */}
            <div className="rec-id">
              RECEIPT ID · {String(rideId).slice(0, 16).toUpperCase()}
            </div>

          </div>

          {/* bottom with actions */}
          <div className="rec-bottom">
            <div className="rec-actions">
              <button className="rec-btn rec-btn-print" onClick={() => window.print()}>
                🖨 Print
              </button>
              <button className="rec-btn rec-btn-home" onClick={() => window.location.href = "/rider"}>
                ← Back to Rides
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}