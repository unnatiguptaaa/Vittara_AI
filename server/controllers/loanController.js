import { LoanRepository } from '../models/Loan.js';
import { calculateEMI, evaluateEligibility } from '../utils/financialCalculations.js';

/**
 * Handles comprehensive loan assistant calculation and dynamic EMI calculation
 * POST /api/loan/calculate
 */
export async function calculateLoan(req, res, next) {
  try {
    const {
      amount,
      principal,
      purpose = 'Personal',
      monthlyIncome,
      monthlyExpenses = 0,
      tenure,
      tenureMonths,
      interestRate
    } = req.body;

    const effectiveAmount = Number(amount || principal);
    const effectiveTenure = Number(tenure || tenureMonths);

    // Validation
    if (!effectiveAmount || isNaN(effectiveAmount) || effectiveAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid loan amount.'
      });
    }

    if (!effectiveTenure || isNaN(effectiveTenure) || effectiveTenure <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid tenure in months.'
      });
    }

    // 1. Direct Quick EMI Calculation (if interest rate provided)
    if (interestRate !== undefined && interestRate !== null) {
      const rateNum = Number(interestRate);
      if (isNaN(rateNum) || rateNum <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Please enter a valid interest rate.'
        });
      }

      const emiResult = calculateEMI({
        principal: effectiveAmount,
        interestRate: rateNum,
        tenureMonths: effectiveTenure,
        processingFeeRate: req.body.processingFeeRate || 1.0,
        processingFeeMin: req.body.processingFeeMin || 500
      });

      return res.status(200).json({
        success: true,
        type: 'emi_calculation',
        data: emiResult
      });
    }

    // 2. Comprehensive Loan Assistant Flow (Income, Expenses, Purpose, MongoDB matching)
    const incomeNum = Number(monthlyIncome);
    const expensesNum = Number(monthlyExpenses);

    if (!incomeNum || isNaN(incomeNum) || incomeNum <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid monthly income.'
      });
    }

    if (isNaN(expensesNum) || expensesNum < 0) {
      return res.status(400).json({
        success: false,
        error: 'Monthly expenses cannot be negative.'
      });
    }

    if (expensesNum >= incomeNum) {
      return res.status(400).json({
        success: false,
        error: 'Monthly expenses must be less than monthly income to qualify for a loan.'
      });
    }

    // Query MongoDB for all demo loan products
    let query = {};
    if (purpose && purpose !== 'All' && purpose !== 'General') {
      query.category = { $regex: new RegExp(`^${purpose}$`, 'i') };
    }

    let products = await LoanRepository.find(query);

    // If no products match the exact category, fetch all available demo products
    if (!products || products.length === 0) {
      products = await LoanRepository.find({});
    }

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Financial data could not be loaded.'
      });
    }

    // Calculate real dynamic EMI and evaluate eligibility for every matched demo product
    const scoredProducts = products.map(prod => {
      const eligibility = evaluateEligibility({
        loanAmount: effectiveAmount,
        monthlyIncome: incomeNum,
        monthlyExpenses: expensesNum,
        tenureMonths: effectiveTenure,
        productInterestRate: prod.interestRate,
        productMaxDti: prod.maxDtiRatio || 0.60
      });

      const emiDetails = calculateEMI({
        principal: effectiveAmount,
        interestRate: prod.interestRate,
        tenureMonths: effectiveTenure,
        processingFeeRate: prod.processingFeeRate,
        processingFeeMin: prod.processingFeeMin
      });

      const withinAmountRange = effectiveAmount >= prod.minAmount && effectiveAmount <= prod.maxAmount;
      const withinTenureRange = effectiveTenure >= prod.minTenure && effectiveTenure <= prod.maxTenure;
      const meetsIncomeReq = incomeNum >= (prod.minIncome || 20000);

      return {
        product: prod,
        emiDetails,
        eligibility,
        isQualified: eligibility.isEligible && withinAmountRange && withinTenureRange && meetsIncomeReq,
        constraints: {
          withinAmountRange,
          withinTenureRange,
          meetsIncomeReq
        }
      };
    });

    // Sort with best qualified loans first (lowest interest rate)
    scoredProducts.sort((a, b) => {
      if (a.isQualified && !b.isQualified) return -1;
      if (!a.isQualified && b.isQualified) return 1;
      return a.product.interestRate - b.product.interestRate;
    });

    // Compute representative benchmark EMI (using top recommendation)
    const topChoice = scoredProducts[0];

    return res.status(200).json({
      success: true,
      type: 'loan_assistant',
      summary: {
        requestedAmount: effectiveAmount,
        purpose,
        monthlyIncome: incomeNum,
        monthlyExpenses: expensesNum,
        tenureMonths: effectiveTenure,
        topEmi: topChoice ? topChoice.emiDetails.monthlyEmi : 0,
        topInterestRate: topChoice ? topChoice.product.interestRate : 0,
        eligibleCount: scoredProducts.filter(p => p.isQualified).length,
        totalEvaluated: scoredProducts.length
      },
      products: scoredProducts
    });

  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/loans
 * Retrieve all loan products from MongoDB
 */
export async function getAllLoans(req, res, next) {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const loans = await LoanRepository.find(query);

    if (!loans) {
      return res.status(500).json({
        success: false,
        error: 'Financial data could not be loaded.'
      });
    }

    return res.status(200).json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/loans/:id
 */
export async function getLoanById(req, res, next) {
  try {
    const { id } = req.params;
    const loan = await LoanRepository.findById(id);

    if (!loan) {
      return res.status(404).json({
        success: false,
        error: 'Loan product not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: loan
    });
  } catch (error) {
    next(error);
  }
}
