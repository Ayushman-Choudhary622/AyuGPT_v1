export async function webSearch(query: string): Promise<string> {
  const MAX_RESULTS = 4;

  try {
    // Skip instant API (returns inconsistent JSON), go straight to HTML scrape
    const htmlUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const htmlRes = await fetch(htmlUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!htmlRes.ok) {
      return "";
    }

    const html = await htmlRes.text();
    const results: string[] = [];

    const blockRegex =
      /<a class="result__a"[^>]*>([^<]+)<\/a>[\s\S]*?<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;

    let match: RegExpExecArray | null;
    let count = 0;

    while ((match = blockRegex.exec(html)) !== null && count < MAX_RESULTS) {
      const title = match[1]
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .trim();
      const snippet = match[2]
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .trim();

      if (title && snippet) {
        results.push(`**${title}**\n${snippet}`);
        count++;
      }
    }

    if (results.length > 0) {
      return `🌐 Web Search Results for: "${query}"\n\n${results.join("\n\n---\n\n")}`;
    }

    return "";
  } catch (err) {
    // Silently fail — AI will answer from training data
    console.error("[webSearch] Error:", err);
    return "";
  }
}
