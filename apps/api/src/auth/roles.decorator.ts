import { Role } from '@repo/core';
import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = 'role';
export const Roles = (role: Array<Role>) => SetMetadata(ROLE_KEY, role);
