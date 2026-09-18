/**
 * Financial Calculation Utilities for Vittara AI
 * Standard mathematical formulas for EMI, Amortization, and Eligibility
 */

export function calculateEMI({ principal, interestRate, tenureMonths, processingFeeRate = 1.0, processingFeeMin = 500 }) {
  const P = Number(principal);
  const annualRate = Number(interestRate);
  const n = Number(tenureMonths);

  if (!P || P <= 0 || isNaN(P)) {
    throw new Error('Please enter a valid loan amount.');
  }
  if (!annualRate || annualRate <= 0 || isNaN(annualRate)) {
    throw new Error('Please enter a valid interest rate.');
  }
  if (!n || n <= 0 || isNaN(n)) {
    throw new Error('Please enter a valid tenure in months.');
  }

  // Monthly interest rate
  const r = annualRate / (12 * 100);

  // EMI = [P x r x (1+r)^n] / [(1+r)^n - 1]
  const emiFactor = Math.pow(1 + r, n);
  const emiExact = (P * r * emiFactor) / (emiFactor - 1);
  const monthlyEmi = Math.round(emiExact);

  const totalPayment = Math.round(monthlyEmi * n);
  const totalInterest = Math.max(0, totalPayment - P);

  // Processing fee
  const calculatedFee = Math.round(P * (processingFeeRate / 100));
  const processingFee = Math.max(processingFeeMin, calculatedFee);

  const estimatedTotalCost = totalPayment + processingFee;

  return {
    principal: P,
    annualInterestRate: annualRate,
    tenureMonths: n,
    monthlyEmi,
    totalInterest,
    totalPayment,
    processingFee,
    estimatedTotalCost
  };
}

export function evaluateEligibility({ loanAmount, monthlyIncome, monthlyExpenses, tenureMonths, productInterestRate, productMaxDti = 0.60 }) {
  const P = Number(loanAmount);
  const income = Number(monthlyIncome);
  const expenses = Number(monthlyExpenses);
  const n = Number(tenureMonths);

  if (income <= 0) throw new Error('Monthly income must be greater than 0.');
  if (expenses < 0) throw new Error('Monthly expenses cannot be negative.');
  if (expenses >= income) {
    return {
      isEligible: false,
      dtiRatio: 1.0,
      riskLevel: 'High',
      status: 'Ineligible: Expenses equal or exceed income',
      reason: 'Your monthly expenses are equal to or greater than your income. Lenders require positive disposable income.'
    };
  }

  const emiData = calculateEMI({ principal: P, interestRate: productInterestRate, tenureMonths: n });
  const projectedObligations = expenses + emiData.monthlyEmi;
  const dtiRatio = Number((projectedObligations / income).toFixed(2));
  const disposableIncome = income - expenses;

  let isEligible = false;
  let status = 'Moderate Chance';
  let riskLevel = 'Medium';
  let maxAffordableEmi = Math.round(income * productMaxDti - expenses);
  let reason = '';

  if (dtiRatio <= 0.40 && disposableIncome >= emiData.monthlyEmi * 1.5) {
    isEligible = true;
    status = 'High Approval Likelihood';
    riskLevel = 'Low';
    reason = `Your Debt-to-Income ratio of ${(dtiRatio * 100).toFixed(0)}% is well within safe banking thresholds.`;
  } else if (dtiRatio <= productMaxDti && disposableIncome >= emiData.monthlyEmi) {
    isEligible = true;
    status = 'Moderate Approval Likelihood';
    riskLevel = 'Moderate';
    reason = `Your Debt-to-Income ratio is ${(dtiRatio * 100).toFixed(0)}%. May require standard documentation or co-applicant.`;
  } else {
    isEligible = false;
    status = 'High Risk of Rejection';
    riskLevel = 'High';
    reason = `Projected Debt-to-Income ratio (${(dtiRatio * 100).toFixed(0)}%) exceeds lender safety threshold of ${(productMaxDti * 100).toFixed(0)}%.`;
  }

  return {
    isEligible,
    dtiRatio,
    disposableIncome,
    maxAffordableEmi: Math.max(0, maxAffordableEmi),
    status,
    riskLevel,
    reason,
    emiData
  };
}

export function compareLoanProducts(products, loanAmount = 200000, tenureMonths = 36) {
  if (!products || products.length < 2) {
    throw new Error('At least two loan products are required for comparison.');
  }

  const comparisons = products.map(prod => {
    const emiDetails = calculateEMI({
      principal: loanAmount,
      interestRate: prod.interestRate,
      tenureMonths: tenureMonths,
      processingFeeRate: prod.processingFeeRate,
      processingFeeMin: prod.processingFeeMin
    });

    return {
      product: prod,
      loanAmount,
      tenureMonths,
      interestRate: prod.interestRate,
      monthlyEmi: emiDetails.monthlyEmi,
      totalInterest: emiDetails.totalInterest,
      totalPayment: emiDetails.totalPayment,
      processingFee: emiDetails.processingFee,
      estimatedTotalCost: emiDetails.estimatedTotalCost,
      conditions: prod.conditions,
      preClosureCharges: prod.preClosureCharges
    };
  });

  // Find highlights
  let lowestRateProduct = comparisons[0];
  let lowestFeeProduct = comparisons[0];
  let lowestEmiProduct = comparisons[0];

  for (const c of comparisons) {
    if (c.interestRate < lowestRateProduct.interestRate) lowestRateProduct = c;
    if (c.processingFee < lowestFeeProduct.processingFee) lowestFeeProduct = c;
    if (c.monthlyEmi < lowestEmiProduct.monthlyEmi) lowestEmiProduct = c;
  }

  return {
    comparisons,
    highlights: {
      lowestRate: lowestRateProduct.product.name,
      lowestFee: lowestFeeProduct.product.name,
      lowestEmi: lowestEmiProduct.product.name,
      rateDiff: Math.abs(comparisons[0].interestRate - comparisons[1].interestRate).toFixed(2),
      monthlySaving: Math.abs(comparisons[0].monthlyEmi - comparisons[1].monthlyEmi)
    }
  };
}
