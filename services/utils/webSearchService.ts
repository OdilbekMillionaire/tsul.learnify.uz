/**
 * Web Search Service
 * Integrates with Manus built-in data API for web search capabilities
 * Fetches relevant sources to enrich lesson content with current information
 */

import { ENV } from '../_core/env';

const { forgeApiUrl, forgeApiKey } = ENV;

export interface SearchResult {
  title: string;
  url: string;
  domain: string;
  snippet: string;
  relevanceScore: number;
}

/**
 * Search the web for information related to a lesson topic
 * Uses Manus built-in data API for web search
 */
export async function searchWeb(
  query: string,
  maxResults: number = 5
): Promise<SearchResult[]> {
  try {
    const response = await fetch(`${forgeApiUrl}/data_api/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${forgeApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        search_type: 'web',
        max_results: maxResults,
      }),
    });

    if (!response.ok) {
      console.error(`Web search failed: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json() as any;
    
    // Transform API response to our SearchResult format
    if (Array.isArray(data.results)) {
      return data.results.map((result: any) => ({
        title: result.title || '',
        url: result.url || '',
        domain: new URL(result.url || 'https://example.com').hostname || '',
        snippet: result.snippet || result.description || '',
        relevanceScore: result.relevance_score || 0.5,
      }));
    }

    return [];
  } catch (error) {
    console.error('Web search error:', error);
    return [];
  }
}

/**
 * Search for academic sources related to a topic
 * Focuses on scholarly articles and credible sources
 */
export async function searchAcademicSources(
  topic: string,
  module: string,
  maxResults: number = 5
): Promise<SearchResult[]> {
  const query = `${topic} ${module} academic research scholarly`;
  return searchWeb(query, maxResults);
}

/**
 * Search for case law and legal precedents
 * Useful for law-related lessons
 */
export async function searchLegalPrecedents(
  topic: string,
  jurisdiction: string = 'Uzbekistan',
  maxResults: number = 5
): Promise<SearchResult[]> {
  const query = `${topic} case law precedent ${jurisdiction} court decision`;
  return searchWeb(query, maxResults);
}

/**
 * Search for practical examples and applications
 */
export async function searchPracticalExamples(
  topic: string,
  maxResults: number = 5
): Promise<SearchResult[]> {
  const query = `${topic} practical example application real-world`;
  return searchWeb(query, maxResults);
}

/**
 * Batch search for multiple aspects of a topic
 */
export async function searchTopicComprehensively(
  topic: string,
  module: string,
  options: {
    includeAcademic?: boolean;
    includeLegal?: boolean;
    includePractical?: boolean;
    maxResultsPerCategory?: number;
  } = {}
): Promise<SearchResult[]> {
  const {
    includeAcademic = true,
    includeLegal = true,
    includePractical = true,
    maxResultsPerCategory = 3,
  } = options;

  const allResults: SearchResult[] = [];
  const seenUrls = new Set<string>();

  const addResults = (results: SearchResult[]) => {
    results.forEach(result => {
      if (!seenUrls.has(result.url)) {
        seenUrls.add(result.url);
        allResults.push(result);
      }
    });
  };

  // Parallel searches for better performance
  const searches = [];

  if (includeAcademic) {
    searches.push(searchAcademicSources(topic, module, maxResultsPerCategory));
  }

  if (includeLegal) {
    searches.push(searchLegalPrecedents(topic, 'Uzbekistan', maxResultsPerCategory));
  }

  if (includePractical) {
    searches.push(searchPracticalExamples(topic, maxResultsPerCategory));
  }

  const results = await Promise.all(searches);
  results.forEach(addResults);

  // Sort by relevance score
  return allResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
}
