const DROPOUT_HANDLE = "dropout.tv";
const FEED_URL = `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${DROPOUT_HANDLE}&limit=100&filter=posts_no_replies`;
const SCHEDULE_HEADER = /^this week on dropout/i;
const DAY_LINE = /^(?<emoji>[^\p{L}\p{N}]*?)\s*(?<day>mon|tue|wed|thu|fri|sat|sun)[a-z]*:\s*(?<title>.+)$/iu;
const WEEKDAY_INDEX: Record<string, number> = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 };

export type Release = { date: Date; emoji: string; title: string };
export type Schedule = { weekOf: Date; releases: Release[]; url: string };

type FeedPost = { uri: string; record: { text: string; createdAt: string } };
type FeedResponse = { feed: { post: FeedPost; reason?: unknown }[] };

export const startOfWeek = (d: Date): Date => {
  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return monday;
};

const addDays = (d: Date, n: number): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

const postUrl = (uri: string) => `https://bsky.app/profile/${DROPOUT_HANDLE}/post/${uri.split("/").pop()}`;

const parseReleases = (text: string, weekOf: Date): Release[] =>
  text.split("\n").flatMap((line) => {
    const match = line.trim().match(DAY_LINE)?.groups;
    const offset = match && WEEKDAY_INDEX[match.day!.toLowerCase()];
    if (!match || offset === undefined) return [];
    return [{ date: addDays(weekOf, offset), emoji: match.emoji!, title: match.title!.trim() }];
  });

export async function fetchLatestSchedule(): Promise<Schedule | undefined> {
  const res = await fetch(FEED_URL);
  if (!res.ok) throw new Error(`Bluesky returned ${res.status} ${res.statusText}`);
  const { feed } = (await res.json()) as FeedResponse;

  const post = feed.find(({ post, reason }) => !reason && SCHEDULE_HEADER.test(post.record.text.trim()))?.post;
  if (!post) return undefined;

  const weekOf = startOfWeek(new Date(post.record.createdAt));
  return { weekOf, releases: parseReleases(post.record.text, weekOf), url: postUrl(post.uri) };
}
