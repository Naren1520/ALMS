import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums';

export const ROLES_KEY = 'roles';

/**
 * Method/class decorator that marks a route with the required RBAC roles.
 * Used in conjunction with `RolesGuard`.
 *
 * @example
 *   @Roles(UserRole.ADMIN, UserRole.MODERATOR)
 *   @Get('admin/users')
 *   getUsers() { ... }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
