import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --bg:          #07090f;
          --surface:     #0d1120;
          --border:      rgba(255,255,255,0.07);
          --violet:      #7c6af7;
          --violet-g:    rgba(124,106,247,0.28);
          --violet-soft: rgba(124,106,247,0.12);
          --amber:       #fbbf24;
          --teal:        #22d3ee;
          --green:       #10b981;
          --text:        #e2e8f4;
          --muted:       rgba(226,232,244,0.42);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: var(--bg) !important; font-family: 'DM Sans', sans-serif; }

        .su-root {
          min-height: 100vh;
          display: flex;
          position: relative;
          overflow: hidden;
          background: var(--bg);
        }

        /* ── RIGHT decorative panel ── */
        .su-deco {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 64px;
          position: relative;
          z-index: 1;
          order: 2;
        }
        @media (max-width: 900px) { .su-deco { display: none; } }

        /* diagonal clip on LEFT edge of deco panel */
        .su-deco::before {
          content: '';
          position: absolute;
          top: 0; left: -1px; bottom: 0;
          width: 80px;
          background: var(--bg);
          clip-path: polygon(0 0, 40% 0, 100% 100%, 0 100%);
          z-index: 2;
          pointer-events: none;
        }

        /* ambient glow */
        .su-deco-glow {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 65% 55% at 70% 35%, rgba(34,211,238,0.1)  0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 20% 85%, rgba(124,106,247,0.08) 0%, transparent 55%);
        }
        .su-deco-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* brand */
        .su-brand {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 64px;
          position: relative; z-index: 1;
        }
        .su-brand-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--teal), #06b6d4);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          box-shadow: 0 0 24px rgba(34,211,238,0.35);
        }
        .su-brand-name {
          font-family: 'Syne', sans-serif;
          font-size: 1.3rem; font-weight: 800;
          letter-spacing: -0.04em; color: #fff;
        }

        /* headline */
        .su-headline {
          position: relative; z-index: 1;
          font-family: 'Syne', sans-serif;
          font-size: 2.8rem; font-weight: 800;
          letter-spacing: -0.05em; color: #fff;
          line-height: 1.05; margin-bottom: 18px;
        }
        .su-headline span {
          background: linear-gradient(135deg, var(--teal), #67e8f9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .su-tagline {
          position: relative; z-index: 1;
          font-size: 0.92rem; color: var(--muted);
          line-height: 1.7; max-width: 340px; margin-bottom: 48px;
        }

        /* steps */
        .su-steps {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; gap: 0;
        }
        .su-step {
          display: flex; gap: 16px; align-items: flex-start;
          padding-bottom: 24px;
          position: relative;
        }
        /* vertical connector */
        .su-step:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 17px; top: 36px; bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, rgba(34,211,238,0.25), transparent);
        }

        .su-step-num {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 0.82rem; font-weight: 800;
          flex-shrink: 0;
          position: relative; z-index: 1;
        }
        .su-step-num.s1 { background: rgba(34,211,238,0.15);  color: var(--teal);  border: 1px solid rgba(34,211,238,0.3);  }
        .su-step-num.s2 { background: rgba(124,106,247,0.15); color: #a78bfa;      border: 1px solid rgba(124,106,247,0.3); }
        .su-step-num.s3 { background: rgba(16,185,129,0.15);  color: var(--green); border: 1px solid rgba(16,185,129,0.3);  }

        .su-step-text strong {
          display: block; color: #fff; font-weight: 600;
          font-size: 0.9rem; margin-bottom: 3px;
        }
        .su-step-text span { font-size: 0.8rem; color: var(--muted); line-height: 1.5; }

        /* floating stat cards */
        .su-stat-row {
          position: absolute;
          bottom: 80px; left: 64px; right: 64px;
          z-index: 1;
          display: flex; gap: 12px;
        }
        .su-stat {
          flex: 1;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 14px 16px;
          animation: suFloat 5s ease-in-out infinite;
        }
        .su-stat:nth-child(2) { animation-delay: 1.5s; }
        .su-stat:nth-child(3) { animation-delay: 3s; }
        @keyframes suFloat {
          0%,100% { transform: translateY(0);   }
          50%      { transform: translateY(-6px); }
        }
        .su-stat-val {
          font-family: 'Syne', sans-serif;
          font-size: 1.3rem; font-weight: 900;
          letter-spacing: -0.04em; color: #fff;
          margin-bottom: 3px;
        }
        .su-stat-label { font-size: 0.7rem; color: var(--muted); letter-spacing: 0.04em; }

        /* ── LEFT auth panel ── */
        .su-auth {
          width: 480px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          padding: 40px 32px;
          position: relative; z-index: 1;
          background: var(--bg);
          order: 1;
        }
        @media (max-width: 900px) {
          .su-auth { width: 100%; padding: 40px 24px; }
        }

        .su-auth-inner {
          width: 100%;
          display: flex; flex-direction: column; align-items: center;
        }

        /* mobile brand */
        .su-mobile-brand {
          display: none;
          align-items: center; gap: 12px;
          margin-bottom: 28px;
        }
        @media (max-width: 900px) { .su-mobile-brand { display: flex; } }

        .su-welcome { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; letter-spacing: -0.03em; color: #fff; margin-bottom: 6px; text-align: center; }
        .su-welcome-sub { font-size: 0.82rem; color: var(--muted); margin-bottom: 28px; text-align: center; }

        /* ── Clerk overrides ── */
        .su-auth .cl-rootBox { width: 100% !important; }
        .su-auth .cl-card {
          background: var(--surface) !important;
          border: 1px solid var(--border) !important;
          border-radius: 20px !important;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5) !important;
          width: 100% !important;
        }
        .su-auth .cl-headerTitle {
          color: #fff !important;
          font-family: 'Syne', sans-serif !important;
          font-weight: 800 !important;
          letter-spacing: -0.03em !important;
        }
        .su-auth .cl-headerSubtitle { color: var(--muted) !important; }
        .su-auth .cl-formFieldLabel { color: rgba(226,232,244,0.6) !important; font-size: 0.8rem !important; }
        .su-auth .cl-formFieldInput {
          background: #121827 !important;
          border-color: var(--border) !important;
          color: var(--text) !important;
          border-radius: 10px !important;
        }
        .su-auth .cl-formFieldInput:focus {
          border-color: rgba(34,211,238,0.5) !important;
          box-shadow: 0 0 0 3px rgba(34,211,238,0.1) !important;
        }
        .su-auth .cl-formButtonPrimary {
          background: linear-gradient(135deg, var(--teal), #06b6d4) !important;
          border-radius: 11px !important;
          box-shadow: 0 8px 24px rgba(34,211,238,0.3) !important;
          font-family: 'Syne', sans-serif !important;
          font-weight: 800 !important;
          letter-spacing: -0.01em !important;
          color: #021c21 !important;
        }
        .su-auth .cl-footerActionLink { color: var(--teal) !important; }
        .su-auth .cl-dividerLine { background: var(--border) !important; }
        .su-auth .cl-dividerText { color: var(--muted) !important; }
        .su-auth .cl-socialButtonsBlockButton {
          background: #121827 !important;
          border-color: var(--border) !important;
          color: var(--text) !important;
          border-radius: 10px !important;
        }
        .su-auth .cl-socialButtonsBlockButton:hover {
          background: #1a2236 !important;
          border-color: rgba(34,211,238,0.35) !important;
        }

        .su-footer-note {
          margin-top: 18px;
          font-size: 0.72rem;
          color: rgba(226,232,244,0.18);
          text-align: center;
          letter-spacing: 0.04em;
        }
      `}</style>

      <div className="su-root">

        {/* ── AUTH PANEL (left) ── */}
        <div className="su-auth">
          <div className="su-auth-inner">

            {/* mobile brand */}
            <div className="su-mobile-brand">
              <div className="su-brand-icon">🚖</div>
              <span className="su-brand-name">RideApp</span>
            </div>

            <div className="su-welcome">Create your account</div>
            <div className="su-welcome-sub">Join thousands of riders and drivers today</div>

            <SignUp />

            <p className="su-footer-note">By signing up you agree to our Terms & Privacy Policy.</p>
          </div>
        </div>

        {/* ── DECO PANEL (right) ── */}
        <div className="su-deco">
          <div className="su-deco-glow" />
          <div className="su-deco-grid" />

          <div className="su-brand">
            <div className="su-brand-icon">🚖</div>
            <span className="su-brand-name">RideApp</span>
          </div>

          <h1 className="su-headline">
            Join the<br />
            <span>smarter ride.</span>
          </h1>

          <p className="su-tagline">
            Sign up in seconds. Whether you're booking your first ride or ready to earn as a driver — we've got you.
          </p>

          <div className="su-steps">
            {[
              { n: "01", cls: "s1", title: "Create your account",  desc: "Quick sign-up with email or Google — no hassle."    },
              { n: "02", cls: "s2", title: "Pick your role",       desc: "Choose to ride or drive. Switch any time you want." },
              { n: "03", cls: "s3", title: "Hit the road",         desc: "Book rides or start earning within minutes."        },
            ].map((s) => (
              <div key={s.n} className="su-step">
                <div className={`su-step-num ${s.cls}`}>{s.n}</div>
                <div className="su-step-text">
                  <strong>{s.title}</strong>
                  <span>{s.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* floating stat cards */}
          <div className="su-stat-row">
            {[
              { val: "10k+", label: "Active Riders"   },
              { val: "2k+",  label: "Verified Drivers" },
              { val: "4.9★", label: "Avg. Rating"      },
            ].map((s) => (
              <div key={s.label} className="su-stat">
                <div className="su-stat-val">{s.val}</div>
                <div className="su-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}