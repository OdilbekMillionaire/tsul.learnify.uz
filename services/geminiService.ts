import { GoogleGenAI, Type, Schema } from "@google/genai";
import OpenAI from "openai";
import { LessonFormState, LessonResponse, Language, LessonFocus, EnhancedLessonResponse, SourceContent, RAGContext, CredibilityMetrics, LessonSourceAttributions } from '../types';
import { fetchAcademicSources, calculateCredibilityScore, getSourceBreakdown } from './academicSourceService';
import { searchForTopic, createBibliographyFromSearch } from './searchService';

// ==========================================
// CONFIGURATION & CLIENT INITIALIZATION
// ==========================================

// Helper for delay
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 1. Google Gemini Client (Always initialized as primary)
const geminiApiKey = process.env.API_KEY || '';
const googleAI = new GoogleGenAI({ apiKey: geminiApiKey });

// 2. OpenAI Client (Lazy Initialized)
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OpenAI API Key is missing in environment variables");
  return new OpenAI({ 
    apiKey: apiKey, 
    dangerouslyAllowBrowser: true 
  });
};

// 3. Groq Client (Lazy Initialized)
const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Groq API Key is missing in environment variables");
  return new OpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });
};

// ==========================================
// SCHEMAS & PROMPTS
// ==========================================

// Base Schema Definitions
const courtCaseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    year: { type: Type.STRING },
    court: { type: Type.STRING },
    facts: { type: Type.STRING },
    legalIssue: { type: Type.STRING },
    holding: { type: Type.STRING },
    significance: { type: Type.STRING }
  },
  required: ['name', 'year', 'court', 'facts', 'legalIssue', 'holding', 'significance']
};

const doctrineSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    definition: { type: Type.STRING },
    origin: { type: Type.STRING },
    application: { type: Type.STRING },
    currentStatus: { type: Type.STRING }
  },
  required: ['name', 'definition', 'origin', 'application', 'currentStatus']
};

const contentSectionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    content: { type: Type.STRING }
  },
  required: ['title', 'content']
};

const getExpertPersona = (moduleName: string): string => {
  const m = moduleName.toLowerCase();
  if (m.includes('jinoyat') || m.includes('criminal')) return "a Senior Expert in Criminal Law & Criminology";
  if (m.includes('fuqarolik') || m.includes('civil')) return "a Distinguished Professor of Civil Law";
  if (m.includes('xalqaro') || m.includes('international')) return "a Scholar of International Law";
  if (m.includes('biznes') || m.includes('business')) return "a Corporate Law Consultant";
  return "a Senior Law Professor";
};

// ==========================================
// PROVIDER IMPLEMENTATIONS
// ==========================================

// --- PROVIDER 1: GOOGLE GEMINI ---
async function callGemini(prompt: string, schema: Schema, model: string): Promise<LessonResponse> {
  console.log(`Attempting Gemini (${model})...`);
  const response = await googleAI.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      temperature: 0.3,
    }
  });

  const text = response.text;
  if (!text) throw new Error("Gemini returned empty response");
  return JSON.parse(text) as LessonResponse;
}

// --- PROVIDER 2 & 3: OPENAI / GROQ ---
async function callOpenAICompatible(
  getClient: () => OpenAI, 
  providerName: string,
  model: string, 
  systemPrompt: string, 
  userPrompt: string
): Promise<LessonResponse> {
  console.log(`Attempting ${providerName} (${model})...`);
  
  // Initialize client only when called
  const client = getClient();

  const completion = await client.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    model: model,
    response_format: { type: "json_object" }, // Enforce JSON mode
    temperature: 0.3,
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error(`${providerName} returned empty response`);
  
  return JSON.parse(content) as LessonResponse;
}

// ==========================================
// MAIN GENERATION LOGIC
// ==========================================

