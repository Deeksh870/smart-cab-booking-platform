import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        :root {
          --bg:          #07090f;
          --surface:     #0d1120;
          --surface2:    #111827;
          --border:      rgba(255,255,255,0.07);
          --violet:      #7c6af7;
          --violet-g:    rgba(124,106,247,0.3);
          --violet-soft: rgba(124,106,247,0.12);
          --teal:        #22d3ee;
          --teal-g:      rgba(34,211,238,0.2);
          --amber:       #fbbf24;
          --green:       #10b981;
          --text:        #e2e8f4;
          --muted:       rgba(226,232,244,0.45);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg) !important; }

        .hp-root {
          min-height: 100vh;
          background: var(--bg);
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          position: relative;
          overflow-x: hidden;
        }

        /* ── BACKGROUND ── */
        .hp-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 70% 55% at 50% 20%,  rgba(124,106,247,0.13) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 10% 80%,  rgba(34,211,238,0.07)  0%, transparent 55%),
            radial-gradient(ellipse 40% 35% at 90% 70%,  rgba(251,191,36,0.05)  0%, transparent 50%);
        }
        .hp-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 52px 52px;
        }

        /* ── NAV ── */
        .hp-nav {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 48px;
          background: rgba(7,9,15,0.7);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          animation: hpFadeDown 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        @media (max-width:640px) { .hp-nav { padding: 16px 20px; } }

        .hp-nav-brand {
          display: flex; align-items: center; gap: 12px;
          text-decoration: none;
        }
        .hp-nav-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg, var(--violet), #a78bfa);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          box-shadow: 0 0 18px var(--violet-g);
        }
        .hp-nav-name {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem; font-weight: 800;
          letter-spacing: -0.03em; color: #fff;
        }

        .hp-nav-actions { display: flex; align-items: center; gap: 10px; }

        .hp-nav-signin {
          padding: 8px 18px;
          border-radius: 9px;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text);
          font-family: 'Syne', sans-serif;
          font-size: 0.82rem; font-weight: 700;
          text-decoration: none;
          letter-spacing: 0.01em;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
        }
        .hp-nav-signin:hover { border-color: rgba(124,106,247,0.4); background: var(--surface2); transform: translateY(-1px); }

        .hp-nav-signup {
          padding: 8px 18px;
          border-radius: 9px;
          background: linear-gradient(135deg, var(--violet), #a78bfa);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 0.82rem; font-weight: 700;
          text-decoration: none;
          letter-spacing: 0.01em;
          box-shadow: 0 4px 16px var(--violet-g);
          transition: opacity 0.2s, transform 0.15s;
        }
        .hp-nav-signup:hover { opacity: 0.88; transform: translateY(-1px); }

        /* ── HERO ── */
        .hp-hero {
          position: relative; z-index: 1;
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
          padding: 120px 24px 80px;
        }

        /* eyebrow badge */
        .hp-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 6px 16px;
          font-size: 0.75rem; font-weight: 500;
          color: var(--muted);
          letter-spacing: 0.07em; text-transform: uppercase;
          margin-bottom: 28px;
          animation: hpFadeUp 0.7s 0.1s cubic-bezier(0.22,1,0.36,1) both;
        }
        .hp-eyebrow-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--teal);
          box-shadow: 0 0 10px var(--teal-g);
          animation: eyePulse 2s ease-in-out infinite;
        }
        @keyframes eyePulse { 0%,100%{opacity:1}50%{opacity:.35} }

        /* headline */
        .hp-headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.8rem, 7vw, 5.5rem);
          font-weight: 900;
          letter-spacing: -0.05em;
          color: #fff;
          line-height: 1.0;
          margin-bottom: 24px;
          max-width: 820px;
          animation: hpFadeUp 0.7s 0.18s cubic-bezier(0.22,1,0.36,1) both;
        }
        .hp-headline-accent {
          background: linear-gradient(135deg, var(--violet) 0%, var(--teal) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* subheading */
        .hp-sub {
          font-size: clamp(0.95rem, 2vw, 1.1rem);
          color: var(--muted);
          line-height: 1.75;
          max-width: 480px;
          margin-bottom: 44px;
          animation: hpFadeUp 0.7s 0.26s cubic-bezier(0.22,1,0.36,1) both;
        }

        /* CTA buttons */
        .hp-ctas {
          display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;
          margin-bottom: 72px;
          animation: hpFadeUp 0.7s 0.34s cubic-bezier(0.22,1,0.36,1) both;
        }

        .hp-cta-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 15px 32px;
          border-radius: 13px;
          background: linear-gradient(135deg, var(--violet), #a78bfa);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 1rem; font-weight: 800;
          letter-spacing: -0.01em;
          text-decoration: none;
          box-shadow: 0 12px 32px var(--violet-g);
          transition: transform 0.15s, opacity 0.15s, box-shadow 0.15s;
          position: relative; overflow: hidden;
        }
        .hp-cta-primary::before {
          content:'';
          position:absolute; top:0; left:-100%; width:60%; height:100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: left 0.5s ease;
        }
        .hp-cta-primary:hover { transform: translateY(-3px); box-shadow: 0 18px 40px var(--violet-g); }
        .hp-cta-primary:hover::before { left: 150%; }

        .hp-cta-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 15px 32px;
          border-radius: 13px;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text);
          font-family: 'Syne', sans-serif;
          font-size: 1rem; font-weight: 700;
          letter-spacing: -0.01em;
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
        }
        .hp-cta-secondary:hover { border-color: rgba(255,255,255,0.15); background: var(--surface2); transform: translateY(-3px); }

        /* ── STATS ROW ── */
        .hp-stats {
          display: flex; gap: 0;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 18px;
          overflow: hidden;
          margin-bottom: 80px;
          animation: hpFadeUp 0.7s 0.42s cubic-bezier(0.22,1,0.36,1) both;
        }
        @media (max-width:580px) { .hp-stats { flex-direction: column; } }

        .hp-stat {
          flex: 1; padding: 20px 28px;
          text-align: center;
          border-right: 1px solid var(--border);
          position: relative;
        }
        .hp-stat:last-child { border-right: none; }
        .hp-stat-val {
          font-family: 'Syne', sans-serif;
          font-size: 1.7rem; font-weight: 900;
          letter-spacing: -0.04em; color: #fff;
          margin-bottom: 4px;
        }
        .hp-stat-label { font-size: 0.76rem; color: var(--muted); letter-spacing: 0.04em; }

        /* ── FEATURE CARDS ── */
        .hp-features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          width: 100%; max-width: 900px;
          animation: hpFadeUp 0.7s 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        @media (max-width:720px) { .hp-features { grid-template-columns: 1fr; max-width:400px; } }

        .hp-feat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 24px;
          text-align: left;
          position: relative; overflow: hidden;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .hp-feat-card:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }

        /* top accent */
        .hp-feat-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
          opacity: 0.6; transition: opacity 0.2s;
        }
        .hp-feat-card:hover::before { opacity: 1; }
        .hp-feat-card.fc-v::before { background: linear-gradient(90deg, var(--violet), transparent); }
        .hp-feat-card.fc-t::before { background: linear-gradient(90deg, var(--teal),   transparent); }
        .hp-feat-card.fc-a::before { background: linear-gradient(90deg, var(--amber),  transparent); }
        .hp-feat-card.fc-g::before { background: linear-gradient(90deg, var(--green),  transparent); }

        .hp-feat-icon {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; margin-bottom: 14px;
          border: 1px solid var(--border);
        }
        .ic-v { background: var(--violet-soft); }
        .ic-t { background: rgba(34,211,238,0.1); }
        .ic-a { background: rgba(251,191,36,0.1); }
        .ic-g { background: rgba(16,185,129,0.1); }

        .hp-feat-name {
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem; font-weight: 800;
          letter-spacing: -0.02em; color: #fff;
          margin-bottom: 6px;
        }
        .hp-feat-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.6; }

        /* ── ROLE CARDS ── */
        .hp-roles {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 16px; width: 100%; max-width: 700px;
          margin-top: 64px;
          animation: hpFadeUp 0.7s 0.58s cubic-bezier(0.22,1,0.36,1) both;
        }
        @media (max-width:580px) { .hp-roles { grid-template-columns: 1fr; } }

        .hp-role {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 24px;
          text-decoration: none; color: var(--text);
          display: flex; flex-direction: column; gap: 10px;
          transition: border-color 0.25s, transform 0.2s, box-shadow 0.2s;
          position: relative; overflow: hidden;
        }
        .hp-role::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
        }
        .hp-role.r-rider::before  { background: linear-gradient(90deg, var(--violet), #a78bfa); }
        .hp-role.r-driver::before { background: linear-gradient(90deg, var(--amber), #fde68a); }

        .hp-role:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.35); }
        .hp-role.r-rider:hover  { border-color: rgba(124,106,247,0.35); }
        .hp-role.r-driver:hover { border-color: rgba(251,191,36,0.3); }

        .hp-role-top { display: flex; align-items: center; gap: 12px; }
        .hp-role-icon {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; font-size: 22px;
        }
        .r-rider  .hp-role-icon { background: var(--violet-soft); }
        .r-driver .hp-role-icon { background: rgba(251,191,36,0.12); }

        .hp-role-name {
          font-family: 'Syne', sans-serif;
          font-size: 1.05rem; font-weight: 800;
          letter-spacing: -0.02em; color: #fff;
        }
        .hp-role-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.55; }
        .hp-role-arrow {
          font-size: 0.82rem; color: var(--muted2);
          margin-top: 4px; transition: color 0.2s, transform 0.2s;
        }
        .hp-role:hover .hp-role-arrow { color: var(--text); transform: translateX(4px); }

        /* ── FOOTER ── */
        .hp-footer {
          position: relative; z-index: 1;
          text-align: center;
          padding: 32px 24px;
          border-top: 1px solid var(--border);
          font-size: 0.76rem;
          color: rgba(226,232,244,0.2);
          letter-spacing: 0.04em;
        }

        /* animations */
        @keyframes hpFadeDown { from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:none} }
        @keyframes hpFadeUp   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:none} }
      `}</style>

      <div className="hp-root">
        <div className="hp-bg" />
        <div className="hp-grid" />

        {/* ── NAV ── */}
        <nav className="hp-nav">
          <a href="/" className="hp-nav-brand">
            <div className="hp-nav-icon">🚖</div>
            <span className="hp-nav-name">RideApp</span>
          </a>
          <div className="hp-nav-actions">
            <a href="/sign-in" className="hp-nav-signin">Sign In</a>
            <a href="/sign-up" className="hp-nav-signup">Get Started</a>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="hp-hero">

          <div className="hp-eyebrow">
            <span className="hp-eyebrow-dot" />
            Now live in Bangalore
          </div>

          <h1 className="hp-headline">
            The ride you want,<br />
            <span className="hp-headline-accent">exactly when you need it.</span>
          </h1>

          <p className="hp-sub">
            Book a cab in seconds. Track your driver live. Pay securely.
            RideApp connects riders and drivers across Bangalore instantly.
          </p>

          <div className="hp-ctas">
            <a href="/sign-up" className="hp-cta-primary">
              Get Started Free →
            </a>
            <a href="/sign-in" className="hp-cta-secondary">
              Sign In
            </a>
          </div>

          {/* stats */}
          <div className="hp-stats">
            {[
              { val: "10k+", label: "Active Riders"    },
              { val: "2k+",  label: "Verified Drivers" },
              { val: "4.9★", label: "Average Rating"   },
              { val: "<2m",  label: "Avg. Pickup Time" },
            ].map((s) => (
              <div key={s.label} className="hp-stat">
                <div className="hp-stat-val">{s.val}</div>
                <div className="hp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* features */}
          <div className="hp-features">
            {[
              { icon:"⚡", cls:"fc-v", ic:"ic-v", name:"Instant Matching",   desc:"Get matched with a driver near you in under 2 minutes."         },
              { icon:"📍", cls:"fc-t", ic:"ic-t", name:"Live GPS Tracking",   desc:"Watch your driver navigate to you on a live map in real time."  },
              { icon:"💳", cls:"fc-a", ic:"ic-a", name:"Flexible Payments",   desc:"Pay with card, UPI, or cash — whatever works for you."          },
            ].map((f) => (
              <div key={f.name} className={`hp-feat-card ${f.cls}`}>
                <div className={`hp-feat-icon ${f.ic}`}>{f.icon}</div>
                <div className="hp-feat-name">{f.name}</div>
                <div className="hp-feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>

          {/* role cards */}
          <div className="hp-roles">
            <a href="/sign-up" className="hp-role r-rider">
              <div className="hp-role-top">
                <div className="hp-role-icon">🧑‍💼</div>
                <div className="hp-role-name">I'm a Rider</div>
              </div>
              <div className="hp-role-desc">Book rides, track your driver, and pay securely from one place.</div>
              <div className="hp-role-arrow">Start riding →</div>
            </a>
            <a href="/sign-up" className="hp-role r-driver">
              <div className="hp-role-top">
                <div className="hp-role-icon">🚖</div>
                <div className="hp-role-name">I'm a Driver</div>
              </div>
              <div className="hp-role-desc">Set your hours, accept rides, and track your earnings in real time.</div>
              <div className="hp-role-arrow">Start driving →</div>
            </a>
          </div>

        </section>

        {/* ── FOOTER ── */}
        <footer className="hp-footer">
          © 2025 RideApp · Bangalore, India · All rights reserved
        </footer>

      </div>
    </>
  );
}