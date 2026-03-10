import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Check if user exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (!existingUser) {
    await supabase.from("users").insert([
      {
        id: userId,
        email: user.emailAddresses[0]?.emailAddress,
      },
    ]);

    redirect("/select-role");
  }

  // If role not selected
  if (!existingUser.role) {
    redirect("/select-role");
  }

  // Role-based redirect
  if (existingUser.role === "rider") {
    redirect("/rider");
  }

  if (existingUser.role === "driver") {
    redirect("/driver");
  }

  return (
    <div className="dashboard-loading">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:ital,wght@0,300;0,400;1,300&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .dashboard-loading {
          min-height: 100vh;
          background: #0a0a0f;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }

        .dashboard-loading::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 50% at 20% 40%, rgba(99, 60, 255, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 70%, rgba(255, 100, 60, 0.08) 0%, transparent 55%);
          pointer-events: none;
        }

        .grid-lines {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        .card {
          position: relative;
          z-index: 10;
          text-align: center;
          animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .logo-ring {
          width: 72px;
          height: 72px;
          margin: 0 auto 28px;
          position: relative;
        }

        .logo-ring svg {
          width: 100%;
          height: 100%;
          animation: spin 2.4s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .logo-ring .inner-dot {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-ring .inner-dot span {
          width: 18px;
          height: 18px;
          background: linear-gradient(135deg, #7c5cfc, #fc6c3f);
          border-radius: 50%;
          display: block;
          box-shadow: 0 0 18px rgba(124, 92, 252, 0.7);
        }

        .headline {
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #f0eeff;
          line-height: 1.1;
          margin-bottom: 10px;
        }

        .subline {
          font-size: 0.92rem;
          font-weight: 300;
          color: rgba(240, 238, 255, 0.45);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .dots {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-top: 36px;
        }

        .dots span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(124, 92, 252, 0.5);
          animation: pulse 1.4s ease-in-out infinite;
        }

        .dots span:nth-child(2) { animation-delay: 0.2s; }
        .dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes pulse {
          0%, 100% { transform: scale(1);   opacity: 0.4; }
          50%       { transform: scale(1.5); opacity: 1;   }
        }
      `}</style>

      <div className="grid-lines" />

      <div className="card">
        <div className="logo-ring">
          <svg viewBox="0 0 72 72" fill="none">
            <circle cx="36" cy="36" r="32" stroke="rgba(124,92,252,0.2)" strokeWidth="1.5" />
            <path
              d="M36 4 A32 32 0 0 1 68 36"
              stroke="url(#arcGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="arcGrad" x1="36" y1="4" x2="68" y2="36" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7c5cfc" />
                <stop offset="1" stopColor="#fc6c3f" />
              </linearGradient>
            </defs>
          </svg>
          <div className="inner-dot"><span /></div>
        </div>

        <h1 className="headline">Setting things up</h1>
        <p className="subline">Redirecting you now</p>

        <div className="dots">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}