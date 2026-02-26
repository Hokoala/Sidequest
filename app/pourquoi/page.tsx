import Header from "@/components/header";
import StepsScroll from "@/components/steps-scroll";
import Footer from "@/components/footer";
import { Globe } from "@/components/ui/globe";
import { AnimatedList } from "@/components/ui/animated-list";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { BarChart3, Users, Zap, CalendarDays } from "lucide-react";

const HABIT_NOTIFICATIONS = [
  { emoji: "🏃", name: "Sport complété", sub: "30 min de course" },
  { emoji: "📚", name: "Lecture faite", sub: "20 pages lues" },
  { emoji: "💧", name: "Hydratation", sub: "2L d'eau atteints" },
  { emoji: "🧘", name: "Méditation", sub: "10 min de pleine conscience" },
  { emoji: "🥗", name: "Nutrition", sub: "Repas équilibré" },
  { emoji: "😴", name: "Sommeil", sub: "8h de repos" },
];

const HabitListBackground = () => (
  <div className="absolute inset-0 overflow-hidden px-5 pt-8 pb-24">
    <AnimatedList delay={1600} className="gap-3">
      {HABIT_NOTIFICATIONS.map((h) => (
        <div
          key={h.name}
          className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 backdrop-blur-sm"
        >
          <span className="text-2xl leading-none">{h.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white leading-snug">{h.name}</div>
            <div className="text-xs text-white/45 mt-0.5">{h.sub}</div>
          </div>
          <div className="shrink-0 text-xs text-emerald-400 font-bold">✓</div>
        </div>
      ))}
    </AnimatedList>
  </div>
);

const GlobeBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <Globe className="top-4" />
  </div>
);

const OrbitBackground = () => (
  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
    <OrbitingCircles radius={60} duration={12} iconSize={32}>
      <span className="text-xl">🏃</span>
      <span className="text-xl">📚</span>
      <span className="text-xl">💧</span>
    </OrbitingCircles>
    <OrbitingCircles radius={110} duration={22} reverse iconSize={32}>
      <span className="text-xl">🎯</span>
      <span className="text-xl">📊</span>
      <span className="text-xl">🧘</span>
      <span className="text-xl">😴</span>
    </OrbitingCircles>
    <div className="z-10 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-2xl backdrop-blur-sm">
      ✨
    </div>
  </div>
);


