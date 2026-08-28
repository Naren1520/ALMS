import { Controller } from '@nestjs/common';
import { ExcessInventoryService } from './excess-inventory.service';

@Controller('excess-inventory')
export class ExcessInventoryController {
  constructor(private readonly excessInventoryService: ExcessInventoryService) {}
}
