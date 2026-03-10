"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rideId = searchParams.get("rideId");

  useEffect(() => {
    const updatePayment = async () => {
      if (!rideId) return;

      await supabase
        .from("rides")
        .update({ payment_status: "paid" })
        .eq("id", rideId);
    };

    updatePayment();
  }, [rideId]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --bg:         #07090f;
          --surface:    #0d1120;
          --border:     rgba(255,255,255,0.07);
          --green:      #10b981;
          --green-glow: rgba(16,185,129,0.35);
          --green-soft: rgba(16,185,129,0.12);
          --violet:     #7c6af7;
          --text:       #e2e8f4;
          --muted:      rgba(226,232,244,0.45);
        }

        .ps-root {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: var(--bg);
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          overflow: hidden;
          position: relative;
        }

        /* ambient bg */
        .ps-root::before {
          content: '';
          position: fixed; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 55% 45% at 50% 40%, rgba(16,185,129,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 40% 35% at 20% 80%, rgba(124,106,247,0.07) 0%, transparent 55%);
        }

        /* confetti particles */
        .ps-particle {
          position: fixed;
          top: -10px;
          width: 8px; height: 8px;
          border-radius: 2px;
          animation: psFall linear infinite;
          opacity: 0;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes psFall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 0; }
          10%  { opacity: 0.85; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }

        .ps-inner {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; align-items: center;
          text-align: center;
          padding: 24px;
          animation: psUp 0.75s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes psUp {
          from { opacity:0; transform: translateY(30px) scale(0.96); }
          to   { opacity:1; transform: none; }
        }

        /* checkmark ring */
        .ps-check-wrap {
          position: relative;
          width: 110px; height: 110px;
          margin-bottom: 30px;
        }

        /* outer spinning ring */
        .ps-ring {
          position: absolute; inset: 0;
          border-radius: 50%;
          border: 2px solid transparent;
          background:
            linear-gradient(var(--bg), var(--bg)) padding-box,
            conic-gradient(var(--green), rgba(16,185,129,0.1) 60%, var(--green) 100%) border-box;
          animation: psRingSpin 3s linear infinite;
        }
        @keyframes psRingSpin { to { transform: rotate(360deg); } }

        /* green circle */
        .ps-check-circle {
          position: absolute;
          inset: 10px;
          border-radius: 50%;
          background: var(--green-soft);
          border: 1.5px solid rgba(16,185,129,0.3);
          display: flex; align-items: center; justify-content: center;
          box-shadow:
            0 0 32px var(--green-glow),
            inset 0 0 20px rgba(16,185,129,0.08);
        }

        /* animated checkmark SVG */
        .ps-check-svg {
          width: 42px; height: 42px;
        }
        .ps-check-path {
          stroke: var(--green);
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: psDraw 0.5s 0.3s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes psDraw { to { stroke-dashoffset: 0; } }

        /* pulse ring behind circle */
        .ps-pulse {
          position: absolute; inset: 6px;
          border-radius: 50%;
          border: 1px solid rgba(16,185,129,0.25);
          animation: psPulse 2s ease-out infinite;
        }
        @keyframes psPulse {
          0%   { transform: scale(1);    opacity: 0.6; }
          100% { transform: scale(1.55); opacity: 0; }
        }

        /* title */
        .ps-title {
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #fff;
          margin-bottom: 10px;
          line-height: 1.1;
        }
        .ps-title span {
          background: linear-gradient(135deg, var(--green), #34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ps-sub {
          font-size: 0.9rem;
          color: var(--muted);
          line-height: 1.6;
          max-width: 300px;
          margin-bottom: 32px;
        }

        /* detail pill */
        .ps-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 8px 18px;
          font-size: 0.8rem;
          color: var(--muted);
          margin-bottom: 32px;
          letter-spacing: 0.03em;
        }
        .ps-pill-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 8px var(--green-glow);
        }

        /* button */
        .ps-btn {
          padding: 14px 40px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--green), #059669);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          border: none;
          cursor: pointer;
          box-shadow: 0 10px 30px var(--green-glow);
          transition: transform 0.15s, opacity 0.15s, box-shadow 0.15s;
          position: relative; overflow: hidden;
        }
        .ps-btn::before {
          content: '';
          position: absolute; top:0; left:-100%; width:60%; height:100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: left 0.5s ease;
        }
        .ps-btn:hover { transform: translateY(-2px); opacity:0.92; box-shadow: 0 16px 36px var(--green-glow); }
        .ps-btn:hover::before { left: 150%; }
        .ps-btn:active { transform: translateY(0); }
      `}</style>

      {/* confetti particles */}
      {[
        { left:"10%",  delay:"0s",   dur:"3.2s", color:"#7c6af7", rot:"12deg"  },
        { left:"20%",  delay:"0.4s", dur:"2.8s", color:"#10b981", rot:"-8deg"  },
        { left:"33%",  delay:"0.1s", dur:"3.5s", color:"#fbbf24", rot:"20deg"  },
        { left:"47%",  delay:"0.7s", dur:"2.6s", color:"#f472b6", rot:"-15deg" },
        { left:"58%",  delay:"0.2s", dur:"3.0s", color:"#10b981", rot:"5deg"   },
        { left:"70%",  delay:"0.9s", dur:"2.9s", color:"#7c6af7", rot:"-20deg" },
        { left:"82%",  delay:"0.3s", dur:"3.4s", color:"#fbbf24", rot:"10deg"  },
        { left:"90%",  delay:"0.6s", dur:"2.7s", color:"#f472b6", rot:"-5deg"  },
        { left:"25%",  delay:"1.1s", dur:"3.1s", color:"#22d3ee", rot:"18deg"  },
        { left:"65%",  delay:"1.4s", dur:"2.5s", color:"#10b981", rot:"-12deg" },
        { left:"42%",  delay:"1.8s", dur:"3.3s", color:"#a78bfa", rot:"8deg"   },
        { left:"75%",  delay:"2.1s", dur:"2.9s", color:"#fbbf24", rot:"-18deg" },
      ].map((p, i) => (
        <div
          key={i}
          className="ps-particle"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.dur,
            background: p.color,
            transform: `rotate(${p.rot})`,
          }}
        />
      ))}

      <div className="ps-root">
        <div className="ps-inner">

          {/* animated checkmark */}
          <div className="ps-check-wrap">
            <div className="ps-ring" />
            <div className="ps-pulse" />
            <div className="ps-check-circle">
              <svg className="ps-check-svg" viewBox="0 0 44 44">
                <path className="ps-check-path" d="M10 22 L19 31 L34 14" />
              </svg>
            </div>
          </div>

          <h1 className="ps-title">
            Payment <span>Successful</span>
          </h1>

          <p className="ps-sub">
            Your ride payment has been completed.<br />
            Thank you for riding with us!
          </p>

          <div className="ps-pill">
            <span className="ps-pill-dot" />
            Transaction confirmed · Ride settled
          </div>

          <button onClick={() => router.push("/rider")} className="ps-btn">
            Back to Dashboard →
          </button>

        </div>
      </div>
    </>
  );
}