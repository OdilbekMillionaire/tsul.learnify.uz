// Web Search Service for enriching lessons with real-time information
// Uses multiple search strategies to find relevant academic and current resources

export interface SearchResult {
  title: string;
  description: string;
  url: string;
  source: string;
}

// Try multiple search APIs with fallback strategy
export const searchForTopic = async (query: string, maxResults: number = 5): Promise<SearchResult[]> => {
  try {
    // Strategy 1: Try using SerpAPI (free tier available)
    const results = await trySerperAPI(query, maxResults);
    if (results.length > 0) return results;

    // Strategy 2: Try using DuckDuckGo instant answers
    const ddgResults = await tryDuckDuckGo(query, maxResults);
    if (ddgResults.length > 0) return ddgResults;

    // Strategy 3: Try Wikipedia
    const wikiResults = await tryWikipedia(query);
    if (wikiResults.length > 0) return wikiResults;

    return [];
  } catch (error) {
    console.warn('All search strategies failed:', error);
    return [];
  }
};

// Search using DuckDuckGo (no API key required)
async function tryDuckDuckGo(query: string, maxResults: number): Promise<SearchResult[]> {
  try {
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&t=learnify`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      }
    );
    const data = await response.json();

    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      return data.RelatedTopics.slice(0, maxResults).map((item: any) => ({
        title: item.Text?.split(' - ')[0] || query,
        description: item.Text || '',
        url: item.FirstURL || '#',
        source: 'DuckDuckGo'
      }));
    }
    return [];
  } catch (error) {
    console.warn('DuckDuckGo search failed:', error);
    return [];
  }
}

// Search using Wikipedia (free, no API key needed)
async function tryWikipedia(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&srsearch=${encodeURIComponent(query)}&list=search&srprop=snippet&srlimit=3&origin=*`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      }
    );
    const data = await response.json();

    if (data.query?.search && Array.isArray(data.query.search)) {
      return data.query.search.map((item: any) => ({
        title: item.title,
        description: item.snippet.replace(/<[^>]*>/g, ''),
        url: `https://en.wikipedia.org/wiki/${item.title.replace(/ /g, '_')}`,
        source: 'Wikipedia'
      }));
    }
    return [];
  } catch (error) {
    console.warn('Wikipedia search failed:', error);
    return [];
  }
}

// Fallback: Try to use Serper API if available (requires API key in env)
async function trySerperAPI(query: string, maxResults: number): Promise<SearchResult[]> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query, num: maxResults }),
    });

    const data = await response.json();
    if (data.organic && Array.isArray(data.organic)) {
      return data.organic.map((item: any) => ({
        title: item.title,
        description: item.snippet,
        url: item.link,
        source: 'Serper'
      }));
    }
    return [];
  } catch (error) {
    console.warn('Serper API search failed:', error);
    return [];
  }
}

// Extract key academic references from search results
export const extractAcademicReferences = (results: SearchResult[]): string[] => {
  return results
    .filter(r => r.source === 'Wikipedia' || r.source === 'Serper')
    .slice(0, 3)
    .map(r => `${r.title} - ${r.url}`);
};

// Create a formatted bibliography entry from search results
export const createBibliographyFromSearch = (results: SearchResult[]): string[] => {
  return results
    .slice(0, 5)
    .map(r => {
      // Simple citation format
      return `${r.title} (${r.source}). Retrieved from ${r.url}`;
    });
};