export default function PourquoiPage() {
  return (
    <>
      <style>{`
        .pq-page {
          min-height: 100vh;
          background: #06060f;
          font-family: 'DM Sans', sans-serif;
          color: #f0f0f0;
        }

        /* Hero */
        .pq-hero {
          padding: 120px 24px 100px;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }
        .pq-eyebrow {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #3b82f6;
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 999px;
          padding: 4px 14px;
          margin-bottom: 24px;
        }
        .pq-title {
          font-size: clamp(40px, 7vw, 80px);
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1.0;
          margin-bottom: 24px;
        }
        .pq-title span { color: #3b82f6; }
        .pq-desc {
          font-size: 18px;
          color: rgba(255,255,255,0.45);
          line-height: 1.7;
          max-width: 560px;
          margin: 0 auto 40px;
        }
        .pq-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          background: #3b82f6;
          color: #fff;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }
        .pq-cta:hover { background: #2563eb; transform: scale(1.02); }

        /* Features */
        .pq-section {
          padding: 80px 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .pq-section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-bottom: 12px;
        }
        .pq-section-title {
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 700;
          letter-spacing: -0.03em;
          margin-bottom: 56px;
          max-width: 500px;
        }

        /* Bento grid */
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 22rem;
          gap: 16px;
        }
        .bento-card {
          position: relative;
          background: #0c0c1c;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          transition: border-color 0.25s;
        }
        .bento-card:hover { border-color: rgba(59,130,246,0.3); }
        .bento-span-1 { grid-column: span 1; }
        .bento-span-2 { grid-column: span 2; }
        .bento-footer {
          position: relative;
          z-index: 10;
          padding: 20px 24px 22px;
          background: linear-gradient(to top, #0c0c1c 60%, transparent);
        }
        .bento-icon {
          width: 22px;
          height: 22px;
          color: #3b82f6;
          margin-bottom: 8px;
        }
        .bento-name {
          font-size: 16px;
          font-weight: 700;
          color: #f0f0f0;
          letter-spacing: -0.01em;
          margin-bottom: 4px;
        }
        .bento-desc {
          font-size: 12.5px;
          color: rgba(255,255,255,0.38);
          line-height: 1.55;
        }
        /* Bar chart background */
        .bento-bars {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          gap: 4px;
          padding: 24px 24px 90px;
        }
        .bento-bar {
          flex: 1;
          border-radius: 4px 4px 2px 2px;
        }


        /* Stats */
        .pq-stats {
          padding: 80px 24px;
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .stat {
          padding: 40px 24px;
          text-align: center;
        }
        .stat-num {
          font-size: 56px;
          font-weight: 700;
          color: #3b82f6;
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 8px;
        }
        .stat-label {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
        }
      `}</style>

      <Header />
      <div className="pq-page">

        {/* Hero */}
        <div className="pq-hero">
          <span className="pq-eyebrow">Pourquoi SQUEST ?</span>
          <h1 className="pq-title">
            La régularité<br />
            crée les <span>résultats</span>
          </h1>
          <p className="pq-desc">
            SQUEST t'aide à construire des habitudes solides grâce au suivi quotidien,
            la visualisation de ta progression et la motivation par le challenge.
          </p>
          <a href="/" className="pq-cta">
            Commencer gratuitement →
          </a>
        </div>

        {/* Features */}
        <div className="pq-section">
          <div className="pq-section-label">Fonctionnalités</div>
          <h2 className="pq-section-title">Tout ce dont tu as besoin, rien de superflu</h2>
          <div className="bento-grid">

            {/* Card 1: AnimatedList */}
            <div className="bento-card bento-span-1">
              <HabitListBackground />
              <div className="bento-footer">
                <BarChart3 className="bento-icon" />
                <div className="bento-name">Habitudes en temps réel</div>
                <div className="bento-desc">Coche tes habitudes en un clic. Regarde ta liste s'animer chaque jour.</div>
              </div>
            </div>

            {/* Card 2: Globe */}
            <div className="bento-card bento-span-2">
              <GlobeBackground />
              <div className="bento-footer">
                <Users className="bento-icon" />
                <div className="bento-name">Communauté mondiale</div>
                <div className="bento-desc">Challenge tes amis et compare vos progressions. La motivation vient aussi des autres.</div>
              </div>
            </div>

            {/* Card 3: OrbitingCircles */}
            <div className="bento-card bento-span-2">
              <OrbitBackground />
              <div className="bento-footer">
                <Zap className="bento-icon" />
                <div className="bento-name">Tout en orbite</div>
                <div className="bento-desc">Sport, lecture, méditation, nutrition — crée toutes les habitudes qui comptent pour toi.</div>
              </div>
            </div>

            {/* Card 4: Bar chart */}
            <div className="bento-card bento-span-1">
              <div className="bento-bars">
                {[60,80,45,90,100,70,85,55,95,75,40,88,72,65].map((h, i) => (
                  <div key={i} className="bento-bar" style={{
                    height: `${h}%`,
                    background: h >= 80 ? "rgba(59,130,246,0.7)" : h >= 60 ? "rgba(59,130,246,0.4)" : "rgba(59,130,246,0.18)",
                  }} />
                ))}
              </div>
              <div className="bento-footer">
                <CalendarDays className="bento-icon" />
                <div className="bento-name">Historique mensuel</div>
                <div className="bento-desc">14 jours de graphique pour voir ta régularité d'un coup d'œil.</div>
              </div>
            </div>

          </div>
        </div>

        {/* Steps */}
        <StepsScroll />

        {/* Stats */}
        <div className="pq-stats">
          <div className="stat">
            <div className="stat-num">21</div>
            <div className="stat-label">jours pour créer une habitude</div>
          </div>
          <div className="stat">
            <div className="stat-num">∞</div>
            <div className="stat-label">habitudes à suivre</div>
          </div>
          <div className="stat">
            <div className="stat-num">0€</div>
            <div className="stat-label">pour toujours</div>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
}
