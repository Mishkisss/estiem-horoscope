import {
  GoldButton,
  Page,
  SectionIntro,
  SignGrid,
  useCurrentSeason,
} from "@/components/horoscope";
import { AdSlot } from "@/components/ads";
import { Constellation } from "@/components/constellation";
import { useActionQuery } from "@agent-native/core/client/hooks";

export function meta() {
  return [{ title: "Daily Horoscope · ESTIEM" }];
}

function dayLabel(date: string | undefined): string {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return "···";
  return `${date.slice(8, 10)}.${date.slice(5, 7)}`;
}

export default function HomeRoute() {
  const season = useCurrentSeason();
  const { data } = useActionQuery("get-today-horoscope", {});
  const { data: dayData } = useActionQuery("get-day-forecast", {});
  const forecast = dayData?.forecast ?? null;
  const cancerReading = data?.horoscopes.find((h) => h.sign === "cancer");
  const featuredTitle =
    cancerReading?.overview.split(/(?<=[.!?])\s/)[0] ??
    "Family or friendly comfort will fill your day with warmth.";
  const featuredBody =
    cancerReading?.advice ??
    "Today you are the baker of treats: bake a charlotte for the local picnic.";
  return (
    <Page>
      <section className="flex flex-col items-center gap-7 px-5 pb-24 pt-20 text-center md:px-16">
        <div className="rounded-[200px] border-[6px] border-white px-6 py-8 md:px-[110px] md:py-12">
          <h1 className="text-5xl font-bold md:text-[80px]">Daily Horoscope</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="rounded-full bg-[#FAD44D] px-5 py-3 text-lg font-bold text-[#174530]">
            {dayLabel(data?.date)}
          </span>
          <span className="text-lg font-semibold text-[#FAD44D]">
            {data?.isFallback ? "Latest published forecast" : "Daily horoscope"}
          </span>
        </div>
        <p className="max-w-[760px] text-xl leading-normal text-[#94B0A1]">
          The daily horoscope by ESTIEM — choose your sign and find out what
          today has in store for you
        </p>
        <GoldButton to="/signs">Choose your sign</GoldButton>
      </section>

      {forecast ? (
        <section className="px-5 pb-16 md:px-16">
          <div className="rounded-3xl border border-[#94B0A1] bg-[#174530] px-6 py-8 md:px-10 md:py-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#FAD44D] px-4 py-2 text-sm font-bold text-[#174530]">
                {dayLabel(forecast.date)}
              </span>
              <span className="text-sm font-semibold text-[#FAD44D]">
                Forecast of the day
              </span>
              {forecast.weekday ? (
                <span className="text-sm text-[#94B0A1]">{forecast.weekday}</span>
              ) : null}
            </div>
            <p className="mt-5 max-w-[900px] text-lg leading-[1.75] text-[#94B0A1] md:text-xl">
              {forecast.content}
            </p>
            <p className="mt-5 text-xs text-[#94B0A1]">
              General forecast for the day
              {forecast.energyLevel ? ` · Energy: ${forecast.energyLevel}` : ""}
              {forecast.moon ? ` · Moon: ${forecast.moon}` : ""} · source CosmyDay
            </p>
          </div>
        </section>
      ) : null}

      <section className="bg-[#174530] px-5 py-8 text-center md:px-16">
        <p className="text-sm font-semibold text-[#FAD44D]">
          Seasonal theme · {season.label}
        </p>
        <p className="mt-2 text-[#94B0A1]">
          The site's design changes automatically with the seasons.
        </p>
      </section>

      <section className="flex flex-col gap-8 px-5 py-20 md:px-16">
        <SectionIntro
          title="Choose your sign"
          text="12 zodiac signs — each with its own period, name and short overview. Finding your sign is even easier."
        />
        <SignGrid />
      </section>

      {/* Advertising placement — renders nothing until ads are enabled. */}
      <AdSlot />

      <section className="flex flex-col items-center gap-12 bg-[#174530] px-5 py-[72px] md:px-16 lg:flex-row">
        <div className="flex flex-1 flex-col gap-6">
          <span className="self-start rounded-[60px] bg-[#94B0A1] px-10 py-3.5 text-[32px] font-bold tracking-[0.12em] text-[#174530]">
            CANCER
          </span>
          <p className="text-[28px] font-bold">{featuredTitle}</p>
          <p className="text-[22px] leading-normal">{featuredBody}</p>
        </div>
        <Constellation slug="cancer" className="w-full max-w-[380px]" />
      </section>
    </Page>
  );
}
