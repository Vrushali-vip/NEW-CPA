// import { NextResponse } from "next/server";
// import Parser from "rss-parser";

// const parser = new Parser();

// const FEED_URL_EN = "https://feeds.bbci.co.uk/news/world/rss.xml";
// const FEED_URL_DE = "https://www.tagesschau.de/xml/rss2";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const lang = searchParams.get("lang") ?? "en";
//   const feedUrl = lang === "de" ? FEED_URL_DE : FEED_URL_EN;

//   try {
//     const feed = await parser.parseURL(feedUrl);

//     const items = feed.items.slice(0, 6).map((item) => ({
//       title: item.title ?? "",
//       summary: item.contentSnippet ?? "",
//       date: item.pubDate ?? "",
//       link: item.link ?? "#",
//     }));

//     return NextResponse.json({ items });
//   } catch (error: any) {
//     console.error("Failed to fetch RSS feed", feedUrl, error);
//     return NextResponse.json({ error: "Failed to fetch RSS feed", details: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser();

const FEED_URL_EN = "https://feeds.bbci.co.uk/news/world/rss.xml";
const FEED_URL_DE = "https://www.tagesschau.de/xml/rss2";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") ?? "en";
  const feedUrl = lang === "de" ? FEED_URL_DE : FEED_URL_EN;

  try {
    const feed = await parser.parseURL(feedUrl);

    const items = feed.items.slice(0, 6).map((item) => ({
      title: item.title ?? "",
      summary: item.contentSnippet ?? "",
      date: item.pubDate ?? "",
      link: item.link ?? "#",
    }));

    return NextResponse.json({ items });
  } catch (error: unknown) {
    console.error("Failed to fetch RSS feed", feedUrl, error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to fetch RSS feed", details: message },
      { status: 500 }
    );
  }
}
