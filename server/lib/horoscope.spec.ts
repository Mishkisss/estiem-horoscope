import { describe, expect, it } from "vitest";

import { luckyExtrasFor, parseCosmyDayContent } from "./horoscope";

const SAMPLE = `✨ Monday, November 2 — Virgo

🪐 Overview: For you, **Virgo**, today brings a distinct pull between your inner reflections and how you express yourself.

💼 Work & goals: You might find yourself re-evaluating recent decisions or communications.

❤️ Relationships: Conversations could feel more charged or dramatic than usual.

⚡ Energy & mood: Your energy might feel a bit scattered today.

🔮 Today's tip: Instead of trying to force a decision, take a step back.`;

describe("parseCosmyDayContent", () => {
  it("maps all five sections by their headings", () => {
    const parsed = parseCosmyDayContent(SAMPLE);

    expect(parsed.overview).toContain("inner reflections and how you express yourself");
    expect(parsed.overview).not.toContain("**");
    expect(parsed.work).toContain("re-evaluating recent decisions");
    expect(parsed.love).toContain("more charged or dramatic");
    expect(parsed.mood).toContain("a bit scattered");
    expect(parsed.advice).toContain("take a step back");
  });

  it("appends continuation lines to the open section", () => {
    const parsed = parseCosmyDayContent(
      SAMPLE.replace(
        "how you express yourself.",
        "how you express yourself.\nExtra continuation line.",
      ),
    );

    expect(parsed.overview).toContain("Extra continuation line");
  });

  it("returns empty strings when sections are missing", () => {
    const parsed = parseCosmyDayContent("✨ Monday, November 2 — Virgo\n");

    expect(parsed).toEqual({ overview: "", work: "", love: "", mood: "", advice: "" });
  });

  it("supports heading-only lines where body text follows", () => {
    const parsed = parseCosmyDayContent(
      "🪐 Overview:\nFirst paragraph of the overview.\n",
    );

    expect(parsed.overview).toBe("First paragraph of the overview.");
  });
});

describe("luckyExtrasFor", () => {
  it("is deterministic for the same sign and day", () => {
    const a = luckyExtrasFor("leo", "2026-11-02");
    const b = luckyExtrasFor("leo", "2026-11-02");

    expect(b).toEqual(a);
    expect(a.luckyNumber).toBeGreaterThanOrEqual(1);
    expect(a.luckyNumber).toBeLessThanOrEqual(99);
  });

  it("differs across days and stays inside the sign's element or opposition", () => {
    expect(luckyExtrasFor("leo", "2026-11-02")).not.toEqual(
      luckyExtrasFor("leo", "2026-11-03"),
    );

    const fire = new Set(["aries", "leo", "sagittarius"]);
    const compat = luckyExtrasFor("leo", "2026-11-02").compatibility;
    expect(fire.has(compat) || compat === "aquarius").toBe(true);
  });
});
