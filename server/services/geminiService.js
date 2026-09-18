import { GoogleGenAI } from '@google/genai';
import { applicationTools } from './toolService.js';

// Active chat sessions memory store
const chatSessions = new Map();

export function getSessionHistory(sessionId) {
  if (!sessionId) return [];
  return chatSessions.get(sessionId) || [];
}

export function saveSessionHistory(sessionId, history) {
  if (!sessionId) return;
  chatSessions.set(sessionId, history.slice(-20)); // retain last 20 messages for context
}

export function clearSession(sessionId) {
  if (sessionId && chatSessions.has(sessionId)) {
    chatSessions.delete(sessionId);
    return true;
  }
  return false;
}

/**
 * System instruction tailored for Vittara AI Financial Advisor
 */
function getSystemPrompt(language = 'English') {
  let langInstruction = 'Respond strictly in clear, professional English.';
  if (language === 'Hindi') {
    langInstruction = 'Respond strictly in natural Hindi using the Devanagari script (हिंदी भाषा). Explain financial concepts with simplicity and clarity.';
  } else if (language === 'Hinglish') {
    langInstruction = 'Respond strictly in natural conversational Hinglish (Hindi written in Roman/English script, as commonly spoken in India). E.g. "Deductible wo amount hota hai jo claim hone par pehle aapko apni pocket se pay karna padta hai...". Keep tone friendly and accessible.';
  }

  return `You are Vittara AI, an advanced, trustworthy financial intelligence advisor and loan/insurance specialist.
Your role:
1. Explain financial terms (APR, Deductible, Premium, Tenure, Processing Fee, Waiting Period, Coverage, Exclusions, etc.) accurately with intuitive analogies and real-world Indian finance examples (₹ / Lakhs).
2. Assist users with loan eligibility, EMI calculations, and transparent loan product comparisons.
3. Provide insurance insights covering coverage, deductibles, waiting periods, sub-limits, and exclusions.
4. LANGUAGE DIRECTIVE: ${langInstruction}
5. ACCURACY & INTEGRITY: Never invent or hallucinate financial numbers or loan terms. If financial figures or document details are not available or not found, explicitly state: "Not found in document" or "Information not available".
6. TOOL USAGE: When structured tool data is provided in context, use those exact figures to craft your response.`;
}

/**
 * Pattern-based intent detection for tool pre-orchestration
 */
async function detectAndExecuteTools(userMessage) {
  const msg = userMessage.toLowerCase();
  const toolResults = [];

  // 1. Term Explainer Intent
  const termMatches = [
    'apr', 'deductible', 'premium', 'tenure', 'processing fee',
    'waiting period', 'coverage', 'exclusions', 'co-pay', 'pre-closure', 'ltv', 'ncb'
  ];
  for (const t of termMatches) {
    if (msg.includes(t)) {
      const res = await applicationTools.explain_term({ term: t });
      if (res.success) {
        toolResults.push({ tool: 'explain_term', result: res.data });
        break;
      }
    }
  }

  // 2. EMI Calculation Intent
  const amountMatch = msg.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:lakh|lacs|k)?/i);
  const rateMatch = msg.match(/(\d+(?:\.\d+)?)\s*%/);
  const tenureMatch = msg.match(/(\d+)\s*(?:months|month|yrs|years|yr|y)/i);

  if ((msg.includes('emi') || msg.includes('calculate') || msg.includes('loan')) && (amountMatch || rateMatch || tenureMatch)) {
    let principal = 200000;
    if (amountMatch) {
      let raw = amountMatch[1].replace(/,/g, '');
      let num = parseFloat(raw);
      if (/lakh|lac/i.test(msg)) num = num * 100000;
      else if (/k/i.test(msg) && num < 1000) num = num * 1000;
      if (num >= 5000) principal = num;
    }
    let rate = rateMatch ? parseFloat(rateMatch[1]) : 10.5;
    let tenure = tenureMatch ? parseInt(tenureMatch[1]) : 36;
    if (/yr|year/i.test(msg) && tenureMatch && parseInt(tenureMatch[1]) <= 30) {
      tenure = parseInt(tenureMatch[1]) * 12;
    }

    const emiRes = await applicationTools.calculate_emi({
      principal,
      interestRate: rate,
      tenureMonths: tenure
    });
    if (emiRes.success) {
      toolResults.push({ tool: 'calculate_emi', result: emiRes.data });
    }
  }

  // 3. Insurance Intent
  if (msg.includes('insurance') || msg.includes('policy') || msg.includes('mediclaim') || msg.includes('health cover')) {
    let cat = 'All';
    if (msg.includes('health') || msg.includes('medical')) cat = 'Health';
    else if (msg.includes('life') || msg.includes('term')) cat = 'Term Life';
    else if (msg.includes('motor') || msg.includes('car') || msg.includes('bike')) cat = 'Motor';
    else if (msg.includes('critical')) cat = 'Critical Illness';

    const insRes = await applicationTools.lookup_insurance({ category: cat });
    if (insRes.success && insRes.data.length > 0) {
      toolResults.push({ tool: 'lookup_insurance', result: insRes.data.slice(0, 3) });
    }
  }

  // 4. Compare Intent
  if (msg.includes('compare') || msg.includes('comparison') || (msg.includes('sbi') && msg.includes('hdfc'))) {
    const compRes = await applicationTools.compare_loans({ loanAmount: 200000, tenureMonths: 36 });
    if (compRes.success) {
      toolResults.push({ tool: 'compare_loans', result: compRes.data });
    }
  }

  return toolResults;
}

