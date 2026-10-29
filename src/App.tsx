import React, { useState, useEffect, useRef } from "react";
import * as Lucide from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import { track } from "@vercel/analytics";

/* ============================================================
   TIPOS
   ============================================================ */
type Kid = { id: string; name: string; age: string; likes: string; calms: string };
type Contact = { id: string; label: string; name: string; phone: string };
type Task = { id: string; shift: string; cat: string; text: string };
type Hour = { id: string; date: string; h: number; note: string };
type AgendaItem = { id: string; day: number; time: string; title: string; type: string };
type Wish = { id: string; text: string; kind: string; done: boolean };
type AlertItem = { id: string; kind: string; text: string };
type Report = {
  shift: string; useNotes: boolean; mood: string; eating: string; sleep: number | "";
  bath: string; meds: string; medNote: string; trocas: number | ""; highlight: string; kid: string;
};
type State = {
  tab: string; seeded: boolean; name: string; age: string;
  diary: Record<string, Record<string, string>>;
  hoursLimit: string | number; hours: Hour[];
  agenda: AgendaItem[]; wish: Wish[]; contacts: Contact[]; alerts: AlertItem[]; kids: Kid[];
  rules: Record<string, string>; tasks: Task[];
  done: Record<string, Record<string, boolean>>;
  notes: Record<string, string>;
  report: Record<string, Record<string, any>>;
};
type SetFn = <K extends keyof State>(k: K, v: State[K] | ((prev: State[K]) => State[K])) => void;
type TabProps = { s: State; set: SetFn };
type Option = { id: string; label: string; icon?: string };

/* ============================================================
   CLASSES TAILWIND REUTILIZÁVEIS (paleta Blush & Soft Rose)
   ============================================================ */
const cx = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(" ");

const CARD = "bg-white border border-[#F3DEE3] rounded-[20px] p-4 shadow-[0_2px_10px_rgba(181,83,106,0.10)]";
const SUB = "text-[13px] text-[#7A626C]";
const label = (c = "text-[#7A626C]") => cx("block mb-1.5 text-xs font-bold uppercase tracking-wider", c);
const inp = (w = "w-full", pad = "px-3 py-2.5", colors = "border-[#F3DEE3] bg-[#FEF6F7]") =>
  cx("min-w-0 rounded-xl border text-base leading-snug text-[#3B2A31] placeholder:text-[#7A626C]/70 focus:outline-none focus:ring-2 focus:ring-[#B5536A]", w, pad, colors);
const ta = (minH = "min-h-[72px]", colors?: string) => cx(inp("w-full", "px-3 py-2.5", colors), minH, "resize-y");

const BTN_CORE = "inline-flex items-center justify-center gap-2 rounded-xl border text-sm font-bold no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B5536A] disabled:pointer-events-none disabled:opacity-40";
const btn = (kind: "n" | "p" | "d" = "n", small = false) =>
  cx(
    BTN_CORE,
    small ? "min-h-9 px-2.5 py-1.5" : "min-h-[44px] px-3.5 py-2.5",
    kind === "n" && "border-[#F3DEE3] bg-white text-[#3B2A31]",
    kind === "p" && "border-[#B5536A] bg-[#B5536A] text-white",
    kind === "d" && "border-[#C22B33] bg-[#C22B33] text-white"
  );
const IBTN = "inline-flex h-9 w-9 flex-none items-center justify-center rounded-[10px] text-[#7A626C] hover:bg-[#FEF6F7] hover:text-[#C22B33] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B5536A]";
const ROW = "flex items-center gap-2.5 border-t border-[#F3DEE3] py-2 first:border-t-0";
const CHIP = "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold uppercase leading-none tracking-wide";

const TONES: Record<string, string> = {
  "": "bg-[#FADFE5] text-[#B5536A]",
  mint: "bg-[#E2F0E8] text-[#2F6B50]",
  lav: "bg-[#EDE4F4] text-[#66468A]",
  peach: "bg-[#FCE8DA] text-[#94502D]",
  red: "bg-[#FFE8E6] text-[#C22B33]",
  solid: "bg-[#B5536A] text-white",
  danger: "bg-[#C22B33] text-white",
};
const chip = (tone = "") => cx(CHIP, TONES[tone] ?? TONES[""]);

/* ============================================================
   HELPERS
   ============================================================ */
const KEY = "planoDeBordo.v1";
const pad = (n: number) => String(n).padStart(2, "0");
const dkey = (d: Date = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const uid = () => Math.random().toString(36).slice(2, 9);
const parseKey = (k: string) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
const fmtShort = (k: string) => parseKey(k).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
const fmtLong = (d: Date = new Date()) => d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
const weekKeys = () => {
  const t = new Date(); const dow = (t.getDay() + 6) % 7;
  return Array.from({ length: 7 }, (_, i) => dkey(new Date(t.getFullYear(), t.getMonth(), t.getDate() - dow + i)));
};
const fmtH = (n: number) => (Math.round(n * 10) / 10).toString().replace(".", ",");

async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch (e) {}
  try {
    const t = document.createElement("textarea");
    t.value = text; t.style.position = "fixed"; t.style.opacity = "0";
    document.body.appendChild(t); t.select();
    const ok = document.execCommand("copy"); document.body.removeChild(t); return ok;
  } catch (e) { return false; }
}

/* ============================================================
   DADOS INICIAIS
   ============================================================ */
const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
const ENERGY: Option[] = [
  { id: "radiante", label: "Radiante", icon: "Sun" },
  { id: "bem", label: "Bem", icon: "Smile" },
  { id: "neutra", label: "Neutra", icon: "Meh" },
  { id: "cansada", label: "Cansada", icon: "BatteryLow" },
  { id: "saudade", label: "Saudade", icon: "Heart" },
];
const KIDMOOD = [
  { id: "feliz", label: "Feliz", icon: "Smile", emoji: "😄" },
  { id: "tranquilo", label: "Tranquilo", icon: "Cloud", emoji: "😌" },
  { id: "agitado", label: "Agitado", icon: "Zap", emoji: "🤪" },
  { id: "manhoso", label: "Manhoso", icon: "Frown", emoji: "🥺" },
  { id: "sonolento", label: "Sonolento", icon: "Moon", emoji: "😴" },
];
const EATING = [
  { id: "bem", label: "Comeu bem", text: "Comeu bem 😋" },
  { id: "medio", label: "Médio", text: "Comeu um pouco menos que o normal 🙂" },
  { id: "pouco", label: "Pouco", text: "Comeu pouco 😕" },
];
const MEDS = [
  { id: "nao", label: "Não precisou", text: "Nenhum hoje" },
  { id: "dado", label: "Dado", text: "Dado no horário combinado ✅" },
  { id: "pendente", label: "Pendente", text: "Ainda pendente ⏳" },
];
const SHIFTS: Option[] = [
  { id: "manha", label: "Manhã", icon: "Sunrise" },
  { id: "tarde", label: "Tarde", icon: "Sun" },
  { id: "noite", label: "Noite", icon: "Moon" },
];
const CATS: Record<string, { label: string; icon: string; tone: string }> = {
  refeicao: { label: "Refeições", icon: "Utensils", tone: "peach" },
  higiene: { label: "Higiene e cuidados", icon: "Bath", tone: "" },
  atividade: { label: "Atividades", icon: "Puzzle", tone: "mint" },
  remedio: { label: "Medicamentos", icon: "Pill", tone: "red" },
};
const AGENDA_TYPES: Record<string, { label: string; tone: string }> = {
  aula: { label: "Aula", tone: "" },
  estudo: { label: "Estudo", tone: "lav" },
  folga: { label: "Folga", tone: "mint" },
};
const ALERT_KINDS: Record<string, string> = { alergia: "Alergia", restricao: "Restrição alimentar", remedio: "Medicamento" };

