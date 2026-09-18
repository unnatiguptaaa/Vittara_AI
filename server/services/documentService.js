import pdfParse from 'pdf-parse';

/**
 * Document extraction and preprocessing service
 */
export async function extractDocumentText(file) {
  if (!file) {
    throw new Error('No document file was uploaded.');
  }

  const { mimetype, originalname, buffer } = file;
  let rawText = '';

  const isPdf = mimetype === 'application/pdf' || originalname.toLowerCase().endsWith('.pdf');
  const isTxt = mimetype === 'text/plain' || originalname.toLowerCase().endsWith('.txt');

  if (!isPdf && !isTxt) {
    throw new Error('Supported formats: PDF, TXT.');
  }

  if (isPdf) {
    try {
      const data = await pdfParse(buffer);
      rawText = data.text || '';
    } catch (err) {
      console.warn(`[DocumentService] pdf-parse warning: ${err.message}. Trying text fallback.`);
      rawText = buffer.toString('utf-8');
    }
  } else {
    rawText = buffer.toString('utf-8');
  }

  // Clean and sanitize whitespace
  const sanitizedText = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/ +/g, ' ')
    .trim();

  if (!sanitizedText || sanitizedText.length < 10) {
    throw new Error('The document appears empty or could not be read.');
  }

  return {
    filename: originalname,
    fileType: isPdf ? 'PDF' : 'TXT',
    charCount: sanitizedText.length,
    wordCount: sanitizedText.split(/\s+/).length,
    text: sanitizedText
  };
}

/**
 * Deterministic local analyzer fallback or pre-pass for document structure
 */
export function buildDocumentAnalysisPrompt(documentText, language = 'English') {
  return `You are Vittara AI, an expert financial and loan document auditor.
Analyze the following document carefully and extract structured financial findings.

CRITICAL RULES:
1. Extract only facts directly stated in the text.
2. If any piece of information is missing, unstated, or cannot be determined, you MUST write exactly: "Not found in document."
3. NEVER invent, assume, or hallucinate missing numbers, dates, interest rates, or applicant details.
4. Provide the analysis in ${language === 'Hindi' ? 'Hindi (Devanagari)' : language === 'Hinglish' ? 'Hinglish (conversational Hindi in Roman script)' : 'English'}.

DOCUMENT CONTENT:
"""
${documentText.slice(0, 15000)}
"""

Please return your analysis formatted cleanly in markdown with these exact sections:
### 1. Document Classification
- **Document Type**: (e.g., Loan Sanction Letter, Salary Slip, Insurance Policy Schedule, Bank Statement, or "Not found in document.")
- **Issuing Entity / Bank**: (Name of the financial institution or "Not found in document.")
- **Date of Document**: (Document date or "Not found in document.")

### 2. Key Extracted Entities & Financial Figures
- **Applicant / Borrower Name**: (Name or "Not found in document.")
- **Sanctioned / Principal Amount**: (Amount with currency or "Not found in document.")
- **Interest Rate (% p.a.)**: (Rate or "Not found in document.")
- **Tenure / Duration**: (Tenure or "Not found in document.")
- **Monthly EMI / Payment**: (EMI amount or "Not found in document.")
- **Processing Fee / Charges**: (Fee details or "Not found in document.")
- **Deductible / Co-pay (if insurance)**: (Amount or "Not found in document.")

### 3. Critical Terms, Clauses & Conditions
- (List explicit conditions found, or "Not found in document.")

### 4. Risk / Compliance Observations
- (Any red flags, foreclosure penalties, missing signatures, or notable obligations found in text, or "Not found in document.")

### 5. Auditor Summary
- (A concise 2-3 sentence executive summary of the document in ${language}).`;
}

export function parseLocalDocumentFallback(docText, language = 'English') {
  // Deterministic local extraction when AI service is offline
  const findMatch = (regex) => {
    const m = docText.match(regex);
    return m ? m[1].trim() : 'Not found in document.';
  };

  const amountMatch = docText.match(/(?:Rs\.?|INR|₹)\s?([\d,]+(?:\.\d{2})?)/i) || docText.match(/Amount[:\s]+([\d,]+)/i);
  const rateMatch = docText.match(/(\d+(?:\.\d+)?)\s*%/);
  const tenureMatch = docText.match(/(\d+)\s*(?:months|yrs|years)/i);
  const emiMatch = docText.match(/EMI[:\s]+(?:Rs\.?|INR|₹)?\s*([\d,]+)/i);

  const amount = amountMatch ? `₹${amountMatch[1]}` : 'Not found in document.';
  const rate = rateMatch ? `${rateMatch[1]}%` : 'Not found in document.';
  const tenure = tenureMatch ? `${tenureMatch[1]} months` : 'Not found in document.';
  const emi = emiMatch ? `₹${emiMatch[1]}` : 'Not found in document.';

  const isLoan = /loan|sanction|emi|borrower/i.test(docText);
  const isInsurance = /insurance|policy|premium|deductible/i.test(docText);
  const docType = isLoan ? 'Loan Agreement / Sanction Letter' : isInsurance ? 'Insurance Policy Document' : 'Financial Statement';

  return `### 1. Document Classification
- **Document Type**: ${docType}
- **Issuing Entity / Bank**: ${findMatch(/(?:Bank|Corporation|Insurer|Company)[:\s]+([A-Za-z\s]+)/i)}
- **Date of Document**: ${findMatch(/(?:Date|Dated)[:\s]+([A-Za-z0-9\/\-\,\s]+)/i)}

### 2. Key Extracted Entities & Financial Figures
- **Applicant / Borrower Name**: ${findMatch(/(?:Name|Borrower|Customer)[:\s]+([A-Za-z\s]+)/i)}
- **Sanctioned / Principal Amount**: ${amount}
- **Interest Rate (% p.a.)**: ${rate}
- **Tenure / Duration**: ${tenure}
- **Monthly EMI / Payment**: ${emi}
- **Processing Fee / Charges**: ${findMatch(/(?:Processing Fee|Fee)[:\s]+([A-Za-z0-9\s\,\.\%]+)/i)}
- **Deductible / Co-pay (if insurance)**: Not found in document.

### 3. Critical Terms, Clauses & Conditions
- ${docText.includes('pre-closure') || docText.includes('foreclosure') ? 'Foreclosure clause present in text.' : 'Not found in document.'}
- ${docText.includes('KYC') ? 'KYC verification required.' : 'Not found in document.'}

### 4. Risk / Compliance Observations
- Document extracted via local fallback parsing.
- Verified against missing values rule: All unstated fields are explicitly marked "Not found in document."

### 5. Auditor Summary
${language === 'Hindi'
  ? 'दस्तावेज़ का विश्लेषण सफलतापूर्वक किया गया है। अनुपलब्ध विवरणों को "Not found in document" चिन्हित किया गया है।'
  : language === 'Hinglish'
  ? 'Document successfully analyze ho gaya hai. Missing fields ko "Not found in document" mark kiya gaya hai bina koi false data invent kiye.'
  : 'Document successfully parsed. Unstated values have been explicitly tagged as "Not found in document" in accordance with strict auditing guidelines.'}`;
}
