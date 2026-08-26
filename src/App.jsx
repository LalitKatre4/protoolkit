import React, { useState, useMemo, useCallback } from "react";
import {
  Search,
  Moon,
  Sun,
  Share2,
  Copy,
  Check,
  Wrench,
  TrendingUp,
  Mail,
  Gauge,
  Code2,
  Sparkles,
  Target,
  Landmark,
  ChevronRight,
  MessageSquare,
  SlidersHorizontal,
} from "lucide-react";

/* -------------------------------- Theme -------------------------------- */

const THEMES = {
  dark: {
    bg: "#0A0E14",
    bgAlt: "#0E1219",
    surface: "#141924",
    surfaceAlt: "#1B212E",
    border: "#242B3A",
    borderStrong: "#323B4F",
    text: "#E7EAF0",
    textMuted: "#8B93A8",
    textFaint: "#5B6478",
    accent: "#5EEAD4",
    accentSoft: "rgba(94,234,212,0.12)",
    accent2: "#F5A623",
    accent2Soft: "rgba(245,166,35,0.12)",
    danger: "#F2545B",
    dangerSoft: "rgba(242,84,91,0.12)",
    success: "#4ADE80",
    successSoft: "rgba(74,222,128,0.12)",
    readoutBg: "#080B10",
  },
  light: {
    bg: "#F3F4F7",
    bgAlt: "#EAECF1",
    surface: "#FFFFFF",
    surfaceAlt: "#F6F7FA",
    border: "#E1E4EA",
    borderStrong: "#CBD0DB",
    text: "#151822",
    textMuted: "#5B6478",
    textFaint: "#8B93A8",
    accent: "#0F8F83",
    accentSoft: "rgba(15,143,131,0.10)",
    accent2: "#B4670A",
    accent2Soft: "rgba(180,103,10,0.10)",
    danger: "#D6353D",
    dangerSoft: "rgba(214,53,61,0.10)",
    success: "#16A34A",
    successSoft: "rgba(22,163,74,0.10)",
    readoutBg: "#10141C",
  },
};

const FONT_IMPORT_URL =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap";

/* ------------------------------- Helpers -------------------------------- */

const fmtCurrency = (n) => {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n >= 1000 ? 0 : 2,
  });
};

const fmtNum = (n, decimals = 0) => {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
};

const clampNum = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

/* ------------------------------- Atoms ----------------------------------- */

function FieldLabel({ children, hint, t }) {
  return (
    <div className="flex items-baseline justify-between mb-1.5">
      <label
        className="text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: t.textMuted, fontFamily: "'Inter', sans-serif" }}
      >
        {children}
      </label>
      {hint && (
        <span
          className="text-[10px]"
          style={{ color: t.textFaint, fontFamily: "'JetBrains Mono', monospace" }}
        >
          {hint}
        </span>
      )}
    </div>
  );
}

