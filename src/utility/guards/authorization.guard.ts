import { CanActivate, ExecutionContext, Injectable, mixin, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const AuthorizeGuard = (allowedRoles: string[]) => {
  class RolesGuardMixin implements CanActivate {
    canActivate(
      context: ExecutionContext,
    ): boolean  {
      const request = context.switchToHttp().getRequest();
      const result = request?.currentUser?.roles.map((role: string) => allowedRoles.includes(role)).find((val:boolean) => val === true);
      if (result) return true;
      throw new UnauthorizedException("Sorry, you're not authorized to access this user.");
    }
  }
  const guard = mixin(RolesGuardMixin);
  return guard;
}
