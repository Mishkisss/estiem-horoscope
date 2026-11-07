import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import type { ReactNode } from "react";

export const SIGNS = [
  { slug: "aries", en: "ARIES", name: "Aries", period: "21.03 – 19.04" },
  { slug: "taurus", en: "TAURUS", name: "Taurus", period: "20.04 – 20.05" },
  { slug: "gemini", en: "GEMINI", name: "Gemini", period: "21.05 – 20.06" },
  { slug: "cancer", en: "CANCER", name: "Cancer", period: "21.06 – 22.07" },
  { slug: "leo", en: "LEO", name: "Leo", period: "23.07 – 22.08" },
  { slug: "virgo", en: "VIRGO", name: "Virgo", period: "23.08 – 22.09" },
  { slug: "libra", en: "LIBRA", name: "Libra", period: "23.09 – 22.10" },
  { slug: "scorpio", en: "SCORPIO", name: "Scorpio", period: "23.10 – 21.11" },
  { slug: "sagittarius", en: "SAGITTARIUS", name: "Sagittarius", period: "22.11 – 21.12" },
  { slug: "capricorn", en: "CAPRICORN", name: "Capricorn", period: "22.12 – 19.01" },
  { slug: "aquarius", en: "AQUARIUS", name: "Aquarius", period: "20.01 – 18.02" },
  { slug: "pisces", en: "PISCES", name: "Pisces", period: "19.02 – 20.03" },
] as const;

export type SignSlug = (typeof SIGNS)[number]["slug"];

// Seasonal theming is fully automatic (calendar-based via useCurrentSeason);
// there is deliberately no user-facing control to switch seasons.
export const SEASON_THEMES = [
  { key: "winter", label: "Winter" },
  { key: "spring", label: "Spring" },
  { key: "summer", label: "Summer" },
  { key: "autumn", label: "Autumn" },
] as const;

export type SeasonKey = (typeof SEASON_THEMES)[number]["key"];

