import { LoanRepository } from '../models/Loan.js';
import { InsuranceRepository } from '../models/Insurance.js';
import { TermRepository } from '../models/Term.js';
import { demoLoans, demoInsurances, demoTerms } from './seedData.js';

export async function seedDatabase(force = false) {
  try {
    const loanCount = await LoanRepository.countDocuments();
    const insuranceCount = await InsuranceRepository.countDocuments();
    const termCount = await TermRepository.countDocuments();

    console.log(`[Seeder] Current counts: ${loanCount} Loans, ${insuranceCount} Insurances, ${termCount} Terms.`);

    if (force || loanCount === 0) {
      if (force) await LoanRepository.deleteMany();
      await LoanRepository.insertMany(demoLoans);
      console.log(`[Seeder] Successfully seeded ${demoLoans.length} Demo Loan Products.`);
    }

    if (force || insuranceCount === 0) {
      if (force) await InsuranceRepository.deleteMany();
      await InsuranceRepository.insertMany(demoInsurances);
      console.log(`[Seeder] Successfully seeded ${demoInsurances.length} Demo Insurance Products.`);
    }

    if (force || termCount === 0) {
      if (force) await TermRepository.deleteMany();
      await TermRepository.insertMany(demoTerms);
      console.log(`[Seeder] Successfully seeded ${demoTerms.length} Financial Terms.`);
    }

    return {
      success: true,
      loansSeeded: demoLoans.length,
      insuranceSeeded: demoInsurances.length,
      termsSeeded: demoTerms.length
    };
  } catch (error) {
    console.error(`[Seeder] Seeding error:`, error.message);
    throw error;
  }
}