export const generateLesson = async (form: LessonFormState, language: Language): Promise<LessonResponse> => {
  const persona = getExpertPersona(form.module);

  // RAG: Fetch academic sources for context enrichment (non-blocking)
  let ragContext: RAGContext = {
    sources: [],
    embeddings: [],
    credibilityScore: 0,
    officialSourcePercentage: 0
  };
  let searchResults: any[] = [];
  let searchBibliography: string[] = [];

  try {
    // Strategy 1: PRIORITY - Fetch academic sources from official/trusted platforms
    // This is the new RAG approach (Retrieval Augmented Generation)
    const academicSources = await fetchAcademicSources(
      form.topic,
      'uzbekistan',
      5 // max 5 sources
    );

    if (academicSources.length > 0) {
      ragContext.sources = academicSources;
      ragContext.credibilityScore = calculateCredibilityScore(academicSources);
      const breakdown = getSourceBreakdown(academicSources);
      ragContext.officialSourcePercentage = Math.round(
        ((breakdown.official + breakdown.academic) / academicSources.length) * 100
      );

      // Convert to searchResults format for backward compatibility
      searchResults = academicSources.map(s => ({
        title: s.title,
        description: s.excerpt,
        url: s.url,
        source: s.sourceType,
        badge: s.credibilityBadge
      }));

      searchBibliography = academicSources.map(s => `${s.title} (${s.sourceType.toUpperCase()}): ${s.url}`);

      console.log(`[RAG] Found ${searchResults.length} academic sources. Credibility score: ${ragContext.credibilityScore}%`);
    } else {
      // Strategy 2: FALLBACK - Use general web search if academic sources unavailable
      console.log('[RAG] No academic sources found, falling back to general web search...');
      const searchQueries = [form.topic, `${form.module} ${form.topic}`];
      const allResults = await Promise.all(
        searchQueries.map(q => searchForTopic(q, 2).catch(() => []))
      );
      searchResults = allResults.flat().slice(0, 3);
      searchBibliography = createBibliographyFromSearch(searchResults);

      // Convert to source content for consistency
      if (searchResults.length > 0) {
        ragContext.sources = searchResults.map((r, i) => ({
          sourceId: `web_${i}_${Date.now()}`,
          sourceType: 'educational' as const,
          title: r.title,
          url: r.url,
          relevanceScore: 50,
          excerpt: r.description || '',
          credibilityBadge: 'general' as const,
          fetchedAt: new Date()
        }));
        ragContext.credibilityScore = 40; // Lower score for general sources
        ragContext.officialSourcePercentage = 0;
      }
    }
  } catch (searchError) {
    console.warn('[RAG] Source enrichment failed (non-critical):', searchError);
  }

  // Construct Focus Instructions
  let focusInstruction = "";
  switch(form.focus) {
    case LessonFocus.THEORETICAL: focusInstruction = "Focus on legal dogmatics and philosophy."; break;
    case LessonFocus.PRACTICAL: focusInstruction = "Focus on drafting, procedural steps, and application."; break;
    case LessonFocus.CASE_BASED: focusInstruction = "Center the lesson around specific court precedents."; break;
    case LessonFocus.LEGISLATIVE: focusInstruction = "Focus on statutory interpretation of Codes."; break;
  }

  // Construct Requirements
  let structureReqs = "";
  if (form.structure.comparativeAnalysis) structureReqs += "- Include 'comparativeAnalysis' section.\n";
  if (form.structure.practicalExercises) structureReqs += "- Include 'practicalExercises'.\n";
  if (form.structure.glossary) structureReqs += "- Include 'glossary'.\n";
  if (form.structure.bibliography) structureReqs += "- Include 'bibliography'.\n";

  // Build Schema
  const requiredFields = ['title', 'module', 'objectives', 'concepts', 'definitionAndStructure', 'historicalDevelopment', 'commonMistakes', 'discussionQuestions', 'conclusion'];
  if (form.structure.comparativeAnalysis) requiredFields.push('comparativeAnalysis');
  if (form.structure.practicalExercises) requiredFields.push('practicalExercises');
  if (form.structure.glossary) requiredFields.push('glossary');
  if (form.structure.bibliography) requiredFields.push('bibliography');
  if (form.structure.caseLaw) requiredFields.push('courtCases');
  if (form.structure.doctrines) requiredFields.push('legalDoctrines');

  const lessonSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      module: { type: Type.STRING },
      objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
      concepts: { type: Type.ARRAY, items: { type: Type.STRING } },
      definitionAndStructure: contentSectionSchema,
      historicalDevelopment: contentSectionSchema,
      comparativeAnalysis: contentSectionSchema,
      practicalExercises: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, answer: { type: Type.STRING } }, required: ['question', 'answer'] } },
      glossary: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { term: { type: Type.STRING }, definition: { type: Type.STRING } }, required: ['term', 'definition'] } },
      bibliography: { type: Type.ARRAY, items: { type: Type.STRING } },
      courtCases: { type: Type.ARRAY, items: courtCaseSchema },
      legalDoctrines: { type: Type.ARRAY, items: doctrineSchema },
      commonMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
      discussionQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
      conclusion: { type: Type.STRING }
    },
    required: requiredFields
  };

  // RAG Context: Embed source content in prompt for better accuracy
  const ragPromptContext = ragContext.sources.length > 0
    ? `
    OFFICIAL ACADEMIC SOURCES FOR CONTEXT (Credibility Score: ${ragContext.credibilityScore}%):
    ${ragContext.sources.map((s, i) => `
    [Source ${i + 1}] ${s.title}
    Type: ${s.sourceType.toUpperCase()} | Badge: ${s.credibilityBadge}
    URL: ${s.url}
    Content Excerpt: ${s.excerpt}
    `).join('\n')}

    IMPORTANT: You MUST cite these sources in your lesson content using the format [Source: SourceTitle].
    Ensure academic credibility by referencing official sources whenever possible.
    `
    : '';

  const corePrompt = `
    Role: You are ${persona} at TSUL (Tashkent State University of Law).
    Task: Generate a high-fidelity, university-grade academic lesson with official source citations.
    Language: ${language} (STRICTLY).
    Module: ${form.module}
    Topic: ${form.topic}
    Level: ${form.level}

    ${ragPromptContext}

    Strategy: ${focusInstruction}

    Requirements:
    - Output strictly valid JSON.
    - Ensure court cases are real/historically accurate.
    - Use **bold** for emphasis and *italics* for technical terms (support markdown formatting).
    - Include numbered lists and bullet points using markdown syntax (-, 1. 2. etc.)
    - CITE SOURCES: When using information from the provided sources, cite them as [Source: SourceTitle]
    - If you cannot cite a claim from provided sources, be transparent about it
    ${structureReqs}
  `;

  // System Prompt for OpenAI/Groq (Needs Schema as text)
  const openAISystemPrompt = `
    You are a JSON-only API. You must return a JSON object matching this schema exactly:
    ${JSON.stringify(lessonSchema, null, 2)}
  `;

  // --- FALLBACK EXECUTION FLOW ---

  // 1. Try Gemini Pro
  try {
    const lesson = await callGemini(corePrompt, lessonSchema, 'gemini-3-pro-preview');

    // Enhance bibliography with search results if available
    if (searchBibliography.length > 0 && lesson.bibliography) {
      lesson.bibliography = [...new Set([...lesson.bibliography, ...searchBibliography])].slice(0, 15);
    } else if (searchBibliography.length > 0) {
      lesson.bibliography = searchBibliography;
    }

    // Add source links for display in UI
    if (searchResults.length > 0) {
      lesson.sourceLinks = searchResults;
    }

    // Enhance response with RAG metadata
    const enhancedLesson: EnhancedLessonResponse = {
      ...lesson,
      ragContext,
      credibilityMetrics: {
        officialSources: getSourceBreakdown(ragContext.sources).official,
        academicSources: getSourceBreakdown(ragContext.sources).academic,
        trustedSources: getSourceBreakdown(ragContext.sources).trusted,
        generalSources: getSourceBreakdown(ragContext.sources).general,
        credibilityScore: ragContext.credibilityScore,
        badges: ragContext.sources
          .filter(s => s.credibilityBadge === 'official')
          .map(s => `official_${s.sourceType}`)
      }
    };

    return enhancedLesson;
  } catch (err: any) {
    console.warn("Gemini Pro failed:", err.message);

    // 1b. Try Gemini Flash (Fast Fallback)
    try {
      if (err.message.includes('429') || err.message.includes('quota')) {
        console.warn("Quota hit. Trying Gemini Flash...");
        return await callGemini(corePrompt, lessonSchema, 'gemini-3-flash-preview');
      }
      throw err; // If not quota, throw to next provider
    } catch (geminiErr: any) {
      console.warn("All Gemini models failed. Switching to OpenAI...");
      
      // 2. Try OpenAI (GPT-4o)
      try {
        const lesson = await callOpenAICompatible(getOpenAIClient, "OpenAI", "gpt-4o", openAISystemPrompt, corePrompt);

        // Enhance bibliography with search results
        if (searchBibliography.length > 0 && lesson.bibliography) {
          lesson.bibliography = [...new Set([...lesson.bibliography, ...searchBibliography])].slice(0, 15);
        } else if (searchBibliography.length > 0) {
          lesson.bibliography = searchBibliography;
        }

        // Add source links for display in UI
        if (searchResults.length > 0) {
          lesson.sourceLinks = searchResults;
        }

        // Enhance response with RAG metadata
        const enhancedLesson: EnhancedLessonResponse = {
          ...lesson,
          ragContext,
          credibilityMetrics: {
            officialSources: getSourceBreakdown(ragContext.sources).official,
            academicSources: getSourceBreakdown(ragContext.sources).academic,
            trustedSources: getSourceBreakdown(ragContext.sources).trusted,
            generalSources: getSourceBreakdown(ragContext.sources).general,
            credibilityScore: ragContext.credibilityScore,
            badges: ragContext.sources
              .filter(s => s.credibilityBadge === 'official')
              .map(s => `official_${s.sourceType}`)
          }
        };

        return enhancedLesson;
      } catch (openaiErr: any) {
        console.warn("OpenAI failed:", openaiErr.message);
        console.warn("Switching to Groq...");

        // 3. Try Groq (Llama 3)
        try {
          // Llama 3.3 70b is excellent at JSON and complex reasoning
          const lesson = await callOpenAICompatible(getGroqClient, "Groq", "llama-3.3-70b-versatile", openAISystemPrompt, corePrompt);

          // Enhance bibliography with search results
          if (searchBibliography.length > 0 && lesson.bibliography) {
            lesson.bibliography = [...new Set([...lesson.bibliography, ...searchBibliography])].slice(0, 15);
          } else if (searchBibliography.length > 0) {
            lesson.bibliography = searchBibliography;
          }

          // Add source links for display in UI
          if (searchResults.length > 0) {
            lesson.sourceLinks = searchResults;
          }

          // Enhance response with RAG metadata
          const enhancedLesson: EnhancedLessonResponse = {
            ...lesson,
            ragContext,
            credibilityMetrics: {
              officialSources: getSourceBreakdown(ragContext.sources).official,
              academicSources: getSourceBreakdown(ragContext.sources).academic,
              trustedSources: getSourceBreakdown(ragContext.sources).trusted,
              generalSources: getSourceBreakdown(ragContext.sources).general,
              credibilityScore: ragContext.credibilityScore,
              badges: ragContext.sources
                .filter(s => s.credibilityBadge === 'official')
                .map(s => `official_${s.sourceType}`)
            }
          };

          return enhancedLesson;
        } catch (groqErr: any) {
          console.error("CRITICAL: All AI providers failed.");
          throw new Error("All AI services are currently unavailable. Please try again later.");
        }
      }
    }
  }
};

