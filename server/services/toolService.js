import { calculateEMI, evaluateEligibility, compareLoanProducts } from '../utils/financialCalculations.js';
import { LoanRepository } from '../models/Loan.js';
import { InsuranceRepository } from '../models/Insurance.js';
import { TermRepository } from '../models/Term.js';
import { extractDocumentText } from './documentService.js';

export const applicationTools = {
  /**
   * Tool: calculate_emi
   */
  async calculate_emi({ principal, interestRate, tenureMonths, processingFeeRate = 1.0 }) {
    try {
      const result = calculateEMI({
        principal: Number(principal),
        interestRate: Number(interestRate),
        tenureMonths: Number(tenureMonths),
        processingFeeRate: Number(processingFeeRate)
      });
      return {
        success: true,
        tool: 'calculate_emi',
        data: result
      };
    } catch (err) {
      return {
        success: false,
        tool: 'calculate_emi',
        error: err.message
      };
    }
  },

  /**
   * Tool: compare_loans
   */
  async compare_loans({ loanIds, loanAmount = 200000, tenureMonths = 36 }) {
    try {
      let products = [];
      if (loanIds && Array.isArray(loanIds) && loanIds.length > 0) {
        for (const id of loanIds) {
          const item = await LoanRepository.findById(id);
          if (item) products.push(item);
        }
      }

      if (products.length < 2) {
        // Fetch top 2 products as fallback
        const all = await LoanRepository.find();
        products = all.slice(0, 2);
      }

      const comparison = compareLoanProducts(products, Number(loanAmount), Number(tenureMonths));
      return {
        success: true,
        tool: 'compare_loans',
        data: comparison
      };
    } catch (err) {
      return {
        success: false,
        tool: 'compare_loans',
        error: err.message
      };
    }
  },

  /**
   * Tool: lookup_insurance
   */
  async lookup_insurance({ category, query }) {
    try {
      let filter = {};
      if (category && category !== 'All') {
        filter.category = category;
      }
      if (query) {
        filter.name = { $regex: query, $options: 'i' };
      }

      const insurances = await InsuranceRepository.find(filter);
      return {
        success: true,
        tool: 'lookup_insurance',
        count: insurances.length,
        data: insurances
      };
    } catch (err) {
      return {
        success: false,
        tool: 'lookup_insurance',
        error: err.message
      };
    }
  },

  /**
   * Tool: explain_term
   */
  async explain_term({ term }) {
    try {
      if (!term) throw new Error('Term name is required.');
      const regex = new RegExp(`^${term.trim()}$`, 'i');
      let found = await TermRepository.findOne({ term: { $regex: term.trim(), $options: 'i' } });

      if (!found) {
        // Check aliases or partial match
        found = await TermRepository.findOne({ aliases: { $in: [term.trim()] } });
      }

      if (!found) {
        const all = await TermRepository.find();
        found = all.find(t => t.term.toLowerCase().includes(term.toLowerCase()) || term.toLowerCase().includes(t.term.toLowerCase()));
      }

      if (!found) {
        return {
          success: false,
          tool: 'explain_term',
          error: `Financial term "${term}" not found in database.`
        };
      }

      return {
        success: true,
        tool: 'explain_term',
        data: found
      };
    } catch (err) {
      return {
        success: false,
        tool: 'explain_term',
        error: err.message
      };
    }
  },

  /**
   * Tool: analyze_document
   */
  async analyze_document({ documentText }) {
    try {
      if (!documentText) throw new Error('Document text is required for analysis.');
      return {
        success: true,
        tool: 'analyze_document',
        charCount: documentText.length,
        preview: documentText.slice(0, 500)
      };
    } catch (err) {
      return {
        success: false,
        tool: 'analyze_document',
        error: err.message
      };
    }
  }
};

/**
 * Tool definitions formatted for Gemini function calling
 */
export const geminiToolDeclarations = [
  {
    name: "calculate_emi",
    description: "Calculates accurate monthly EMI, total interest, and total repayment for a loan using real banking formulas.",
    parameters: {
      type: "OBJECT",
      properties: {
        principal: { type: "NUMBER", description: "Loan principal amount in INR (e.g. 200000)" },
        interestRate: { type: "NUMBER", description: "Annual interest rate percentage (e.g. 10.5)" },
        tenureMonths: { type: "NUMBER", description: "Loan repayment duration in months (e.g. 36)" },
        processingFeeRate: { type: "NUMBER", description: "Processing fee percentage (e.g. 1.5)" }
      },
      required: ["principal", "interestRate", "tenureMonths"]
    }
  },
  {
    name: "compare_loans",
    description: "Compares 2 or 3 loan products side-by-side on interest rate, tenure, processing fees, monthly EMI, and conditions.",
    parameters: {
      type: "OBJECT",
      properties: {
        loanIds: { type: "ARRAY", items: { type: "STRING" }, description: "Array of loan product IDs or empty to pick best available" },
        loanAmount: { type: "NUMBER", description: "Comparison loan amount (e.g. 200000)" },
        tenureMonths: { type: "NUMBER", description: "Comparison tenure in months (e.g. 36)" }
      }
    }
  },
  {
    name: "lookup_insurance",
    description: "Queries database for insurance plans, returning real data on coverage, premium, deductible, waiting period, and exclusions.",
    parameters: {
      type: "OBJECT",
      properties: {
        category: { type: "STRING", description: "Insurance category like 'Health', 'Term Life', 'Motor', or 'All'" },
        query: { type: "STRING", description: "Search query or provider name" }
      }
    }
  },
  {
    name: "explain_term",
    description: "Retrieves verified definitions, examples, and analogies for financial terms like APR, Deductible, Premium, Tenure, etc.",
    parameters: {
      type: "OBJECT",
      properties: {
        term: { type: "STRING", description: "Financial term name e.g. APR, Deductible, Premium, Tenure, Waiting Period" }
      },
      required: ["term"]
    }
  }
];