function NumberField({ label, value, onChange, prefix, suffix, hint, t, step = 1 }) {
  return (
    <div>
      <FieldLabel t={t} hint={hint}>
        {label}
      </FieldLabel>
      <div
        className="flex items-center rounded-lg border overflow-hidden transition-colors focus-within:ring-2"
        style={{
          background: t.surfaceAlt,
          borderColor: t.border,
          "--tw-ring-color": t.accent + "55",
        }}
      >
        {prefix && (
          <span
            className="pl-3 text-sm font-medium select-none"
            style={{ color: t.textFaint, fontFamily: "'JetBrains Mono', monospace" }}
          >
            {prefix}
          </span>
        )}
        <input
          type="number"
          inputMode="decimal"
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-3 py-2.5 text-sm font-medium outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          style={{ color: t.text, fontFamily: "'JetBrains Mono', monospace" }}
        />
        {suffix && (
          <span
            className="pr-3 text-sm font-medium select-none"
            style={{ color: t.textFaint, fontFamily: "'JetBrains Mono', monospace" }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function Readout({ label, value, sub, tone = "accent", t, size = "md" }) {
  const toneColor =
    tone === "danger" ? t.danger : tone === "success" ? t.success : tone === "accent2" ? t.accent2 : t.accent;
  return (
    <div
      className="rounded-lg px-4 py-3 flex flex-col gap-0.5 border"
      style={{ background: t.readoutBg, borderColor: t.border }}
    >
      <span
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: t.textFaint }}
      >
        {label}
      </span>
      <span
        className={size === "lg" ? "text-2xl" : "text-lg"}
        style={{
          color: toneColor,
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
          textShadow: `0 0 18px ${toneColor}33`,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </span>
      {sub && (
        <span className="text-[11px]" style={{ color: t.textMuted }}>
          {sub}
        </span>
      )}
    </div>
  );
}

function TickBorder({ t }) {
  return (
    <div className="flex items-end gap-[3px] h-2 px-4 pt-2 select-none" aria-hidden="true">
      {Array.from({ length: 28 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 1,
            height: i % 4 === 0 ? 8 : 4,
            background: t.borderStrong,
            opacity: i % 4 === 0 ? 0.9 : 0.4,
          }}
        />
      ))}
    </div>
  );
}

function CategoryPill({ category, t }) {
  const iconMap = {
    Freelancing: Wrench,
    Marketing: TrendingUp,
    Developer: Code2,
    Finance: Landmark,
  };
  const Icon = iconMap[category] || Sparkles;
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md"
      style={{ background: t.accentSoft, color: t.accent }}
    >
      <Icon size={11} strokeWidth={2.5} />
      {category}
    </span>
  );
}

/* --------------------------- Calculator Card shell ------------------------ */

function CalcCard({ meta, t, children }) {
  const Icon = meta.icon;
  return (
    <div
      className="rounded-2xl border overflow-hidden flex flex-col transition-shadow hover:shadow-lg"
      style={{ background: t.surface, borderColor: t.border, boxShadow: `0 1px 0 ${t.border}` }}
    >
      <TickBorder t={t} />
      <div className="px-5 pt-3 pb-4">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: t.accentSoft }}
            >
              <Icon size={18} style={{ color: t.accent }} strokeWidth={2.2} />
            </div>
            <div>
              <h3
                className="text-[15px] font-semibold leading-tight"
                style={{ color: t.text, fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {meta.title}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>
                {meta.desc}
              </p>
            </div>
          </div>
          <CategoryPill category={meta.category} t={t} />
        </div>
      </div>
      <div className="px-5 pb-5 flex-1">{children}</div>
    </div>
  );
}

/* ------------------------------ Calculators -------------------------------- */

function FreelanceRateCalculator({ t }) {
  const [income, setIncome] = useState("6000");
  const [hours, setHours] = useState("25");
  const [expenses, setExpenses] = useState("800");
  const [margin, setMargin] = useState("20");

  const { hourlyRate, projectRate, monthlyHours } = useMemo(() => {
    const inc = clampNum(income);
    const hrsWk = clampNum(hours);
    const exp = clampNum(expenses);
    const marg = Math.min(clampNum(margin), 95);

    const baseNeed = inc + exp;
    const withMargin = marg < 95 ? baseNeed / (1 - marg / 100) : baseNeed;
    const monthlyHrs = hrsWk * 4.33;
    const hourly = monthlyHrs > 0 ? withMargin / monthlyHrs : 0;
    const project = hourly * hrsWk;

    return { hourlyRate: hourly, projectRate: project, monthlyHours: monthlyHrs };
  }, [income, hours, expenses, margin]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Desired Income" prefix="$" value={income} onChange={setIncome} hint="/ month" t={t} />
        <NumberField label="Billable Hours" value={hours} onChange={setHours} hint="/ week" t={t} />
        <NumberField label="Monthly Expenses" prefix="$" value={expenses} onChange={setExpenses} t={t} />
        <NumberField label="Profit Margin" value={margin} onChange={setMargin} suffix="%" t={t} />
      </div>
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <Readout label="Hourly Rate" value={fmtCurrency(hourlyRate)} tone="accent" t={t} size="lg" />
        <Readout
          label="Project Rate"
          value={fmtCurrency(projectRate)}
          sub={`based on ${fmtNum(clampNum(hours))} hrs/wk`}
          tone="accent2"
          t={t}
        />
      </div>
      <p className="text-[11px] pt-0.5" style={{ color: t.textFaint }}>
        Assumes {fmtNum(monthlyHours, 1)} billable hours per month (4.33 weeks).
      </p>
    </div>
  );
}

function RoasCalculator({ t }) {
  const [spend, setSpend] = useState("2000");
  const [revenue, setRevenue] = useState("7000");
  const [cost, setCost] = useState("1500");

  const { roas, profit, breakeven, marginPct } = useMemo(() => {
    const s = clampNum(spend);
    const r = clampNum(revenue);
    const c = clampNum(cost);
    const roasVal = s > 0 ? r / s : 0;
    const profitVal = r - s - c;
    const margin = r > 0 ? (r - c) / r : 0;
    const breakevenRoas = margin > 0 ? 1 / margin : Infinity;
    return { roas: roasVal, profit: profitVal, breakeven: breakevenRoas, marginPct: margin * 100 };
  }, [spend, revenue, cost]);

  const profitTone = profit >= 0 ? "success" : "danger";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Ad Spend" prefix="$" value={spend} onChange={setSpend} t={t} />
        <NumberField label="Revenue Generated" prefix="$" value={revenue} onChange={setRevenue} t={t} />
        <NumberField label="Product Cost" prefix="$" value={cost} onChange={setCost} hint="COGS" t={t} />
        <div
          className="rounded-lg border flex flex-col justify-center px-3"
          style={{ background: t.surfaceAlt, borderColor: t.border }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: t.textFaint }}>
            Gross Margin
          </span>
          <span className="text-sm font-semibold" style={{ color: t.text, fontFamily: "'JetBrains Mono', monospace" }}>
            {fmtNum(marginPct, 1)}%
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        <Readout label="ROAS" value={`${fmtNum(roas, 2)}x`} tone="accent" t={t} size="lg" />
        <Readout label="Profit" value={fmtCurrency(profit)} tone={profitTone} t={t} />
        <Readout
          label="Breakeven ROAS"
          value={isFinite(breakeven) ? `${fmtNum(breakeven, 2)}x` : "—"}
          tone="accent2"
          t={t}
        />
      </div>
    </div>
  );
}

