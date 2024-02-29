import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
class PermissionsService {
  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const localStorage = this.document.defaultView?.localStorage;
    if (localStorage) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.router.navigate(['/login']);
        return false;
      }
      const login = next.data['login'] as boolean;
      if (login) {
        return true;
      }
      const requiredRoles = next.data['rols'] as string[];
      const typeUser = localStorage.getItem('type');
      const hasRequiredRole = requiredRoles.includes(typeUser!);

      if (!hasRequiredRole) {
        this.router.navigate(['/admin']);
        return false;
      }
      return true;
    }
    return false;
  }
}

export const AuthGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  return inject(PermissionsService).canActivate(next, state);
};