/**
 * Intelligent deterministic fallback response when Gemini is not reachable or API key is absent
 */
function generateDeterministicResponse(message, toolResults, language = 'English') {
  const msg = message.toLowerCase();

  // If tool data was found, format it in the target language
  if (toolResults.length > 0) {
    const primary = toolResults[0];

    if (primary.tool === 'explain_term') {
      const t = primary.result;
      if (language === 'Hindi') {
        return `### ${t.term}\n\n${t.hindiExplanation}\n\n**उदाहरण:** ${t.example}\n\n**सरल उपमा (Analogy):** ${t.analogy}`;
      } else if (language === 'Hinglish') {
        return `### ${t.term}\n\n${t.hinglishExplanation}\n\n**Example:** ${t.example}\n\n**Simple Analogy:** ${t.analogy}`;
      } else {
        return `### ${t.term}\n\n${t.fullExplanation}\n\n**Example:** ${t.example}\n\n**Analogy:** ${t.analogy}`;
      }
    }

    if (primary.tool === 'calculate_emi') {
      const e = primary.result;
      if (language === 'Hindi') {
        return `### ईएमआई गणना (EMI Calculation)\n\n- **ऋण राशि (Loan Amount):** ₹${e.principal.toLocaleString('en-IN')}\n- **ब्याज दर (Interest Rate):** ${e.annualInterestRate}%\n- **अवधि (Tenure):** ${e.tenureMonths} महीने\n\n**मासिक ईएमआई:** ₹${e.monthlyEmi.toLocaleString('en-IN')}\n**कुल ब्याज:** ₹${e.totalInterest.toLocaleString('en-IN')}\n**कुल भुगतान:** ₹${e.totalPayment.toLocaleString('en-IN')}\n**प्रोसेसिंग फीस:** ₹${e.processingFee.toLocaleString('en-IN')}`;
      } else if (language === 'Hinglish') {
        return `### EMI Calculation Summary\n\n- **Loan Amount:** ₹${e.principal.toLocaleString('en-IN')}\n- **Interest Rate:** ${e.annualInterestRate}% p.a.\n- **Tenure:** ${e.tenureMonths} months\n\n**Monthly EMI:** ₹${e.monthlyEmi.toLocaleString('en-IN')}\n**Total Interest:** ₹${e.totalInterest.toLocaleString('en-IN')}\n**Total Payment:** ₹${e.totalPayment.toLocaleString('en-IN')}\n**Processing Fee:** ₹${e.processingFee.toLocaleString('en-IN')}`;
      } else {
        return `### EMI Calculation Summary\n\n- **Principal Amount:** ₹${e.principal.toLocaleString('en-IN')}\n- **Interest Rate:** ${e.annualInterestRate}% p.a.\n- **Tenure:** ${e.tenureMonths} months\n\n**Monthly EMI:** ₹${e.monthlyEmi.toLocaleString('en-IN')}\n**Total Interest Payable:** ₹${e.totalInterest.toLocaleString('en-IN')}\n**Total Amount Payable:** ₹${e.totalPayment.toLocaleString('en-IN')}\n**Processing Fee:** ₹${e.processingFee.toLocaleString('en-IN')}`;
      }
    }

    if (primary.tool === 'lookup_insurance') {
      const list = primary.result;
      const items = list.map(i => `- **${i.name}** (${i.provider}): Coverage ₹${(i.coverage / 100000).toFixed(1)} Lakhs, Annual Premium ₹${i.premium.toLocaleString('en-IN')}, Deductible: ₹${i.deductible.toLocaleString('en-IN')}`).join('\n');
      return `### Demo Insurance Options\n\n${items}\n\n*All plans loaded from database records.*`;
    }
  }

  // Greetings or general questions
  if (/hi|hello|namaste|hey/i.test(msg)) {
    if (language === 'Hindi') {
      return 'नमस्ते! मैं विट्टारा एआई (Vittara AI) हूँ, आपका वित्तीय सलाहकार। मैं आपको लोन ईएमआई, वित्तीय शब्दों (जैसे Deductible, APR), और बीमा योजनाओं को समझने में मदद कर सकता हूँ। आप क्या जानना चाहते हैं?';
    } else if (language === 'Hinglish') {
      return 'Namaste! Main Vittara AI hoon, aapka personal financial assistant. Main aapko loan eligibility, EMI calculation, insurance products, aur financial terms (jaise Deductible, APR) samjhane mein help kar sakta hoon. Aap kya explore karna chahte hain?';
    } else {
      return 'Hello! I am Vittara AI, your personal financial assistant. I can help you calculate EMIs, compare loan products, understand insurance coverage and deductibles, or explain financial terms. How can I assist you today?';
    }
  }

  if (language === 'Hindi') {
    return 'विट्टारा एआई आपके वित्तीय प्रश्नों में मदद के लिए तैयार है। आप किसी भी वित्तीय शब्द (जैसे Deductible, APR), लोन ईएमआई या बीमा के बारे में पूछ सकते हैं।';
  } else if (language === 'Hinglish') {
    return 'Vittara AI aapki financial journey mein help karne ke liye ready hai. Aap kisi bhi financial term (Deductible, APR), loan EMI ya insurance details ke bare mein pooch sakte hain!';
  } else {
    return 'Vittara AI is ready to assist you. You can ask about any financial term (e.g., Deductible, APR, Tenure), calculate an EMI, compare loans, or check insurance policies.';
  }
}

