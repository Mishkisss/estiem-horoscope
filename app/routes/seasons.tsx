import { useState } from "react";
import {
  Page,
  SEASON_THEMES,
  SectionIntro,
  useCurrentSeason,
  type SeasonKey,
} from "@/components/horoscope";

export function meta() {
  return [{ title: "Сезонні теми · Daily Horoscope" }];
}

export default function SeasonsRoute() {
  const currentSeason = useCurrentSeason();
  const [previewSeason, setPreviewSeason] = useState<SeasonKey | null>(null);
  const season =
    SEASON_THEMES.find((theme) => theme.key === previewSeason) ?? currentSeason;

  return (
    <Page seasonOverride={previewSeason ?? undefined}>
      <div className="flex flex-col gap-8 px-5 pb-24 pt-[72px] md:px-16">
        <SectionIntro
          big
          title="Сезонні теми"
          text="Оформлення гороскопу змінюється разом із порою року"
        />
        <div className="flex flex-col gap-5 border-t border-[#94B0A1]/40 py-8">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[#FAD44D]">
              {previewSeason ? "Попередній перегляд" : "Зараз активна тема"}
            </span>
            <h2 className="text-4xl font-bold md:text-5xl">{season.label}</h2>
            <p className="max-w-2xl text-lg leading-relaxed text-[#94B0A1]">
              {season.note} з’являються на зеленому тлі автоматично відповідно до
              календарної пори року.
            </p>
          </div>
          <div
            aria-label="Попередній перегляд сезонної теми"
            className="flex flex-wrap gap-3"
            role="group"
          >
            <button
              type="button"
              aria-pressed={previewSeason === null}
              onClick={() => setPreviewSeason(null)}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAD44D] ${
                previewSeason === null
                  ? "bg-[#FAD44D] text-[#174530]"
                  : "border border-[#94B0A1] text-white hover:border-[#FAD44D]"
              }`}
            >
              Автоматично
            </button>
            {SEASON_THEMES.map((theme) => {
              const selected = previewSeason === theme.key;
              return (
                <button
                  key={theme.key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setPreviewSeason(theme.key)}
                  className={`rounded-full px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAD44D] ${
                    selected
                      ? "bg-[#FAD44D] text-[#174530]"
                      : "border border-[#94B0A1] text-white hover:border-[#FAD44D]"
                  }`}
                >
                  {theme.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Page>
  );
}
