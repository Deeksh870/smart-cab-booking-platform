"use client";

import { useEffect, useState } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

export default function DriverPage() {

  const { user } = useUser();

  const [availableRides, setAvailableRides] = useState<any[]>([]);
  const [activeRide, setActiveRide] = useState<any>(null);

  const [totalRides, setTotalRides] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const [ratings, setRatings] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState<number>(0);

  const fetchRides = async () => {

    if (!user) return;

    const { data: requested } = await supabase
      .from("rides")
      .select("*")
      .eq("status", "requested")
      .is("driver_id", null);

    const { data: driverRide } = await supabase
  .from("rides")
  .select("*")
  .eq("driver_id", user.id)
  .not("status", "in", "(completed,cancelled)")
  .limit(1);

    setAvailableRides(requested || []);

    if (driverRide && driverRide.length > 0) {
      setActiveRide(driverRide[0]);
    } else {
      setActiveRide(null);
    }

    fetchDriverStats();
    fetchRatings();
  };

  const fetchDriverStats = async () => {

    if (!user) return;

    const { data } = await supabase
      .from("rides")
      .select("*")
      .eq("driver_id", user.id)
      .eq("status", "completed")
      .eq("payment_status", "paid");

    if (data) {

      setTotalRides(data.length);

      const earnings = data.reduce((sum, ride) => {
        return sum + (ride.fare || 0);
      }, 0);

      setTotalEarnings(earnings);
    }
  };

  const fetchRatings = async () => {

    if (!user) return;

    const { data } = await supabase
      .from("ratings")
      .select("*")
      .eq("driver_id", user.id);

    if (data) {

      setRatings(data);

      const total = data.reduce((sum, r) => sum + r.rating, 0);

      const avg = data.length ? total / data.length : 0;

      setAvgRating(Number(avg.toFixed(1)));
    }
  };

  useEffect(() => {

  fetchRides();

  if (!user) return;

  const channel = supabase
    .channel("ride-updates")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "rides"
      },
      () => {
        fetchRides();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };

}, [user]);

  const acceptRide = async (rideId: string) => {

    if (!user) return;

    await supabase
      .from("rides")
      .update({
        driver_id: user.id,
        status: "accepted",
      })
      .eq("id", rideId);

    fetchRides();
  };

  const startRide = async () => {

    if (!activeRide) return;

    await supabase
      .from("rides")
      .update({ status: "ongoing" })
      .eq("id", activeRide.id);

    fetchRides();
  };

  const completeRide = async () => {

    if (!activeRide) return;

    await supabase
      .from("rides")
      .update({ status: "completed" })
      .eq("id", activeRide.id);

    fetchRides();
  };

  const getStatusColor = (status: string) => {

    if (status === "accepted") return "bg-blue-600";
    if (status === "ongoing") return "bg-yellow-500";
    if (status === "completed") return "bg-green-600";

    return "bg-purple-600";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Sans:ital,wght@0,400;0,500;1,400&display=swap');

        :root {
          --bg:       #080b10;
          --surface:  #0e1420;
          --surface2: #131a28;
          --border:   rgba(255,255,255,0.07);
          --amber:    #f5a623;
          --amber-glow: rgba(245,166,35,0.18);
          --teal:     #00d4aa;
          --teal-glow: rgba(0,212,170,0.15);
          --red:      #ff4d6d;
          --text:     #e8ecf0;
          --muted:    rgba(232,236,240,0.45);
        }

        .driver-root {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: 'Instrument Sans', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* Ambient background blobs */
        .driver-root::before {
          content: '';
          position: fixed;
          top: -20%;
          left: -10%;
          width: 55vw;
          height: 55vw;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }
        .driver-root::after {
          content: '';
          position: fixed;
          bottom: -15%;
          right: -10%;
          width: 45vw;
          height: 45vw;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,212,170,0.07) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }

        .driver-inner {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 36px 24px 60px;
        }

        /* ── HEADER ── */
        .driver-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 48px;
          animation: fadeSlideDown 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }

        .driver-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .driver-badge {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--amber), #e8832a);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 0 24px var(--amber-glow);
          flex-shrink: 0;
        }

        .driver-title {
          font-family: 'Cabinet Grotesk', sans-serif;
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #fff;
          line-height: 1;
          margin-bottom: 4px;
        }

        .driver-subtitle {
          font-size: 0.85rem;
          color: var(--muted);
          letter-spacing: 0.04em;
        }

        /* live dot */
        .live-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(0,212,170,0.1);
          border: 1px solid rgba(0,212,170,0.25);
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--teal);
          margin-top: 8px;
          letter-spacing: 0.05em;
        }
        .live-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--teal);
          animation: livePulse 1.6s ease-in-out infinite;
        }
        @keyframes livePulse {
          0%,100% { opacity:1; transform: scale(1); }
          50%      { opacity:.4; transform: scale(1.5); }
        }

        /* ── STATS ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 28px;
          animation: fadeSlideUp 0.6s 0.1s cubic-bezier(0.22,1,0.36,1) both;
        }
        @media (max-width: 680px) {
          .stats-grid { grid-template-columns: 1fr; }
        }

        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px 22px;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.4);
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          border-radius: 20px 20px 0 0;
        }
        .stat-card.amber::before { background: linear-gradient(90deg, var(--amber), transparent); }
        .stat-card.teal::before  { background: linear-gradient(90deg, var(--teal),  transparent); }
        .stat-card.gold::before  { background: linear-gradient(90deg, #ffd700,      transparent); }

        .stat-icon {
          font-size: 1.5rem;
          margin-bottom: 14px;
          display: block;
        }
        .stat-label {
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 6px;
        }
        .stat-value {
          font-family: 'Cabinet Grotesk', sans-serif;
          font-size: 2.4rem;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #fff;
          line-height: 1;
        }
        .stat-sub {
          font-size: 0.76rem;
          color: var(--muted);
          margin-top: 6px;
        }

        /* ── MAIN 2-COL ── */
        .main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
          animation: fadeSlideUp 0.6s 0.2s cubic-bezier(0.22,1,0.36,1) both;
        }
        @media (max-width: 780px) {
          .main-grid { grid-template-columns: 1fr; }
        }

        .panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 22px;
          padding: 26px;
          position: relative;
          overflow: hidden;
        }

        .panel-title {
          font-family: 'Cabinet Grotesk', sans-serif;
          font-size: 1.05rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #fff;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .panel-title-icon {
          width: 30px; height: 30px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
        }
        .icon-green { background: rgba(0,212,130,0.15); }
        .icon-amber { background: rgba(245,166,35,0.15); }

        /* ride card */
        .ride-card {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 12px;
          transition: border-color 0.2s;
        }
        .ride-card:hover { border-color: rgba(255,255,255,0.15); }
        .ride-card:last-child { margin-bottom: 0; }

        .ride-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 8px;
        }
        .ride-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          margin-top: 5px;
          flex-shrink: 0;
        }
        .dot-green { background: #00d482; }
        .dot-red   { background: var(--red); }

        .ride-label {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--muted);
          font-weight: 500;
        }
        .ride-value {
          font-size: 0.9rem;
          color: var(--text);
          font-weight: 500;
          margin-top: 1px;
        }

        /* connector line between pickup & drop */
        .ride-connector {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          margin: 0 3px;
        }
        .connector-line {
          width: 1px; height: 18px;
          background: var(--border);
        }

        /* status badge */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 11px;
          border-radius: 999px;
          font-size: 0.73rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: capitalize;
        }
        .status-accepted { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); }
        .status-ongoing  { background: rgba(245,166,35,0.15);  color: var(--amber); border: 1px solid rgba(245,166,35,0.3); }
        .status-completed{ background: rgba(0,212,130,0.15);   color: #00d482;  border: 1px solid rgba(0,212,130,0.3); }
        .status-requested{ background: rgba(168,85,247,0.15);  color: #c084fc;  border: 1px solid rgba(168,85,247,0.3); }

        /* buttons */
        .btn {
          width: 100%;
          padding: 13px;
          border-radius: 12px;
          font-family: 'Cabinet Grotesk', sans-serif;
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          border: none;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          margin-top: 14px;
        }
        .btn:hover  { transform: translateY(-2px); opacity: 0.92; }
        .btn:active { transform: translateY(0); }

        .btn-accept {
          background: linear-gradient(135deg, #00d482, #00b36e);
          color: #001a0e;
          box-shadow: 0 8px 24px rgba(0,212,130,0.3);
        }
        .btn-start {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #fff;
          box-shadow: 0 8px 24px rgba(59,130,246,0.3);
        }
        .btn-complete {
          background: linear-gradient(135deg, var(--amber), #e8832a);
          color: #1a0d00;
          box-shadow: 0 8px 24px var(--amber-glow);
        }

        /* empty state */
        .empty-state {
          text-align: center;
          padding: 30px 16px;
          color: var(--muted);
        }
        .empty-icon {
          font-size: 2.2rem;
          margin-bottom: 10px;
          opacity: 0.5;
        }
        .empty-text {
          font-size: 0.88rem;
          letter-spacing: 0.02em;
        }

        /* ── REVIEWS ── */
        .reviews-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 22px;
          padding: 26px;
          animation: fadeSlideUp 0.6s 0.3s cubic-bezier(0.22,1,0.36,1) both;
        }

        .review-card {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 16px 18px;
          margin-bottom: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .review-card:last-child { margin-bottom: 0; }

        .review-stars {
          display: flex;
          gap: 3px;
        }
        .star {
          font-size: 0.85rem;
        }

        .review-text {
          font-size: 0.88rem;
          color: rgba(232,236,240,0.75);
          font-style: italic;
          line-height: 1.5;
        }
        .review-text::before { content: '"'; }
        .review-text::after  { content: '"'; }

        /* divider line in active ride */
        .ride-divider {
          height: 1px;
          background: var(--border);
          margin: 14px 0;
        }

        /* scrollbar in available rides if many */
        .rides-scroll {
          max-height: 380px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
        }

        /* animations */
        @keyframes fadeSlideDown {
          from { opacity:0; transform: translateY(-20px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity:0; transform: translateY(24px); }
          to   { opacity:1; transform: translateY(0); }
        }
      `}</style>

      <div className="driver-root">
        <div className="driver-inner">

          {/* ── HEADER ── */}
          <div className="driver-header">
            <div className="driver-header-left">
              <div className="driver-badge">🚖</div>
              <div>
                <div className="driver-title">Driver Dashboard</div>
                <div className="driver-subtitle">
                  Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
                </div>
                <div className="live-pill">
                  <span className="live-dot" />
                  Live Updates On
                </div>
              </div>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>

          {/* ── STATS ── */}
          <div className="stats-grid">
            <div className="stat-card amber">
              <span className="stat-icon">🏁</span>
              <div className="stat-label">Rides Completed</div>
              <div className="stat-value">{totalRides}</div>
              <div className="stat-sub">All-time total</div>
            </div>

            <div className="stat-card teal">
              <span className="stat-icon">💰</span>
              <div className="stat-label">Total Earnings</div>
              <div className="stat-value">₹{totalEarnings.toLocaleString()}</div>
              <div className="stat-sub">Paid rides only</div>
            </div>

            <div className="stat-card gold">
              <span className="stat-icon">⭐</span>
              <div className="stat-label">Driver Rating</div>
              <div className="stat-value">{avgRating || "—"}</div>
              <div className="stat-sub">
                {ratings.length > 0
                  ? `Based on ${ratings.length} review${ratings.length > 1 ? "s" : ""}`
                  : "No reviews yet"}
              </div>
            </div>
          </div>

          {/* ── MAIN PANELS ── */}
          <div className="main-grid">

            {/* Available Rides */}
            <div className="panel">
              <div className="panel-title">
                <span className="panel-title-icon icon-green">🗺️</span>
                Available Rides
              </div>

              {availableRides.length > 0 ? (
                <div className="rides-scroll">
                  {availableRides.map((ride) => (
                    <div key={ride.id} className="ride-card">
                      <div style={{ display: "flex", gap: "12px" }}>
                        <div className="ride-connector">
                          <span className="ride-dot dot-green" style={{ marginTop: 14 }} />
                          <div className="connector-line" />
                          <span className="ride-dot dot-red" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ marginBottom: "12px" }}>
                            <div className="ride-label">Pickup</div>
                            <div className="ride-value">{ride.pickup_location}</div>
                          </div>
                          <div>
                            <div className="ride-label">Drop</div>
                            <div className="ride-value">{ride.drop_location}</div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => acceptRide(ride.id)}
                        className="btn btn-accept"
                      >
                        Accept Ride →
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🛣️</div>
                  <div className="empty-text">No rides available right now.<br />Check back shortly.</div>
                </div>
              )}
            </div>

            {/* Active Ride */}
            <div className="panel">
              <div className="panel-title">
                <span className="panel-title-icon icon-amber">⚡</span>
                Active Ride
              </div>

              {activeRide ? (
                <div>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
                    <div className="ride-connector">
                      <span className="ride-dot dot-green" style={{ marginTop: 14 }} />
                      <div className="connector-line" />
                      <span className="ride-dot dot-red" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: "12px" }}>
                        <div className="ride-label">Pickup</div>
                        <div className="ride-value">{activeRide.pickup_location}</div>
                      </div>
                      <div>
                        <div className="ride-label">Drop</div>
                        <div className="ride-value">{activeRide.drop_location}</div>
                      </div>
                    </div>
                  </div>

                  <div className="ride-divider" />

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span className="ride-label">Status</span>
                    <span className={`status-badge status-${activeRide.status}`}>
                      {activeRide.status === "accepted" && "● "}
                      {activeRide.status === "ongoing"  && "▶ "}
                      {activeRide.status}
                    </span>
                  </div>

                  {activeRide.status === "accepted" && (
                    <button onClick={startRide} className="btn btn-start">
                      ▶ &nbsp;Start Ride
                    </button>
                  )}

                  {activeRide.status === "ongoing" && (
                    <button onClick={completeRide} className="btn btn-complete">
                      ✓ &nbsp;Complete Ride
                    </button>
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🚦</div>
                  <div className="empty-text">No active ride.<br />Accept one from the left panel.</div>
                </div>
              )}
            </div>

          </div>

          {/* ── REVIEWS ── */}
          <div className="reviews-panel">
            <div className="panel-title">
              <span className="panel-title-icon" style={{ background: "rgba(255,215,0,0.12)" }}>⭐</span>
              Rider Reviews
              {ratings.length > 0 && (
                <span style={{
                  marginLeft: "auto",
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  fontFamily: "inherit",
                  color: "var(--muted)",
                  letterSpacing: "0.04em"
                }}>
                  {ratings.length} review{ratings.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {ratings.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
                {ratings.map((r) => (
                  <div key={r.id} className="review-card">
                    <div className="review-stars">
                      {[1,2,3,4,5].map((n) => (
                        <span key={n} className="star" style={{ color: n <= r.rating ? "#ffd700" : "rgba(255,255,255,0.15)" }}>
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="review-text">
                      {r.review || "No review provided"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <div className="empty-text">No reviews yet. Complete rides to earn ratings.</div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
