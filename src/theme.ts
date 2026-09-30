/** Colors via Bun.Color, so the palette lives as hex in one place. */

const RESET = "\x1b[0m";
const useColor = () => Boolean(process.stdout.isTTY) && !process.env.NO_COLOR;

const palette = {
  today: "#feea3b",
  warn: "#eab308",
  accent: "#22d3ee",
  muted: "#8b8b93",
  heading: "#e4e4e7",
} as const;

type Tone = keyof typeof palette;

const codes = new Map<Tone, string>();
for (const [tone, hex] of Object.entries(palette)) {
  codes.set(tone as Tone, Bun.color(hex, "ansi") ?? "");
}

const GAME_CHANGER = ["#FED348", "#f7aa5f", "#FF9B45", "#e14e3f", "#DD2330", "#00A0B8", "#4b9395"].map(
  (hex) => Bun.color(hex, "ansi") ?? "",
);

const paintGameChanger = (s: string): string =>
  useColor()
    ? [...s].map((ch, i) => `\x1b[1m${GAME_CHANGER[i % GAME_CHANGER.length]}${ch}`).join("") + RESET
    : s;

const paint =
  (tone: Tone) =>
  (s: string): string =>
    useColor() ? `${codes.get(tone) ?? ""}${s}${RESET}` : s;

export const c = {
  today: paint("today"),
  yellow: paint("warn"),
  cyan: paint("accent"),
  dim: paint("muted"),
  gameChanger: paintGameChanger,
  title: (s: string) => (useColor() ? `\x1b[1m${codes.get("heading")}${s}${RESET}` : s),
};
