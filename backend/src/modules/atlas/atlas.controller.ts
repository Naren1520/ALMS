import { Controller, Get, Param } from '@nestjs/common';
import { AtlasService } from './atlas.service';

@Controller('craft-atlas')
export class AtlasController {
  constructor(private readonly atlasService: AtlasService) {}

  @Get('regions')
  getAllRegions() {
    return this.atlasService.getAllRegions();
  }

  @Get('regions/:regionCode')
  getRegionData(@Param('regionCode') regionCode: string) {
    return this.atlasService.getRegionData(regionCode);
  }
}
