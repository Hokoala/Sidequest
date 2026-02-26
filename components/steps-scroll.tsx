"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { UserPlus, PenLine, CheckCircle2, TrendingUp, LucideIcon } from "lucide-react"

interface Step {
  num: string
  title: string
  desc: string
  Icon: LucideIcon
}

const STEPS: Step[] = [
  {
    num: "01",
    title: "Crée ton compte",
    desc: "Inscription gratuite en quelques secondes. Aucune carte bancaire, aucune prise de tête.",
    Icon: UserPlus,
  },
  {
    num: "02",
    title: "Ajoute tes habitudes",
    desc: "Choisis un emoji et donne un nom à chaque habitude. Sport, lecture, méditation — c'est toi qui décides.",
    Icon: PenLine,
  },
  {
    num: "03",
    title: "Coche chaque jour",
    desc: "Ouvre SQUEST le matin ou le soir et coche ce que tu as accompli. 10 secondes suffisent.",
    Icon: CheckCircle2,
  },
  {
    num: "04",
    title: "Suis ta progression",
    desc: "Regarde tes graphiques évoluer, monte dans le classement et défie tes amis.",
    Icon: TrendingUp,
  },
]

export default function StepsScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".step-gsap-card")

      // état initial
      gsap.set(cards, { opacity: 0, x: 60 })
      if (lineRef.current) gsap.set(lineRef.current, { scaleY: 0, transformOrigin: "top center" })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: stickyRef.current,
          pinSpacing: false,
        },
      })

      cards.forEach((card, i) => {
        const progress = (i + 1) / cards.length
        tl.to(card, { opacity: 1, x: 0, duration: 0.6 }, i * 0.8)
        tl.to(lineRef.current, { scaleY: progress, duration: 0.6 }, i * 0.8)
      })
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <style>{`
        .steps-wrapper {
          height: ${STEPS.length * 100}vh;
          background: #08081a;
        }
        .steps-sticky {
          height: 100vh;
          top: 0;
          display: flex;
          align-items: center;
          padding: 0 24px;
        }
        .steps-inner {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .steps-left {
          position: relative;
        }
        .steps-left-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-bottom: 16px;
        }
        .steps-left-title {
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: #f0f0f0;
          margin-bottom: 48px;
        }
        .steps-timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
        }
        .steps-timeline-track {
          position: absolute;
          left: 14px;
          top: 28px;
          bottom: 28px;
          width: 1px;
          background: rgba(255,255,255,0.06);
        }
        .steps-timeline-fill {
          position: absolute;
          left: 14px;
          top: 28px;
          bottom: 28px;
          width: 1px;
          background: #3b82f6;
          transform-origin: top;
        }
        .step-dot-row {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 14px 0;
        }
        .step-dot {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          background: #0c0c1c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.3);
          flex-shrink: 0;
          z-index: 1;
        }
        .step-dot-label {
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          font-weight: 500;
        }

        /* Right: cards */
        .steps-right {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .step-gsap-card {
          background: #0c0c1c;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 28px 32px;
          display: flex;
          gap: 20px;
          align-items: flex-start;
          will-change: transform, opacity;
        }
        .step-gsap-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(59,130,246,0.12);
          border: 1px solid rgba(59,130,246,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
          color: #3b82f6;
        }
        .step-gsap-num {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #3b82f6;
          margin-bottom: 6px;
        }
        .step-gsap-title {
          font-size: 17px;
          font-weight: 700;
          color: #f0f0f0;
          letter-spacing: -0.01em;
          margin-bottom: 6px;
        }
        .step-gsap-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.38);
          line-height: 1.6;
        }
      `}</style>

      <div ref={wrapperRef} className="steps-wrapper">
        <div ref={stickyRef} className="steps-sticky">
          <div className="steps-inner">

            {/* Left: title + timeline */}
            <div className="steps-left">
              <div className="steps-left-label">Comment ça marche</div>
              <h2 className="steps-left-title">Quatre étapes pour transformer ta routine</h2>
              <div className="steps-timeline">
                <div className="steps-timeline-track" />
                <div ref={lineRef} className="steps-timeline-fill" />
                {STEPS.map((s) => (
                  <div className="step-dot-row" key={s.num}>
                    <div className="step-dot">{s.num}</div>
                    <span className="step-dot-label">{s.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: animated cards */}
            <div className="steps-right">
              {STEPS.map((s) => (
                <div className="step-gsap-card" key={s.num}>
                  <div className="step-gsap-icon">
                    <s.Icon size={18} strokeWidth={2} />
                  </div>
                  <div>
                    <div className="step-gsap-num">{s.num}</div>
                    <div className="step-gsap-title">{s.title}</div>
                    <div className="step-gsap-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
