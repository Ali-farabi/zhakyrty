"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Cormorant_Garamond, Playfair_Display } from "next/font/google";
import Image from "next/image";
const headingFont = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
});

const bodyFont = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const EVENT_DATE = new Date("2026-03-23T18:00:00+06:00");
// TODO: If you need a different time/timezone, update the string above.

type FormState = {
  name: string;
  guests: string;
  phone: string;
};

type Status = "idle" | "loading" | "success" | "error";

function getTimeLeft(target: Date) {
  const now = Date.now();
  const diff = target.getTime() - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isLive: false };
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(EVENT_DATE));
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState<FormState>({
    name: "",
    guests: "1",
    phone: "",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(EVENT_DATE));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const particleCount = useMemo(() => Array.from({ length: 14 }), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "loading") return;
    setStatus("loading");

    // TODO: Paste your Google Apps Script Webhook URL here.
    const webhookUrl = "PASTE_WEBHOOK_URL_HERE";

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // If your Apps Script expects form-encoded data or needs no-cors, adjust here.
        body: JSON.stringify({
          ...form,
          event: "Арсен",
          eventDate: "23 наурыз 2026",
        }),
      });

      setStatus("success");
      setForm({ name: "", guests: "1", phone: "" });
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <div className={`${bodyFont.className} min-h-screen bg-[#f9f5ee] text-[#2d2417]`}>
      <style jsx global>{`
        :root {
          color-scheme: light;
        }
        body {
          background-color: #f9f5ee;
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 120% 50%;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.25;
          }
          50% {
            transform: translateY(-32px) translateX(12px);
            opacity: 0.8;
          }
        }
        @keyframes pulseGlow {
          0%,
          100% {
            box-shadow: 0 0 0 rgba(184, 139, 60, 0.2);
          }
          50% {
            box-shadow: 0 0 32px rgba(184, 139, 60, 0.45);
          }
        }
        @keyframes successPop {
          0% {
            transform: scale(0.7);
            opacity: 0;
          }
          60% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
        .shimmer-text {
          background: linear-gradient(
            90deg,
            #9a7a2d 0%,
            #b88b3c 40%,
            #d4aa54 65%,
            #b88b3c 85%,
            #9a7a2d 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 6s linear infinite;
        }
        .glass-card {
          background: radial-gradient(
            circle at top,
            rgba(255, 255, 255, 0.9),
            rgba(248, 243, 233, 0.85)
          );
          border: 1px solid rgba(184, 139, 60, 0.25);
          backdrop-filter: blur(12px);
        }
        .gold-divider {
          background: linear-gradient(
            90deg,
            rgba(184, 139, 60, 0) 0%,
            rgba(184, 139, 60, 0.7) 50%,
            rgba(184, 139, 60, 0) 100%
          );
        }
        .particle {
          position: absolute;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(184, 139, 60, 0.45), rgba(184, 139, 60, 0.05));
          animation: float 10s ease-in-out infinite;
        }
      `}</style>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(184,139,60,0.18),_transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,_rgba(184,139,60,0.08)_0%,_transparent_50%)]" />

        <div className="pointer-events-none absolute inset-0">
          {particleCount.map((_, index) => {
            const size = 6 + (index % 5) * 5;
            const top = (index * 13) % 100;
            const left = (index * 21) % 100;
            const delay = index * 0.6;
            const duration = 10 + (index % 6) * 2;

            return (
              <span
                key={`particle-${index}`}
                className="particle"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  top: `${top}%`,
                  left: `${left}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}
        </div>

        <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-6 pb-20 pt-14 sm:px-10 sm:pt-20 lg:px-16">
          <section
            className="flex flex-col gap-6 text-center sm:gap-8"
            style={{ animation: "fadeUp 1s ease both" }}
          >
            <p className="text-xs uppercase tracking-[0.5em] text-[#b48a3a] sm:text-sm">
              Тұсау кесер тойына шақыру
            </p>
            <h1
              className={`${headingFont.className} shimmer-text text-4xl uppercase leading-tight sm:text-5xl lg:text-6xl`}
            >
              Арсен
            </h1>
            <p className="mx-auto max-w-2xl text-base text-[#5b4a2f] sm:text-lg">
              Біздің ерекше күнімізге арналған салтанатқа шақырамыз. Махаббат, жарық және
              әсемдікке толы мерекені бірге бөлісуге қуаныштымыз.
            </p>
            <div className="mx-auto flex flex-col items-center gap-4 text-[#2d2417] sm:flex-row sm:gap-6">
              <div className="rounded-full border border-[#b48a3a] px-6 py-2 text-sm tracking-[0.3em]">
                23 наурыз 2026
              </div>
              <div className="rounded-full border border-[#b48a3a] px-6 py-2 text-sm tracking-[0.3em]">
                Әл-Фараби 1, Тараз
              </div>
            </div>
          </section>

          <section
            className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
            style={{ animation: "fadeUp 1.1s ease both", animationDelay: "0.2s" }}
          >
            <div className="glass-card rounded-[32px] p-8 sm:p-10">
              <h2 className={`${headingFont.className} text-2xl sm:text-3xl`}>
                Той туралы
              </h2>
              <p className="mt-4 text-sm uppercase tracking-[0.4em] text-[#b48a3a]">
                Салтанат және қонақасы
              </p>
              <div className="mt-8 grid gap-6 text-base text-[#5b4a2f] sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#b48a3a]">Күні</p>
                  <p className="mt-2 text-lg">23 наурыз 2026</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#b48a3a]">Өтетін орны</p>
                  <p className="mt-2 text-lg">Әл-Фараби 1, Тараз</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#b48a3a]">Басталуы</p>
                  <p className="mt-2 text-lg">18:00</p>
                </div>
               
              </div>
              <div className="mt-10 grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
                {[
                  { label: "Күн", value: timeLeft.days },
                  { label: "Сағат", value: timeLeft.hours },
                  { label: "Минут", value: timeLeft.minutes },
                  { label: "Секунд", value: timeLeft.seconds },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-[#e6d6b4] bg-[#fffaf0] px-3 py-4"
                  >
                    <div className="text-2xl font-semibold text-[#b88b3c] sm:text-3xl">
                      {item.value.toString().padStart(2, "0")}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[#9c7530]">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
              {timeLeft.isLive && (
                <p className="mt-6 text-center text-sm uppercase tracking-[0.4em] text-[#b88b3c]">
                  Той басталды
                </p>
              )}
            </div>

            <div className="glass-card flex flex-col justify-between rounded-[32px] p-8 sm:p-10">
              <div>
                <h2 className={`${headingFont.className} text-2xl sm:text-3xl`}>
                  Естелік суреттер
                </h2>
                <p className="mt-4 text-sm uppercase tracking-[0.4em] text-[#b48a3a]">
                  Біздің тарих
                </p>
              </div>
              <div className="mt-8 flex-1 rounded-[28px] border border-dashed border-[#b48a3a] bg-[#fffaf0]/70 p-6">
               
                <div
                  className="flex h-full min-h-[260px] items-center justify-center rounded-[22px] border border-[#e6d6b4] bg-[linear-gradient(135deg,_rgba(184,139,60,0.08),_transparent)] text-center text-sm text-[#b48a3a]"
                  style={{
                    backgroundImage: "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <Image
                    src="/Image-arsen.jpg"
                    alt="Той суреттері"
                    width={400}
                    height={300}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>
          </section>

          <section
            className="glass-card rounded-[32px] p-8 sm:p-10"
            style={{ animation: "fadeUp 1.1s ease both", animationDelay: "0.35s" }}
          >
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <h2 className={`${headingFont.className} text-2xl sm:text-3xl`}>
                  Қатысуды растау
                </h2>
                <p className="mt-4 text-[#5b4a2f]">
                  Қатысуыңызды растаңыз және мәліметтермен бөлісіңіз — әр қонаққа ерекше көңіл
                  бөлеміз.
                </p>
                <div className="mt-8 rounded-2xl border border-[#e6d6b4] bg-[#fffaf0] p-5 text-sm">
                  <p className="uppercase tracking-[0.4em] text-[#b48a3a]">Байланыс</p>
                  <p className="mt-3 text-[#5b4a2f]">
                    Сұрақтар болса, ұйымдастырушыға хабарласыңыз.
                  </p>
                  <p className="mt-3 text-[#b88b3c]">+7 (___) ___-__-__</p>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="relative flex flex-col gap-5 rounded-[24px] border border-[#e6d6b4] bg-[#fffaf0] p-6 sm:p-8"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-[0.4em] text-[#b48a3a]">
                    Аты-жөні
                  </label>
                  <input
                    className="rounded-xl border border-[#e6d6b4] bg-white/70 px-4 py-3 text-base text-[#2d2417] outline-none transition focus:border-[#b88b3c]"
                    placeholder="Атыңыз"
                    value={form.name}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-[0.4em] text-[#b48a3a]">
                    Қонақ саны
                  </label>
                  <select
                    className="rounded-xl border border-[#e6d6b4] bg-white/70 px-4 py-3 text-base text-[#2d2417] outline-none transition focus:border-[#b88b3c]"
                    value={form.guests}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, guests: event.target.value }))
                    }
                  >
                    {["1", "2", "3", "4", "5+"].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-[0.4em] text-[#b48a3a]">
                    Телефон
                  </label>
                  <input
                    className="rounded-xl border border-[#e6d6b4] bg-white/70 px-4 py-3 text-base text-[#2d2417] outline-none transition focus:border-[#b88b3c]"
                    placeholder="+7 (___) ___-__-__"
                    value={form.phone}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, phone: event.target.value }))
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 rounded-full border border-[#b88b3c] bg-[#fdf7ea] px-6 py-3 text-sm uppercase tracking-[0.35em] text-[#b88b3c] transition hover:bg-[#f7ecd5] focus:outline-none focus:ring-2 focus:ring-[#b88b3c]"
                  style={{ animation: "pulseGlow 3.5s ease-in-out infinite" }}
                >
                  {status === "loading" ? "Жіберілуде..." : "Қатысуды растау"}
                </button>

                {status === "error" && (
                  <p className="text-sm text-[#b45644]">
                    Жіберу сәтсіз болды. Байланыс пен webhook-ты тексеріңіз.
                  </p>
                )}

                {status === "success" && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[24px] bg-white/90 text-center"
                    style={{ animation: "successPop 0.8s ease-out both" }}
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#b88b3c] text-2xl text-[#b88b3c]">
                      ✓
                    </div>
                    <p className="text-sm uppercase tracking-[0.35em] text-[#b88b3c]">
                      Тойда көріскенше
                    </p>
                  </div>
                )}
              </form>
            </div>
          </section>

          <footer className="flex flex-col items-center gap-4 pb-10 text-center text-sm text-[#b48a3a]">
            <div className="gold-divider h-px w-40" />
            <p className="uppercase tracking-[0.35em]">Махаббатпен • 2026</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
