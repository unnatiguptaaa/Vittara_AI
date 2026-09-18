import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const UI_TRANSLATIONS = {
  English: {
    brandName: 'Vittara AI',
    tagline: 'Intelligent Financial & Loan Advisor',
    nav: {
      home: 'Home',
      chat: 'AI Assistant',
      loans: 'Loan Assistant',
      calculator: 'EMI Calculator',
      compare: 'Compare Loans',
      insurance: 'Insurance',
      terms: 'Term Explainer',
      documents: 'Document Analyzer',
      summary: 'Financial Summary'
    },
    actions: {
      submit: 'Submit',
      calculate: 'Calculate EMI',
      compare: 'Compare Products',
      upload: 'Upload & Audit Document',
      clear: 'Clear',
      reset: 'Reset',
      viewDetails: 'View Details',
      selectToCompare: 'Select to Compare',
      selected: 'Selected',
      newChat: 'New Conversation',
      clearChat: 'Clear History',
      close: 'Close',
      saveKey: 'Save API Key',
      settings: 'AI Settings'
    },
    labels: {
      loanAmount: 'Loan Amount (₹)',
      purpose: 'Loan Purpose',
      monthlyIncome: 'Monthly In-hand Income (₹)',
      monthlyExpenses: 'Monthly Fixed Expenses (₹)',
      tenure: 'Repayment Tenure (Months)',
      interestRate: 'Interest Rate (% p.a.)',
      monthlyEmi: 'Monthly EMI',
      totalInterest: 'Total Interest Payable',
      totalPayment: 'Total Repayment Amount',
      processingFee: 'Processing Fee',
      totalCost: 'Estimated Total Cost',
      coverage: 'Coverage (Sum Insured)',
      deductible: 'Deductible',
      waitingPeriod: 'Waiting Period',
      exclusions: 'Key Exclusions',
      demoBadge: 'Verified Financial Product'
    }
  },
  Hindi: {
    brandName: 'विट्टारा एआई',
    tagline: 'बुद्धिमान वित्तीय एवं ऋण सलाहकार',
    nav: {
      home: 'होम',
      chat: 'एआई सहायक (AI Assistant)',
      loans: 'ऋण सहायक',
      calculator: 'ईएमआई कैलकुलेटर',
      compare: 'लोन तुलना',
      insurance: 'बीमा योजनाएं',
      terms: 'वित्तीय शब्दावली',
      documents: 'दस्तावेज़ विश्लेषक',
      summary: 'वित्तीय सारांश'
    },
    actions: {
      submit: 'जमा करें',
      calculate: 'ईएमआई निकालें',
      compare: 'उत्पादों की तुलना करें',
      upload: 'दस्तावेज़ अपलोड करें',
      clear: 'साफ़ करें',
      reset: 'रीसेट करें',
      viewDetails: 'विवरण देखें',
      selectToCompare: 'तुलना के लिए चुनें',
      selected: 'चुना गया',
      newChat: 'नई बातचीत',
      clearChat: 'इतिहास मिटाएं',
      close: 'बंद करें',
      saveKey: 'एपीआई कुंजी सहेजें',
      settings: 'एआई सेटिंग्स'
    },
    labels: {
      loanAmount: 'ऋण राशि (₹)',
      purpose: 'लोन का उद्देश्य',
      monthlyIncome: 'मासिक आय (₹)',
      monthlyExpenses: 'मासिक खर्चे (₹)',
      tenure: 'ऋण अवधि (महीने)',
      interestRate: 'वार्षिक ब्याज दर (%)',
      monthlyEmi: 'मासिक ईएमआई',
      totalInterest: 'कुल ब्याज',
      totalPayment: 'कुल भुगतान राशि',
      processingFee: 'प्रोसेसिंग शुल्क',
      totalCost: 'अनुमानित कुल लागत',
      coverage: 'बीमा कवर',
      deductible: 'डिडक्टिबल',
      waitingPeriod: 'वेटिंग पीरियड',
      exclusions: 'मुख्य बहिष्करण (Exclusions)',
      demoBadge: 'डेमो उत्पाद'
    }
  },
  Hinglish: {
    brandName: 'Vittara AI',
    tagline: 'Smart Financial & Loan Guidance',
    nav: {
      home: 'Home',
      chat: 'AI Assistant',
      loans: 'Loan Assistant',
      calculator: 'EMI Calculator',
      compare: 'Loan Compare',
      insurance: 'Insurance Plans',
      terms: 'Term Explainer',
      documents: 'Document Analyzer',
      summary: 'Financial Summary'
    },
    actions: {
      submit: 'Submit Karo',
      calculate: 'EMI Calculate Karo',
      compare: 'Compare Karo',
      upload: 'Document Audit Karo',
      clear: 'Clear',
      reset: 'Reset',
      viewDetails: 'Details Dekho',
      selectToCompare: 'Compare Mein Jodo',
      selected: 'Selected Hai',
      newChat: 'New Chat Shuru Karo',
      clearChat: 'History Clear Karo',
      close: 'Close',
      saveKey: 'API Key Save Karo',
      settings: 'AI Settings'
    },
    labels: {
      loanAmount: 'Loan Amount (₹)',
      purpose: 'Loan Purpose',
      monthlyIncome: 'Monthly Income (₹)',
      monthlyExpenses: 'Monthly Kharcha (₹)',
      tenure: 'Tenure (Kitne Months)',
      interestRate: 'Interest Rate (% p.a.)',
      monthlyEmi: 'Monthly EMI',
      totalInterest: 'Total Interest Kitna Banega',
      totalPayment: 'Total Payment Amount',
      processingFee: 'Processing Fee',
      totalCost: 'Estimated Total Cost',
      coverage: 'Total Coverage Amount',
      deductible: 'Deductible Amount',
      waitingPeriod: 'Waiting Period',
      exclusions: 'Kya Cover Nahi Hoga',
      demoBadge: 'Verified Financial Product'
    }
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('vittara_language') || 'English';
  });

  useEffect(() => {
    localStorage.setItem('vittara_language', language);
  }, [language]);

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.English;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
