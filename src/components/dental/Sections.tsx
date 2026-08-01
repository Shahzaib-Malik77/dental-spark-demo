import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import doctor1 from "@/assets/doctor-1.jpg";
import doctor2 from "@/assets/doctor-2.jpg";
import doctor3 from "@/assets/doctor-3.jpg";
import clinicInterior from "@/assets/clinic-interior.jpg";

/* ---------- shared reveal ---------- */

export function useReveal(threshold = 0.15) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  const getAnimStyle = (index: number): CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 110}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 110}ms`,
  });

  return { containerRef, getAnimStyle, visible };
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-neutral-500 uppercase">
      <span className="h-1.5 w-1.5 rounded-full bg-black" />
      {children}
    </span>
  );
}

/* ---------- marquee ---------- */

const marqueeItems = [
  "Digital X-Rays",
  "Same-Day Crowns",
  "Sedation Dentistry",
  "Invisible Aligners",
  "Emergency Care",
  "Kids Dentistry",
];

export function MarqueeStrip() {
  return (
    <div className="w-full overflow-hidden border-y border-black/10 bg-black py-4 md:py-5">
      <div className="marquee-track flex w-max items-center gap-10 md:gap-16">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center gap-10 md:gap-16" aria-hidden={dup === 1}>
            {marqueeItems.map((item) => (
              <span
                key={item}
                className="flex items-center gap-10 text-lg font-bold whitespace-nowrap text-white md:gap-16 md:text-2xl"
              >
                {item}
                <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- why us + counters ---------- */

const stats = [
  { value: 18, suffix: "+", label: "Years of practice" },
  { value: 12000, suffix: "+", label: "Smiles restored" },
  { value: 4.9, suffix: "/5", label: "Patient rating" },
  { value: 24, suffix: "/7", label: "Emergency line" },
];

const reasons = [
  {
    num: "01",
    title: "Painless treatment protocol",
    body: "Micro-anaesthesia and calm sedation options mean most patients feel nothing at all.",
  },
  {
    num: "02",
    title: "Same-day digital dentistry",
    body: "In-house scanners and a milling unit produce crowns and veneers while you wait.",
  },
  {
    num: "03",
    title: "Transparent, fixed pricing",
    body: "Every plan is quoted in writing before we start. No surprise line items, ever.",
  },
];

function Counter({ value, suffix, active }: { value: number; suffix: string; active: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value]);

  const isDecimal = !Number.isInteger(value);
  const text = isDecimal
    ? display.toFixed(1)
    : Math.round(display).toLocaleString("en-US");

  return (
    <span className="tabular-nums">
      {text}
      {suffix}
    </span>
  );
}

export function WhyUsSection() {
  const { containerRef, getAnimStyle, visible } = useReveal(0.2);

  return (
    <section
      id="about"
      ref={(el) => {
        containerRef.current = el;
      }}
      className="w-full px-3 py-16 md:px-5 md:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div style={getAnimStyle(0)}>
          <SectionLabel>Why Dental Health</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[0.95] font-bold tracking-tight text-black">
            Clinical precision,
            <br />
            without the anxiety.
          </h2>
        </div>

        <div
          style={getAnimStyle(1)}
          className="mt-12 grid grid-cols-2 gap-1.5 md:mt-16 md:grid-cols-4 md:gap-2"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl bg-stone-50 p-5 transition-colors duration-300 hover:bg-black md:rounded-2xl md:p-7 [&:hover_*]:text-white"
            >
              <p className="text-[clamp(2rem,4vw,3.5rem)] leading-none font-bold text-black transition-colors duration-300">
                <Counter value={s.value} suffix={s.suffix} active={visible} />
              </p>
              <p className="mt-3 text-xs font-semibold text-neutral-500 transition-colors duration-300 md:text-sm">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-1.5 grid grid-cols-1 gap-1.5 md:mt-2 md:grid-cols-3 md:gap-2">
          {reasons.map((r, i) => (
            <div
              key={r.num}
              style={getAnimStyle(2 + i)}
              className="group rounded-xl border border-black/10 p-5 transition-colors duration-300 hover:border-black md:rounded-2xl md:p-7"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black text-xs font-semibold text-black transition-colors duration-300 group-hover:bg-black group-hover:text-white md:h-11 md:w-11 md:text-sm">
                {r.num}
              </span>
              <h3 className="mt-6 text-xl leading-tight font-bold text-black md:text-2xl">
                {r.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed font-medium text-neutral-500">{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- team ---------- */

const team = [
  { name: "Dr. Alexandra Reid", role: "Cosmetic & General Dentist", img: doctor1 },
  { name: "Dr. Marcus Hale", role: "Implantology & Oral Surgery", img: doctor2 },
  { name: "Elena Vasquez", role: "Lead Dental Hygienist", img: doctor3 },
];

export function TeamSection() {
  const { containerRef, getAnimStyle } = useReveal(0.15);

  return (
    <section
      id="team"
      ref={(el) => {
        containerRef.current = el;
      }}
      className="w-full px-3 pb-16 md:px-5 md:pb-24"
    >
      <div className="mx-auto max-w-7xl">
        <div
          style={getAnimStyle(0)}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <SectionLabel>The Team</SectionLabel>
            <h2 className="mt-5 text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[0.95] font-bold tracking-tight text-black">
              People behind
              <br />
              the smiles.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed font-medium text-neutral-500">
            A small, senior team — you see the same clinician at every visit, from consultation to
            final polish.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-1.5 md:mt-16 md:grid-cols-3 md:gap-2">
          {team.map((member, i) => (
            <article
              key={member.name}
              style={getAnimStyle(1 + i)}
              className="group relative overflow-hidden rounded-xl bg-stone-50 md:rounded-2xl"
            >
              <img
                src={member.img}
                alt={`${member.name}, ${member.role}`}
                loading="lazy"
                width={912}
                height={1200}
                className="h-[380px] w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 md:h-[520px]"
              />
              <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-white/70 p-4 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 md:rounded-2xl md:p-5">
                <h3 className="text-lg leading-tight font-bold text-black md:text-xl">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs font-semibold text-neutral-600 md:text-sm">
                  {member.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- testimonials ---------- */

const testimonials = [
  {
    quote:
      "I avoided dentists for nine years. They rebuilt four teeth in two visits and I never felt a thing.",
    name: "Hira K.",
    detail: "Veneers & whitening",
  },
  {
    quote:
      "The scan-to-crown process is unreal. Walked in at 10, walked out with a permanent crown by 2.",
    name: "Daniel M.",
    detail: "Same-day crown",
  },
  {
    quote:
      "Two implants, zero drama. Pricing was fixed up front and the follow-up care was genuinely warm.",
    name: "Sana R.",
    detail: "Dental implants",
  },
];

export function TestimonialsSection() {
  const { containerRef, getAnimStyle } = useReveal(0.2);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, []);

  const active = testimonials[index]!;

  return (
    <section
      ref={(el) => {
        containerRef.current = el;
      }}
      className="w-full px-3 pb-16 md:px-5 md:pb-24"
    >
      <div className="mx-auto max-w-7xl">
        <div
          style={getAnimStyle(0)}
          className="rounded-xl bg-black p-6 md:rounded-2xl md:p-14"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] font-semibold tracking-[0.18em] text-white/60 uppercase">
              Patient stories
            </span>
            <span className="text-xs font-semibold text-white/60 tabular-nums md:text-sm">
              {String(index + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
            </span>
          </div>

          <blockquote
            key={index}
            className="animate-fade-in mt-8 max-w-4xl text-[clamp(1.5rem,3.6vw,3rem)] leading-[1.1] font-bold text-white md:mt-12"
          >
            “{active.quote}”
          </blockquote>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-6 md:mt-14">
            <div>
              <p className="text-sm font-bold text-white md:text-base">{active.name}</p>
              <p className="mt-1 text-xs font-semibold text-white/60 md:text-sm">{active.detail}</p>
            </div>
            <div className="flex gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.name}
                  aria-label={`Show review from ${t.name}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index ? "w-10 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- faq ---------- */