function ColdEmailCalculator({ t }) {
  const [emails, setEmails] = useState("2000");
  const [openRate, setOpenRate] = useState("45");
  const [replyRate, setReplyRate] = useState("8");

  const { opens, replies, bookedCalls } = useMemo(() => {
    const e = clampNum(emails);
    const o = clampNum(openRate);
    const r = clampNum(replyRate);
    const opensVal = e * (o / 100);
    const repliesVal = opensVal * (r / 100);
    const bookedVal = repliesVal * 0.2;
    return { opens: opensVal, replies: repliesVal, bookedCalls: bookedVal };
  }, [emails, openRate, replyRate]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Emails Sent" value={emails} onChange={setEmails} hint="/ month" t={t} />
        <NumberField label="Open Rate" value={openRate} onChange={setOpenRate} suffix="%" t={t} />
        <NumberField label="Reply Rate" value={replyRate} onChange={setReplyRate} suffix="%" hint="of opens" t={t} />
      </div>
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        <Readout label="Opens" value={fmtNum(opens)} tone="accent" t={t} />
        <Readout label="Leads (Replies)" value={fmtNum(replies)} tone="accent2" t={t} size="lg" />
        <Readout label="Booked Calls" value={fmtNum(bookedCalls)} tone="success" t={t} />
      </div>
      <p className="text-[11px] pt-0.5" style={{ color: t.textFaint }}>
        Booked calls assume 20% of positive replies convert to a call.
      </p>
    </div>
  );
}

