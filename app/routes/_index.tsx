import {
  GoldButton,
  Page,
  SectionIntro,
  SignGrid,
  useCurrentSeason,
} from "@/components/horoscope";
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
  const cancerReading = data?.horoscopes.find((h) => h.sign === "cancer");
  const featuredTitle =
    cancerReading?.overview.split(/(?<=[.!?])\s/)[0] ??
    "Сімейний або дружній затишок заповнить твій день теплом.";
  const featuredBody =
    cancerReading?.advice ??
    "Сьогодні ти пекар смаколиків: спечи шарлотку для локального пікніка.";
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
            Щоденний гороскоп
          </span>
        </div>
        <p className="max-w-[760px] text-xl leading-normal text-[#94B0A1]">
          Щоденний гороскоп від ESTIEM — обери свій знак і дізнайся, що чекає на
          тебе сьогодні
        </p>
        <GoldButton to="/signs">Обрати знак</GoldButton>
      </section>

      <section className="bg-[#174530] px-5 py-8 text-center md:px-16">
        <p className="text-sm font-semibold text-[#FAD44D]">
          Сезонна тема · {season.label}
        </p>
        <p className="mt-2 text-[#94B0A1]">
          Оформлення сайту автоматично змінюється разом із порами року.
        </p>
      </section>

      <section className="flex flex-col gap-8 px-5 py-20 md:px-16">
        <SectionIntro
          title="Обери свій знак"
          text="12 знаків зодіаку — кожен зі своїм періодом, назвою та коротким оглядом. Знайти свій знак ще простіше."
        />
        <SignGrid />
      </section>

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