const T = (shift: string, cat: string, text: string): Task => ({ id: uid(), shift, cat, text });
const DEFAULT: State = {
  tab: "espaco", seeded: true, name: "", age: "",
  diary: {}, hoursLimit: 45, hours: [],
  agenda: [
    { id: uid(), day: 0, time: "09:30", title: "Aula de inglês", type: "aula" },
    { id: uid(), day: 2, time: "14:00", title: "Estudar vocabulário", type: "estudo" },
    { id: uid(), day: 5, time: "10:00", title: "Folga: passeio no parque", type: "folga" },
  ],
  wish: [
    { id: uid(), text: "Conhecer o museu da cidade", kind: "lugar", done: false },
    { id: uid(), text: "Escrever 3 cartas para a família", kind: "meta", done: false },
  ],
  contacts: [
    { id: "c1", label: "Pais", name: "", phone: "" },
    { id: "c2", label: "Pediatra", name: "", phone: "" },
    { id: "c3", label: "Emergência local", name: "Serviço de emergência", phone: "911" },
  ],
  alerts: [{ id: uid(), kind: "alergia", text: "Alergia grave a amendoim (exemplo)" }],
  kids: [{ id: uid(), name: "Sofia (exemplo)", age: "4 anos", likes: "Massinha, desenhos, banho de espuma", calms: "Colo, música baixinha, cobertor rosa" }],
  rules: {
    telas: "Até 30 min por dia, só depois do lanche (exemplo).",
    sono: "Soneca às 13h. Dormir às 20h30 depois da história (exemplo).",
    permitido: "Frutas, iogurte, pão integral, sucos naturais (exemplo).",
    proibido: "Doces antes do jantar, refrigerante, amendoim (exemplo).",
    outras: "",
  },
  tasks: [
    T("manha", "refeicao", "Café da manhã"), T("manha", "higiene", "Escovar os dentes"), T("manha", "higiene", "Trocar de roupa"),
    T("manha", "atividade", "Brincadeira ou leitura"), T("manha", "remedio", "Medicamento da manhã (se houver)"),
    T("tarde", "refeicao", "Almoço"), T("tarde", "higiene", "Soneca / momento de descanso"), T("tarde", "refeicao", "Lanche da tarde"),
    T("tarde", "atividade", "Atividade ao ar livre"), T("tarde", "remedio", "Medicamento da tarde (se houver)"),
    T("noite", "refeicao", "Jantar"), T("noite", "higiene", "Banho"), T("noite", "higiene", "Escovar os dentes"),
    T("noite", "atividade", "Pijama e história"), T("noite", "remedio", "Medicamento da noite (se houver)"),
  ],
  done: {}, notes: {}, report: {},
};

function load(): State {
  try { const r = localStorage.getItem(KEY); if (r) return { ...DEFAULT, ...JSON.parse(r) }; } catch (e) {}
  return DEFAULT;
}

/* ============================================================
   PEÇAS DE INTERFACE
   ============================================================ */
const ICONS = Lucide as unknown as Record<string, LucideIcon | undefined>;

function Icon({ n, size = 20 }: { n: string; size?: number }) {
  const C = ICONS[n];
  if (!C) return <span className="inline-block" style={{ width: size, height: size }} />;
  return <C size={size} strokeWidth={2} aria-hidden="true" />;
}

function IconChip({ tone = "", className = "h-9 w-9 rounded-xl", children }: { tone?: string; className?: string; children: React.ReactNode }) {
  return <span className={cx("inline-flex flex-none items-center justify-center", className, TONES[tone] ?? TONES[""])}>{children}</span>;
}

function Title({ icon, title, hint, tone = "" }: { icon: string; title: string; hint?: string; tone?: string }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <IconChip tone={tone}><Icon n={icon} /></IconChip>
      <div className="min-w-0">
        <h2 className="text-lg font-extrabold leading-tight">{title}</h2>
        {hint && <div className={SUB}>{hint}</div>}
      </div>
    </div>
  );
}

function Field({ id, label: text, children }: { id: string; label: string; children: React.ReactNode }) {
  return (<div><label className={label()} htmlFor={id}>{text}</label>{children}</div>);
}

function CheckBtn({ on, text, onClick }: { on: boolean; text: string; onClick: () => void }) {
  return (
    <button type="button" role="checkbox" aria-checked={on} aria-label={text} onClick={onClick}
      className={cx(
        "inline-flex h-7 w-7 flex-none items-center justify-center rounded-[9px] border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B5536A]",
        on ? "border-[#B5536A] bg-[#B5536A] text-white" : "border-[#F3DEE3] bg-[#FEF6F7] text-transparent"
      )}>
      <Icon n="Check" size={16} />
    </button>
  );
}

function Stepper({ id, value, onChange, step = 1, min = 0, max = 99, unit }:
  { id: string; value: number | ""; onChange: (v: number | "") => void; step?: number; min?: number; max?: number; unit?: string }) {
  const bump = (d: number) => onChange(Math.min(max, Math.max(min, Math.round(((value === "" ? 0 : value) + d) * 10) / 10)));
  return (
    <div className="flex items-center gap-2">
      <button type="button" className={btn()} aria-label="Diminuir" onClick={() => bump(-step)}><Icon n="Minus" size={16} /></button>
      <input id={id} className={cx(inp("w-[90px]"), "text-center")} inputMode="decimal" value={value}
        onChange={(e) => { const x = e.target.value.replace(",", "."); onChange(x === "" ? "" : isNaN(Number(x)) ? value : Number(x)); }} />
      <button type="button" className={btn()} aria-label="Aumentar" onClick={() => bump(step)}><Icon n="Plus" size={16} /></button>
      {unit && <span className={SUB}>{unit}</span>}
    </div>
  );
}

