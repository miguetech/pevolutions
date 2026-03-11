import { Role } from '../types/user';

export const permissions = {
  [Role.USER]: [
    'account:read',
    'account:update',
    'players:read',
    'players:create',
  ],
  [Role.ADMIN]: [
    'account:read',
    'account:update',
    'players:*',
    'users:read',
    'users:update',
    'users:delete',
    'logs:read',
  ],
  [Role.SUPER_ADMIN]: ['*'],
};

export function hasPermission(role: Role, permission: string): boolean {
  const rolePerms = permissions[role];
  if (!rolePerms) return false;
  
  if (rolePerms.includes('*')) return true;
  
  // Check exact permission
  if (rolePerms.includes(permission)) return true;
  
  // Check wildcard permissions (e.g., 'players:*')
  const [resource] = permission.split(':');
  return rolePerms.includes(`${resource}:*`);
}
