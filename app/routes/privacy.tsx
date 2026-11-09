import { Page, SectionIntro } from "@/components/horoscope";

export function meta() {
  return [{ title: "Privacy Policy · Daily Horoscope" }];
}

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "Who we are",
    body: [
      "Daily Horoscope is the daily horoscope service by ESTIEM LG Kyiv (Local Group in Kyiv), a local group of ESTIEM — European Students of Industrial Engineering and Management. This policy explains what happens with your data when you use this website.",
    ],
  },
  {
    title: "What we collect",
    body: [
      "The site works without an account: there is no registration and we never ask for your name, email or payment details.",
      "Like most websites, we record technical data on our hosting provider (Netlify): IP address, requested page and user agent, kept for security and abuse prevention in server logs.",
      "We measure usage with Google Analytics 4 (page views, country, device type and browser) to understand which horoscopes are read.",
    ],
  },
  {
    title: "Cookies and local storage",
    body: [
      "Google Analytics sets cookies to recognise your browser between visits.",
      "Your advertising choice is stored in your browser's local storage under the key “estiem-ads-consent”. Clearing site data removes it, and the question will be asked again.",
    ],
  },
  {
    title: "Advertising",
    body: [
      "When advertising is enabled, display banners are served by a third-party advertising network (currently Adsterra). Advertising frames are loaded only after you press “Accept” in the consent bar — declining means no advertising request is made at all.",
      "Advertising partners may use cookies or similar identifiers to select and count ads. Ads are always labelled “Advertisement”.",
      "You can withdraw your choice at any time by clearing this site's data in your browser settings.",
    ],
  },
  {
    title: "Your rights (GDPR)",
    body: [
      "Depending on your location, you may request access to, correction or deletion of data we hold, object to processing, or withdraw consent at any time. Google provides controls for Analytics data in your Google Account.",
      "This website is not intended for children under 16.",
    ],
  },
  {
    title: "Contact",
    body: [
      "Questions about this policy? Reach ESTIEM LG Kyiv through our links in the website footer (Telegram, Instagram or the estiemkyiv.org.ua website).",
    ],
  },
];

export default function PrivacyRoute() {
  return (
    <Page>
      <section className="flex flex-col gap-6 px-5 pb-12 pt-[72px] md:px-16">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[#FAD44D] px-4 py-2.5 text-sm font-bold text-[#174530]">
            Privacy
          </span>
          <span className="text-sm font-semibold text-[#94B0A1]">
            Last updated: November 2026
          </span>
        </div>
        <h1 className="text-4xl font-bold md:text-[56px]">Privacy Policy</h1>
        <p className="max-w-[900px] text-[20px] leading-[1.6] text-[#94B0A1]">
          A short, honest description of what this website stores, what third
          parties are involved, and the choices you have.
        </p>
      </section>
      <section className="flex flex-col gap-8 bg-[#174530] px-5 pb-[72px] pt-14 md:px-16">
        <SectionIntro
          title="How your data is handled"
          text="Daily Horoscope collects as little as possible and never sells personal data."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {SECTIONS.map((section) => (
            <div
              key={section.title}
              className="flex flex-col gap-3 rounded-3xl border border-[#94B0A1] p-7"
            >
              <h2 className="text-xl font-bold text-[#FAD44D]">
                {section.title}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-base leading-[1.7] text-[#94B0A1]">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </Page>
  );
}
