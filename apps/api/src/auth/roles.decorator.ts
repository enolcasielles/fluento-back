import { Role } from '@/core/enums/roles.enum';
import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = 'role';
export const Roles = (role: Array<Role>) => SetMetadata(ROLE_KEY, role);