// ==========================================
// CHAT FUNCTIONALITY (ALSO WITH FALLBACK)
// ==========================================

export const chatWithAssistant = async (
  history: { role: 'user' | 'model'; content: string }[],
  currentMessage: string,
  lessonContext: LessonResponse,
  language: Language
) => {
  const persona = getExpertPersona(lessonContext.module);
  const systemContext = `
    You are ${persona}. Teaching: "${lessonContext.title}".
    Context: ${JSON.stringify(lessonContext.concepts)}.
    Language: ${language}.
    Keep answers concise.
  `;

  // 1. Try Gemini Flash (Best for Chat)
  try {
    const chat = googleAI.chats.create({
      model: 'gemini-3-flash-preview',
      config: { systemInstruction: systemContext },
      history: history.map(h => ({ role: h.role, parts: [{ text: h.content }] }))
    });
    const result = await chat.sendMessage({ message: currentMessage });
    return result.text || "";
  } catch (err) {
    console.warn("Gemini Chat failed, switching to Groq (Fastest fallback)...");

    // 2. Fallback to Groq (Llama 3 is very fast for chat)
    try {
        const groq = getGroqClient();
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemContext },
                ...history.map(h => ({ role: h.role === 'model' ? 'assistant' : 'user', content: h.content } as any)),
                { role: "user", content: currentMessage }
            ]
        });
        return completion.choices[0].message.content || "";
    } catch (groqErr) {
        console.warn("Groq Chat failed, switching to OpenAI...");
        
        // 3. Final Fallback to OpenAI (GPT-4o-mini for cost/speed)
        try {
            const openai = getOpenAIClient();
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini", 
                messages: [
                    { role: "system", content: systemContext },
                    ...history.map(h => ({ role: h.role === 'model' ? 'assistant' : 'user', content: h.content } as any)),
                    { role: "user", content: currentMessage }
                ]
            });
            return completion.choices[0].message.content || "";
        } catch (finalErr) {
            return "Error: Unable to connect to any AI assistant.";
        }
    }
  }
};