/**
 * Main Gemini Chat & Orchestration handler
 */
export async function sendChatMessage({ message, sessionId, language = 'English', customApiKey = null, contextData = null }) {
  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new Error('Please enter a valid message.');
  }

  const effectiveApiKey = (customApiKey && customApiKey.trim()) || process.env.GEMINI_API_KEY;
  const history = getSessionHistory(sessionId);

  // Step 1: AI Orchestrator executes application tools
  const toolResults = await detectAndExecuteTools(message);

  let fullPrompt = `User Query: "${message.trim()}"\nActive Language: ${language}`;

  if (contextData) {
    fullPrompt += `\nCurrent User Financial Context: ${JSON.stringify(contextData)}`;
  }

  if (toolResults.length > 0) {
    fullPrompt += `\nApplication Tool Execution Results:\n${JSON.stringify(toolResults, null, 2)}`;
  }

  // If no Gemini API Key is available, use verified deterministic financial generator
  if (!effectiveApiKey) {
    console.log('[GeminiService] No GEMINI_API_KEY detected in environment. Using deterministic fallback.');
    const replyText = generateDeterministicResponse(message, toolResults, language);
    
    // Save to history
    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: replyText });
    saveSessionHistory(sessionId, history);

    return {
      text: replyText,
      language,
      sessionId,
      toolCalls: toolResults.map(t => t.tool),
      source: 'local_orchestrator',
      warning: 'Live Gemini API key not set. Running with built-in financial knowledge base.'
    };
  }

  // Step 2: Call Gemini 3.8 Flash via @google/genai SDK
  try {
    const ai = new GoogleGenAI({ apiKey: effectiveApiKey });
    const systemInstruction = getSystemPrompt(language);

    // Build contents with recent history turns
    const contents = [];
    for (const h of history.slice(-6)) {
      contents.push({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: fullPrompt }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: { parts: [{ text: systemInstruction }] },
        temperature: 0.3,
        maxOutputTokens: 1200
      }
    });

    const replyText = response.text || 'Response received from Vittara AI.';

    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: replyText });
    saveSessionHistory(sessionId, history);

    return {
      text: replyText,
      language,
      sessionId,
      toolCalls: toolResults.map(t => t.tool),
      source: 'gemini-3.8-flash'
    };
  } catch (error) {
    console.error('[GeminiService] Gemini API call error:', error.message);
    
    // Check if error is network/rate limit, provide required fallback message or local handler
    if (error.status === 401 || error.status === 403 || error.message.includes('API key')) {
      return {
        text: 'Vittara AI is temporarily unavailable. Please verify your GEMINI_API_KEY or try again.',
        language,
        sessionId,
        error: true,
        source: 'error_fallback'
      };
    }

    // Default error handling as specified in prompt: "Vittara AI is temporarily unavailable. Please try again."
    const deterministic = generateDeterministicResponse(message, toolResults, language);
    return {
      text: deterministic || 'Vittara AI is temporarily unavailable. Please try again.',
      language,
      sessionId,
      toolCalls: toolResults.map(t => t.tool),
      source: 'fallback_handler',
      note: 'Vittara AI is temporarily unavailable. Please try again.'
    };
  }
}