function RunwayCalculator({ t }) {
  const [cash, setCash] = useState("120000");
  const [burn, setBurn] = useState("18000");
  const [rev, setRev] = useState("6000");

  const { runway, netBurn, tone, statusLabel } = useMemo(() => {
    const c = clampNum(cash);
    const b = clampNum(burn);
    const r = clampNum(rev);
    const net = b - r;

    if (net <= 0) {
      return { runway: Infinity, netBurn: net, tone: "success", statusLabel: "Profitable — infinite runway" };
    }
    const months = c / net;
    let toneVal = "success";
    let label = "Healthy";
    if (months < 6) {
      toneVal = "danger";
      label = "Critical — raise or cut burn now";
    } else if (months < 12) {
      toneVal = "accent2";
      label = "Caution — plan your next raise";
    } else {
      toneVal = "success";
      label = "Healthy";
    }
    return { runway: months, netBurn: net, tone: toneVal, statusLabel: label };
  }, [cash, burn, rev]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Cash Balance" prefix="$" value={cash} onChange={setCash} t={t} />
        <NumberField label="Monthly Burn" prefix="$" value={burn} onChange={setBurn} t={t} />
        <NumberField label="Monthly Revenue" prefix="$" value={rev} onChange={setRev} t={t} />
        <div
          className="rounded-lg border flex flex-col justify-center px-3"
          style={{ background: t.surfaceAlt, borderColor: t.border }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: t.textFaint }}>
            Net Burn
          </span>
          <span className="text-sm font-semibold" style={{ color: t.text, fontFamily: "'JetBrains Mono', monospace" }}>
            {fmtCurrency(netBurn)}/mo
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2.5 pt-1">
        <div
          className="rounded-lg px-4 py-3 flex items-center justify-between border"
          style={{ background: t.readoutBg, borderColor: t.border }}
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: t.textFaint }}>
              Runway
            </span>
            <span
              className="text-2xl"
              style={{
                color: tone === "success" ? t.success : tone === "danger" ? t.danger : t.accent2,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
              }}
            >
              {isFinite(runway) ? `${fmtNum(runway, 1)} mo` : "∞"}
            </span>
          </div>
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{
              background: tone === "success" ? t.success : tone === "danger" ? t.danger : t.accent2,
              boxShadow: `0 0 12px ${tone === "success" ? t.success : tone === "danger" ? t.danger : t.accent2}`,
            }}
          />
        </div>
        <p className="text-[11px]" style={{ color: t.textMuted }}>
          {statusLabel}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------ Cheat Sheets -------------------------------- */

