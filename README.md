![](<public/assets/Github Banner.png>)

# The Makers Guild

A webring for people who build things — apps, tools, weird side projects, anything made out of curiosity rather than a roadmap. Every member's site links to the next one in the ring. No feed, no algorithm. Just one maker pointing you toward another.

---

## What Is A Webring?

A webring is one of the internet's oldest discovery tricks. Back in the 90s, before Google and infinite scroll, personal sites linked to each other in a loop — each one wearing a small widget with **Previous**, **Next**, and **Random** buttons. Clicking *Next* enough times eventually brought you back where you started.

Yahoo bought the biggest webring network and let it rot. Search and feeds took over. The Makers Guild is bringing that loop back, for people who build.

---

## How To Join

1. Head over to [the-makers-guild.vercel.app](https://the-makers-guild.vercel.app) and fill out the application form, or open a request on [GitHub](https://github.com/imti-ahmed/The-Makers-Guild)
2. Wait for review — we'll check your site meets the criteria (1–2 days)
3. Once approved, embed the Guild widget on your homepage
4. You're in the ring

![](<public/assets/Readme 01.png>)

---

## Criteria To Join

- Personal sites only — no corporate pages, landing pages, or resume portfolios
- Something worth exploring — leave a visitor informed, intrigued, or inspired
- Open to builders, designers, developers, artists, and hobbyists
- No illegal, adult, or disturbing content
- Site must be live and regularly updated — inactive members are removed

---

## Widget Policy

Every member must embed the Guild widget on their homepage. The widget is how the ring stays connected — it shows your membership and gives visitors **Previous**, **Next**, and **Random** buttons to navigate the ring.

Removing the widget or letting your site go offline will trigger an automatic review and removal PR.

![](<public/assets/Readme 2.png>)

---

## About The Author

Designed, developed and maintained by [Imtiyaz Ahmed](https://www.imtiyazahmed.com) — a designer and builder who wanted a better way to discover personal sites on the internet.

---

## File Details

| Path | Purpose |
|------|---------|
| `members/` | One `.md` file per approved member. Each file is the source of truth for their name, URL, widget ID, tags, and screenshot. |
| `members/<slug>.md` | A member record. Fields: `name`, `nickname`, `url`, `email`, `tags`, `widget`, `bgColor`, `textColor`, `screenshot`. |
| `activity.md` | Weekly automated health check log. Records whether each member's site is live and widget is present. |
