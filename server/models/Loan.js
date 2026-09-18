import mongoose from 'mongoose';
import { getDbStatus } from '../config/db.js';
import { inMemoryStore } from './inMemoryStore.js';

const loanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bank: { type: String, required: true },
  category: { type: String, required: true }, // Personal, Home, Auto, Education, Business
  interestRate: { type: Number, required: true }, // Annual %
  minAmount: { type: Number, required: true },
  maxAmount: { type: Number, required: true },
  minTenure: { type: Number, required: true }, // Months
  maxTenure: { type: Number, required: true }, // Months
  processingFeeRate: { type: Number, required: true }, // % of loan
  processingFeeMin: { type: Number, default: 500 },
  minIncome: { type: Number, default: 20000 },
  maxDtiRatio: { type: Number, default: 0.60 },
  features: [{ type: String }],
  conditions: { type: String, default: 'Standard bank KYC & income proof required.' },
  preClosureCharges: { type: String, default: 'Nil after 12 EMIs; 2% prior.' },
  productStatus: { type: String, default: 'Active' },
  rating: { type: Number, default: 4.5 },
  badge: { type: String }
}, { timestamps: true });

export const LoanModel = mongoose.models.Loan || mongoose.model('Loan', loanSchema);

export const LoanRepository = {
  async find(query = {}) {
    const { isInMemory } = getDbStatus();
    if (isInMemory) {
      return inMemoryStore.loans.find(query);
    }
    return LoanModel.find(query).lean();
  },

  async findOne(query = {}) {
    const { isInMemory } = getDbStatus();
    if (isInMemory) {
      return inMemoryStore.loans.findOne(query);
    }
    return LoanModel.findOne(query).lean();
  },

  async findById(id) {
    const { isInMemory } = getDbStatus();
    if (isInMemory) {
      return inMemoryStore.loans.findById(id);
    }
    return LoanModel.findById(id).lean();
  },

  async countDocuments() {
    const { isInMemory } = getDbStatus();
    if (isInMemory) {
      return inMemoryStore.loans.countDocuments();
    }
    return LoanModel.countDocuments();
  },

  async insertMany(docs) {
    const { isInMemory } = getDbStatus();
    if (isInMemory) {
      return inMemoryStore.loans.insertMany(docs);
    }
    return LoanModel.insertMany(docs);
  },

  async deleteMany() {
    const { isInMemory } = getDbStatus();
    if (isInMemory) {
      return inMemoryStore.loans.deleteMany();
    }
    return LoanModel.deleteMany({});
  }
};
