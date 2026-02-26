"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import { useSession } from "@/lib/auth-client";
import { Loader2, Handshake, PartyPopper, XCircle } from "lucide-react";

export default function RejoindreAmi() {
  const { code } = useParams<{ code: string }>();
  const { data: session } = useSession();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ready" | "done" | "error">("loading");
  const [fromName, setFromName] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`/api/friends/invite?code=${code}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setStatus("error"); setMsg(d.error); }
        else if (d.usedByUserId) { setStatus("error"); setMsg("Ce lien a déjà été utilisé."); }
        else { setFromName(d.fromName); setStatus("ready"); }
      });
  }, [code]);

  const accept = async () => {
    if (!session) return;
    const res = await fetch("/api/friends/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (data.success) { setStatus("done"); setTimeout(() => router.push("/amis"), 2000); }
    else { setStatus("error"); setMsg(data.error); }
  };

  return (
    <>
      <style>{`
        .rejoindre-page {
          min-height: 100vh; background: #06060f;
          font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; justify-content: center;
          padding: 80px 24px;
        }
        .rejoindre-card {
          background: #0c0c18;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 48px 40px;
          max-width: 420px; width: 100%;
          text-align: center;
        }
        .rejoindre-icon {
          width: 72px; height: 72px; border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
          background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2);
          color: #3b82f6;
        }
        .rejoindre-icon.success { background: rgba(52,211,153,0.1); border-color: rgba(52,211,153,0.2); color: #34d399; }
        .rejoindre-icon.danger  { background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.2); color: #f87171; }
        .rejoindre-title {
          font-size: 24px; font-weight: 700; color: #f0f0f0;
          letter-spacing: -0.02em; margin-bottom: 8px;
        }
        .rejoindre-sub {
          font-size: 14px; color: rgba(255,255,255,0.4); line-height: 1.6; margin-bottom: 32px;
        }
        .rejoindre-name { color: #3b82f6; font-weight: 600; }
        .btn-accept {
          width: 100%; padding: 14px; background: #3b82f6; color: #fff;
          border: none; border-radius: 999px;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
          cursor: pointer; transition: background 0.2s;
        }
        .btn-accept:hover { background: #2563eb; }
        .rejoindre-msg { font-size: 14px; color: rgba(255,255,255,0.4); margin-top: 16px; }
        .rejoindre-msg.ok { color: #34d399; }
        .rejoindre-msg.err { color: #f87171; }
      `}</style>
      <Header />
      <div className="rejoindre-page">
        <div className="rejoindre-card">
          {status === "loading" && (
            <>
              <div className="rejoindre-icon"><Loader2 size={32} className="animate-spin" /></div>
              <div className="rejoindre-title">Vérification…</div>
            </>
          )}
          {status === "ready" && (
            <>
              <div className="rejoindre-icon"><Handshake size={32} /></div>
              <div className="rejoindre-title">Invitation reçue</div>
              <p className="rejoindre-sub">
                <span className="rejoindre-name">{fromName}</span> t&apos;invite à rejoindre son réseau sur SQUEST.
                Accepte pour vous voir mutuellement dans le classement.
              </p>
              {session ? (
                <button className="btn-accept" onClick={accept}>Accepter l&apos;invitation</button>
              ) : (
                <p className="rejoindre-msg">Connecte-toi d&apos;abord pour accepter l&apos;invitation.</p>
              )}
            </>
          )}
          {status === "done" && (
            <>
              <div className="rejoindre-icon success"><PartyPopper size={32} /></div>
              <div className="rejoindre-title">Ami ajouté !</div>
              <p className="rejoindre-msg ok">Redirection vers ta liste d&apos;amis…</p>
            </>
          )}
          {status === "error" && (
            <>
              <div className="rejoindre-icon danger"><XCircle size={32} /></div>
              <div className="rejoindre-title">Lien invalide</div>
              <p className="rejoindre-msg err">{msg}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
