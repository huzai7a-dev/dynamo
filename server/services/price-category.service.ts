import type { PriceCategoryRequest } from "#shared/types";
import priceCategoryRepository from "../repositories/price-category.repository";

class PriceCategoryService {
  async getByUserId(userId: string | number) {
    return await priceCategoryRepository.findByUserId(userId);
  }

  async upsert(userId: string | number, payload: PriceCategoryRequest) {
    return await priceCategoryRepository.upsert(userId, payload);
  }
}

export default new PriceCategoryService();