const faqs = [
  {
    q: "Does the treatment hurt?",
    a: "We use topical numbing before any injection, plus optional nitrous sedation. Most patients rate discomfort at 0–1 out of 10.",
  },
  {
    q: "How long do veneers last?",
    a: "Porcelain veneers typically last 12–18 years with routine hygiene visits. We include a 5-year care warranty on all cosmetic work.",
  },
  {
    q: "Do you offer payment plans?",
    a: "Yes — treatments over $800 can be split into 3, 6, or 12 interest-free monthly payments approved on the day.",
  },
  {
    q: "What about dental emergencies?",
    a: "Our emergency line is staffed 24/7 and we hold same-day slots every morning for urgent pain, trauma, or lost restorations.",
  },
];

export function FaqSection() {
  const { containerRef, getAnimStyle } = useReveal(0.15);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      ref={(el) => {
        containerRef.current = el;
      }}
      className="w-full px-3 pb-16 md:px-5 md:pb-24"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <div style={getAnimStyle(0)}>
          <SectionLabel>Questions</SectionLabel>
          <h2 className="mt-5 text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[0.95] font-bold tracking-tight text-black">
            Good to
            <br />
            know.
          </h2>
        </div>

        <div className="divide-y divide-black/10 border-y border-black/10">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} style={getAnimStyle(1 + i)}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left md:py-7"
                >
                  <span className="text-lg leading-tight font-bold text-black md:text-2xl">
                    {f.q}
                  </span>
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black md:h-11 md:w-11">
                    <span className="absolute h-0.5 w-3.5 rounded-full bg-black md:w-4" />
                    <span
                      className={`absolute h-0.5 w-3.5 rounded-full bg-black transition-transform duration-300 md:w-4 ${
                        isOpen ? "rotate-0" : "rotate-90"
                      }`}
                    />
                  </span>
                </button>
                <div
                  className="grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p className="overflow-hidden pr-10 text-sm leading-relaxed font-medium text-neutral-500 md:text-base">
                    <span className="block pb-6 md:pb-8">{f.a}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- booking ---------- */