function Opts({ options, value, onChange, cols = 3, row = false }:
  { options: Option[]; value: string; onChange: (v: string) => void; cols?: number; row?: boolean }) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {options.map((o) => (
        <button key={o.id} type="button" aria-pressed={value === o.id} onClick={() => onChange(value === o.id ? "" : o.id)}
          className={cx(
            "flex items-center justify-center gap-1 rounded-[14px] border-[1.5px] text-center font-bold leading-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B5536A]",
            row ? "min-h-[44px] flex-row px-2.5 py-2 text-[13px]" : "min-h-[64px] flex-col px-1 py-2 text-xs",
            value === o.id ? "border-[#B5536A] bg-[#FADFE5] text-[#B5536A]" : "border-[#F3DEE3] bg-[#FEF6F7] text-[#7A626C]"
          )}>
          {o.icon && <Icon n={o.icon} size={row ? 18 : 24} />}
          <span>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

function Seg({ options, value, onChange, ariaLabel }: { options: Option[]; value: string; onChange: (v: string) => void; ariaLabel: string }) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="grid gap-1 rounded-[14px] border border-[#F3DEE3] bg-[#FEF6F7] p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => (
        <button key={o.id} type="button" role="tab" aria-selected={value === o.id} onClick={() => onChange(o.id)}
          className={cx(
            "flex min-h-[44px] items-center justify-center gap-1.5 rounded-[10px] px-1.5 py-2.5 text-sm font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B5536A]",
            value === o.id ? "bg-white text-[#B5536A] shadow-[0_1px_4px_rgba(150,60,85,0.22)]" : "text-[#7A626C]"
          )}>
          {o.icon && <Icon n={o.icon} size={16} />}{o.label}
        </button>
      ))}
    </div>
  );
}

/* ============================================================
   ABA 1: MEU ESPAÇO
   ============================================================ */
