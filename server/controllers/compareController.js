import { LoanRepository } from '../models/Loan.js';
import { compareLoanProducts } from '../utils/financialCalculations.js';

/**
 * POST /api/compare
 * Dynamic comparison between 2 or 3 selected loan products
 */
export async function compareLoans(req, res, next) {
  try {
    const { loanIds, amount = 200000, tenure = 36 } = req.body;

    const loanAmount = Number(amount);
    const tenureMonths = Number(tenure);

    if (!loanAmount || isNaN(loanAmount) || loanAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid loan amount.'
      });
    }

    if (!tenureMonths || isNaN(tenureMonths) || tenureMonths <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid tenure in months.'
      });
    }

    if (!loanIds || !Array.isArray(loanIds) || loanIds.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please select at least 2 loan products to compare.'
      });
    }

    if (loanIds.length > 3) {
      return res.status(400).json({
        success: false,
        error: 'You can compare a maximum of 3 products at a time.'
      });
    }

    // Fetch products from MongoDB
    const products = [];
    for (const id of loanIds) {
      const p = await LoanRepository.findById(id);
      if (p) {
        products.push(p);
      }
    }

    if (products.length < 2) {
      return res.status(404).json({
        success: false,
        error: 'No matching demo products found.'
      });
    }

    const comparisonResult = compareLoanProducts(products, loanAmount, tenureMonths);

    return res.status(200).json({
      success: true,
      data: comparisonResult
    });

  } catch (error) {
    next(error);
  }
}
