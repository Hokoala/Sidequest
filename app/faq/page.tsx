"use client";

import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

const FAQS = [
  {
    category: "Général",
    items: [
      {
        q: "Qu'est-ce que SQUEST ?",
        a: "SQUEST est une plateforme de développement personnel qui te permet de suivre tes habitudes quotidiennes, mesurer ta progression et te comparer à tes amis pour rester motivé.",
      },
      {
        q: "Est-ce que SQUEST est gratuit ?",
        a: "Oui, SQUEST est entièrement gratuit. Crée ton compte en quelques secondes et commence à suivre tes habitudes dès aujourd'hui.",
      },
      {
        q: "Sur quels appareils puis-je utiliser SQUEST ?",
        a: "SQUEST fonctionne sur tous les navigateurs modernes — ordinateur, tablette et mobile. Aucune application à installer.",
      },
    ],
  },
  {
    category: "Habitudes",
    items: [
      {
        q: "Combien d'habitudes puis-je créer ?",
        a: "Il n'y a aucune limite. Tu peux créer autant d'habitudes que tu veux, de la méditation au sport en passant par la lecture.",
      },
      {
        q: "Que se passe-t-il si j'oublie de cocher une habitude ?",
        a: "Tu peux cocher une habitude pour n'importe quelle date passée. SQUEST est là pour t'aider, pas pour te juger.",
      },
      {
        q: "Comment fonctionne le graphique de progression ?",
        a: "Le graphique affiche ton taux de complétion jour par jour sur les 14 derniers jours. Plus la barre est bleue, plus tu as été régulier ce jour-là.",
      },
    ],
  },
  {
    category: "Amis & Classement",
    items: [
      {
        q: "Comment inviter un ami ?",
        a: "Va sur la page « Partage d'amis », génère ton lien unique et envoie-le à ton ami. Une fois qu'il l'accepte, vous apparaissez mutuellement dans vos classements.",
      },
      {
        q: "Comment fonctionne le classement ?",
        a: "Le classement est basé sur le taux de complétion des habitudes sur les 7 derniers jours. Seuls les utilisateurs ayant au moins une habitude apparaissent.",
      },
      {
        q: "Mes données sont-elles visibles par tous ?",
        a: "Seul ton nom et ton taux de complétion hebdomadaire sont visibles dans le classement global. Tes habitudes détaillées restent privées.",
      },
    ],
  },
  {
    category: "Compte",
    items: [
      {
        q: "Comment supprimer mon compte ?",
        a: "Tu peux supprimer ton compte à tout moment depuis les paramètres. Toutes tes données seront définitivement effacées.",
      },
      {
        q: "J'ai oublié mon mot de passe, que faire ?",
        a: "La fonctionnalité de réinitialisation de mot de passe est en cours de développement. En attendant, contacte-nous via la page de support.",
      },
    ],
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <style>{`
        .faq-page {
          min-height: 100vh;
          background: #06060f;
          font-family: 'DM Sans', sans-serif;
          padding: 80px 24px 80px;
        }
        .faq-container {
          max-width: 760px;
          margin: 0 auto;
        }
        .faq-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #3b82f6;
          margin-bottom: 12px;
        }
        .faq-title {
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 700;
          color: #f0f0f0;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: 16px;
        }
        .faq-sub {
          font-size: 16px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 64px;
          line-height: 1.6;
        }
        .faq-category {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin: 40px 0 14px;
        }
        .faq-category:first-of-type { margin-top: 0; }
        .faq-item {
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .faq-question {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          padding: 20px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 500;
          color: #e0e0e0;
          transition: color 0.2s;
        }
        .faq-question:hover { color: #fff; }
        .faq-icon {
          width: 24px;
          height: 24px;
          border-radius: 999px;
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s, transform 0.3s;
          color: #3b82f6;
          font-size: 16px;
          line-height: 1;
        }
        .faq-icon.open {
          background: #3b82f6;
          color: #fff;
          transform: rotate(45deg);
        }
        .faq-answer {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.35s cubic-bezier(0.23,1,0.32,1), padding 0.35s;
          padding-bottom: 0;
        }
        .faq-answer.open {
          max-height: 200px;
          padding-bottom: 20px;
        }
        .faq-answer p {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          line-height: 1.7;
        }
      `}</style>

      <Header />
      <div className="faq-page">
        <div className="faq-container">
          <div className="faq-eyebrow">Support</div>
          <h1 className="faq-title">Questions fréquentes</h1>
          <p className="faq-sub">
            Tout ce que tu dois savoir sur SQUEST. Tu ne trouves pas ta réponse ?{" "}
            <span style={{ color: "#3b82f6" }}>Contacte-nous.</span>
          </p>

          {FAQS.map((section) => (
            <div key={section.category}>
              <div className="faq-category">{section.category}</div>
              {section.items.map((item) => {
                const id = `${section.category}-${item.q}`;
                const isOpen = open === id;
                return (
                  <div className="faq-item" key={id}>
                    <button className="faq-question" onClick={() => setOpen(isOpen ? null : id)}>
                      <span>{item.q}</span>
                      <span className={`faq-icon ${isOpen ? "open" : ""}`}>+</span>
                    </button>
                    <div className={`faq-answer ${isOpen ? "open" : ""}`}>
                      <p>{item.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