function Profile({ s, set }: TabProps) {
  const first = (s.name || "").trim().split(/\s+/)[0];
  const hr = new Date().getHours();
  const greet = hr < 12 ? "Bom dia" : hr < 18 ? "Boa tarde" : "Boa noite";
  return (
    <section className={CARD} aria-label="Perfil pessoal">
      <div className="flex items-center gap-4">
        <div aria-hidden="true" className="flex h-14 w-14 flex-none items-center justify-center rounded-full border-2 border-[#B5536A] bg-[#FADFE5] text-2xl font-extrabold uppercase text-[#B5536A]">
          {first ? first[0] : <Icon n="User" size={26} />}
        </div>
        <div className="min-w-0">
          <h2 className="text-[22px] font-extrabold leading-tight [overflow-wrap:anywhere]">
            {first ? `Olá, ${first}! Como está seu dia?` : "Olá! Como está seu dia?"}
          </h2>
          <div className={SUB}>{first ? `${greet}. Este espaço é só seu.` : "Conte quem você é para deixar o espaço com a sua cara."}</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-3">
        <Field id="pf-name" label="Seu nome">
          <input id="pf-name" className={inp()} autoComplete="given-name" placeholder="Como você se chama?" value={s.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field id="pf-age" label="Idade">
          <input id="pf-age" className={inp()} inputMode="numeric" maxLength={3} placeholder="Anos" value={s.age} onChange={(e) => set("age", e.target.value.replace(/\D/g, ""))} />
        </Field>
      </div>
    </section>
  );
}

function Diary({ s, set }: TabProps) {
  const today = dkey();
  const e = s.diary[today] || {};
  const upd = (k: string, v: string) => set("diary", (d) => ({ ...d, [today]: { ...(d[today] || {}), [k]: v } }));
  const past = Object.keys(s.diary).filter((k) => k !== today && Object.values(s.diary[k]).some(Boolean)).sort().reverse().slice(0, 7);
  const fields = [
    { k: "win", label: "Superação ou conquista do dia", ph: "O que você conseguiu hoje, mesmo que pequeno?" },
    { k: "challenge", label: "Maior desafio do dia", ph: "O que foi difícil? Como você lidou?" },
    { k: "gratitude", label: "Momento de gratidão ou memória", ph: "Uma cena que você quer guardar." },
  ];
  return (
    <section className={CARD}>
      <Title icon="BookOpen" title="Diário de vivências" hint={`${fmtLong()} · salvo automaticamente`} />
      <div className={label()}>Humor e energia de hoje</div>
      <Opts options={ENERGY} cols={5} value={e.mood || ""} onChange={(v) => upd("mood", v)} />
      <div className="mt-4 flex flex-col gap-4">
        {fields.map((f) => (
          <Field key={f.k} id={`d-${f.k}`} label={f.label}>
            <textarea id={`d-${f.k}`} className={ta()} placeholder={f.ph} value={e[f.k] || ""} onChange={(ev) => upd(f.k, ev.target.value)} />
          </Field>
        ))}
      </div>
      {past.length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer font-bold text-[#B5536A]">Dias anteriores ({past.length})</summary>
          <div className="mt-3 flex flex-col gap-3">
            {past.map((k) => {
              const d = s.diary[k]; const m = ENERGY.find((x) => x.id === d.mood);
              return (
                <div key={k} className="rounded-[14px] bg-[#FEF6F7] p-3">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <strong className="capitalize">{fmtShort(k)}</strong>
                    {m && <span className={chip()}>{m.label}</span>}
                  </div>
                  {d.win && <p className={cx(SUB, "my-0.5")}><b>Conquista:</b> {d.win}</p>}
                  {d.challenge && <p className={cx(SUB, "my-0.5")}><b>Desafio:</b> {d.challenge}</p>}
                  {d.gratitude && <p className={cx(SUB, "my-0.5")}><b>Gratidão:</b> {d.gratitude}</p>}
                </div>
              );
            })}
          </div>
        </details>
      )}
    </section>
  );
}

function Hours({ s, set }: TabProps) {
  const week = weekKeys(); const today = dkey();
  const [date, setDate] = useState(today); const [h, setH] = useState<number | "">(8); const [note, setNote] = useState("");
  const perDay = week.map((k) => s.hours.filter((x) => x.date === k).reduce((a, x) => a + x.h, 0));
  const total = perDay.reduce((a, b) => a + b, 0);
  const limit = Number(s.hoursLimit) || 45;
  const pct = Math.min(100, (total / limit) * 100);
  const barColor = total > limit ? "bg-[#C22B33]" : total >= limit * 0.9 ? "bg-[#B9791A]" : "bg-[#B5536A]";
  const weekEntries = s.hours.filter((x) => week.includes(x.date)).sort((a, b) => (a.date < b.date ? 1 : -1));
  const maxDay = Math.max(10, ...perDay);
  const add = () => {
    if (!h || h <= 0) return;
    set("hours", (l) => [...l, { id: uid(), date, h: Number(h), note: note.trim() }]); setNote("");
    track("registrou_horas");
  };
  return (
    <section className={CARD}>
      <Title icon="Clock" title="Horas da semana" hint="Segunda a domingo" tone="lav" />
      <div className="mb-2 flex items-end justify-between gap-3">
        <div className="text-[34px] font-extrabold leading-none tabular-nums">
          {fmtH(total)}<span className="text-base font-semibold text-[#7A626C]"> de {fmtH(limit)} h</span>
        </div>
        <div className="flex items-center gap-2">
          <label className={SUB} htmlFor="limite">Limite</label>
          <input id="limite" className={inp("w-[70px]", "px-2 py-1.5")} inputMode="decimal" value={s.hoursLimit}
            onChange={(e) => set("hoursLimit", e.target.value.replace(",", "."))} />
        </div>
      </div>
      <div role="progressbar" aria-valuemin={0} aria-valuemax={limit} aria-valuenow={total} className="h-2.5 overflow-hidden rounded-full border border-[#F3DEE3] bg-[#FEF6F7]">
        <i className={cx("block h-full rounded-full transition-all", barColor)} style={{ width: `${pct}%` }} />
      </div>
      <p className={cx(SUB, "mb-3 mt-1.5")}>
        {total > limit ? `Passou ${fmtH(total - limit)} h do limite.` : `Restam ${fmtH(limit - total)} h nesta semana.`}
      </p>
      <div className="mb-4 grid h-[78px] grid-cols-7 items-end gap-1.5">
        {week.map((k, i) => (
          <div key={k} className="flex h-full flex-col items-center justify-end gap-1">
            <span className="text-[11px] tabular-nums text-[#7A626C]">{perDay[i] ? fmtH(perDay[i]) : ""}</span>
            <div className={cx("w-full max-w-[28px] rounded-lg", k === today ? "bg-[#B5536A]" : "bg-[#FADFE5]")}
              style={{ height: `${Math.max(4, (perDay[i] / maxDay) * 46)}px` }} />
            <span className={cx("text-[11px] font-bold", k === today ? "text-[#B5536A]" : "text-[#7A626C]")}>{DAYS[i][0]}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2">
        <Field id="h-date" label="Dia"><input id="h-date" type="date" className={inp()} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field id="h-val" label="Horas"><Stepper id="h-val" value={h} onChange={setH} step={0.5} max={24} /></Field>
      </div>
      <div className="mt-2 flex gap-2">
        <input id="h-note" aria-label="Observação" className={inp()} placeholder="Observação (opcional)" value={note} onChange={(e) => setNote(e.target.value)} />
        <button type="button" className={btn("p")} onClick={add}><Icon n="Plus" size={18} />Registrar</button>
      </div>
      {weekEntries.length > 0 && (
        <div className="mt-3">
          {weekEntries.map((x) => (
            <div key={x.id} className={ROW}>
              <div className="min-w-0 flex-1">
                <div className="font-bold capitalize">{fmtShort(x.date)}</div>
                {x.note && <div className={SUB}>{x.note}</div>}
              </div>
              <span className={cx(chip("lav"), "tabular-nums")}>{fmtH(x.h)} h</span>
              <button type="button" className={IBTN} aria-label="Remover registro" onClick={() => set("hours", (l) => l.filter((y) => y.id !== x.id))}><Icon n="Trash2" size={18} /></button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Agenda({ s, set }: TabProps) {
  const [f, setF] = useState({ day: (new Date().getDay() + 6) % 7, time: "09:00", title: "", type: "aula" });
  const todayIdx = (new Date().getDay() + 6) % 7;
  const add = () => {
    if (!f.title.trim()) return;
    set("agenda", (l) => [...l, { id: uid(), ...f, title: f.title.trim() }]); setF({ ...f, title: "" });
  };
  const grouped = DAYS.map((d, i) => ({ d, i, items: s.agenda.filter((a) => a.day === i).sort((a, b) => a.time.localeCompare(b.time)) })).filter((g) => g.items.length);
  return (
    <section className={CARD}>
      <Title icon="CalendarDays" title="Agenda rápida" hint="Aulas, estudos e folgas" tone="mint" />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2">
        <Field id="a-day" label="Dia">
          <select id="a-day" className={inp()} value={f.day} onChange={(e) => setF({ ...f, day: Number(e.target.value) })}>
            {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
          </select>
        </Field>
        <Field id="a-time" label="Hora"><input id="a-time" type="time" className={inp()} value={f.time} onChange={(e) => setF({ ...f, time: e.target.value })} /></Field>
        <Field id="a-type" label="Tipo">
          <select id="a-type" className={inp()} value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
            {Object.entries(AGENDA_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </Field>
      </div>
      <div className="mt-2 flex gap-2">
        <input id="a-title" aria-label="Título do compromisso" className={inp()} placeholder="Ex.: Aula de inglês" value={f.title}
          onChange={(e) => setF({ ...f, title: e.target.value })} onKeyDown={(e) => e.key === "Enter" && add()} />
        <button type="button" className={btn("p")} onClick={add} aria-label="Adicionar à agenda"><Icon n="Plus" size={18} /></button>
      </div>
      <div className="mt-3 flex flex-col gap-3">
        {grouped.length === 0 && <p className={SUB}>Nada na agenda ainda. Adicione sua primeira aula, estudo ou folga.</p>}
        {grouped.map((g) => (
          <div key={g.d}>
            <div className={label(g.i === todayIdx ? "text-[#B5536A]" : undefined)}>{g.d}{g.i === todayIdx ? " · hoje" : ""}</div>
            {g.items.map((a) => (
              <div key={a.id} className={ROW}>
                <span className="w-[52px] font-extrabold tabular-nums">{a.time}</span>
                <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{a.title}</span>
                <span className={chip(AGENDA_TYPES[a.type].tone)}>{AGENDA_TYPES[a.type].label}</span>
                <button type="button" className={IBTN} aria-label={`Remover ${a.title}`} onClick={() => set("agenda", (l) => l.filter((y) => y.id !== a.id))}><Icon n="Trash2" size={18} /></button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function Wishlist({ s, set }: TabProps) {
  const [text, setText] = useState(""); const [kind, setKind] = useState("lugar");
  const add = () => { if (!text.trim()) return; set("wish", (l) => [...l, { id: uid(), text: text.trim(), kind, done: false }]); setText(""); };
  const toggle = (id: string) => set("wish", (l) => l.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const done = s.wish.filter((x) => x.done).length;
  return (
    <section className={CARD}>
      <Title icon="MapPin" title="Lista de desejos" hint={s.wish.length ? `${done} de ${s.wish.length} realizados` : "Lugares para visitar e metas"} tone="peach" />
      <div className="mb-2">
        <Seg ariaLabel="Tipo de desejo" value={kind} onChange={setKind}
          options={[{ id: "lugar", label: "Lugar", icon: "MapPin" }, { id: "meta", label: "Meta", icon: "Target" }]} />
      </div>
      <div className="flex gap-2">
        <input id="w-text" aria-label="Novo desejo" className={inp()} placeholder={kind === "lugar" ? "Um lugar que quero conhecer" : "Uma meta que quero cumprir"} value={text}
          onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
        <button type="button" className={btn("p")} onClick={add} aria-label="Adicionar desejo"><Icon n="Plus" size={18} /></button>
      </div>
      <div className="mt-3">
        {s.wish.length === 0 && <p className={SUB}>Sua lista está vazia. Comece com um lugar ou uma meta.</p>}
        {s.wish.map((x) => (
          <div key={x.id} className={ROW}>
            <CheckBtn on={x.done} text={x.text} onClick={() => toggle(x.id)} />
            <span className={cx("min-w-0 flex-1 [overflow-wrap:anywhere]", x.done ? "text-[#7A626C] line-through" : "text-[#3B2A31]")}>{x.text}</span>
            <span className={chip(x.kind === "lugar" ? "peach" : "")}>{x.kind === "lugar" ? "Lugar" : "Meta"}</span>
            <button type="button" className={IBTN} aria-label={`Remover ${x.text}`} onClick={() => set("wish", (l) => l.filter((y) => y.id !== x.id))}><Icon n="Trash2" size={18} /></button>
          </div>
        ))}
      </div>
    </section>
  );
}

function TabEspaco({ s, set }: TabProps) {
  return (
    <div className="flex flex-col gap-4">
      <Profile s={s} set={set} />
      <Diary s={s} set={set} />
      <Hours s={s} set={set} />
      <Agenda s={s} set={set} />
      <Wishlist s={s} set={set} />
    </div>
  );
}

/* ============================================================
   ABA 2: SEGURANÇA & REGRAS
   ============================================================ */
function Emergency({ s, set }: TabProps) {
  const [edit, setEdit] = useState(false); const [copied, setCopied] = useState("");
  const upd = (id: string, k: keyof Contact, v: string) => set("contacts", (l) => l.map((c) => (c.id === id ? { ...c, [k]: v } : c)));
  const doCopy = async (c: Contact) => {
    const ok = await copyText(`${c.label}${c.name ? " – " + c.name : ""}: ${c.phone}`);
    setCopied(ok ? c.id : "err"); setTimeout(() => setCopied(""), 2000);
  };
  return (
    <section aria-label="Cartão de emergência" className="overflow-hidden rounded-[20px] border-2 border-[#C22B33] bg-white shadow-[0_2px_10px_rgba(181,83,106,0.10)]">
      <div className="flex items-center gap-2.5 bg-[#C22B33] px-4 py-3 text-white">
        <Icon n="Siren" size={24} />
        <h2 className="flex-1 text-[19px] font-extrabold">Cartão de emergência</h2>
        <button type="button" className={btn("n", true)} onClick={() => setEdit(!edit)}>
          <Icon n={edit ? "Check" : "Pencil"} size={16} />{edit ? "Pronto" : "Editar"}
        </button>
      </div>
      <div className="px-4 pb-4 pt-1">
        {s.contacts.map((c) => (
          <div key={c.id} className="flex flex-col items-stretch gap-2 border-t border-[#F3DEE3] py-3 first:border-t-0">
            {edit ? (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-2">
                <input aria-label="Rótulo" className={inp()} placeholder="Quem (ex.: Mãe)" value={c.label} onChange={(e) => upd(c.id, "label", e.target.value)} />
                <input aria-label="Nome" className={inp()} placeholder="Nome" value={c.name} onChange={(e) => upd(c.id, "name", e.target.value)} />
                <div className="flex gap-2">
                  <input aria-label="Telefone" className={inp()} inputMode="tel" placeholder="Telefone" value={c.phone} onChange={(e) => upd(c.id, "phone", e.target.value)} />
                  <button type="button" className={IBTN} aria-label={`Remover ${c.label}`} onClick={() => set("contacts", (l) => l.filter((x) => x.id !== c.id))}><Icon n="Trash2" size={18} /></button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <strong className="text-base">{c.label}{c.name ? <span className={cx(SUB, "font-semibold")}> · {c.name}</span> : null}</strong>
                  <span className="select-all text-xl font-extrabold tabular-nums">{c.phone || "sem número"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a className={cx(btn("d"), !c.phone && "pointer-events-none opacity-40")} href={`tel:${c.phone.replace(/\s/g, "")}`} aria-disabled={!c.phone}>
                    <Icon n="Phone" size={18} />Ligar
                  </a>
                  <button type="button" className={btn()} disabled={!c.phone} onClick={() => doCopy(c)}>
                    <Icon n={copied === c.id ? "Check" : "Copy"} size={18} />{copied === c.id ? "Copiado" : "Copiar"}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {edit && (
          <button type="button" className={cx(btn(), "mt-1")} onClick={() => set("contacts", (l) => [...l, { id: uid(), label: "", name: "", phone: "" }])}><Icon n="Plus" size={18} />Novo contato</button>
        )}
        {copied === "err" && <p className="mt-2 text-[13px] text-[#C22B33]">Não foi possível copiar. Toque no número para selecioná-lo.</p>}
        <p className={cx(SUB, "mt-2")}>Se o botão Ligar não abrir o discador, copie o número e disque pelo celular.</p>
      </div>
    </section>
  );
}

function HealthAlerts({ s, set }: TabProps) {
  const [kind, setKind] = useState("alergia"); const [text, setText] = useState("");
  const add = () => { if (!text.trim()) return; set("alerts", (l) => [...l, { id: uid(), kind, text: text.trim() }]); setText(""); };
  return (
    <section aria-label="Alertas de saúde" className="rounded-[20px] border border-[#C22B33] bg-[#FFE8E6] p-4">
      <div className="mb-3 flex items-center gap-3">
        <IconChip tone="danger"><Icon n="AlertTriangle" /></IconChip>
        <div>
          <h2 className="text-lg font-extrabold text-[#C22B33]">Alertas de saúde</h2>
          <div className={SUB}>Alergias, restrições e medicamentos</div>
        </div>
      </div>
      {s.alerts.length === 0 && <p className={cx(SUB, "mb-2")}>Nenhum alerta cadastrado. Confirme com os pais antes do primeiro turno.</p>}
      <div className="flex flex-col gap-2">
        {s.alerts.map((a) => (
          <div key={a.id} className="flex items-center gap-2 rounded-[14px] border border-[#C22B33] bg-white py-2 pl-3 pr-2">
            <span className={chip("danger")}>{ALERT_KINDS[a.kind]}</span>
            <span className="min-w-0 flex-1 font-bold [overflow-wrap:anywhere]">{a.text}</span>
            <button type="button" className={IBTN} aria-label={`Remover ${a.text}`} onClick={() => set("alerts", (l) => l.filter((x) => x.id !== a.id))}><Icon n="Trash2" size={18} /></button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <select aria-label="Tipo de alerta" className={inp("w-auto flex-none")} value={kind} onChange={(e) => setKind(e.target.value)}>
          {Object.entries(ALERT_KINDS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <input aria-label="Descrição do alerta" className={inp("flex-[1_1_160px]")} placeholder="Ex.: Amoxicilina 5 ml às 8h e 20h" value={text}
          onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
        <button type="button" className={btn("d")} onClick={add} aria-label="Adicionar alerta"><Icon n="Plus" size={18} /></button>
      </div>
    </section>
  );
}

function Kids({ s, set }: TabProps) {
  const upd = (id: string, k: keyof Kid, v: string) => set("kids", (l) => l.map((c) => (c.id === id ? { ...c, [k]: v } : c)));
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <IconChip><Icon n="Baby" /></IconChip>
          <h2 className="text-lg font-extrabold">Perfil das crianças</h2>
        </div>
        <button type="button" className={btn()} onClick={() => set("kids", (l) => [...l, { id: uid(), name: "", age: "", likes: "", calms: "" }])}><Icon n="Plus" size={18} />Adicionar</button>
      </div>
      <div className="flex flex-col gap-3">
        {s.kids.length === 0 && <div className={cx(CARD, SUB)}>Nenhuma criança cadastrada. Toque em Adicionar.</div>}
        {s.kids.map((k) => (
          <div key={k.id} className={CARD}>
            <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto] items-end gap-2">
              <Field id={`k-n-${k.id}`} label="Nome"><input id={`k-n-${k.id}`} className={inp()} value={k.name} onChange={(e) => upd(k.id, "name", e.target.value)} /></Field>
              <Field id={`k-a-${k.id}`} label="Idade"><input id={`k-a-${k.id}`} className={inp()} value={k.age} onChange={(e) => upd(k.id, "age", e.target.value)} /></Field>
              <button type="button" className={cx(IBTN, "mb-1")} aria-label={`Remover ${k.name || "criança"}`} onClick={() => set("kids", (l) => l.filter((x) => x.id !== k.id))}><Icon n="Trash2" size={18} /></button>
            </div>
            <div className="mt-3 flex flex-col gap-3">
              <Field id={`k-l-${k.id}`} label="Do que gosta"><textarea id={`k-l-${k.id}`} className={ta()} value={k.likes} onChange={(e) => upd(k.id, "likes", e.target.value)} /></Field>
              <Field id={`k-c-${k.id}`} label="O que acalma"><textarea id={`k-c-${k.id}`} className={ta()} value={k.calms} onChange={(e) => upd(k.id, "calms", e.target.value)} /></Field>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Rules({ s, set }: TabProps) {
  const upd = (k: string, v: string) => set("rules", (r) => ({ ...r, [k]: v }));
  const items = [
    { k: "telas", label: "Limite de telas", icon: "Tv" },
    { k: "sono", label: "Rotina de sono", icon: "BedDouble" },
    { k: "permitido", label: "Alimentação permitida", icon: "Apple" },
    { k: "proibido", label: "Alimentação proibida", icon: "Ban" },
    { k: "outras", label: "Outras regras da casa", icon: "Home" },
  ];
  return (
    <section className={CARD}>
      <Title icon="Home" title="Regras da casa" hint="Toque para editar" tone="peach" />
      <div className="flex flex-col gap-4">
        {items.map((i) => {
          const bad = i.k === "proibido";
          return (
            <div key={i.k}>
              <label className={cx(label(bad ? "text-[#C22B33]" : undefined), "flex items-center gap-2")} htmlFor={`r-${i.k}`}><Icon n={i.icon} size={14} />{i.label}</label>
              <textarea id={`r-${i.k}`} className={ta("min-h-[72px]", bad ? "border-[#C22B33] bg-[#FFE8E6]" : undefined)}
                placeholder="Escreva aqui" value={s.rules[i.k] || ""} onChange={(e) => upd(i.k, e.target.value)} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TabSeguranca({ s, set }: TabProps) {
  return (
    <div className="flex flex-col gap-4">
      <Emergency s={s} set={set} />
      <HealthAlerts s={s} set={set} />
      <Kids s={s} set={set} />
      <Rules s={s} set={set} />
    </div>
  );
}

/* ============================================================
   ABA 3: CRONOGRAMA DIÁRIO
   ============================================================ */
function TabCronograma({ s, set }: TabProps) {
  const today = dkey(); const hr = new Date().getHours();
  const [shift, setShift] = useState(hr < 12 ? "manha" : hr < 18 ? "tarde" : "noite");
  const [txt, setTxt] = useState(""); const [cat, setCat] = useState("atividade");
  const tasks = s.tasks.filter((t) => t.shift === shift);
  const done = s.done[today] || {};
  const nDone = tasks.filter((t) => done[t.id]).length;
  const pct = tasks.length ? (nDone / tasks.length) * 100 : 0;
  const toggle = (id: string) => {
    if (!done[id]) track("salvou_checklist");
    set("done", (d) => ({ ...d, [today]: { ...(d[today] || {}), [id]: !(d[today] || {})[id] } }));
  };
  const addTask = () => { if (!txt.trim()) return; set("tasks", (l) => [...l, { id: uid(), shift, cat, text: txt.trim() }]); setTxt(""); };
  const nkey = `${today}|${shift}`;
  const cur = SHIFTS.find((x) => x.id === shift) as Option;
  return (
    <div className="flex flex-col gap-4">
      <Seg ariaLabel="Turno" options={SHIFTS} value={shift} onChange={setShift} />
      <section className={CARD}>
        <Title icon={cur.icon || "Sun"} title={`Turno da ${cur.label.toLowerCase()}`} hint={fmtLong()} />
        <div className="mb-1 flex items-center gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full border border-[#F3DEE3] bg-[#FEF6F7]">
            <i className="block h-full rounded-full bg-[#B5536A] transition-all" style={{ width: `${pct}%` }} />
          </div>
          <strong className="tabular-nums">{nDone}/{tasks.length}</strong>
        </div>
        {Object.entries(CATS).map(([ck, cv]) => {
          const list = tasks.filter((t) => t.cat === ck);
          if (!list.length) return null;
          return (
            <div key={ck} className="mt-4">
              <div className="mb-1 flex items-center gap-2">
                <IconChip tone={cv.tone} className="h-7 w-7 rounded-[9px]"><Icon n={cv.icon} size={15} /></IconChip>
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A626C]">{cv.label}</span>
              </div>
              {list.map((t) => (
                <div key={t.id} className={ROW}>
                  <CheckBtn on={!!done[t.id]} text={t.text} onClick={() => toggle(t.id)} />
                  <span className={cx("min-w-0 flex-1 [overflow-wrap:anywhere]", done[t.id] ? "text-[#7A626C] line-through" : "text-[#3B2A31]")}>{t.text}</span>
                  <button type="button" className={IBTN} aria-label={`Remover ${t.text}`} onClick={() => set("tasks", (l) => l.filter((x) => x.id !== t.id))}><Icon n="X" size={18} /></button>
                </div>
              ))}
            </div>
          );
        })}
        {tasks.length === 0 && <p className={cx(SUB, "mt-3")}>Nenhuma tarefa neste turno. Adicione abaixo.</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          <select aria-label="Categoria" className={inp("w-auto flex-none")} value={cat} onChange={(e) => setCat(e.target.value)}>
            {Object.entries(CATS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <input aria-label="Nova tarefa" className={inp("flex-[1_1_150px]")} placeholder="Nova tarefa" value={txt} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} />
          <button type="button" className={btn("p")} onClick={addTask} aria-label="Adicionar tarefa"><Icon n="Plus" size={18} /></button>
        </div>
        {nDone > 0 && (
          <button type="button" className={cx(btn(), "mt-3")}
            onClick={() => set("done", (d) => { const c = { ...(d[today] || {}) }; tasks.forEach((t) => delete c[t.id]); return { ...d, [today]: c }; })}>
            <Icon n="RotateCcw" size={16} />Desmarcar este turno
          </button>
        )}
      </section>
      <section className={CARD}>
        <Title icon="NotebookPen" title="Anotações do turno" hint="Imprevistos e momentos fofos" tone="peach" />
        <label className="sr-only" htmlFor="notas">Anotações do turno</label>
        <textarea id="notas" className={ta("min-h-[110px]")} placeholder="Ex.: Caiu no parquinho, só um susto. Deu o primeiro abraço no cachorro!"
          value={s.notes[nkey] || ""} onChange={(e) => set("notes", (n) => ({ ...n, [nkey]: e.target.value }))} />
      </section>
    </div>
  );
}

/* ============================================================
   ABA 4: DIÁRIO DE BORDO PARA OS PAIS
   ============================================================ */
function buildMessage(s: State, r: Report, today: string): string {
  const shiftId = r.shift || "dia";
  const found = SHIFTS.find((x) => x.id === shiftId);
  const shiftLabel = shiftId === "dia" || !found ? "dia" : `turno da ${found.label.toLowerCase()}`;
  const mood = KIDMOOD.find((x) => x.id === r.mood);
  const eat = EATING.find((x) => x.id === r.eating);
  const med = MEDS.find((x) => x.id === r.meds);
  const L: string[] = [];
  L.push(`🌟 *Resumo do ${shiftLabel}* – ${fmtShort(today)}`);
  if (r.kid) L.push(`👶 *${r.kid}*`);
  L.push("");
  if (mood) L.push(`${mood.emoji} *Humor:* ${mood.label}`);
  if (eat) L.push(`🍽️ *Alimentação:* ${eat.text}`);
  if (r.sleep !== "" && r.sleep != null) L.push(`😴 *Sono/soneca:* ${fmtH(Number(r.sleep))} h`);
  if (r.bath) L.push(`🛁 *Banho:* ${r.bath === "sim" ? "Tomou banho ✅" : "Não foi hoje"}`);
  if (med) L.push(`💊 *Medicamentos:* ${med.text}${r.medNote ? ` (${r.medNote})` : ""}`);
  if (r.trocas !== "" && r.trocas != null) L.push(`🧷 *Trocas:* ${r.trocas}`);
  let notes = "";
  if (r.useNotes) {
    const ids = shiftId === "dia" ? SHIFTS.map((x) => x.id) : [shiftId];
    notes = ids.map((id) => (s.notes[`${today}|${id}`] || "").trim()).filter(Boolean).join("\n");
  }
  if (notes) { L.push(""); L.push("📝 *Anotações do turno:*"); L.push(notes); }
  if (r.highlight && r.highlight.trim()) { L.push(""); L.push("💬 *Recado para vocês:*"); L.push(r.highlight.trim()); }
  L.push("");
  L.push("Com carinho,");
  L.push(`${s.name || "Sua au pair"} 💗`);
  return L.join("\n");
}

function TabPais({ s, set }: TabProps) {
  const today = dkey();
  const r = {
    shift: "dia", useNotes: true, mood: "", eating: "", sleep: "", bath: "", meds: "", medNote: "", trocas: "", highlight: "",
    kid: (s.kids[0] && s.kids[0].name.replace(/\s*\(exemplo\)/, "")) || "",
    ...(s.report[today] || {}),
  } as Report;
  const upd = (k: string, v: any) => set("report", (d) => ({ ...d, [today]: { ...r, ...(d[today] || {}), [k]: v } }));
  const [msg, setMsg] = useState(""); const [status, setStatus] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const gen = () => {
    setMsg(buildMessage(s, r, today)); setStatus("");
    track("gerou_relatorio_whatsapp");
    setTimeout(() => ref.current && ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
  };
  const copy = async () => {
    const ok = await copyText(msg);
    if (!ok && ref.current) { ref.current.focus(); ref.current.select(); }
    setStatus(ok ? "ok" : "err"); setTimeout(() => setStatus(""), 2500);
  };
  const shiftOpts: Option[] = [{ id: "dia", label: "Dia todo" }, ...SHIFTS.map((x) => ({ id: x.id, label: x.label }))];
  return (
    <div className="flex flex-col gap-4">
      <section className={CARD}>
        <Title icon="ClipboardCheck" title="Fechamento do turno" hint="Leva cerca de 1 minuto" tone="mint" />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
          <Field id="p-kid" label="Criança">
            <input id="p-kid" className={inp()} list="kidlist" placeholder="Nome" value={r.kid} onChange={(e) => upd("kid", e.target.value)} />
            <datalist id="kidlist">{s.kids.filter((k) => k.name).map((k) => <option key={k.id} value={k.name.replace(/\s*\(exemplo\)/, "")} />)}</datalist>
          </Field>
          <Field id="p-name" label="Seu nome"><input id="p-name" className={inp()} placeholder="Para assinar" value={s.name} onChange={(e) => set("name", e.target.value)} /></Field>
        </div>
        <div className="mt-4"><div className={label()}>Período</div>
          <Opts options={shiftOpts} cols={4} row value={r.shift} onChange={(v) => upd("shift", v || "dia")} />
        </div>
        <div className="mt-4"><div className={label()}>Humor geral da criança</div>
          <Opts options={KIDMOOD} cols={5} value={r.mood} onChange={(v) => upd("mood", v)} />
        </div>
        <div className="mt-4"><div className={label()}>Alimentação</div>
          <Opts options={EATING.map((x) => ({ ...x, icon: "Utensils" }))} cols={3} value={r.eating} onChange={(v) => upd("eating", v)} />
        </div>
        <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          <Field id="p-sleep" label="Sono / soneca"><Stepper id="p-sleep" value={r.sleep} onChange={(v) => upd("sleep", v)} step={0.5} max={24} unit="horas" /></Field>
          <Field id="p-trocas" label="Trocas (fralda ou roupa)"><Stepper id="p-trocas" value={r.trocas} onChange={(v) => upd("trocas", v)} step={1} max={30} /></Field>
        </div>
        <div className="mt-4"><div className={label()}>Banho</div>
          <Opts options={[{ id: "sim", label: "Tomou banho", icon: "Bath" }, { id: "nao", label: "Não hoje", icon: "X" }]} cols={2} row value={r.bath} onChange={(v) => upd("bath", v)} />
        </div>
        <div className="mt-4"><div className={label()}>Medicamentos</div>
          <Opts options={MEDS.map((x) => ({ ...x, icon: "Pill" }))} cols={3} value={r.meds} onChange={(v) => upd("meds", v)} />
          {r.meds === "dado" && <input aria-label="Qual medicamento e horário" className={cx(inp(), "mt-2")} placeholder="Qual e a que horas? (opcional)" value={r.medNote} onChange={(e) => upd("medNote", e.target.value)} />}
        </div>
        <div className="mt-4">
          <Field id="p-high" label="Recado ou destaque do dia para os pais">
            <textarea id="p-high" className={ta("min-h-[96px]")} placeholder="Ex.: Hoje ela montou um quebra-cabeça sozinha e pediu para mostrar a vocês!" value={r.highlight} onChange={(e) => upd("highlight", e.target.value)} />
          </Field>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <CheckBtn on={r.useNotes} text="Incluir anotações do cronograma" onClick={() => upd("useNotes", !r.useNotes)} />
          <span>Incluir minhas anotações do cronograma</span>
        </div>
        <button type="button" className={cx(btn("p"), "mt-4 w-full")} onClick={gen}><Icon n="Sparkles" size={18} />Gerar resumo para WhatsApp</button>
      </section>

      {msg && (
        <section className={CARD} aria-live="polite">
          <Title icon="MessageCircle" title="Mensagem pronta" hint="Você pode ajustar o texto antes de enviar" />
          <label className="sr-only" htmlFor="msg">Mensagem</label>
          <textarea id="msg" ref={ref} className={cx(ta("min-h-[280px]"), "whitespace-pre-wrap text-[15px]")} value={msg} onChange={(e) => setMsg(e.target.value)} />
          <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
            <button type="button" className={btn("p")} onClick={copy}><Icon n={status === "ok" ? "Check" : "Copy"} size={18} />{status === "ok" ? "Copiado!" : "Copiar mensagem"}</button>
            <a className={btn()} href={`https://wa.me/?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer"><Icon n="Send" size={18} />Abrir no WhatsApp</a>
          </div>
          {status === "err" && <p className="mt-2 text-[13px] text-[#C22B33]">Não foi possível copiar automaticamente. O texto foi selecionado: use Copiar do seu celular.</p>}
        </section>
      )}
    </div>
  );
}

/* ============================================================
   APP
   ============================================================ */
const TABS = [
  { id: "espaco", label: "Meu espaço", icon: "Heart" },
  { id: "seguranca", label: "Segurança", icon: "ShieldAlert" },
  { id: "cronograma", label: "Cronograma", icon: "ClipboardList" },
  { id: "pais", label: "Para os pais", icon: "MessageCircle" },
];

export default function App() {
  const [s, setS] = useState<State>(load);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }, [s]);

  const set: SetFn = (k, v) =>
    setS((p) => {
      const val: any = typeof v === "function" ? (v as (x: any) => any)(p[k]) : v;
      return { ...p, [k]: val } as State;
    });

  const clearExamples = () =>
    setS((p) => ({
      ...p, seeded: false, agenda: [], wish: [], alerts: [],
      rules: { telas: "", sono: "", permitido: "", proibido: "", outras: "" },
      kids: [{ id: uid(), name: "", age: "", likes: "", calms: "" }],
      contacts: p.contacts.map((c) => (c.id === "c3" ? { ...c, name: "", phone: "" } : c)),
    }));

  const tab = s.tab;
  return (
    <div className="min-h-screen bg-[#FCEFF2] px-4 pb-28 pt-3 font-sans text-[15px] leading-normal text-[#3B2A31]">
      <div className="mx-auto max-w-[640px]">
        <header className="flex items-center gap-3 pb-4 pt-2">
          <IconChip tone="solid" className="h-11 w-11 rounded-[14px]"><Icon n="Anchor" size={24} /></IconChip>
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold leading-none">Plano de Bordo</h1>
            <div className={SUB}>Au pair &amp; cuidador · <span className="capitalize">{fmtLong()}</span></div>
          </div>
        </header>

        {s.seeded && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#FCE8DA] px-3.5 py-3 text-[13px] font-semibold text-[#94502D]">
            <span>Os dados que você vê são exemplos. Edite à vontade ou comece do zero.</span>
            <button type="button" className={btn("n", true)} onClick={clearExamples}>Limpar exemplos</button>
          </div>
        )}

        <main id="painel" role="tabpanel">
          {tab === "espaco" && <TabEspaco s={s} set={set} />}
          {tab === "seguranca" && <TabSeguranca s={s} set={set} />}
          {tab === "cronograma" && <TabCronograma s={s} set={set} />}
          {tab === "pais" && <TabPais s={s} set={set} />}
        </main>

        <p className={cx(SUB, "mt-5 text-center")}>Tudo fica salvo neste aparelho e navegador.</p>
      </div>

      <nav aria-label="Seções do aplicativo"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-[#F3DEE3] bg-white px-2.5 pb-[calc(8px+env(safe-area-inset-bottom,0px))] pt-2 shadow-[0_-4px_14px_rgba(181,83,106,0.08)]">
        <div role="tablist" className="mx-auto grid max-w-[640px] grid-cols-4 gap-1">
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} aria-controls="painel"
              onClick={() => { set("tab", t.id); window.scrollTo({ top: 0 }); }}
              className={cx(
                "flex flex-col items-center gap-0.5 rounded-xl px-0.5 py-1.5 text-[11px] font-bold leading-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B5536A]",
                tab === t.id ? "bg-[#FADFE5] text-[#B5536A]" : "text-[#7A626C]"
              )}>
              <Icon n={t.icon} size={22} /><span>{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <Analytics />
    </div>
  );
}