function calendarSeason(date: Date): SeasonKey {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

export function useCurrentSeason() {
  const [key, setKey] = useState<SeasonKey>(() => calendarSeason(new Date()));

  useEffect(() => {
    const update = () => setKey(calendarSeason(new Date()));
    const timer = window.setInterval(update, 60 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  return SEASON_THEMES.find((season) => season.key === key)!;
}

const LOGO_PATH =
  "M172.308 8.65385H165.319L154.835 16.6154L154.593 16.3385L153.901 10.7308L153.347 8.58462L146.531 8.65385L130.857 35.9308H138.331L145.943 22.3269L147.465 19.9038L147.742 20.0769L148.434 25.3385L148.849 27.0692L158.191 20.0077L158.468 20.1462L149.472 35.9308H156.807L172.135 9.27692L172.308 8.65385ZM136.255 8.72308L136.047 8.58462L119.37 8.65385L105.599 32.4692L103.8 35.9308H121.515L126.117 30.4615L126.013 30.1154L114.699 30.1846L114.526 29.7692L117.294 25.2692H125.598L130.788 19.3154L130.719 18.9692H121.1V18.3462L123.245 14.8846L134.317 14.8154L136.255 8.72308ZM109.163 8.58462H102.139L101.793 8.82692L86.327 35.9308H93.6968L109.267 8.93077L109.163 8.58462ZM93.3508 8.65385H73.871L68.7848 14.8154L76.0508 14.8846L76.1892 15.0577L64.356 35.9308H71.6912L83.6628 15.0577L84.0088 14.8154H91.517L93.3508 8.65385ZM64.875 8.65385L56.398 8.58462L54.5988 8.72308L50.862 10.1077L48.44 11.8385L46.018 14.7115L45.326 15.9923L44.9108 17.5846L45.0492 20.5962L47.056 27.1731L47.402 27.7615V29.0769L46.7792 29.7692L46.018 30.1154L37.4372 30.1846L35.638 35.9308H48.267L50.689 34.6846L52.765 33.1615L54.9448 30.6346L55.9828 28.5577L56.3288 27.0692L55.9828 24.2308L53.5608 17.2385V15.9923L54.2528 15.2308L55.706 14.8154H62.972L63.2488 14.4692L64.875 8.65385ZM48.44 0H20.4832L17.127 5.95385L17.3 6.23077H19.4452L19.549 6.57692L14.878 14.7115L14.4628 15.0577H12.0408L11.418 15.8538L8.3732 21.1154V21.3923H10.726L10.899 21.6346L6.1588 29.8385L5.709 30.1846H3.1832L0 35.9308H27.9568L30.967 30.5308L30.8632 30.1154L7.3352 30.1846L7.093 29.7692L11.418 22.2231L12.11 21.3923H25.3272L28.6488 15.75L28.7872 15.0577H15.9852L15.8468 14.8846V14.5385L20.3448 6.75L20.8292 6.23077H44.807L45.6028 5.19231L48.44 0Z";

export function Logo({ width = 173 }: { width?: number }) {
  return (
    <svg
      width={width}
      viewBox="0 0 173 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ESTIEM"
    >
      <path d={LOGO_PATH} fill="white" />
    </svg>
  );
}

const NAV = [
  { to: "/", label: "Home", end: true as const },
  { to: "/signs", label: "Signs" },
  { to: "/about", label: "About" },
];

const AUTUMN_LEAVES = [
  [0, 2, 50, -24], [5, 1, 38, 22], [11, 3, 32, -8], [16, 8, 42, 36],
  [1, 13, 36, 48], [8, 15, 46, -42], [17, 20, 29, 14], [0, 28, 39, -14],
  [3, 39, 31, 34], [0, 52, 44, -38], [5, 64, 34, 18], [1, 77, 47, -12],
  [9, 86, 39, 42], [0, 96, 51, -32], [14, 96, 37, 16],
  [100, 1, 48, 25], [94, 2, 37, -36], [88, 5, 34, 11], [99, 13, 40, -18],
  [92, 16, 45, 43], [84, 21, 31, -8], [100, 30, 39, 32], [97, 42, 32, -28],
  [100, 55, 47, 12], [94, 68, 35, -42], [100, 79, 42, 36], [91, 88, 32, -18],
  [99, 98, 52, 22], [86, 96, 40, -34],
] as const;

const AUTUMN_PALETTES = [
  ["#FFD45C", "#F18824", "#B83E1E"],
  ["#FFB43F", "#E65320", "#8C2B22"],
  ["#F8D66B", "#D97822", "#A63820"],
  ["#F07832", "#C73A23", "#70251E"],
  ["#FFE07A", "#E5A12C", "#BD4B22"],
] as const;

function MapleLeaf({ index }: { index: number }) {
  const palette = AUTUMN_PALETTES[index % AUTUMN_PALETTES.length]!;
  const gradientId = `autumn-maple-${index}`;
  const leafShape = "M32 5C34 9 35 13 35 17C40 13 45 12 49 14C49 19 47 23 43 27C49 26 54 28 57 32C55 37 51 40 45 41C50 44 52 48 52 53C47 55 42 54 37 51C38 57 36 62 32 65C28 62 26 57 27 51C22 54 17 55 12 53C12 48 14 44 19 41C13 40 9 37 7 32C10 28 15 26 21 27C17 23 15 19 15 14C19 12 24 13 29 17C29 13 30 9 32 5Z";

  return (
    <svg viewBox="0 0 64 78" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="14" y1="10" x2="49" y2="61" gradientUnits="userSpaceOnUse">
          <stop stopColor={palette[0]} />
          <stop offset="0.52" stopColor={palette[1]} />
          <stop offset="1" stopColor={palette[2]} />
        </linearGradient>
      </defs>
      <path d={leafShape} fill={`url(#${gradientId})`} stroke="#54271B" strokeOpacity="0.55" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M32 62C31 49 32 31 32 10M32 46L15 32M32 39L48 28M32 52L17 48M32 52L47 48" fill="none" stroke="#6D2D1D" strokeOpacity="0.66" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M32 13C31 20 31 26 32 32" fill="none" stroke="#FFE29A" strokeOpacity="0.56" strokeWidth="1" strokeLinecap="round" />
      <path d="M32 63L29 72M32 63L35 72" fill="none" stroke="#8D4320" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

type DecorationPlacement = readonly [number, number, number, number];

const BORDER_PLACEMENTS: DecorationPlacement[] = [
  [2, 2, 46, -18], [10, 7, 34, 26], [20, 2, 29, -8], [1, 14, 38, 18],
  [6, 25, 32, -36], [1, 40, 44, 12], [4, 56, 35, 28], [1, 73, 43, -20],
  [11, 86, 31, 38], [2, 98, 48, -12], [19, 98, 33, 24],
  [98, 2, 43, 18], [91, 8, 31, -24], [81, 2, 38, 12], [99, 17, 34, 32],
  [95, 31, 46, -18], [99, 48, 32, 24], [96, 65, 42, -32], [99, 82, 35, 14],
  [89, 91, 31, -14], [98, 99, 49, 28], [80, 99, 36, -22],
];

const SUMMER_PLACEMENTS: DecorationPlacement[] = [
  [3, 3, 50, -12], [15, 8, 35, 18], [1, 20, 29, 0], [5, 37, 39, 18],
  [1, 58, 32, -8], [7, 77, 47, 14], [2, 96, 41, 0], [18, 99, 33, -18],
  [97, 3, 46, 12], [86, 6, 34, -18], [99, 22, 31, 8], [95, 42, 43, -14],
  [99, 62, 34, 12], [92, 79, 39, -20], [99, 97, 48, 12], [83, 99, 32, -8],
];

const SPRING_PALETTE = ["#FFE4EE", "#F7BDD1", "#DC82AD", "#FAD44D"] as const;
const SUMMER_PALETTE = ["#FFF3A6", "#FAD44D", "#F2A52C", "#E67729"] as const;
const WINTER_PALETTE = ["#F4FCFF", "#BFEAF4", "#82C8DD", "#FAD44D"] as const;

function Snowflake({ index }: { index: number }) {
  const gradientId = `snow-crystal-${index}`;
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="19" y1="14" x2="78" y2="88" gradientUnits="userSpaceOnUse">
          <stop stopColor={WINTER_PALETTE[0]} />
          <stop offset="0.55" stopColor={WINTER_PALETTE[1]} />
          <stop offset="1" stopColor={WINTER_PALETTE[2]} />
        </linearGradient>
      </defs>
      <g stroke={`url(#${gradientId})`} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        {[0, 60, 120].map((angle) => (
          <g key={angle} transform={`rotate(${angle} 50 50)`}>
            <path d="M50 8V92M50 20L39 31M50 20L61 31M50 38L39 49M50 38L61 49M50 62L39 51M50 62L61 51M50 80L39 69M50 80L61 69" />
          </g>
        ))}
      </g>
      <circle cx="50" cy="50" r="6" fill="#D8F5FA" stroke="#F4FCFF" strokeWidth="2" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <circle key={angle} cx="50" cy="8" r="2.4" fill="#F4FCFF" transform={`rotate(${angle} 50 50)`} />
      ))}
    </svg>
  );
}

function Blossom({ index }: { index: number }) {
  const gradientId = `blossom-petal-${index}`;
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="22" y1="15" x2="77" y2="82" gradientUnits="userSpaceOnUse">
          <stop stopColor={SPRING_PALETTE[0]} />
          <stop offset="0.62" stopColor={SPRING_PALETTE[1]} />
          <stop offset="1" stopColor={SPRING_PALETTE[2]} />
        </linearGradient>
      </defs>
      <g fill={`url(#${gradientId})`} stroke="#FCE8F0" strokeWidth="1.2">
        {[0, 72, 144, 216, 288].map((angle) => (
          <path key={angle} d="M50 52C37 44 33 31 38 20C42 11 48 7 50 7C54 11 62 19 62 30C62 40 57 48 50 52Z" transform={`rotate(${angle} 50 50)`} />
        ))}
      </g>
      <g stroke="#FFF8DE" strokeWidth="1.2" strokeLinecap="round">
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <path key={angle} d="M50 48L50 32" transform={`rotate(${angle} 50 50)`} />
        ))}
      </g>
      <circle cx="50" cy="50" r="8" fill={SPRING_PALETTE[3]} />
      <circle cx="47" cy="47" r="2" fill="#FFF5C2" />
      <path d="M49 89C48 80 48 72 50 63" fill="none" stroke="#8EBB73" strokeWidth="2" strokeLinecap="round" />
      <path d="M49 78C39 69 33 70 30 73C35 81 41 82 49 78ZM50 72C59 63 66 64 69 67C65 75 59 76 50 72Z" fill="#8EBB73" stroke="#B4D68F" strokeWidth="1" />
    </svg>
  );
}

