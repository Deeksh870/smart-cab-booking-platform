"use client";

import { useState, useEffect } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import RideStatus from "@/app/components/RideStatus";
import Map from "@/app/components/Map";

export default function RiderPage() {

  const { user } = useUser();

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const [distance, setDistance] = useState(0);
  const [fare, setFare] = useState(0);

  const [loading, setLoading] = useState(false);
  const [activeRide, setActiveRide] = useState<any>(null);
  const [rideHistory, setRideHistory] = useState<any[]>([]);

  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const fetchRide = async () => {
    if (!user) return;

    const { data: active } = await supabase
      .from("rides")
      .select("*")
      .eq("rider_id", user.id)
      .not("status", "in", "(completed,cancelled)")
      .limit(1);

    const { data: completed } = await supabase
      .from("rides")
      .select("*")
      .eq("rider_id", user.id)
      .eq("status", "completed")
      .order("payment_status", { ascending: true });

    if (active && active.length > 0) {
      setActiveRide(active[0]);
    } else {
      setActiveRide(null);
    }

    setRideHistory(completed || []);
  };

  useEffect(() => {
    fetchRide();
    const interval = setInterval(() => { fetchRide(); }, 3000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (distance > 0) {
      const calculatedFare = Math.round(distance * 25);
      setFare(calculatedFare);
    }
  }, [distance]);

  const applyPromo = () => {
    const code = promoCode.toUpperCase();
    if (code === "SAVE50") { setDiscount(50); }
    else if (code === "SAVE100") { setDiscount(100); }
    else if (code === "WELCOME10") { setDiscount(Math.round(fare * 0.1)); }
    else if (code === "WELCOME20") { setDiscount(Math.round(fare * 0.2)); }
    else if (code === "FIRSTRIDE") { setDiscount(75); }
    else if (code === "CAB25") { setDiscount(Math.round(fare * 0.25)); }
    else { alert("Invalid Promo Code"); setDiscount(0); }
  };

  const handleBookRide = async () => {
    if (!pickup || !drop || !user?.id) return;

    const { data: existingRide } = await supabase
      .from("rides")
      .select("*")
      .eq("rider_id", user.id)
      .not("status", "in", "(completed,cancelled)")
      .limit(1);

    if (existingRide && existingRide.length > 0) {
      alert("You already have an active ride.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("rides").insert([{
      rider_id: user.id,
      pickup_location: pickup,
      drop_location: drop,
      fare: fare - discount,
      status: "requested",
      payment_status: "pending"
    }]);

    setLoading(false);

    if (!error) {
      setPickup("");
      setDrop("");
      setPromoCode("");
      setDiscount(0);
      fetchRide();
    }
  };

  const cancelRide = async (rideId: string) => {
    await supabase.from("rides").update({ status: "cancelled" }).eq("id", rideId);
    fetchRide();
  };

  const resetRide = async () => {
    if (!activeRide) return;
    await supabase.from("rides").update({ status: "completed", payment_status: "paid" }).eq("id", activeRide.id);
    fetchRide();
  };

  const handlePayment = async (rideId: string) => {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rideId, amount: 100 })
    });
    const data = await res.json();
    if (data?.url) { window.location.href = data.url; }
  };

  const submitRating = async () => {
    if (!selectedRide) return;
    await supabase.from("ratings").insert([{
      ride_id: selectedRide.id,
      rider_id: selectedRide.rider_id,
      driver_id: selectedRide.driver_id,
      rating,
      review
    }]);
    await supabase.from("rides").update({ rating_given: true }).eq("id", selectedRide.id);
    setSelectedRide(null);
    setRating(0);
    setReview("");
    fetchRide();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Satoshi:wght@300;400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        :root {
          --bg: #060810;
          --surface: #0d1120;
          --surface2: #111827;
          --surface3: #161e2e;
          --border: rgba(255,255,255,0.06);
          --border-hover: rgba(255,255,255,0.12);
          --violet: #7c6af7;
          --violet-soft: rgba(124,106,247,0.15);
          --violet-glow: rgba(124,106,247,0.25);
          --cyan: #22d3ee;
          --cyan-soft: rgba(34,211,238,0.12);
          --rose: #f43f5e;
          --rose-soft: rgba(244,63,94,0.12);
          --amber: #fbbf24;
          --amber-soft: rgba(251,191,36,0.12);
          --green: #10b981;
          --green-soft: rgba(16,185,129,0.12);
          --text: #e2e8f4;
          --muted: rgba(226,232,244,0.4);
          --muted2: rgba(226,232,244,0.22);
        }

        .rider-root {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', 'Satoshi', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* Mesh background */
        .rider-mesh {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background:
            radial-gradient(ellipse 70% 50% at 15% 20%, rgba(124,106,247,0.09) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 85% 75%, rgba(34,211,238,0.07) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 50% 100%, rgba(244,63,94,0.05) 0%, transparent 50%);
        }

        /* Subtle grid */
        .rider-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .rider-inner {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 36px 24px 72px;
        }

        /* ── HEADER ── */
        .rider-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 44px;
          animation: rFadeDown 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }

        .rider-header-left { display: flex; align-items: center; gap: 18px; }

        .rider-avatar-ring {
          width: 56px; height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, var(--violet), #a78bfa);
          display: flex; align-items: center; justify-content: center;
          font-size: 26px;
          box-shadow: 0 0 28px var(--violet-glow);
          flex-shrink: 0;
        }

        .rider-name {
          font-family: 'Syne', sans-serif;
          font-size: 1.85rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #fff;
          line-height: 1;
          margin-bottom: 5px;
        }

        .rider-tagline {
          font-size: 0.82rem;
          color: var(--muted);
          letter-spacing: 0.04em;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.03em;
          text-decoration: none;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text);
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
        }
        .nav-btn:hover {
          border-color: var(--border-hover);
          background: var(--surface2);
          transform: translateY(-1px);
        }

        /* ── SECTION LABEL ── */
        .section-label {
          font-family: 'Syne', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted2);
          margin-bottom: 14px;
        }

        /* ── MAIN GRID ── */
        .rider-main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
          animation: rFadeUp 0.6s 0.1s cubic-bezier(0.22,1,0.36,1) both;
        }
        @media (max-width: 780px) { .rider-main-grid { grid-template-columns: 1fr; } }

        /* ── PANEL ── */
        .r-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 22px;
          padding: 26px;
          position: relative;
          overflow: hidden;
        }

        .r-panel-title {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #fff;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .r-panel-icon {
          width: 30px; height: 30px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }
        .icon-violet { background: var(--violet-soft); }
        .icon-cyan   { background: var(--cyan-soft); }

        /* ── INPUTS ── */
        .r-input-wrap {
          position: relative;
          margin-bottom: 12px;
        }
        .r-input-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 13px;
          pointer-events: none;
        }
        .r-input {
          width: 100%;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 11px;
          padding: 12px 14px 12px 36px;
          color: var(--text);
          font-family: inherit;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .r-input::placeholder { color: var(--muted2); }
        .r-input:focus {
          border-color: rgba(124,106,247,0.5);
          box-shadow: 0 0 0 3px rgba(124,106,247,0.1);
        }
        .r-input:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        /* fare breakdown */
        .fare-box {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 14px 16px;
          margin: 14px 0;
        }
        .fare-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          padding: 3px 0;
        }
        .fare-row-label { color: var(--muted); }
        .fare-row-value { color: var(--text); font-weight: 500; }
        .fare-divider { height: 1px; background: var(--border); margin: 8px 0; }
        .fare-total-label { color: var(--text); font-weight: 600; font-size: 0.9rem; }
        .fare-total-value { color: var(--green); font-weight: 700; font-size: 1rem; }
        .fare-discount { color: var(--amber); font-weight: 500; }

        /* promo row */
        .promo-row {
          display: flex;
          gap: 8px;
          margin-top: 4px;
          margin-bottom: 14px;
        }
        .promo-input {
          flex: 1;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 10px 14px;
          color: var(--text);
          font-family: inherit;
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .promo-input::placeholder { text-transform: none; letter-spacing: 0; color: var(--muted2); }
        .promo-input:focus { border-color: rgba(251,191,36,0.4); }

        .promo-btn {
          padding: 10px 16px;
          border-radius: 10px;
          background: var(--amber-soft);
          border: 1px solid rgba(251,191,36,0.25);
          color: var(--amber);
          font-family: 'Syne', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .promo-btn:hover { background: rgba(251,191,36,0.2); transform: translateY(-1px); }

        /* ── BUTTONS ── */
        .r-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          border: none;
          cursor: pointer;
          transition: transform 0.15s, opacity 0.15s, box-shadow 0.15s;
        }
        .r-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .r-btn:active:not(:disabled) { transform: translateY(0); }
        .r-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        .r-btn-book {
          background: linear-gradient(135deg, var(--violet), #a78bfa);
          color: #fff;
          box-shadow: 0 8px 24px var(--violet-glow);
        }
        .r-btn-book-active {
          background: var(--surface2);
          color: var(--muted);
          border: 1px solid var(--border);
          box-shadow: none;
        }
        .r-btn-cancel {
          background: var(--rose-soft);
          border: 1px solid rgba(244,63,94,0.25);
          color: var(--rose);
          font-family: 'Syne', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 10px 18px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .r-btn-cancel:hover { background: rgba(244,63,94,0.2); transform: translateY(-1px); }

        .r-btn-dev {
          background: var(--amber-soft);
          border: 1px solid rgba(251,191,36,0.22);
          color: var(--amber);
          font-family: 'Syne', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 8px 14px;
          border-radius: 9px;
          cursor: pointer;
          transition: background 0.2s;
          letter-spacing: 0.03em;
        }
        .r-btn-dev:hover { background: rgba(251,191,36,0.2); }

        /* active ride detail rows */
        .ride-detail-row {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
          align-items: flex-start;
        }
        .ride-detail-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          margin-top: 5px;
          flex-shrink: 0;
        }
        .dot-g { background: var(--green); }
        .dot-r { background: var(--rose); }

        .ride-detail-label {
          font-size: 0.71rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--muted2);
          font-weight: 500;
        }
        .ride-detail-value {
          font-size: 0.88rem;
          color: var(--text);
          font-weight: 500;
        }

        .connector-stub {
          width: 1px; height: 16px;
          background: var(--border);
          margin: 2px 0 2px 3px;
        }

        .r-divider { height: 1px; background: var(--border); margin: 14px 0; }

        .status-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 999px;
          font-size: 0.74rem; font-weight: 600;
          letter-spacing: 0.05em; text-transform: capitalize;
        }
        .chip-requested { background: rgba(168,85,247,0.14); color: #c084fc; border: 1px solid rgba(168,85,247,0.28); }
        .chip-accepted  { background: rgba(59,130,246,0.14);  color: #60a5fa; border: 1px solid rgba(59,130,246,0.28); }
        .chip-ongoing   { background: rgba(34,211,238,0.12);  color: var(--cyan); border: 1px solid rgba(34,211,238,0.28); }
        .chip-completed { background: var(--green-soft);       color: var(--green); border: 1px solid rgba(16,185,129,0.28); }

        .ride-action-row {
          display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap;
        }

        /* ── MAP WRAPPER ── */
        .map-wrap {
          border-radius: 14px;
          overflow: hidden;
          margin: 14px 0;
          border: 1px solid var(--border);
        }

        /* ── RIDE HISTORY ── */
        .history-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 22px;
          padding: 26px;
          animation: rFadeUp 0.6s 0.2s cubic-bezier(0.22,1,0.36,1) both;
        }

        .history-card {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 18px;
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          transition: border-color 0.2s;
        }
        .history-card:hover { border-color: var(--border-hover); }
        .history-card:last-child { margin-bottom: 0; }

        .history-left { flex: 1; min-width: 0; }
        .history-right { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; flex-shrink: 0; }

        .h-loc-label {
          font-size: 0.7rem; text-transform: uppercase;
          letter-spacing: 0.07em; color: var(--muted2); font-weight: 500;
        }
        .h-loc-value { font-size: 0.88rem; color: var(--text); font-weight: 500; margin-top: 1px; }

        .h-btn {
          padding: 7px 14px;
          border-radius: 9px;
          font-size: 0.78rem;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
          cursor: pointer;
          border: none;
          transition: transform 0.15s, opacity 0.15s;
          text-decoration: none;
          display: inline-block;
          letter-spacing: 0.02em;
        }
        .h-btn:hover { transform: translateY(-1px); opacity: 0.88; }

        .h-btn-pay    { background: linear-gradient(135deg, #3b82f6, #2563eb); color: #fff; box-shadow: 0 4px 14px rgba(59,130,246,0.3); }
        .h-btn-receipt{ background: var(--violet-soft); color: #a78bfa; border: 1px solid rgba(124,106,247,0.25); }
        .h-btn-rate   { background: var(--amber-soft); color: var(--amber); border: 1px solid rgba(251,191,36,0.25); }

        .paid-tag {
          font-size: 0.76rem; font-weight: 600;
          color: var(--green); letter-spacing: 0.05em;
          display: flex; align-items: center; gap: 5px;
        }

        .empty-state { text-align:center; padding:32px 16px; color:var(--muted); }
        .empty-icon  { font-size:2rem; margin-bottom:10px; opacity:0.45; }
        .empty-text  { font-size:0.86rem; }

        /* ── RATING MODAL ── */
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          z-index: 100;
          animation: rFadeIn 0.25s ease both;
        }

        .modal-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 32px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6);
          animation: rScaleIn 0.3s cubic-bezier(0.22,1,0.36,1) both;
        }

        .modal-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #fff;
          margin-bottom: 6px;
        }
        .modal-sub {
          font-size: 0.82rem;
          color: var(--muted);
          margin-bottom: 22px;
        }

        .star-row {
          display: flex; gap: 8px; margin-bottom: 20px;
        }

        .star-btn {
          background: none; border: none; cursor: pointer;
          font-size: 1.8rem;
          transition: transform 0.15s;
          line-height: 1;
          padding: 0;
        }
        .star-btn:hover { transform: scale(1.2); }
        .star-lit   { filter: drop-shadow(0 0 6px rgba(251,191,36,0.6)); }
        .star-unlit { opacity: 0.2; }

        .r-textarea {
          width: 100%;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 11px;
          padding: 12px 14px;
          color: var(--text);
          font-family: inherit;
          font-size: 0.88rem;
          resize: none;
          outline: none;
          transition: border-color 0.2s;
          margin-bottom: 16px;
          min-height: 80px;
          box-sizing: border-box;
        }
        .r-textarea::placeholder { color: var(--muted2); }
        .r-textarea:focus { border-color: rgba(124,106,247,0.45); }

        .r-btn-submit {
          width: 100%;
          padding: 13px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--green), #059669);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem;
          font-weight: 800;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(16,185,129,0.3);
          transition: transform 0.15s, opacity 0.15s;
        }
        .r-btn-submit:hover { transform: translateY(-2px); opacity: 0.9; }

        /* animations */
        @keyframes rFadeDown  { from { opacity:0; transform: translateY(-18px); } to { opacity:1; transform:none; } }
        @keyframes rFadeUp    { from { opacity:0; transform: translateY(22px);  } to { opacity:1; transform:none; } }
        @keyframes rFadeIn    { from { opacity:0; } to { opacity:1; } }
        @keyframes rScaleIn   { from { opacity:0; transform: scale(0.93); } to { opacity:1; transform:none; } }
      `}</style>

      <div className="rider-root">
        <div className="rider-mesh" />
        <div className="rider-grid" />

        <div className="rider-inner">

          {/* ── HEADER ── */}
          <div className="rider-header">
            <div className="rider-header-left">
              <div className="rider-avatar-ring">👤</div>
              <div>
                <div className="rider-name">
                  Hey, {user?.firstName || "Rider"} 👋
                </div>
                <div className="rider-tagline">Book and manage your rides seamlessly.</div>
              </div>
            </div>

            <div className="header-actions">
              <a href="/support" className="nav-btn">🎧 Support</a>
              <a href="/profile" className="nav-btn">👤 Profile</a>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>

          {/* ── MAIN 2-COL ── */}
          <div className="rider-main-grid">

            {/* BOOK RIDE */}
            <div className="r-panel">
              <div className="r-panel-title">
                <span className="r-panel-icon icon-violet">🗺️</span>
                Book a Ride
              </div>

              <div className="r-input-wrap">
                <span className="r-input-icon">📍</span>
                <input
                  placeholder="Pickup location"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  disabled={!!activeRide}
                  className="r-input"
                />
              </div>

              <div className="r-input-wrap">
                <span className="r-input-icon">🏁</span>
                <input
                  placeholder="Drop location"
                  value={drop}
                  onChange={(e) => setDrop(e.target.value)}
                  disabled={!!activeRide}
                  className="r-input"
                />
              </div>

              {!activeRide && pickup && drop && (
                <div className="map-wrap">
                  <Map pickup={pickup} drop={drop} setDistance={setDistance} />
                </div>
              )}

              {activeRide && (
                <div className="map-wrap">
                  <Map
                    pickup={activeRide.pickup_location}
                    drop={activeRide.drop_location}
                    setDistance={() => {}}
                    rideStatus={activeRide.status}
                  />
                </div>
              )}

              {distance > 0 && (
                <div className="fare-box">
                  <div className="fare-row">
                    <span className="fare-row-label">Distance</span>
                    <span className="fare-row-value">{distance.toFixed(2)} km</span>
                  </div>
                  <div className="fare-row">
                    <span className="fare-row-label">Base Fare</span>
                    <span className="fare-row-value">₹{fare}</span>
                  </div>
                  {discount > 0 && (
                    <div className="fare-row">
                      <span className="fare-row-label">Promo Discount</span>
                      <span className="fare-discount">− ₹{discount}</span>
                    </div>
                  )}
                  <div className="fare-divider" />
                  <div className="fare-row">
                    <span className="fare-total-label">Total Fare</span>
                    <span className="fare-total-value">₹{fare - discount}</span>
                  </div>
                </div>
              )}

              <div className="promo-row">
                <input
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="promo-input"
                />
                <button onClick={applyPromo} className="promo-btn">Apply</button>
              </div>

              <button
                onClick={handleBookRide}
                disabled={loading || !!activeRide}
                className={`r-btn ${activeRide ? "r-btn-book-active" : "r-btn-book"}`}
              >
                {loading ? "Booking…" : activeRide ? "Ride In Progress" : "Book Ride →"}
              </button>
            </div>

            {/* ACTIVE RIDE */}
            <div className="r-panel">
              <div className="r-panel-title">
                <span className="r-panel-icon icon-cyan">⚡</span>
                Active Ride
              </div>

              {activeRide ? (
                <div>
                  <div style={{ display:"flex", gap:"10px" }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", paddingTop:"14px" }}>
                      <span className="ride-detail-dot dot-g" />
                      <div className="connector-stub" />
                      <span className="ride-detail-dot dot-r" />
                    </div>
                    <div style={{ flex:1 }}>
                      <div className="ride-detail-row" style={{ marginBottom:"10px" }}>
                        <div>
                          <div className="ride-detail-label">Pickup</div>
                          <div className="ride-detail-value">{activeRide.pickup_location}</div>
                        </div>
                      </div>
                      <div style={{ marginBottom:"4px" }}>
                        <div className="ride-detail-label">Drop</div>
                        <div className="ride-detail-value">{activeRide.drop_location}</div>
                      </div>
                    </div>
                  </div>

                  <div className="r-divider" />

                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px" }}>
                    <span style={{ fontSize:"0.78rem", color:"var(--muted)", fontWeight:500 }}>Status</span>
                    <span className={`status-chip chip-${activeRide.status}`}>
                      {activeRide.status}
                    </span>
                  </div>

                  <RideStatus status={activeRide.status} />

                  <div className="ride-action-row">
                    {(activeRide.status === "requested" || activeRide.status === "accepted") && (
                      <button onClick={() => cancelRide(activeRide.id)} className="r-btn-cancel">
                        ✕ Cancel Ride
                      </button>
                    )}
                    <button onClick={resetRide} className="r-btn-dev">
                      ⟳ Reset (Dev)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🚕</div>
                  <div className="empty-text">No active ride.<br />Book one from the left panel.</div>
                </div>
              )}
            </div>

          </div>

          {/* ── RIDE HISTORY ── */}
          <div className="history-panel">
            <div className="r-panel-title" style={{ marginBottom:"20px" }}>
              <span className="r-panel-icon" style={{ background:"rgba(34,211,238,0.1)" }}>🕒</span>
              Ride History
              {rideHistory.length > 0 && (
                <span style={{ marginLeft:"auto", fontSize:"0.76rem", fontWeight:500, fontFamily:"inherit", color:"var(--muted)", letterSpacing:"0.04em" }}>
                  {rideHistory.length} ride{rideHistory.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {rideHistory.length > 0 ? rideHistory.map((ride) => (
              <div key={ride.id} className="history-card">
                <div className="history-left">
                  <div style={{ display:"flex", gap:"8px", marginBottom:"10px" }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", paddingTop:"12px" }}>
                      <span className="ride-detail-dot dot-g" style={{ width:"7px", height:"7px" }} />
                      <div style={{ width:"1px", height:"14px", background:"var(--border)" }} />
                      <span className="ride-detail-dot dot-r" style={{ width:"7px", height:"7px" }} />
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ marginBottom:"8px" }}>
                        <div className="h-loc-label">Pickup</div>
                        <div className="h-loc-value">{ride.pickup_location}</div>
                      </div>
                      <div>
                        <div className="h-loc-label">Drop</div>
                        <div className="h-loc-value">{ride.drop_location}</div>
                      </div>
                    </div>
                  </div>
                  <span className={`status-chip chip-${ride.status}`} style={{ fontSize:"0.7rem" }}>
                    {ride.status}
                  </span>
                </div>

                <div className="history-right">
                  {ride.payment_status !== "paid" && (
                    <button onClick={() => handlePayment(ride.id)} className="h-btn h-btn-pay">
                      Pay ₹100
                    </button>
                  )}

                  {ride.payment_status === "paid" && (
                    <span className="paid-tag">✓ Paid</span>
                  )}

                  {ride.payment_status === "paid" && (
                    <a href={`/receipt/${ride.id}`} className="h-btn h-btn-receipt">
                      Receipt
                    </a>
                  )}

                  {ride.payment_status === "paid" && !ride.rating_given && (
                    <button onClick={() => setSelectedRide(ride)} className="h-btn h-btn-rate">
                      ★ Rate
                    </button>
                  )}
                </div>
              </div>
            )) : (
              <div className="empty-state">
                <div className="empty-icon">🛣️</div>
                <div className="empty-text">No completed rides yet.<br />Your history will appear here.</div>
              </div>
            )}
          </div>

        </div>

        {/* ── RATING MODAL ── */}
        {selectedRide && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-title">Rate your driver</div>
              <div className="modal-sub">How was your ride experience?</div>

              <div className="star-row">
                {[1,2,3,4,5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`star-btn ${rating >= star ? "star-lit" : "star-unlit"}`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Share your experience (optional)…"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="r-textarea"
                rows={3}
              />

              <button onClick={submitRating} className="r-btn-submit">
                Submit Rating ✓
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
