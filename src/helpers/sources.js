export const RSS_SOURCES = [
  {
    name: "BBC World",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    domain: "bbc.com",
    tier: 1,
    weight: 0.45,
    language: "en"
  },
  {
    name: "DW Actualidad",
    url: "https://rss.dw.com/xml/rss-es-all",
    domain: "dw.com",
    tier: 1,
    weight: 0.4,
    language: "es"
  },
  {
    name: "Al Jazeera",
    url: "https://www.aljazeera.com/xml/rss/all.xml",
    domain: "aljazeera.com",
    tier: 1,
    weight: 0.4,
    language: "en"
  },
  {
    name: "France 24",
    url: "https://www.france24.com/es/rss",
    domain: "france24.com",
    tier: 1,
    weight: 0.4,
    language: "es"
  },
  {
    name: "UN News (ONU)",
    url: "https://news.un.org/feed/subscribe/en/news/all/rss.xml",
    domain: "un.org",
    tier: 1,
    weight: 0.5,
    language: "en"
  },

  {
    name: "El País",
    url: "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/internacional",
    domain: "elpais.com",
    tier: 2,
    weight: 0.3,
    language: "es"
  },
  {
    name: "RTVE",
    url: "https://www.rtve.es/api/rss/noticias.xml",
    domain: "rtve.es",
    tier: 2,
    weight: 0.3,
    language: "es"
  },
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    domain: "techcrunch.com",
    tier: 2,
    weight: 0.25,
    language: "en"
  },

  {
    name: "Google News",
    url: "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en",
    domain: "news.google.com",
    tier: 3,
    weight: 0.2,
    language: "en"
  },
  {
    name: "Google News (Español)",
    url: "https://news.google.com/rss?hl=es-419&gl=US&ceid=US:es-419",
    domain: "news.google.com",
    tier: 3,
    weight: 0.2,
    language: "es"
  }
];