function SummerSun({ index }: { index: number }) {
  const gradientId = `summer-sun-${index}`;
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <radialGradient id={gradientId} cx="0" cy="0" r="1" gradientTransform="matrix(42 38 -38 42 35 28)" gradientUnits="userSpaceOnUse">
          <stop stopColor={SUMMER_PALETTE[0]} />
          <stop offset="0.55" stopColor={SUMMER_PALETTE[1]} />
          <stop offset="1" stopColor={SUMMER_PALETTE[2]} />
        </radialGradient>
      </defs>
      <g stroke={SUMMER_PALETTE[1]} strokeWidth="2.2" strokeLinecap="round">
        {Array.from({ length: 12 }, (_, ray) => (
          <path key={ray} d="M50 5V16" transform={`rotate(${ray * 30} 50 50)`} />
        ))}
      </g>
      <circle cx="50" cy="50" r="34" fill="none" stroke="#FAD44D" strokeOpacity="0.42" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="25" fill={`url(#${gradientId})`} stroke="#FFE78A" strokeWidth="2" />
      <circle cx="42" cy="40" r="6" fill="#FFF3A6" opacity="0.56" />
      <circle cx="50" cy="50" r="3" fill="#FFF8D5" />
      <path d="M39 59C44 64 55 66 62 60" fill="none" stroke="#C86D25" strokeOpacity="0.65" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SeasonalDecor({ season }: { season: SeasonKey }) {
  if (season === "autumn") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {AUTUMN_LEAVES.map(([x, y, size, rotate], index) => (
          <div
            key={index}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size * 1.22,
              opacity: 0.94,
              transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
            }}
          >
            <MapleLeaf index={index} />
          </div>
        ))}
      </div>
    );
  }

  const placements = season === "summer" ? SUMMER_PLACEMENTS : BORDER_PLACEMENTS;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {placements.map(([x, y, size, rotate], index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: size,
            height: size,
            opacity: season === "winter" ? 0.86 : 0.94,
            transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
            filter:
              season === "winter"
                ? "drop-shadow(0 2px 6px rgba(130, 200, 221, 0.26))"
                : "drop-shadow(0 2px 5px rgba(242, 165, 44, 0.2))",
          }}
        >
          {season === "winter" && <Snowflake index={index} />}
          {season === "spring" && <Blossom index={index} />}
          {season === "summer" && <SummerSun index={index} />}
        </div>
      ))}
    </div>
  );
}

