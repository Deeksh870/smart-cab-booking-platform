type RideStatusProps = {
  status: string;
};

export default function RideStatus({ status }: RideStatusProps) {

  const getStep = () => {
    if (status === "requested") return 1;
    if (status === "accepted") return 2;
    if (status === "ongoing") return 2;
    if (status === "completed") return 3;
    return 1;
  };

  const step = getStep();

  const steps = [
    { n: 1, label: "Requested", icon: "📍", desc: "Looking for a driver" },
    { n: 2, label: "Accepted",  icon: "🚖", desc: "Driver on the way"   },
    { n: 3, label: "Completed", icon: "✓",  desc: "Ride finished"       },
  ];

  return (
    <>
      <style>{`
        .rs-wrap {
          margin-top: 18px;
          padding: 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          position: relative;
          overflow: hidden;
        }

        /* subtle top glow line */
        .rs-wrap::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(124,106,247,0.5), transparent);
        }

        /* progress track */
        .rs-track {
          display: flex;
          align-items: center;
          position: relative;
          margin-bottom: 14px;
        }

        .rs-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          position: relative;
          z-index: 1;
        }

        .rs-bubble {
          width: 40px; height: 40px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
          font-weight: 700;
          transition: all 0.4s ease;
          position: relative;
          flex-shrink: 0;
        }

        /* active / done */
        .rs-bubble-done {
          background: linear-gradient(135deg, #7c6af7, #a78bfa);
          box-shadow: 0 0 18px rgba(124,106,247,0.55), 0 0 6px rgba(124,106,247,0.3);
          color: #fff;
        }

        /* current (pulsing) */
        .rs-bubble-current {
          background: linear-gradient(135deg, #7c6af7, #a78bfa);
          box-shadow: 0 0 24px rgba(124,106,247,0.7);
          color: #fff;
          animation: rsBubblePulse 1.8s ease-in-out infinite;
        }
        @keyframes rsBubblePulse {
          0%,100% { box-shadow: 0 0 14px rgba(124,106,247,0.5); }
          50%      { box-shadow: 0 0 30px rgba(124,106,247,0.85); }
        }

        /* inactive */
        .rs-bubble-inactive {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(226,232,244,0.25);
        }

        /* connector line */
        .rs-line {
          flex: 1;
          height: 2px;
          margin: 0 6px;
          border-radius: 999px;
          position: relative;
          overflow: hidden;
          background: rgba(255,255,255,0.07);
          margin-top: -1px; /* align with bubble center */
        }

        .rs-line-fill {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .rs-line-fill-active {
          background: linear-gradient(90deg, #7c6af7, #a78bfa);
          transform: scaleX(1);
        }
        .rs-line-fill-inactive {
          background: linear-gradient(90deg, #7c6af7, #a78bfa);
          transform: scaleX(0);
        }

        /* animated traveling dot on active lines */
        .rs-line-dot {
          position: absolute;
          top: 50%; transform: translateY(-50%);
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 8px rgba(255,255,255,0.8);
          animation: rsDotTravel 1.6s ease-in-out infinite;
        }
        @keyframes rsDotTravel {
          0%   { left: 0%;   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }

        /* labels row */
        .rs-labels {
          display: flex;
          justify-content: space-between;
        }

        .rs-label-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          flex: 1;
        }

        .rs-label-name {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          transition: color 0.3s;
        }
        .rs-label-name-active   { color: #a78bfa; }
        .rs-label-name-inactive { color: rgba(226,232,244,0.25); }

        .rs-label-desc {
          font-size: 0.65rem;
          letter-spacing: 0.02em;
          color: rgba(226,232,244,0.2);
        }
        .rs-label-desc-active { color: rgba(167,139,250,0.5); }
      `}</style>

      <div className="rs-wrap">
        <div className="rs-track">
          {steps.map((s, i) => {
            const isDone    = step > s.n;
            const isCurrent = step === s.n;
            const isActive  = isDone || isCurrent;
            const lineActive = step > s.n; // line after this node

            return (
              <div key={s.n} style={{ display:"flex", alignItems:"center", flex: i < steps.length - 1 ? "1" : "0" }}>
                {/* node */}
                <div className="rs-node">
                  <div className={`rs-bubble ${isCurrent ? "rs-bubble-current" : isActive ? "rs-bubble-done" : "rs-bubble-inactive"}`}>
                    {isDone ? "✓" : s.icon}
                  </div>
                </div>

                {/* connector (not after last) */}
                {i < steps.length - 1 && (
                  <div className="rs-line" style={{ flex: 1 }}>
                    <div className={`rs-line-fill ${lineActive ? "rs-line-fill-active" : "rs-line-fill-inactive"}`} />
                    {isCurrent && <div className="rs-line-dot" />}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* labels */}
        <div className="rs-labels">
          {steps.map((s) => {
            const isActive = step >= s.n;
            return (
              <div key={s.n} className="rs-label-item">
                <span className={`rs-label-name ${isActive ? "rs-label-name-active" : "rs-label-name-inactive"}`}>
                  {s.label}
                </span>
                <span className={`rs-label-desc ${isActive ? "rs-label-desc-active" : ""}`}>
                  {s.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}