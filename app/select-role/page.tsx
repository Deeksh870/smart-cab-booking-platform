"use client";

import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SelectRolePage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const chooseRole = async (role: string) => {
    if (!user) return;

    setLoading(true);
    setSelected(role);

    const { error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      alert(error.message);
      setSelected(null);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --bg:         #07090f;
          --surface:    #0d1120;
          --surface2:   #121827;
          --border:     rgba(255,255,255,0.07);
          --violet:     #7c6af7;
          --violet-g:   rgba(124,106,247,0.28);
          --amber:      #fbbf24;
          --amber-g:    rgba(251,191,36,0.25);
          --text:       #e2e8f4;
          --muted:      rgba(226,232,244,0.42);
        }

        .sr-root {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: var(--bg);
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        /* ambient blobs */
        .sr-root::before {
          content: '';
          position: fixed; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 55% 45% at 20% 30%,  rgba(124,106,247,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 45% 40% at 85% 75%,  rgba(251,191,36,0.07) 0%, transparent 55%);
        }

        .sr-grid {
          position: fixed; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px);
          background-size: 52px 52px;
        }

        .sr-inner {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; align-items: center;
          text-align: center;
          max-width: 560px; width: 100%;
          animation: srUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes srUp {
          from { opacity:0; transform: translateY(28px) scale(0.97); }
          to   { opacity:1; transform: none; }
        }

        /* top eyebrow */
        .sr-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 5px 14px;
          font-size: 0.74rem;
          font-weight: 500;
          color: var(--muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 22px;
        }
        .sr-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--violet);
          box-shadow: 0 0 8px var(--violet-g);
          animation: eyePulse 2s ease-in-out infinite;
        }
        @keyframes eyePulse {
          0%,100% { opacity:1; } 50% { opacity:0.4; }
        }

        .sr-title {
          font-family: 'Syne', sans-serif;
          font-size: 2.4rem;
          font-weight: 800;
          letter-spacing: -0.05em;
          color: #fff;
          line-height: 1.05;
          margin-bottom: 10px;
        }
        .sr-sub {
          font-size: 0.9rem;
          color: var(--muted);
          line-height: 1.65;
          max-width: 340px;
          margin-bottom: 44px;
        }

        /* cards grid */
        .sr-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          width: 100%;
          margin-bottom: 28px;
        }
        @media (max-width: 480px) { .sr-cards { grid-template-columns: 1fr; } }

        .sr-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 22px;
          padding: 32px 24px 26px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          text-align: left;
          transition: border-color 0.25s, transform 0.2s, box-shadow 0.25s;
          outline: none;
        }
        .sr-card:hover {
          transform: translateY(-4px);
        }
        .sr-card:active { transform: translateY(-1px); }

        /* top accent bar */
        .sr-card::before {
          content: '';
          position: absolute; top:0; left:0; right:0; height:2px;
          border-radius: 22px 22px 0 0;
          transition: opacity 0.3s;
          opacity: 0.5;
        }
        .sr-card:hover::before { opacity: 1; }

        .sr-card.rider::before  { background: linear-gradient(90deg, var(--violet), #a78bfa); }
        .sr-card.driver::before { background: linear-gradient(90deg, var(--amber), #fde68a); }

        .sr-card.rider:hover  { border-color: rgba(124,106,247,0.35); box-shadow: 0 16px 40px rgba(124,106,247,0.15); }
        .sr-card.driver:hover { border-color: rgba(251,191,36,0.35);  box-shadow: 0 16px 40px rgba(251,191,36,0.12);  }

        /* selected state */
        .sr-card.selected-rider  { border-color: rgba(124,106,247,0.5); box-shadow: 0 0 0 3px rgba(124,106,247,0.15), 0 16px 40px rgba(124,106,247,0.2); }
        .sr-card.selected-driver { border-color: rgba(251,191,36,0.5);  box-shadow: 0 0 0 3px rgba(251,191,36,0.12),  0 16px 40px rgba(251,191,36,0.15); }

        /* card icon */
        .sr-card-icon {
          width: 54px; height: 54px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px;
          margin-bottom: 18px;
        }
        .rider  .sr-card-icon { background: rgba(124,106,247,0.14); }
        .driver .sr-card-icon { background: rgba(251,191,36,0.12); }

        .sr-card-name {
          font-family: 'Syne', sans-serif;
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #fff;
          margin-bottom: 6px;
        }
        .sr-card-desc {
          font-size: 0.82rem;
          color: var(--muted);
          line-height: 1.55;
          margin-bottom: 18px;
        }

        /* perks list */
        .sr-perks { display: flex; flex-direction: column; gap: 6px; }
        .sr-perk  { display: flex; align-items: center; gap: 8px; font-size: 0.78rem; color: var(--muted); }
        .sr-perk-dot {
          width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0;
        }
        .rider  .sr-perk-dot { background: #a78bfa; }
        .driver .sr-perk-dot { background: var(--amber); }

        /* choose arrow badge */
        .sr-choose-arrow {
          position: absolute;
          bottom: 18px; right: 18px;
          width: 28px; height: 28px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px;
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.2s, transform 0.2s;
        }
        .sr-card:hover .sr-choose-arrow { opacity: 1; transform: translateX(0); }
        .rider  .sr-choose-arrow { background: rgba(124,106,247,0.2); color: #a78bfa; }
        .driver .sr-choose-arrow { background: rgba(251,191,36,0.15);  color: var(--amber); }

        /* loading state */
        .sr-loading {
          display: flex; align-items: center; gap: 10px;
          font-size: 0.82rem; color: var(--muted);
          letter-spacing: 0.06em; text-transform: uppercase;
        }
        .sr-spinner {
          width: 16px; height: 16px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.1);
          border-top-color: var(--violet);
          animation: srSpin 0.7s linear infinite;
        }
        @keyframes srSpin { to { transform: rotate(360deg); } }

        .sr-footer {
          font-size: 0.76rem;
          color: rgba(226,232,244,0.2);
          letter-spacing: 0.03em;
        }
      `}</style>

      <div className="sr-root">
        <div className="sr-grid" />

        <div className="sr-inner">

          <div className="sr-eyebrow">
            <span className="sr-eyebrow-dot" />
            One-time setup
          </div>

          <h1 className="sr-title">How will you<br />use the app?</h1>
          <p className="sr-sub">
            Choose your role to get started. This sets up your experience — you can always switch later.
          </p>

          <div className="sr-cards">

            {/* RIDER card */}
            <button
              onClick={() => chooseRole("rider")}
              disabled={loading}
              className={`sr-card rider ${selected === "rider" ? "selected-rider" : ""}`}
            >
              <div className="sr-card-icon">🧑‍💼</div>
              <div className="sr-card-name">Rider</div>
              <div className="sr-card-desc">Book rides and get to your destination comfortably.</div>
              <div className="sr-perks">
                <div className="sr-perk"><span className="sr-perk-dot" />Book rides instantly</div>
                <div className="sr-perk"><span className="sr-perk-dot" />Track driver live</div>
                <div className="sr-perk"><span className="sr-perk-dot" />Secure payments</div>
              </div>
              <div className="sr-choose-arrow">→</div>
            </button>

            {/* DRIVER card */}
            <button
              onClick={() => chooseRole("driver")}
              disabled={loading}
              className={`sr-card driver ${selected === "driver" ? "selected-driver" : ""}`}
            >
              <div className="sr-card-icon">🚖</div>
              <div className="sr-card-name">Driver</div>
              <div className="sr-card-desc">Accept ride requests and earn on your schedule.</div>
              <div className="sr-perks">
                <div className="sr-perk"><span className="sr-perk-dot" />Flexible hours</div>
                <div className="sr-perk"><span className="sr-perk-dot" />Real-time requests</div>
                <div className="sr-perk"><span className="sr-perk-dot" />Track your earnings</div>
              </div>
              <div className="sr-choose-arrow">→</div>
            </button>

          </div>

          {loading ? (
            <div className="sr-loading">
              <div className="sr-spinner" />
              Setting up your account…
            </div>
          ) : (
            <p className="sr-footer">Your choice is saved securely to your account.</p>
          )}

        </div>
      </div>
    </>
  );
}