import React, { createContext, useContext, useState } from 'react';

const JourneyContext = createContext();

export function JourneyProvider({ children }) {
  // Financial Journey state populated by real user interactions
  const [journeyData, setJourneyData] = useState({
    hasActiveJourney: false,
    requestedAmount: 200000,
    purpose: 'Personal',
    monthlyIncome: 50000,
    monthlyExpenses: 30000,
    tenureMonths: 36,
    interestRate: 10.35,
    monthlyEmi: 6488,
    totalInterest: 33568,
    totalPayment: 233568,
    processingFee: 3000,
    estimatedTotalCost: 236568,
    dtiRatio: 0.73,
    eligibilityStatus: 'High Approval Likelihood',
    selectedProduct: null,
    comparisonLoanIds: [],
    selectedInsurance: null,
    lastAnalyzedDocument: null
  });

  const updateJourney = (updates) => {
    setJourneyData((prev) => ({
      ...prev,
      ...updates,
      hasActiveJourney: true
    }));
  };

  const toggleCompareLoan = (productId) => {
    setJourneyData((prev) => {
      const current = prev.comparisonLoanIds || [];
      if (current.includes(productId)) {
        return { ...prev, comparisonLoanIds: current.filter(id => id !== productId) };
      } else {
        if (current.length >= 3) {
          // Keep max 3
          return { ...prev, comparisonLoanIds: [...current.slice(1), productId] };
        }
        return { ...prev, comparisonLoanIds: [...current, productId] };
      }
    });
  };

  const resetJourney = () => {
    setJourneyData({
      hasActiveJourney: false,
      requestedAmount: 200000,
      purpose: 'Personal',
      monthlyIncome: 50000,
      monthlyExpenses: 30000,
      tenureMonths: 36,
      interestRate: 10.35,
      monthlyEmi: 6488,
      totalInterest: 33568,
      totalPayment: 233568,
      processingFee: 3000,
      estimatedTotalCost: 236568,
      dtiRatio: 0.73,
      eligibilityStatus: 'High Approval Likelihood',
      selectedProduct: null,
      comparisonLoanIds: [],
      selectedInsurance: null,
      lastAnalyzedDocument: null
    });
  };

  return (
    <JourneyContext.Provider
      value={{
        journeyData,
        updateJourney,
        toggleCompareLoan,
        resetJourney
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
}
