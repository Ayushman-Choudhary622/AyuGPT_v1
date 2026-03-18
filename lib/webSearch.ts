/**
 * DuckDuckGo Web Search — No API key required.
 * Fetches the DuckDuckGo HTML page and parses result titles + snippets.
 */
export async function webSearch(query: string): Promise<string> {
  const MAX_RESULTS = 4;

  try {
    // First try DuckDuckGo Instant Answer API
    const instantUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1&t=AyuGPT`;
    const instantRes = await fetch(instantUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AyuGPT/1.0)" },
      signal: AbortSignal.timeout(6000),
    });

    if (instantRes.ok) {
      const data = await instantRes.json();
      const parts: string[] = [];

      if (data.AbstractText) {
        parts.push(`📖 **Summary:** ${data.AbstractText}`);
      }
      if (data.Answer) {
        parts.push(`✅ **Direct Answer:** ${data.Answer}`);
      }
      if (data.RelatedTopics && data.RelatedTopics.length > 0) {
        const topics = data.RelatedTopics.filter((t: { Text?: string }) => t.Text)
          .slice(0, MAX_RESULTS)
          .map((t: { Text: string; FirstURL?: string }) => `• ${t.Text}`);
        if (topics.length > 0) {
          parts.push(`🔗 **Related:**\n${topics.join("\n")}`);
        }
      }
      if (parts.length > 0) {
        return `🌐 **Web Search Results for: "${query}"**\n\n${parts.join("\n\n")}`;
      }
    }

    // Fallback: scrape DuckDuckGo HTML
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
      return `⚠️ Web search unavailable (status ${htmlRes.status}).`;
    }

    const html = await htmlRes.text();
    const results: string[] = [];

    // Extract result blocks
    const blockRegex = /<div class="result[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;
    const titleRx = /class="result__a"[^>]*>([^<]+)</;
    const snippetRx = /class="result__snippet"[^>]*>([\s\S]*?)<\/a>/;
    const urlRx = /class="result__url"[^>]*>([\s\S]*?)<\//;

    let block: RegExpExecArray | null;
    let count = 0;
    while ((block = blockRegex.exec(html)) !== null && count < MAX_RESULTS) {
      const content = block[1];
      const titleMatch = titleRx.exec(content);
      const snippetMatch = snippetRx.exec(content);
      const urlMatch = urlRx.exec(content);

      const title = titleMatch
        ? titleMatch[1].replace(/&amp;/g, "&").replace(/&quot;/g, '"').trim()
        : null;
      const snippet = snippetMatch
        ? snippetMatch[1]
            .replace(/<[^>]+>/g, "")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"')
            .trim()
        : null;
      const url = urlMatch ? urlMatch[1].replace(/<[^>]+>/g, "").trim() : null;

      if (title && snippet) {
        results.push(
          `**${title}**${url ? ` (${url})` : ""}\n${snippet}`
        );
        count++;
      }
    }

    if (results.length > 0) {
      return `🌐 **Web Search Results for: "${query}"**\n\n${results.join("\n\n---\n\n")}`;
    }

    return `⚠️ No web results found for "${query}". Answering from training knowledge.`;
  } catch (err) {
    console.error("[webSearch] Error:", err);
    return `⚠️ Web search timed out. Answering from training knowledge.`;
  }
}