/**
 * Direct Gemini explanation for Financial Terms
 */
export async function explainTermWithGemini({ term, language = 'English', customApiKey = null, dbData = null }) {
  const effectiveApiKey = (customApiKey && customApiKey.trim()) || process.env.GEMINI_API_KEY;

  if (!effectiveApiKey) {
    if (dbData) {
      if (language === 'Hindi') {
        return {
          explanation: dbData.hindiExplanation,
          example: dbData.example,
          analogy: dbData.analogy,
          source: 'database'
        };
      } else if (language === 'Hinglish') {
        return {
          explanation: dbData.hinglishExplanation,
          example: dbData.example,
          analogy: dbData.analogy,
          source: 'database'
        };
      } else {
        return {
          explanation: dbData.fullExplanation,
          example: dbData.example,
          analogy: dbData.analogy,
          source: 'database'
        };
      }
    }
    return {
      explanation: 'Vittara AI is temporarily unavailable. Please try again.',
      source: 'unavailable'
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: effectiveApiKey });
    const prompt = `Explain the financial term "${term}" clearly in ${language === 'Hindi' ? 'Hindi (Devanagari)' : language === 'Hinglish' ? 'Hinglish (conversational Hindi in Roman script)' : 'English'}.
${dbData ? `Verified Database Baseline:\n- Definition: ${dbData.shortDefinition}\n- Full details: ${dbData.fullExplanation}\n- Example: ${dbData.example}\n- Analogy: ${dbData.analogy}` : ''}

Format your response with:
1. Short Definition
2. Detailed Explanation
3. Real-world Indian Financial Example (₹ / Lakhs)
4. Everyday Analogy`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.2,
        maxOutputTokens: 800
      }
    });

    return {
      explanation: response.text,
      source: 'gemini-3.8-flash'
    };
  } catch (err) {
    console.warn(`[GeminiService] explainTerm error: ${err.message}`);
    if (dbData) {
      return {
        explanation: language === 'Hindi' ? dbData.hindiExplanation : language === 'Hinglish' ? dbData.hinglishExplanation : dbData.fullExplanation,
        example: dbData.example,
        analogy: dbData.analogy,
        source: 'database_fallback'
      };
    }
    return {
      explanation: 'Vittara AI is temporarily unavailable. Please try again.',
      source: 'error'
    };
  }
}

/**
 * Direct Gemini analysis for Document Content
 */
export async function analyzeDocumentWithGemini({ documentText, language = 'English', customApiKey = null }) {
  const effectiveApiKey = (customApiKey && customApiKey.trim()) || process.env.GEMINI_API_KEY;

  if (!effectiveApiKey) {
    return null; // Will trigger deterministic document fallback
  }

  try {
    const ai = new GoogleGenAI({ apiKey: effectiveApiKey });
    const { buildDocumentAnalysisPrompt } = await import('./documentService.js');
    const prompt = buildDocumentAnalysisPrompt(documentText, language);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.1, // Strict factual extraction
        maxOutputTokens: 1500
      }
    });

    return {
      analysis: response.text,
      source: 'gemini-3.8-flash'
    };
  } catch (err) {
    console.error(`[GeminiService] Document analysis error: ${err.message}`);
    return null;
  }
}
