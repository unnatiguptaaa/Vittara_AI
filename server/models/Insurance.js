import mongoose from 'mongoose';
import { getDbStatus } from '../config/db.js';
import { inMemoryStore } from './inMemoryStore.js';

const insuranceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  provider: { type: String, required: true },
  category: { type: String, required: true }, // Health, Term Life, Motor, Critical Illness
  premium: { type: Number, required: true }, // Annual premium in INR
  monthlyPremium: { type: Number, required: true },
  coverage: { type: Number, required: true }, // Sum insured in INR
  deductible: { type: Number, required: true }, // INR
  waitingPeriod: { type: String, required: true },
  exclusions: [{ type: String }],
  limits: { type: String, required: true },
  conditions: { type: String, required: true },
  coPay: { type: String, default: '0%' },
  networkHospitals: { type: Number, default: 8500 },
  claimSettlementRatio: { type: Number, default: 98.0 },
  productStatus: { type: String, default: 'Active' },
  rating: { type: Number, default: 4.6 },
  badge: { type: String }
}, { timestamps: true });

export const InsuranceModel = mongoose.models.Insurance || mongoose.model('Insurance', insuranceSchema);

export const InsuranceRepository = {
  async find(query = {}) {
    const { isInMemory } = getDbStatus();
    if (isInMemory) {
      return inMemoryStore.insurances.find(query);
    }
    return InsuranceModel.find(query).lean();
  },

  async findOne(query = {}) {
    const { isInMemory } = getDbStatus();
    if (isInMemory) {
      return inMemoryStore.insurances.findOne(query);
    }
    return InsuranceModel.findOne(query).lean();
  },

  async findById(id) {
    const { isInMemory } = getDbStatus();
    if (isInMemory) {
      return inMemoryStore.insurances.findById(id);
    }
    return InsuranceModel.findById(id).lean();
  },

  async countDocuments() {
    const { isInMemory } = getDbStatus();
    if (isInMemory) {
      return inMemoryStore.insurances.countDocuments();
    }
    return InsuranceModel.countDocuments();
  },

  async insertMany(docs) {
    const { isInMemory } = getDbStatus();
    if (isInMemory) {
      return inMemoryStore.insurances.insertMany(docs);
    }
    return InsuranceModel.insertMany(docs);
  },

  async deleteMany() {
    const { isInMemory } = getDbStatus();
    if (isInMemory) {
      return inMemoryStore.insurances.deleteMany();
    }
    return InsuranceModel.deleteMany({});
  }
};
