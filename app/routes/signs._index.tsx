import { useState } from "react";
import { IconInfoCircle } from "@tabler/icons-react";
import { GoldButton, Page, SIGNS, SectionIntro, SignCard } from "@/components/horoscope";

export function meta() {
  return [{ title: "Усі знаки · Daily Horoscope" }];
}

const FILTERS = [
  { key: "all", label: "Усі" },
  { key: "spring", label: "Весна", range: [0, 1, 2] },
  { key: "summer", label: "Літо", range: [3, 4, 5] },
  { key: "autumn", label: "Осінь", range: [6, 7, 8] },
  { key: "winter", label: "Зима", range: [9, 10, 11] },
];

export default function SignsRoute() {
  const [f, setF] = useState("all");
  const active = FILTERS.find((x) => x.key === f)!;
  return (
    <Page>
      <div className="flex flex-col gap-8 px-5 pb-24 pt-[72px] md:px-16">
        <SectionIntro
          big
          title="Усі знаки"
          text="Обери свій знак зодіаку, щоб прочитати гороскоп на сьогодні"
        />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {FILTERS.map((x) => (
              <button
                key={x.key}
                onClick={() => setF(x.key)}
                className={`rounded-full px-5 py-3 text-base ${
                  f === x.key
                    ? "bg-[#FAD44D] font-bold text-[#174530]"
                    : "border border-[#94B0A1] bg-[#174530] font-semibold"
                }`}
              >
                {x.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#94B0A1] bg-[#174530] px-4 py-3 text-sm font-semibold text-[#94B0A1]">
            <IconInfoCircle size={16} color="#FAD44D" />
            12 знаків · українською
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SIGNS.map((s, i) =>
            f === "all" || active.range?.includes(i) ? (
              <SignCard key={s.slug} s={s} i={i} />
            ) : null,
          )}
        </div>
      </div>
      <div className="px-5 pb-10 md:px-16">
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-[#FAD44D] bg-[#174530] p-6 md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <span className="text-[28px] font-bold">Читати гороскоп</span>
            <span className="text-lg text-[#94B0A1]">
              Обери свій знак, щоб перейти до щоденного прогнозу, порад та
              настрою дня.
            </span>
          </div>
          <GoldButton to="/signs/aries">Читати гороскоп</GoldButton>
        </div>
      </div>
    </Page>
  );
}