const CHEAT_SHEETS = [
  {
    id: "marketing-kpis",
    title: "Marketing KPIs & Formulas",
    category: "Marketing",
    icon: TrendingUp,
    lines: [
      "CAC = Total Sales & Marketing Spend / New Customers Acquired",
      "LTV = Avg Purchase Value × Purchase Frequency × Customer Lifespan",
      "LTV:CAC — healthy benchmark is 3:1 or higher",
      "Conversion Rate = Conversions / Total Visitors × 100",
      "CTR = Clicks / Impressions × 100",
      "ROAS = Revenue / Ad Spend",
      "Churn Rate = Customers Lost / Customers at Start × 100",
      "MRR = Sum of active monthly recurring subscriptions",
    ],
  },
  {
    id: "git-commands",
    title: "Essential Git Commands",
    category: "Developer",
    icon: Code2,
    lines: [
      "git init — start a new repository",
      "git clone <url> — copy a remote repo locally",
      "git status — see what's changed",
      "git add . — stage all changes",
      'git commit -m "message" — save a snapshot',
      "git branch <name> — create a new branch",
      "git checkout -b <name> — create and switch branches",
      "git merge <branch> — bring changes into current branch",
      "git pull — fetch and merge from remote",
      "git push — send commits to remote",
      "git stash — shelve uncommitted changes",
      "git log --oneline — compact commit history",
    ],
  },
  {
    id: "system-prompts",
    title: "Top System Prompt Templates for AI",
    category: "Developer",
    icon: Sparkles,
    lines: [
      "Role + Task + Constraints + Format: 'You are a [role]. Your task is [task]. Follow: [constraints]. Respond in [format].'",
      "Few-shot pattern: give 2–3 input/output examples before the real request",
      "Chain-of-thought nudge: 'Think step by step before answering'",
      "Output contract: specify the exact schema or JSON keys expected",
      "Guardrail clause: 'If the request is ambiguous, ask one clarifying question first'",
      "Persona anchor: give the model a consistent voice and tone reference",
    ],
  },
  {
    id: "cold-email-frameworks",
    title: "Cold Email Frameworks (AIDA, PAS)",
    category: "Marketing",
    icon: Mail,
    lines: [
      "AIDA — Attention: a specific, relevant opener",
      "AIDA — Interest: a fact or insight tied to their business",
      "AIDA — Desire: the outcome they'll get",
      "AIDA — Action: one clear, low-friction ask",
      "PAS — Problem: name the pain point directly",
      "PAS — Agitate: show the cost of leaving it unsolved",
      "PAS — Solution: your offer, framed as the fix",
    ],
  },
  {
    id: "seo-checklist",
    title: "SEO Checklist",
    category: "Marketing",
    icon: Target,
    lines: [
      "Target one primary keyword per page",
      "Unique title tag under 60 characters",
      "Meta description under 155 characters with a clear CTA",
      "One H1, structured H2/H3 hierarchy",
      "Descriptive alt text on every image",
      "Internal link to 2–3 related pages",
      "Mobile LCP under 2.5 seconds",
      "Submit an updated XML sitemap",
      "Fix broken links and redirect chains",
      "Use descriptive, keyword-friendly URL slugs",
    ],
  },
  {
    id: "b2b-pricing",
    title: "B2B Pricing Models",
    category: "Finance",
    icon: Landmark,
    lines: [
      "Flat-rate — one price, one feature set, simplest to sell",
      "Tiered — Good / Better / Best packages by feature depth",
      "Per-seat — price scales with number of users",
      "Usage-based — price scales with consumption or API calls",
      "Freemium — free tier drives adoption, paid tier drives revenue",
      "Value-based — price anchored to ROI delivered, not build cost",
    ],
  },
];

