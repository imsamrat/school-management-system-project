import { useCallback } from 'react';
import { useAuth } from './useAuth';

export function usePermission() {
  const { user } = useAuth();

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;
      // Super Admin has all permissions
      if (user.roles.some((r) => r.name === 'Super Admin')) return true;
      return user.permissions.includes(permission);
    },
    [user]
  );

  const hasAnyPermission = useCallback(
    (permissions: string[]): boolean => {
      return permissions.some((p) => hasPermission(p));
    },
    [hasPermission]
  );

  const hasAllPermissions = useCallback(
    (permissions: string[]): boolean => {
      return permissions.every((p) => hasPermission(p));
    },
    [hasPermission]
  );

  const hasRole = useCallback(
    (roleName: string): boolean => {
      if (!user) return false;
      return user.roles.some((r) => r.name === roleName);
    },
    [user]
  );

  return { hasPermission, hasAnyPermission, hasAllPermissions, hasRole };
}
