import { Link, useParams } from "react-router";
import { useActionQuery } from "@agent-native/core/client/hooks";
import { Page, SIGNS } from "@/components/horoscope";
import { Constellation } from "@/components/constellation";

export function meta() {
  return [{ title: "Sign Horoscope · Daily Horoscope" }];
}

function dayLabel(date: string | undefined): string {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return "···";
  return `${date.slice(8, 10)}.${date.slice(5, 7)}`;
}

type SignReadingData = ReturnType<
  typeof useActionQuery<undefined, "get-sign-horoscope">
>["data"];

const pill =
  "rounded-full border border-[#94B0A1] px-4 py-2 text-xs font-semibold";

function SignReading({ data }: { data: SignReadingData }) {
  const horoscope = data?.horoscope;
  if (!horoscope) {
    return (
      <section className="bg-[#174530] px-5 py-8 md:px-16">
        <p className="mb-2 text-sm font-semibold text-[#FAD44D]">
          Today's horoscope · <span className="text-white">preparing</span>
        </p>
        <p className="text-lg text-[#94B0A1]">
          Today's forecast is not ready yet — come back a little later.
        </p>
      </section>
    );
  }

  const compat = SIGNS.find((s) => s.slug === horoscope.compatibility);
  return (
    <>
      <section className="bg-[#174530] px-5 py-8 md:px-16">
        <p className="mb-2 text-sm font-semibold text-[#FAD44D]">
          Today's horoscope ·{" "}
          <span className="text-white">{dayLabel(data?.date)}</span>
        </p>
        <p className="text-lg leading-normal">{horoscope.overview}</p>
      </section>

      <section className="grid gap-6 px-5 py-10 md:grid-cols-3 md:px-16">
        <div className="rounded-3xl border border-[#94B0A1] bg-[#174530] p-6">
          <p className="text-sm font-semibold text-[#FAD44D]">💼 Work</p>
          <p className="mt-2 text-base leading-normal text-[#94B0A1]">
            {horoscope.work}
          </p>
        </div>
        <div className="rounded-3xl border border-[#94B0A1] bg-[#174530] p-6">
          <p className="text-sm font-semibold text-[#FAD44D]">❤️ Love</p>
          <p className="mt-2 text-base leading-normal text-[#94B0A1]">
            {horoscope.love}
          </p>
        </div>
        <div className="rounded-3xl border border-[#94B0A1] bg-[#174530] p-6">
          <p className="text-sm font-semibold text-[#FAD44D]">⚡ Mood</p>
          <p className="mt-2 text-base leading-normal text-[#94B0A1]">
            {horoscope.mood}
          </p>
        </div>
      </section>

      {horoscope.advice ? (
        <section className="border-y border-[#94B0A1]/40 bg-[#174530] px-5 py-8 md:px-16">
          <p className="text-sm font-semibold text-[#FAD44D]">🔮 Advice of the day</p>
          <p className="mt-2 text-lg leading-normal">{horoscope.advice}</p>
        </section>
      ) : null}

      {horoscope.luckyNumber != null ||
      horoscope.luckyColor ||
      compat ? (
        <section className="flex flex-wrap items-center gap-3 px-5 py-6 md:px-16">
          {horoscope.luckyNumber != null ? (
            <span className={`${pill} border-[#FAD44D] text-[#FAD44D]`}>
              Lucky number · {horoscope.luckyNumber}
            </span>
          ) : null}
          {horoscope.luckyColor ? (
            <span className={pill}>Lucky color · {horoscope.luckyColor}</span>
          ) : null}
          {compat ? <span className={pill}>Compatibility · {compat.name}</span> : null}
        </section>
      ) : null}
    </>
  );
}

export default function SignRoute() {
  const { slug } = useParams();
  const i = SIGNS.findIndex((s) => s.slug === slug);
  const known = i >= 0;
  // Always mounted: fall back to a valid arg but disable the request
  // for unknown slugs; the action re-validates every value it receives.
  const { data } = useActionQuery(
    "get-sign-horoscope",
    { sign: known ? SIGNS[i]!.slug : "aries" },
    { enabled: known },
  );

  if (!known) {
    return (
      <Page>
        <p className="px-5 py-20 md:px-16">Sign not found</p>
      </Page>
    );
  }
  const s = SIGNS[i]!;
  const prev = SIGNS[(i + 11) % 12]!;
  const next = SIGNS[(i + 1) % 12]!;

  return (
    <Page>
      <section className="flex flex-col items-center justify-between gap-10 px-5 py-12 md:px-16 lg:flex-row">
        <div className="flex flex-col items-start gap-3">
          <span className="text-sm text-[#94B0A1]">
            ← {String(i + 1).padStart(2, "0")} / 12
          </span>
          <h1 className="text-5xl font-bold tracking-wide md:text-6xl">{s.en}</h1>
          <span className="text-xl text-[#94B0A1]">{s.name}</span>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#FAD44D] px-4 py-2 text-xs font-bold text-[#174530]">
              {s.period}
            </span>
            <Link to="/signs" className={pill}>
              All signs
            </Link>
          </div>
        </div>
        <Constellation slug={s.slug} className="w-full max-w-[380px]" />
      </section>
      <SignReading data={data} />
      <section className="flex justify-between gap-4 px-5 py-6 md:px-16">
        <Link to={`/signs/${prev.slug}`} className={pill}>
          ← {prev.name}
        </Link>
        <Link to={`/signs/${next.slug}`} className={pill}>
          {next.name} →
        </Link>
      </section>
    </Page>
  );
}
