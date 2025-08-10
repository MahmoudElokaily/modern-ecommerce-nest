
import { SetMetadata } from '@nestjs/common';

export const AuthorizeRolesDecorator = (...roles: string[]) => SetMetadata('AllowedRoles', roles);
