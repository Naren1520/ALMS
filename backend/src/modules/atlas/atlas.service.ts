import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AtlasService {
  private readonly logger = new Logger(AtlasService.name);

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Get region data for Craft Atlas (Req 21.2)
   * Returns craft list, artisan count, sample product images, cultural description
   */
  async getRegionData(regionCode: string) {
    const [artisanCount, crafts, sampleImages] = await Promise.all([
      this.dataSource.query(
        `SELECT COUNT(*) AS count FROM artisan_profiles
         WHERE (state ILIKE $1 OR district ILIKE $1) AND verified = true`,
        [regionCode],
      ),
      this.dataSource.query(
        `SELECT DISTINCT primary_craft FROM artisan_profiles
         WHERE (state ILIKE $1 OR district ILIKE $1) AND verified = true`,
        [regionCode],
      ),
      this.dataSource.query(
        `SELECT pm.r2_key_enh, pm.r2_key_orig FROM product_media pm
         JOIN products p ON p.id = pm.product_id
         JOIN artisan_profiles ap ON ap.id = p.artisan_id
         WHERE (ap.state ILIKE $1 OR ap.district ILIKE $1)
           AND p.status = 'PUBLISHED' AND pm.is_active = true
         LIMIT 6`,
        [regionCode],
      ),
    ]);

    return {
      regionCode,
      artisanCount: parseInt(artisanCount[0]?.count ?? '0', 10),
      crafts: crafts.map((c: { primary_craft: string }) => c.primary_craft),
      sampleImages: sampleImages.map((img: { r2_key_enh: string; r2_key_orig: string }) =>
        img.r2_key_enh ?? img.r2_key_orig,
      ),
      culturalDescription: `${regionCode} is known for its rich artisan traditions and craft heritage.`,
    };
  }

  /** Get all states with artisan counts */
  async getAllRegions() {
    return this.dataSource.query(
      `SELECT state, COUNT(*) AS artisan_count
       FROM artisan_profiles WHERE verified = true
       GROUP BY state ORDER BY artisan_count DESC`,
    );
  }
}
