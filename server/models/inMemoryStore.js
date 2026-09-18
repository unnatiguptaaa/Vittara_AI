// High-performance in-memory collection store for 100% resilient fallback

class InMemoryCollection {
  constructor(name) {
    this.name = name;
    this.documents = [];
  }

  async find(query = {}) {
    let results = [...this.documents];

    for (const [key, value] of Object.entries(query)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        if ('$regex' in value) {
          const regex = new RegExp(value.$regex, value.$options || 'i');
          results = results.filter(doc => regex.test(String(doc[key] || '')));
        } else if ('$in' in value && Array.isArray(value.$in)) {
          results = results.filter(doc => value.$in.includes(doc[key]) || value.$in.includes(doc._id));
        } else if ('$lte' in value) {
          results = results.filter(doc => (doc[key] !== undefined && doc[key] <= value.$lte));
        } else if ('$gte' in value) {
          results = results.filter(doc => (doc[key] !== undefined && doc[key] >= value.$gte));
        }
      } else {
        results = results.filter(doc => doc[key] === value);
      }
    }

    return results;
  }

  async findOne(query = {}) {
    const list = await this.find(query);
    return list.length > 0 ? list[0] : null;
  }

  async findById(id) {
    return this.documents.find(doc => String(doc._id) === String(id) || String(doc.id) === String(id)) || null;
  }

  async insertMany(docs) {
    const inserted = docs.map((d, index) => ({
      _id: d._id || `mem_${this.name.toLowerCase()}_${Date.now()}_${index}`,
      ...d
    }));
    this.documents.push(...inserted);
    return inserted;
  }

  async create(doc) {
    const newDoc = {
      _id: doc._id || `mem_${this.name.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      ...doc
    };
    this.documents.push(newDoc);
    return newDoc;
  }

  async countDocuments() {
    return this.documents.length;
  }

  async deleteMany() {
    this.documents = [];
    return { acknowledged: true };
  }
}

export const inMemoryStore = {
  loans: new InMemoryCollection('Loan'),
  insurances: new InMemoryCollection('Insurance'),
  terms: new InMemoryCollection('Term'),
};
