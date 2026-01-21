import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LessonFormState, LessonResponse, Language } from '../types';

// In a real Next.js App, this would be a server-side route handler to protect the API key.
// For this single-file export demo, we access it from process.env.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

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

export const generateLesson = async (form: LessonFormState, language: Language): Promise<LessonResponse> => {
  const modelId = 'gemini-3-pro-preview'; // High capability model for structured output

  // 1. Build Dynamic Prompt Requirements
  let structureReqs = "";
  if (form.structure.comparativeAnalysis) structureReqs += "- Include a 'comparativeAnalysis' section comparing this topic with other jurisdictions (e.g. Roman Law, UK, USA, Germany).\n";
  if (form.structure.practicalExercises) structureReqs += "- Include 'practicalExercises' with hypothetical legal scenarios and answers.\n";
  if (form.structure.glossary) structureReqs += "- Include a 'glossary' of key legal terms.\n";
  if (form.structure.bibliography) structureReqs += "- Include a 'bibliography' of standard textbooks or codes.\n";

  // 2. Build Dynamic Schema Validation
  // We strictly require fields if the user asked for them.
  const requiredFields = [
    'title', 
    'module', 
    'objectives', 
    'concepts', 
    'definitionAndStructure', 
    'historicalDevelopment', 
    'commonMistakes', 
    'discussionQuestions', 
    'conclusion'
  ];

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
      practicalExercises: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            answer: { type: Type.STRING }
          },
          required: ['question', 'answer']
        }
      },
      glossary: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            term: { type: Type.STRING },
            definition: { type: Type.STRING }
          },
          required: ['term', 'definition']
        }
      },
      bibliography: { type: Type.ARRAY, items: { type: Type.STRING } },
      courtCases: { type: Type.ARRAY, items: courtCaseSchema },
      legalDoctrines: { type: Type.ARRAY, items: doctrineSchema },
      commonMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
      discussionQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
      conclusion: { type: Type.STRING }
    },
    required: requiredFields
  };

  const prompt = `
    You are a Professor at TSUL (Tashkent State University of Law).
    Generate a university-grade academic lesson.
    
    Parameters:
    - Language: ${language} (STRICTLY OUTPUT IN THIS LANGUAGE)
    - Module: ${form.module}
    - Topic: ${form.topic}
    - Level: ${form.level}
    - Depth: ${form.depth}
    - Audience Simplicity: ${form.simplicity} (Adjust vocabulary and tone accordingly)
    - Lesson Focus: ${form.focus} (Ensure the content strongly aligns with this perspective)
    
    Structure Requirements:
    - Include strictly valid JSON matching the schema.
    - No markdown formatting outside the JSON string.
    - Ensure 'courtCases' are real, historically accurate cases relevant to the topic. If no specific cases exist, provide hypothetical examples labeled as such, but prefer real precedents.
    - Ensure 'legalDoctrines' are accurate legal theories.
    ${structureReqs}
    - Content should be educational, structured, and use academic legal terminology appropriate for the target language.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: lessonSchema,
        temperature: 0.3, // Low temperature for academic accuracy
      }
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");
    
    return JSON.parse(text) as LessonResponse;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

export const chatWithAssistant = async (
  history: { role: 'user' | 'model'; content: string }[],
  currentMessage: string,
  lessonContext: LessonResponse,
  language: Language
) => {
  const modelId = 'gemini-3-flash-preview'; // Faster model for chat
  
  const systemInstruction = `
    You are an AI Lecturer at TSUL. 
    You are currently teaching a lesson titled "${lessonContext.title}" from the module "${lessonContext.module}".
    
    Context of the lesson:
    ${JSON.stringify(lessonContext.concepts)}
    ${lessonContext.definitionAndStructure.content}
    
    Instructions:
    - Answer the student's question based strictly on the provided lesson context and general legal knowledge relevant to the topic.
    - Be helpful, encouraging, and academic.
    - Respond in the language: ${language}.
    - Keep answers concise (max 3 sentences unless asked to elaborate).
  `;

  try {
    const chat = ai.chats.create({
        model: modelId,
        config: {
            systemInstruction
        },
        history: history.map(h => ({
            role: h.role,
            parts: [{ text: h.content }]
        }))
    });

    const result = await chat.sendMessage({ message: currentMessage });
    return result.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "Error communicating with AI Assistant.";
  }
};