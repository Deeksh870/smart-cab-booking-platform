import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --bg:         #07090f;
          --surface:    #0d1120;
          --border:     rgba(255,255,255,0.07);
          --violet:     #7c6af7;
          --violet-g:   rgba(124,106,247,0.28);
          --violet-soft:rgba(124,106,247,0.12);
          --amber:      #fbbf24;
          --text:       #e2e8f4;
          --muted:      rgba(226,232,244,0.42);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--bg) !important;
          font-family: 'DM Sans', sans-serif;
        }

        .signin-root {
          min-height: 100vh;
          display: flex;
          position: relative;
          overflow: hidden;
          background: var(--bg);
        }

        /* ── LEFT PANEL ── */
        .signin-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 64px;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 900px) { .signin-left { display: none; } }

        /* diagonal clip on right edge */
        .signin-left::after {
          content: '';
          position: absolute;
          top: 0; right: -1px; bottom: 0;
          width: 80px;
          background: var(--bg);
          clip-path: polygon(60% 0, 100% 0, 100% 100%, 0% 100%);
          z-index: 2;
        }

        /* ambient glow inside left */
        .signin-left::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 60% at 30% 40%, rgba(124,106,247,0.15) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 80% 85%, rgba(251,191,36,0.07) 0%, transparent 55%);
        }

        /* grid overlay on left panel */
        .signin-left-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .signin-brand {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 64px;
          position: relative; z-index: 1;
        }
        .signin-brand-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--violet), #a78bfa);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          box-shadow: 0 0 24px var(--violet-g);
        }
        .signin-brand-name {
          font-family: 'Syne', sans-serif;
          font-size: 1.3rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #fff;
        }

        .signin-headline {
          position: relative; z-index: 1;
          font-family: 'Syne', sans-serif;
          font-size: 3rem;
          font-weight: 800;
          letter-spacing: -0.05em;
          color: #fff;
          line-height: 1.05;
          margin-bottom: 18px;
        }
        .signin-headline span {
          background: linear-gradient(135deg, var(--violet), #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .signin-tagline {
          position: relative; z-index: 1;
          font-size: 0.95rem;
          color: var(--muted);
          line-height: 1.7;
          max-width: 340px;
          margin-bottom: 52px;
        }

        /* feature pills */
        .signin-features {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; gap: 14px;
        }
        .signin-feat {
          display: flex; align-items: center; gap: 14px;
        }
        .signin-feat-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px;
          flex-shrink: 0;
          background: var(--surface);
          border: 1px solid var(--border);
        }
        .signin-feat-text {
          font-size: 0.88rem;
          color: rgba(226,232,244,0.6);
          font-weight: 400;
        }
        .signin-feat-text strong {
          color: var(--text);
          font-weight: 600;
          display: block;
          font-size: 0.9rem;
          margin-bottom: 1px;
        }

        /* bottom tagline */
        .signin-bottom-tag {
          position: absolute;
          bottom: 32px; left: 64px;
          z-index: 1;
          font-size: 0.74rem;
          color: rgba(226,232,244,0.2);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* floating ride card decoration */
        .signin-deco-card {
          position: absolute;
          bottom: 100px; right: 90px;
          z-index: 1;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 14px 18px;
          display: flex; align-items: center; gap: 12px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.5);
          animation: cardFloat 4s ease-in-out infinite;
          backdrop-filter: blur(4px);
        }
        @keyframes cardFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        .deco-dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 10px rgba(16,185,129,0.6);
          animation: decoPulse 1.6s ease-in-out infinite;
        }
        @keyframes decoPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.4; transform:scale(1.5); }
        }
        .deco-text { font-size: 0.78rem; color: var(--text); font-weight: 500; }
        .deco-sub  { font-size: 0.68rem; color: var(--muted); margin-top: 1px; }

        /* ── RIGHT PANEL ── */
        .signin-right {
          width: 480px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 32px;
          position: relative;
          z-index: 1;
          background: var(--bg);
        }
        @media (max-width: 900px) {
          .signin-right { width: 100%; padding: 40px 24px; }
        }

        .signin-right-inner {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }

        /* mobile-only brand */
        .signin-mobile-brand {
          display: none;
          align-items: center; gap: 12px;
          margin-bottom: 32px;
        }
        @media (max-width: 900px) {
          .signin-mobile-brand { display: flex; }
        }

        .signin-welcome {
          font-family: 'Syne', sans-serif;
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #fff;
          margin-bottom: 6px;
          text-align: center;
        }
        .signin-welcome-sub {
          font-size: 0.82rem;
          color: var(--muted);
          margin-bottom: 28px;
          text-align: center;
        }

        /* Clerk overrides */
        .signin-right .cl-rootBox { width: 100% !important; }
        .signin-right .cl-card {
          background: var(--surface) !important;
          border: 1px solid var(--border) !important;
          border-radius: 20px !important;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5) !important;
          width: 100% !important;
        }
        .signin-right .cl-headerTitle {
          color: #fff !important;
          font-family: 'Syne', sans-serif !important;
          font-weight: 800 !important;
          letter-spacing: -0.03em !important;
        }
        .signin-right .cl-headerSubtitle { color: var(--muted) !important; }
        .signin-right .cl-formFieldLabel { color: rgba(226,232,244,0.6) !important; font-size: 0.8rem !important; }
        .signin-right .cl-formFieldInput {
          background: #121827 !important;
          border-color: var(--border) !important;
          color: var(--text) !important;
          border-radius: 10px !important;
        }
        .signin-right .cl-formFieldInput:focus {
          border-color: rgba(124,106,247,0.5) !important;
          box-shadow: 0 0 0 3px rgba(124,106,247,0.1) !important;
        }
        .signin-right .cl-formButtonPrimary {
          background: linear-gradient(135deg, var(--violet), #a78bfa) !important;
          border-radius: 11px !important;
          box-shadow: 0 8px 24px var(--violet-g) !important;
          font-family: 'Syne', sans-serif !important;
          font-weight: 800 !important;
          letter-spacing: -0.01em !important;
        }
        .signin-right .cl-footerActionLink { color: #a78bfa !important; }
        .signin-right .cl-dividerLine { background: var(--border) !important; }
        .signin-right .cl-dividerText { color: var(--muted) !important; }
        .signin-right .cl-socialButtonsBlockButton {
          background: #121827 !important;
          border-color: var(--border) !important;
          color: var(--text) !important;
          border-radius: 10px !important;
        }
        .signin-right .cl-socialButtonsBlockButton:hover {
          background: #1a2236 !important;
          border-color: rgba(124,106,247,0.35) !important;
        }
        .signin-right .cl-internal-b3fm6y { background: var(--surface) !important; }
      `}</style>

      <div className="signin-root">

        {/* ── LEFT PANEL ── */}
        <div className="signin-left">
          <div className="signin-left-grid" />

          <div className="signin-brand">
            <div className="signin-brand-icon">🚖</div>
            <span className="signin-brand-name">RideApp</span>
          </div>

          <h1 className="signin-headline">
            Your ride,<br />
            <span>your way.</span>
          </h1>

          <p className="signin-tagline">
            The smartest way to book rides in Bangalore.
            Fast, reliable, and always on time.
          </p>

          <div className="signin-features">
            {[
              { icon: "⚡", title: "Instant Matching",  desc: "Get matched with nearby drivers in seconds" },
              { icon: "📍", title: "Live Tracking",     desc: "Track your driver in real time on the map"  },
              { icon: "💳", title: "Secure Payments",   desc: "Pay safely with card, UPI, or cash"         },
              { icon: "⭐", title: "Rated Drivers",     desc: "Only top-rated drivers on our platform"     },
            ].map((f) => (
              <div key={f.title} className="signin-feat">
                <div className="signin-feat-icon">{f.icon}</div>
                <div className="signin-feat-text">
                  <strong>{f.title}</strong>
                  {f.desc}
                </div>
              </div>
            ))}
          </div>

          {/* floating deco card */}
          <div className="signin-deco-card">
            <div className="deco-dot" />
            <div>
              <div className="deco-text">Driver nearby</div>
              <div className="deco-sub">2 min away · Bangalore</div>
            </div>
          </div>

          <div className="signin-bottom-tag">Bangalore · India</div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="signin-right">
          <div className="signin-right-inner">

            {/* mobile brand */}
            <div className="signin-mobile-brand">
              <div className="signin-brand-icon">🚖</div>
              <span className="signin-brand-name">RideApp</span>
            </div>

            <div className="signin-welcome">Welcome back</div>
            <div className="signin-welcome-sub">Sign in to continue to your dashboard</div>

            <SignIn />
          </div>
        </div>

      </div>
    </>
  );
}