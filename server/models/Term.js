import mongoose from 'mongoose';
import { getDbStatus } from '../config/db.js';
import { inMemoryStore } from './inMemoryStore.js';

const termSchema = new mongoose.Schema({
  term: { type: String, required: true, unique: true },
  aliases: [{ type: String }],
  category: { type: String, default: 'General' },
  shortDefinition: { type: String, required: true },
  fullExplanation: { type: String, required: true },
  hindiExplanation: { type: String, required: true },
  hinglishExplanation: { type: String, required: true },
  example: { type: String, required: true },
  analogy: { type: String, required: true }
}, { timestamps: true });

export const TermModel = mongoose.models.Term || mongoose.model('Term', termSchema);

export const TermRepository = {
  async find(query = {}) {
    const { isInMemory } = getDbStatus();
    if (isInMemory) {
      return inMemoryStore.terms.find(query);
    }
    return TermModel.find(query).lean();
  },

  async findOne(query = {}) {
    const { isInMemory } = getDbStatus();
    if (isInMemory) {
      return inMemoryStore.terms.findOne(query);
    }
    return TermModel.findOne(query).lean();
  },

  async findById(id) {
    const { isInMemory } = getDbStatus();
    if (isInMemory) {
      return inMemoryStore.terms.findById(id);
    }
    return TermModel.findById(id).lean();
  },

  async countDocuments() {
    const { isInMemory } = getDbStatus();
    if (isInMemory) {
      return inMemoryStore.terms.countDocuments();
    }
    return TermModel.countDocuments();
  },

  async insertMany(docs) {
    const { isInMemory } = getDbStatus();
    if (isInMemory) {
      return inMemoryStore.terms.insertMany(docs);
    }
    return TermModel.insertMany(docs);
  },

  async deleteMany() {
    const { isInMemory } = getDbStatus();
    if (isInMemory) {
      return inMemoryStore.terms.deleteMany();
    }
    return TermModel.deleteMany({});
  }
};
