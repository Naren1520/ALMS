import {
  Body, Controller, Delete, Get, Param, Patch, Post, Put,
  UploadedFiles, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, CurrentUser } from '../../common/decorators';
import { UserRole, ProductStatus } from '../../common/enums';
import { JwtPayload } from '../../common/interfaces';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /** POST /products — create product and enqueue AI pipeline */
  @Post()
  @Roles(UserRole.ARTISAN)
  @UseGuards(RolesGuard)
  @UseInterceptors(FilesInterceptor('images', 10))
  createProduct(
    @CurrentUser() user: JwtPayload,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('textInput') textInput?: string,
  ) {
    return this.productService.createProduct(
      user.sub,
      files.map((f) => ({
        buffer: f.buffer,
        mimetype: f.mimetype,
        originalname: f.originalname,
        size: f.size,
      })),
      undefined,
      textInput,
    );
  }

  /** GET /products/:id */
  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  /** PUT /products/:id */
  @Put(':id')
  @Roles(UserRole.ARTISAN)
  @UseGuards(RolesGuard)
  updateProduct(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.productService.updateProduct(user.sub, id, body);
  }

  /** PATCH /products/:id/status */
  @Patch(':id/status')
  @Roles(UserRole.ARTISAN)
  @UseGuards(RolesGuard)
  changeStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body('status') status: ProductStatus,
  ) {
    return this.productService.changeStatus(user.sub, id, status);
  }

  /** DELETE /products/:id */
  @Delete(':id')
  @Roles(UserRole.ARTISAN)
  @UseGuards(RolesGuard)
  deleteProduct(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.productService.deleteProduct(user.sub, id);
  }

  /** POST /products/bulk */
  @Post('bulk')
  @Roles(UserRole.ARTISAN)
  @UseGuards(RolesGuard)
  bulkUpdateStatus(
    @CurrentUser() user: JwtPayload,
    @Body() body: { productIds: string[]; targetStatus: ProductStatus },
  ) {
    return this.productService.bulkUpdateStatus(user.sub, body.productIds, body.targetStatus);
  }

  /** GET /products/:id/images/compare */
  @Get(':id/images/compare')
  @Roles(UserRole.ARTISAN)
  @UseGuards(RolesGuard)
  getImageComparison(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.productService.getImageComparison(user.sub, id);
  }

  /** POST /products/:id/images/revert */
  @Post(':id/images/revert')
  @Roles(UserRole.ARTISAN)
  @UseGuards(RolesGuard)
  revertImage(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body('mediaId') mediaId: string,
  ) {
    return this.productService.revertToOriginal(user.sub, id, mediaId);
  }
}
