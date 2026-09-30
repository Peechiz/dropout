#!/usr/bin/env bun
import { fetchLatestSchedule, startOfWeek, type Release } from "./schedule.ts";
import { c } from "./theme.ts";

const HELP = `dropout - this week's Dropout release schedule

usage: dropout

Reads the "This week on Dropout" post Dropout puts on Bluesky every Monday
around 11am ET / 8am PT.`;

const dayLabel = (d: Date) =>
  `${d.toLocaleDateString("en-US", { weekday: "short" })} ${d.getMonth() + 1}/${d.getDate()}`.padEnd(9);

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

function renderRelease({ date, emoji, title }: Release, today: Date): string {
  const line = `${dayLabel(date)}  ${emoji ? `${emoji} ` : ""}${title}`;
  if (sameDay(date, today)) return c.today(line);
  return date < today ? c.dim(line) : line;
}

if (process.argv.includes("-h") || process.argv.includes("--help")) {
  console.log(HELP);
  process.exit(0);
}

const schedule = await fetchLatestSchedule().catch((err: Error) => {
  console.error(c.yellow(`Couldn't reach Bluesky: ${err.message}`));
  process.exit(1);
});

if (!schedule) {
  console.error(c.yellow("No \"This week on Dropout\" post found in Dropout's recent Bluesky posts."));
  process.exit(1);
}

const today = new Date();
const weekLabel = schedule.weekOf.toLocaleDateString("en-US", { month: "long", day: "numeric" });

console.log(`${c.gameChanger("Dropout")} ${c.title(`· week of ${weekLabel}`)}`);
if (!sameDay(schedule.weekOf, startOfWeek(today))) {
  console.log(c.yellow("This week's schedule isn't up yet; showing the latest one."));
}
console.log();
for (const release of schedule.releases) console.log(renderRelease(release, today));
console.log();
console.log(c.dim(schedule.url));
