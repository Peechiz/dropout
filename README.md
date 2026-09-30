# dropout

Prints this week's [Dropout](https://www.dropout.tv) release schedule.

```
$ dropout
Dropout · week of September 28

Mon 9/28   🃏 Game Changer S8 Finale BTS ("Last Talent Standing") + Crowd Control (...)
Wed 9/30   🧸 D20: Toylight
Thu 10/1   🗣️ Adventuring Party
Fri 10/2   🐷 Smartypants (w/ Roz Hernandez, Talia Tabin, Rashawn Nadine Scott)

https://bsky.app/profile/dropout.tv/post/3mwlldu4oes27
```

dropout.tv doesn't publish a schedule itself. Every Monday around 11am ET / 8am PT, Dropout posts a "This week on Dropout" rundown to its socials, and this reads that post through Bluesky's public API, so it needs no account or token. Past days are dimmed and today is highlighted. Before Monday's post goes up you'll see last week's schedule with a note saying so.

## Setup

Needs [Bun](https://bun.sh) 1.4+

```bash
bun install
bun link        # puts `dropout` on your PATH, running from source
```

`bun run build` compiles a standalone `./dropout` binary if you'd rather copy that somewhere.