export function Page({ children }: { children: ReactNode }) {
  const season = useCurrentSeason();
  return (
    <div
      className="relative flex min-h-screen flex-col overflow-x-hidden font-['Inter',sans-serif] text-white"
      style={{ background: "linear-gradient(180deg,#1A4F38 0%,#26664D 100%)" }}
    >
      <SeasonalDecor season={season.key} />
      <header className="relative flex flex-wrap items-center justify-between gap-4 px-5 py-7 md:px-16">
        <Link to="/">
          <Logo />
        </Link>
        <nav className="flex flex-wrap items-center gap-5 md:gap-10">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={"end" in n}
              className={({ isActive }) =>
                `text-base ${isActive ? "font-bold text-[#FAD44D]" : "font-semibold text-white"}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="relative flex-1">{children}</main>
      <footer className="relative flex flex-col gap-8 bg-[#174530] px-5 py-10 md:px-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Logo width={135} />
          <span className="text-sm text-[#94B0A1]">© Daily Horoscope · 01.11</span>
        </div>
        <div className="grid gap-8 border-t border-[#94B0A1]/30 pt-7 md:grid-cols-2">
          <div>
            <h2 className="mb-3 text-sm font-bold text-white">
              ESTIEM · European Students of Industrial Engineering and
              Management
            </h2>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#94B0A1]">
              <a href="https://estiem.org/" target="_blank" rel="noreferrer" className="hover:text-[#FAD44D]">Website</a>
              <a href="https://www.facebook.com/ESTIEMfb/" target="_blank" rel="noreferrer" className="hover:text-[#FAD44D]">Facebook</a>
              <a href="https://www.linkedin.com/company/estiem/" target="_blank" rel="noreferrer" className="hover:text-[#FAD44D]">LinkedIn</a>
              <a href="https://www.instagram.com/estiem_official/" target="_blank" rel="noreferrer" className="hover:text-[#FAD44D]">Instagram</a>
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-bold text-white">
              LG Kyiv · Local Group in Kyiv
            </h2>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#94B0A1]">
              <a href="https://estiemkyiv.org.ua/" target="_blank" rel="noreferrer" className="hover:text-[#FAD44D]">Website</a>
              <a href="https://www.instagram.com/estiem_lgkyiv/" target="_blank" rel="noreferrer" className="hover:text-[#FAD44D]">Instagram</a>
              <a href="https://t.me/estiem_lg_kyiv" target="_blank" rel="noreferrer" className="hover:text-[#FAD44D]">Telegram</a>
              <a href="https://www.linkedin.com/company/estiem-lg-kyiv/" target="_blank" rel="noreferrer" className="hover:text-[#FAD44D]">LinkedIn</a>
              <a href="https://www.facebook.com/estiemlgkyiv/" target="_blank" rel="noreferrer" className="hover:text-[#FAD44D]">Facebook</a>
              <a href="https://linktr.ee/estiem.kyiv" target="_blank" rel="noreferrer" className="hover:text-[#FAD44D]">All links</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function GoldButton({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="inline-block rounded-[40px] bg-[#FAD44D] px-10 py-4 text-lg font-bold text-[#174530]"
    >
      {children}
    </Link>
  );
}

export function SignCard({ s, i }: { s: (typeof SIGNS)[number]; i: number }) {
  return (
    <Link
      to={`/signs/${s.slug}`}
      className="flex flex-col items-start gap-1.5 rounded-3xl border border-[#94B0A1] bg-[#174530] px-6 py-7 transition hover:border-[#FAD44D]"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-[#FAD44D] text-xl font-bold text-[#174530]">
        {String(i + 1).padStart(2, "0")}
      </span>
      <span className="text-[22px] font-bold tracking-[0.08em]">{s.en}</span>
      <span className="text-sm text-[#94B0A1]">{s.period}</span>
    </Link>
  );
}

export function SignGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {SIGNS.map((s, i) => (
        <SignCard key={s.slug} s={s} i={i} />
      ))}
    </div>
  );
}

export function SectionIntro({
  title,
  text,
  big,
}: {
  title: string;
  text: string;
  big?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className={`font-bold ${big ? "text-4xl md:text-[56px]" : "text-4xl md:text-[40px]"}`}>
        {title}
      </h2>
      <p className={`text-[#94B0A1] ${big ? "text-xl" : "text-lg"} leading-normal`}>
        {text}
      </p>
    </div>
  );
}
