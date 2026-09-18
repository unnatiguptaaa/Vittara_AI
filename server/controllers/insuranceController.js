import { InsuranceRepository } from '../models/Insurance.js';

/**
 * GET /api/insurance
 * Search and retrieve demo insurance plans from MongoDB
 */
export async function getAllInsurance(req, res, next) {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { provider: { $regex: search, $options: 'i' } }
      ];
    }

    const insurances = await InsuranceRepository.find(query);

    if (!insurances) {
      return res.status(500).json({
        success: false,
        error: 'Financial data could not be loaded.'
      });
    }

    return res.status(200).json({
      success: true,
      count: insurances.length,
      data: insurances
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/insurance/:id
 */
export async function getInsuranceById(req, res, next) {
  try {
    const { id } = req.params;
    const item = await InsuranceRepository.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Insurance product not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
}
