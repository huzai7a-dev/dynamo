import type { IPriceCategory, PriceCategoryRequest } from "#shared/types";

class PriceCategoryRepository {
  private db: ReturnType<typeof useDb>;
  constructor() {
    this.db = useDb();
  }

  async findByUserId(userId: string | number) {
    const rows = await this.db`
      SELECT * FROM price_categories WHERE user_id = ${userId}
    ` as Array<IPriceCategory>;
    return rows[0] ?? null;
  }

  async upsert(userId: string | number, data: PriceCategoryRequest) {
    const rows = await this.db`
      INSERT INTO price_categories (
        user_id,
        left_chest_hat,
        simple_jacket_back,
        complex_jacket_back,
        applique_jacket_back,
        simple_vector,
        complex_vector
      )
      VALUES (
        ${userId},
        ${data.left_chest_hat ?? null},
        ${data.simple_jacket_back ?? null},
        ${data.complex_jacket_back ?? null},
        ${data.applique_jacket_back ?? null},
        ${data.simple_vector ?? null},
        ${data.complex_vector ?? null}
      )
      ON CONFLICT (user_id) DO UPDATE SET
        left_chest_hat = EXCLUDED.left_chest_hat,
        simple_jacket_back = EXCLUDED.simple_jacket_back,
        complex_jacket_back = EXCLUDED.complex_jacket_back,
        applique_jacket_back = EXCLUDED.applique_jacket_back,
        simple_vector = EXCLUDED.simple_vector,
        complex_vector = EXCLUDED.complex_vector,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    ` as Array<IPriceCategory>;
    return rows[0];
  }
}

export default new PriceCategoryRepository();
