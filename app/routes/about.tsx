import { GoldButton, Page, SectionIntro } from "@/components/horoscope";

export function meta() {
  return [{ title: "About Us · Daily Horoscope" }];
}

const FACTS = [
  ["Daily", "A new horoscope every day"],
  ["12", "zodiac signs"],
  ["4", "seasonal design themes"],
];

export default function AboutRoute() {
  return (
    <Page>
      <section className="flex flex-col gap-8 px-5 pb-12 pt-[72px] md:px-16">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#FAD44D] px-4 py-2.5 text-sm font-bold text-[#174530]">
              About Daily Horoscope
            </span>
            <span className="text-sm font-semibold text-[#94B0A1]">
              Daily horoscope by ESTIEM
            </span>
          </div>
          <h1 className="text-4xl font-bold md:text-[56px]">About Daily Horoscope</h1>
          <p className="text-[22px] leading-[1.6] text-[#94B0A1]">
            Daily Horoscope is the daily horoscope by ESTIEM. Choose your sign
            and find out what today has in store for you.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <GoldButton to="/signs">Choose your sign</GoldButton>
          <span className="flex-1 text-base text-[#94B0A1]">
            Head to the home page to start reading today's horoscope.
          </span>
        </div>
      </section>
      <section className="flex flex-col gap-8 bg-[#174530] px-5 pb-[72px] pt-14 md:px-16">
        <SectionIntro
          title="About the service"
          text="A few more key facts about Daily Horoscope to help you find your way around faster."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {FACTS.map(([big, small]) => (
            <div
              key={small}
              className="flex flex-col gap-2 rounded-3xl border border-[#94B0A1] p-8"
            >
              <span className="text-5xl font-bold text-[#FAD44D]">{big}</span>
              <span className="text-lg">{small}</span>
            </div>
          ))}
        </div>
      </section>
    </Page>
  );
}
