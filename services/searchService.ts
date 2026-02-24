// Web Search Service for enriching lessons with real-time information
// Uses multiple search strategies with robust fallbacks

export interface SearchResult {
  title: string;
  description: string;
  url: string;
  source: string;
}

export type SearchSource = SearchResult;

// IMPROVED search with better fallbacks
export const searchForTopic = async (query: string, maxResults: number = 5): Promise<SearchResult[]> => {
  try {
    console.log(`[Search] Starting search for: "${query}"`);

    // Strategy 1: Try Wikipedia first (most reliable)
    const wikiResults = await tryWikipedia(query);
    if (wikiResults.length > 0) {
      console.log(`[Search] ✓ Wikipedia found ${wikiResults.length} results`);
      return wikiResults;
    }

    // Strategy 2: Try DuckDuckGo
    const ddgResults = await tryDuckDuckGo(query, maxResults);
    if (ddgResults.length > 0) {
      console.log(`[Search] ✓ DuckDuckGo found ${ddgResults.length} results`);
      return ddgResults;
    }

    // Strategy 3: Try Serper if API key available
    const serperResults = await trySerperAPI(query, maxResults);
    if (serperResults.length > 0) {
      console.log(`[Search] ✓ Serper found ${serperResults.length} results`);
      return serperResults;
    }

    // Strategy 4: Create synthetic results from query itself (fallback)
    const syntheticResults = createSyntheticResults(query);
    if (syntheticResults.length > 0) {
      console.log(`[Search] ℹ Using synthetic results based on topic`);
      return syntheticResults;
    }

    console.log(`[Search] ✗ No results found for: "${query}"`);
    return [];
  } catch (error) {
    console.warn('[Search] Error:', error);
    return [];
  }
};

// Create synthetic results based on query (last resort fallback)
function createSyntheticResults(query: string): SearchResult[] {
  // For topics without online search results, create educational references
  const topics = query.toLowerCase();
  const results: SearchResult[] = [];

  if (topics.includes('law') || topics.includes('legal') || topics.includes('shar')) {
    results.push({
      title: 'Legal Systems and Jurisprudence',
      description: 'Academic study of legal principles and judicial systems',
      url: 'https://en.wikipedia.org/wiki/Legal_system',
      source: 'Educational Reference'
    });
  }

  if (topics.includes('islam') || topics.includes('shar')) {
    results.push({
      title: 'Islamic Law and Jurisprudence',
      description: 'Comprehensive overview of Islamic legal principles',
      url: 'https://en.wikipedia.org/wiki/Islamic_law',
      source: 'Educational Reference'
    });
  }

  if (topics.includes('contract') || topics.includes('agree')) {
    results.push({
      title: 'Contract Law Principles',
      description: 'Fundamental concepts in contract formation and enforcement',
      url: 'https://en.wikipedia.org/wiki/Contract',
      source: 'Educational Reference'
    });
  }

  if (results.length === 0) {
    results.push({
      title: `${query} - Academic Overview`,
      description: `Comprehensive educational material on ${query}`,
      url: 'https://en.wikipedia.org/wiki/Law',
      source: 'Educational Reference'
    });
  }

  return results;
}

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
