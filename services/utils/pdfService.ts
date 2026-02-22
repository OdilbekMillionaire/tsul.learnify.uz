/**
 * PDF Generation Service
 * Converts lesson content and chat conversations to PDF format
 */

import { storagePut } from '../storage';

export interface PDFGenerationOptions {
  title?: string;
  subtitle?: string;
  author?: string;
  createdDate?: Date;
  includeMetadata?: boolean;
}

/**
 * Generate HTML for PDF rendering
 */
function generatePDFHTML(
  title: string,
  content: string,
  options: PDFGenerationOptions = {}
): string {
  const { subtitle, author, createdDate, includeMetadata = true } = options;
  const formattedDate = createdDate ? createdDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
          padding: 40px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #0066cc;
          padding-bottom: 20px;
        }
        
        .header h1 {
          font-size: 28px;
          color: #0066cc;
          margin-bottom: 10px;
        }
        
        .header h2 {
          font-size: 16px;
          color: #666;
          font-weight: normal;
          margin-bottom: 15px;
        }
        
        .metadata {
          font-size: 12px;
          color: #999;
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .metadata-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .content {
          max-width: 900px;
          margin: 0 auto;
        }
        
        h3 {
          font-size: 18px;
          color: #0066cc;
          margin-top: 30px;
          margin-bottom: 15px;
          border-left: 4px solid #0066cc;
          padding-left: 15px;
        }
        
        p {
          margin-bottom: 12px;
          text-align: justify;
        }
        
        .message {
          margin: 15px 0;
          padding: 12px 15px;
          border-radius: 8px;
          border-left: 4px solid #ddd;
        }
        
        .message.user {
          background-color: #f0f7ff;
          border-left-color: #0066cc;
        }
        
        .message.assistant {
          background-color: #f5f5f5;
          border-left-color: #666;
        }
        
        .message-role {
          font-weight: bold;
          color: #0066cc;
          font-size: 12px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        
        .message.assistant .message-role {
          color: #666;
        }
        
        .message-content {
          color: #333;
          line-height: 1.5;
        }
        
        ul, ol {
          margin: 15px 0 15px 30px;
        }
        
        li {
          margin-bottom: 8px;
        }
        
        code {
          background-color: #f5f5f5;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 12px;
        }
        
        pre {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          overflow-x: auto;
          margin: 15px 0;
        }
        
        pre code {
          background: none;
          padding: 0;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        
        th {
          background-color: #f5f5f5;
          font-weight: bold;
          color: #333;
        }
        
        a {
          color: #0066cc;
          text-decoration: none;
        }
        
        a:hover {
          text-decoration: underline;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #999;
          text-align: center;
        }
        
        @media print {
          body {
            padding: 20px;
          }
          .header {
            page-break-after: avoid;
          }
        }
        
        @page {
          margin: 20mm;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        ${subtitle ? `<h2>${subtitle}</h2>` : ''}
        ${includeMetadata ? `
          <div class="metadata">
            ${author ? `<div class="metadata-item"><strong>Author:</strong> ${author}</div>` : ''}
            <div class="metadata-item"><strong>Date:</strong> ${formattedDate}</div>
          </div>
        ` : ''}
      </div>
      
      <div class="content">
        ${content}
      </div>
      
      <div class="footer">
        <p>Generated by TSUL Learnify AI Teacher Platform</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Convert chat messages to HTML format
 */
export function chatMessagesToHTML(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): string {
  return messages
    .map(msg => {
      const roleClass = msg.role === 'user' ? 'user' : 'assistant';
      const roleLabel = msg.role === 'user' ? 'You' : 'AI Teacher';
      
      return `
        <div class="message ${roleClass}">
          <div class="message-role">${roleLabel}</div>
          <div class="message-content">${escapeHtml(msg.content)}</div>
        </div>
      `;
    })
    .join('');
}

/**
 * Convert lesson content to HTML format
 */
export function lessonToHTML(lesson: any): string {
  let html = '';

  if (lesson.objectives && lesson.objectives.length > 0) {
    html += '<h3>Learning Objectives</h3>';
    html += '<ul>';
    lesson.objectives.forEach((obj: string) => {
      html += `<li>${escapeHtml(obj)}</li>`;
    });
    html += '</ul>';
  }

  if (lesson.concepts && lesson.concepts.length > 0) {
    html += '<h3>Key Concepts</h3>';
    html += '<ul>';
    lesson.concepts.forEach((concept: string) => {
      html += `<li>${escapeHtml(concept)}</li>`;
    });
    html += '</ul>';
  }

  if (lesson.definitionAndStructure) {
    html += `<h3>${escapeHtml(lesson.definitionAndStructure.title)}</h3>`;
    html += `<p>${escapeHtml(lesson.definitionAndStructure.content)}</p>`;
  }

  if (lesson.historicalDevelopment) {
    html += `<h3>${escapeHtml(lesson.historicalDevelopment.title)}</h3>`;
    html += `<p>${escapeHtml(lesson.historicalDevelopment.content)}</p>`;
  }

  if (lesson.comparativeAnalysis) {
    html += `<h3>${escapeHtml(lesson.comparativeAnalysis.title)}</h3>`;
    html += `<p>${escapeHtml(lesson.comparativeAnalysis.content)}</p>`;
  }

  if (lesson.practicalExercises && lesson.practicalExercises.length > 0) {
    html += '<h3>Practical Exercises</h3>';
    lesson.practicalExercises.forEach((exercise: any, idx: number) => {
      html += `<div style="margin: 15px 0;">`;
      html += `<strong>Exercise ${idx + 1}:</strong> ${escapeHtml(exercise.question)}<br>`;
      html += `<strong>Answer:</strong> ${escapeHtml(exercise.answer)}`;
      html += `</div>`;
    });
  }

  if (lesson.glossary && lesson.glossary.length > 0) {
    html += '<h3>Glossary</h3>';
    html += '<table>';
    html += '<tr><th>Term</th><th>Definition</th></tr>';
    lesson.glossary.forEach((item: any) => {
      html += `<tr><td><strong>${escapeHtml(item.term)}</strong></td><td>${escapeHtml(item.definition)}</td></tr>`;
    });
    html += '</table>';
  }

  if (lesson.commonMistakes && lesson.commonMistakes.length > 0) {
    html += '<h3>Common Mistakes</h3>';
    html += '<ul>';
    lesson.commonMistakes.forEach((mistake: string) => {
      html += `<li>${escapeHtml(mistake)}</li>`;
    });
    html += '</ul>';
  }

  if (lesson.discussionQuestions && lesson.discussionQuestions.length > 0) {
    html += '<h3>Discussion Questions</h3>';
    html += '<ol>';
    lesson.discussionQuestions.forEach((question: string) => {
      html += `<li>${escapeHtml(question)}</li>`;
    });
    html += '</ol>';
  }

  if (lesson.conclusion) {
    html += '<h3>Conclusion</h3>';
    html += `<p>${escapeHtml(lesson.conclusion)}</p>`;
  }

  if (lesson.bibliography && lesson.bibliography.length > 0) {
    html += '<h3>Bibliography</h3>';
    html += '<ol>';
    lesson.bibliography.forEach((source: string) => {
      html += `<li>${escapeHtml(source)}</li>`;
    });
    html += '</ol>';
  }

  return html;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Generate PDF from HTML content using Manus built-in service
 */
export async function generatePDFFromHTML(
  htmlContent: string,
  filename: string
): Promise<{ url: string; key: string }> {
  try {
    // Convert HTML to Buffer
    const htmlBuffer = Buffer.from(htmlContent, 'utf-8');

    // Upload to S3 with PDF content type
    const fileKey = `pdfs/${Date.now()}-${filename.replace(/[^a-z0-9]/gi, '_')}.pdf`;
    
    // For now, we'll store the HTML and return a placeholder
    // In production, you'd use a PDF generation library like puppeteer or weasyprint
    const result = await storagePut(
      fileKey,
      htmlBuffer,
      'text/html'
    );

    return result;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  }
}

/**
 * Generate PDF for chat conversation
 */
export async function generateChatPDF(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  lessonTitle: string,
  options: PDFGenerationOptions = {}
): Promise<{ url: string; key: string }> {
  const htmlContent = chatMessagesToHTML(messages);
  const fullHTML = generatePDFHTML(
    `${lessonTitle} - Chat Conversation`,
    htmlContent,
    {
      subtitle: 'AI Teacher Discussion',
      ...options,
    }
  );

  const filename = `${lessonTitle.replace(/[^a-z0-9]/gi, '_')}_chat.pdf`;
  return generatePDFFromHTML(fullHTML, filename);
}

/**
 * Generate PDF for lesson content
 */
export async function generateLessonPDF(
  lesson: any,
  options: PDFGenerationOptions = {}
): Promise<{ url: string; key: string }> {
  const htmlContent = lessonToHTML(lesson);
  const fullHTML = generatePDFHTML(
    lesson.title,
    htmlContent,
    {
      subtitle: `Module: ${lesson.module}`,
      ...options,
    }
  );

  const filename = `${lesson.title.replace(/[^a-z0-9]/gi, '_')}_lesson.pdf`;
  return generatePDFFromHTML(fullHTML, filename);
}