function CheatSheetCard({ sheet, t }) {
  const [copied, setCopied] = useState(false);
  const Icon = sheet.icon;

  const handleCopy = useCallback(() => {
    const text = `${sheet.title}\n\n${sheet.lines.map((l) => `• ${l}`).join("\n")}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [sheet]);

  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-3 transition-shadow hover:shadow-lg"
      style={{ background: t.surface, borderColor: t.border }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: t.accent2Soft }}
          >
            <Icon size={17} style={{ color: t.accent2 }} strokeWidth={2.2} />
          </div>
          <h3
            className="text-[15px] font-semibold leading-tight"
            style={{ color: t.text, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {sheet.title}
          </h3>
        </div>
        <CategoryPill category={sheet.category} t={t} />
      </div>

      <ul className="space-y-1.5 flex-1">
        {sheet.lines.slice(0, 6).map((line, i) => (
          <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: t.textMuted }}>
            <ChevronRight size={13} className="mt-0.5 shrink-0" style={{ color: t.textFaint }} />
            <span style={{ fontFamily: i === 0 ? "'JetBrains Mono', monospace" : "inherit", fontSize: i === 0 ? "12px" : "13px" }}>
              {line}
            </span>
          </li>
        ))}
        {sheet.lines.length > 6 && (
          <li className="text-[12px] pl-5" style={{ color: t.textFaint }}>
            +{sheet.lines.length - 6} more
          </li>
        )}
      </ul>

      <button
        onClick={handleCopy}
        className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors self-start cursor-pointer"
        style={{
          background: copied ? t.successSoft : t.accentSoft,
          color: copied ? t.success : t.accent,
        }}
      >
        {copied ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} strokeWidth={2.5} />}
        {copied ? "Copied" : "Copy to clipboard"}
      </button>
    </div>
  );
}

/* --------------------------------- Header ----------------------------------- */

const CATEGORIES = ["All", "Freelancing", "Marketing", "Developer", "Finance"];

function Header({ t, dark, setDark, search, setSearch, category, setCategory }) {
  const handleShare = () => {
    const url = encodeURIComponent(typeof window !== "undefined" ? window.location.href : "https://protoolkit.app");
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    if (typeof window !== "undefined") window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <header className="sticky top-0 z-20 backdrop-blur-md border-b" style={{ background: t.bg + "E6", borderColor: t.border }}>
      <div className="max-w-6xl mx-auto px-5 py-3.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center relative"
              style={{ background: t.accent }}
            >
              <SlidersHorizontal size={18} color={t.bg} strokeWidth={2.5} />
            </div>
            <div className="leading-none hidden sm:block">
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: t.text }} className="text-[15px] font-bold">
                ProToolkit
              </div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: t.textFaint }}>
                Calculators &amp; Cheat-Sheets
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-md">
            <div
              className="flex items-center gap-2 rounded-lg border px-3 py-2"
              style={{ background: t.surfaceAlt, borderColor: t.border }}
            >
              <Search size={15} style={{ color: t.textFaint }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search calculators & cheat-sheets…"
                className="w-full bg-transparent text-sm outline-none placeholder:opacity-70"
                style={{ color: t.text }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="hidden md:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer"
              style={{ background: t.accentSoft, color: t.accent }}
            >
              <Share2 size={13} strokeWidth={2.5} />
              Share
            </button>
            <button
              onClick={() => setDark(!dark)}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors cursor-pointer"
              style={{ borderColor: t.border, color: t.textMuted }}
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>

        <nav className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer"
                style={{
                  background: active ? t.accent : "transparent",
                  color: active ? t.bg : t.textMuted,
                  border: `1px solid ${active ? t.accent : t.border}`,
                }}
              >
                {c}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

/* --------------------------------- Footer ----------------------------------- */

function Footer({ t }) {
  const [sent, setSent] = useState(false);
  return (
    <footer className="border-t mt-16" style={{ borderColor: t.border, background: t.bgAlt }}>
      <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: t.accent }}>
            <SlidersHorizontal size={14} color={t.bg} strokeWidth={2.5} />
          </div>
          <p className="text-xs" style={{ color: t.textMuted }}>
            Curated &amp; built by{" "}
            <span style={{ color: t.text, fontWeight: 600 }}>Lalit katre</span> for founders, creators, and builders.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://www.linkedin.com/in/lalit-katre/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer"
            style={{ background: t.surface, color: t.text, border: `1px solid ${t.border}` }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24Z"/>
            </svg>
            Connect on LinkedIn
          </a>
          <button
            onClick={() => {
              setSent(true);
              setTimeout(() => setSent(false), 2000);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer"
            style={{ background: sent ? t.successSoft : t.accentSoft, color: sent ? t.success : t.accent }}
          >
            {sent ? <Check size={13} /> : <MessageSquare size={13} />}
            {sent ? "Thanks!" : "Send feedback"}
          </button>
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------------- App ------------------------------------- */

const CALC_META = [
  {
    id: "freelance",
    title: "Freelance Rate Calculator",
    category: "Freelancing",
    icon: Wrench,
    desc: "Find your ideal hourly & project rate",
    keywords: "income hours expenses margin hourly rate",
  },
  {
    id: "roas",
    title: "Ad ROI / ROAS Calculator",
    category: "Marketing",
    icon: TrendingUp,
    desc: "Measure ad spend efficiency & breakeven",
    keywords: "ad spend revenue roas profit breakeven",
  },
  {
    id: "coldemail",
    title: "Cold Email Outreach Estimator",
    category: "Marketing",
    icon: Mail,
    desc: "Forecast booked calls from send volume",
    keywords: "cold email open rate reply booked calls leads",
  },
  {
    id: "runway",
    title: "SaaS Churn / Runway Calculator",
    category: "Finance",
    icon: Gauge,
    desc: "Know exactly how many months you have left",
    keywords: "runway burn rate cash saas churn",
  },
];

export default function App() {
  const [dark, setDark] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const t = dark ? THEMES.dark : THEMES.light;

  const q = search.trim().toLowerCase();

  const visibleCalcs = CALC_META.filter((c) => {
    const catMatch = category === "All" || c.category === category;
    const searchMatch =
      q === "" || c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.keywords.includes(q);
    return catMatch && searchMatch;
  });

  const visibleSheets = CHEAT_SHEETS.filter((s) => {
    const catMatch = category === "All" || s.category === category;
    const searchMatch =
      q === "" ||
      s.title.toLowerCase().includes(q) ||
      s.lines.some((l) => l.toLowerCase().includes(q));
    return catMatch && searchMatch;
  });

  const calcRenderers = {
    freelance: FreelanceRateCalculator,
    roas: RoasCalculator,
    coldemail: ColdEmailCalculator,
    runway: RunwayCalculator,
  };

  return (
    <div
      className="min-h-screen w-full transition-colors duration-300"
      style={{ background: t.bg, fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @import url('${FONT_IMPORT_URL}');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        input[type=number] { -moz-appearance: textfield; }
        * { transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease; }
      `}</style>

      <Header
        t={t}
        dark={dark}
        setDark={setDark}
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      <main className="max-w-6xl mx-auto px-5">
        <section className="pt-10 pb-8">
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider mb-4"
            style={{ background: t.accentSoft, color: t.accent }}
          >
            <Gauge size={12} strokeWidth={2.5} />
            4 live calculators · 6 cheat-sheets
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold leading-tight max-w-2xl"
            style={{ color: t.text, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
          >
            The instrument panel for your business decisions.
          </h1>
          <p className="mt-3 text-sm sm:text-[15px] max-w-xl" style={{ color: t.textMuted }}>
            Precise, no-nonsense calculators and reference sheets for freelancers, marketers, developers, and
            founders. No sign-up, no spreadsheets — just numbers you can trust.
          </p>
        </section>

        <section className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: t.textMuted, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Calculators
            </h2>
            <span className="text-xs" style={{ color: t.textFaint }}>
              {visibleCalcs.length} of {CALC_META.length}
            </span>
          </div>

          {visibleCalcs.length === 0 ? (
            <EmptyState t={t} label="calculators" />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {visibleCalcs.map((meta) => {
                const Renderer = calcRenderers[meta.id];
                return (
                  <CalcCard key={meta.id} meta={meta} t={t}>
                    <Renderer t={t} />
                  </CalcCard>
                );
              })}
            </div>
          )}
        </section>

        <section className="py-10">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: t.textMuted, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Cheat-Sheet Hub
            </h2>
            <span className="text-xs" style={{ color: t.textFaint }}>
              {visibleSheets.length} of {CHEAT_SHEETS.length}
            </span>
          </div>

          {visibleSheets.length === 0 ? (
            <EmptyState t={t} label="cheat-sheets" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleSheets.map((sheet) => (
                <CheatSheetCard key={sheet.id} sheet={sheet} t={t} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer t={t} />
    </div>
  );
}

function EmptyState({ t, label }) {
  return (
    <div
      className="rounded-2xl border border-dashed py-14 flex flex-col items-center justify-center gap-2 text-center"
      style={{ borderColor: t.border }}
    >
      <Search size={20} style={{ color: t.textFaint }} />
      <p className="text-sm font-medium" style={{ color: t.textMuted }}>
        No {label} match your search or filter.
      </p>
      <p className="text-xs" style={{ color: t.textFaint }}>
        Try a different keyword or switch back to “All”.
      </p>
    </div>
  );
}