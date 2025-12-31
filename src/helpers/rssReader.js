import Parser from "rss-parser";

const parser = new Parser({
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
  }
});

export async function searchNews(claim) {
  try {
    const searchUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(claim)}&hl=en-US&gl=US&ceid=US:en`;
    
    const feed = await parser.parseURL(searchUrl);
    
    return feed.items.map(item => ({
      title: item.title,
      link: item.link,
      summary: item.contentSnippet,
      source: "Google News Search",
      tier: 1 
    }));
  } catch (error) {
    console.error("❌ Error en búsqueda dinámica:", error.message);
    return [];
  }
}