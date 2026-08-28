import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(
    @Query('q') q: string,
    @Query('category') category?: string,
    @Query('priceMin') priceMin?: number,
    @Query('priceMax') priceMax?: number,
    @Query('verifiedOnly') verifiedOnly?: boolean,
    @Query('availability') availability?: 'IN_STOCK' | 'OUT_OF_STOCK',
    @Query('limit') limit = 20,
  ) {
    return this.searchService.search(q, {
      category,
      priceMin: priceMin ? +priceMin : undefined,
      priceMax: priceMax ? +priceMax : undefined,
      verifiedOnly: verifiedOnly === true || (verifiedOnly as unknown as string) === 'true',
      availability,
    }, +limit);
  }
}
