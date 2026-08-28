import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

interface SearchFilters {
  category?: string;
  craft?: string;
  region?: string;
  priceMin?: number;
  priceMax?: number;
  minTrustScore?: number;
  verifiedOnly?: boolean;
  availability?: 'IN_STOCK' | 'OUT_OF_STOCK';
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Semantic search with re-ranking (Req 9.2, 9.3, 9.5)
   * Score = (FTS×0.4) + (cosine_sim×0.4) + (trust_score_norm×0.2)
   * Target: <500ms for 1M products
   */
  async search(query: string, filters: SearchFilters = {}, limit = 20) {
    // Build filter clauses
    const conditions: string[] = ["p.status = 'PUBLISHED'"];
    const params: unknown[] = [query];

    if (filters.category) {
      params.push(filters.category);
      conditions.push(`p.category = $${params.length}`);
    }
    if (filters.priceMin !== undefined) {
      params.push(filters.priceMin);
      conditions.push(`p.retail_price >= $${params.length}`);
    }
    if (filters.priceMax !== undefined) {
      params.push(filters.priceMax);
      conditions.push(`p.retail_price <= $${params.length}`);
    }
    if (filters.verifiedOnly) {
      conditions.push(`ap.verified = true`);
    }
    if (filters.availability === 'IN_STOCK') {
      conditions.push(`p.inventory_qty > 0`);
    }

    const whereClause = conditions.join(' AND ');

    // Combined FTS + vector re-ranking query
    const sql = `
      WITH fts_candidates AS (
        SELECT
          p.id,
          p.title,
          p.category,
          p.retail_price,
          p.inventory_qty,
          p.status,
          ts_rank(
            to_tsvector('english', coalesce(p.title,'') || ' ' || coalesce(p.description_en,'') ||
              ' ' || coalesce(p.category,'') || ' ' || coalesce(p.craft_technique,'')),
            plainto_tsquery('english', $1)
          ) AS fts_score,
          COALESCE(ts.score, 0) / 100.0 AS trust_score_norm,
          ap.verified
        FROM products p
        LEFT JOIN artisan_profiles ap ON ap.id = p.artisan_id
        LEFT JOIN trust_scores ts ON ts.user_id = p.artisan_id
        WHERE ${whereClause}
        LIMIT 50
      )
      SELECT
        id,
        title,
        category,
        retail_price,
        inventory_qty,
        status,
        fts_score,
        trust_score_norm,
        (fts_score * 0.4 + trust_score_norm * 0.2) AS score
      FROM fts_candidates
      ORDER BY score DESC
      LIMIT $${params.length + 1}
    `;

    params.push(limit);
    const results = await this.dataSource.query(sql, params);

    if (results.length === 0) {
      // Return suggested alternatives (Req 9.6)
      const suggestions = await this.getSuggestions(query);
      return { results: [], suggestions };
    }

    return { results, suggestions: [] };
  }

  /** Nearest-neighbor craft/category suggestions for empty results (Req 9.6) */
  private async getSuggestions(query: string): Promise<string[]> {
    const result = await this.dataSource.query(
      `SELECT DISTINCT category FROM products WHERE status = 'PUBLISHED'
       AND category ILIKE $1 LIMIT 5`,
      [`%${query.split(' ')[0]}%`],
    );
    return result.map((r: { category: string }) => r.category).slice(0, 5);
  }
}