export function BookingSection() {
  const { containerRef, getAnimStyle } = useReveal(0.15);
  const [sent, setSent] = useState(false);

  return (
    <section
      id="contact"
      ref={(el) => {
        containerRef.current = el;
      }}
      className="w-full px-3 pb-3 md:px-5 md:pb-5"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-1.5 md:grid-cols-2 md:gap-2">
        <div
          style={getAnimStyle(0)}
          className="relative overflow-hidden rounded-xl md:rounded-2xl"
        >
          <img
            src={clinicInterior}
            alt="Interior of the Dental Health clinic with treatment chair and glass partitions"
            loading="lazy"
            width={1600}
            height={1008}
            className="h-full min-h-[280px] w-full object-cover"
          />
          <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-white/70 p-4 backdrop-blur-xl md:bottom-5 md:left-5 md:right-5 md:rounded-2xl md:p-6">
            <p className="text-xs font-semibold text-neutral-600 md:text-sm">Visit us</p>
            <p className="mt-2 text-lg leading-tight font-bold text-black md:text-2xl">
              4820 Bergenline Ave,
              <br />
              West New York, NJ
            </p>
            <p className="mt-3 text-xs font-semibold text-neutral-600 md:text-sm">
              Mon–Sat · 09:00 – 19:00
            </p>
          </div>
        </div>

        <div
          style={getAnimStyle(1)}
          className="rounded-xl bg-stone-50 p-6 md:rounded-2xl md:p-12"
        >
          <SectionLabel>Book an appointment</SectionLabel>
          <h2 className="mt-5 text-[clamp(2rem,4.5vw,3.5rem)] leading-[0.95] font-bold tracking-tight text-black">
            Free consultation,
            <br />
            no obligation.
          </h2>

          <form
            className="mt-8 flex flex-col gap-1.5 md:mt-10 md:gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <input
              required
              placeholder="Full name"
              className="w-full rounded-xl border border-black/10 bg-white px-5 py-4 text-sm font-semibold text-black placeholder:text-neutral-400 focus:border-black focus:outline-none md:rounded-2xl md:py-5 md:text-base"
            />
            <input
              required
              type="tel"
              placeholder="Phone number"
              className="w-full rounded-xl border border-black/10 bg-white px-5 py-4 text-sm font-semibold text-black placeholder:text-neutral-400 focus:border-black focus:outline-none md:rounded-2xl md:py-5 md:text-base"
            />
            <select
              required
              defaultValue=""
              className="w-full rounded-xl border border-black/10 bg-white px-5 py-4 text-sm font-semibold text-black focus:border-black focus:outline-none md:rounded-2xl md:py-5 md:text-base"
            >
              <option value="" disabled>
                Choose a treatment
              </option>
              <option>Dental veneers</option>
              <option>Dental crowns</option>
              <option>Teeth whitening</option>
              <option>Dental implants</option>
              <option>Emergency visit</option>
            </select>
            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-black px-6 py-4 text-sm font-bold text-white transition-transform duration-200 hover:scale-[1.02] md:py-5 md:text-lg"
            >
              {sent ? "Request received — we'll call you" : "Book my free consultation"}
            </button>
            <p className="mt-2 text-xs font-medium text-neutral-500">
              Demo form — connect it to your clinic's booking system or CRM on request.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ---------- footer ---------- */

export function SiteFooter() {
  return (
    <footer className="w-full px-3 pb-3 md:px-5 md:pb-5">
      <div className="mx-auto max-w-7xl rounded-xl bg-black p-6 md:rounded-2xl md:p-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div>
            <p className="text-2xl leading-none font-extrabold tracking-tight text-white uppercase md:text-4xl">
              Dental
            </p>
            <p className="-mt-1 text-2xl leading-none font-extrabold tracking-tight text-white uppercase md:-mt-2 md:text-4xl">
              Health
            </p>
            <p className="mt-3 text-xs font-medium text-white/50">quality healthcare</p>
          </div>

          <div className="flex flex-wrap gap-10 md:gap-16">
            <div className="flex flex-col gap-2">
              <p className="mb-1 text-[11px] font-semibold tracking-[0.18em] text-white/40 uppercase">
                Explore
              </p>
              {[
                { label: "Services", href: "#services" },
                { label: "About", href: "#about" },
                { label: "Team", href: "#team" },
                { label: "FAQ", href: "#faq" },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-sm font-semibold text-white/80 transition-colors hover:text-white"
                >
                  {l.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <p className="mb-1 text-[11px] font-semibold tracking-[0.18em] text-white/40 uppercase">
                Contact
              </p>
              <a
                href="tel:+15551234567"
                className="text-sm font-semibold text-white/80 transition-colors hover:text-white"
              >
                +1 (555) 123-4567
              </a>
              <a
                href="mailto:hello@dentalhealth.com"
                className="text-sm font-semibold text-white/80 transition-colors hover:text-white"
              >
                hello@dentalhealth.com
              </a>
              <span className="text-sm font-semibold text-white/80">West New York, NJ</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 md:mt-14 md:flex-row md:items-center md:justify-between">
          <p className="text-xs font-medium text-white/40">
            © {new Date().getFullYear()} Dental Health. Demo site by Zaphtra Ltd.
          </p>
          <a
            href="#contact"
            className="text-xs font-semibold text-white/60 transition-colors hover:text-white"
          >
            Book an appointment →
          </a>
        </div>
      </div>
    </footer>
  );
}
