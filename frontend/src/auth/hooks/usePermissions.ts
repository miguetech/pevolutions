import { useAtomValue } from 'jotai';
import { userAtom } from '../stores/authAtoms';
import { hasPermission } from '../utils/rbac';
import { Role } from '../types/user';

export function usePermissions() {
  const user = useAtomValue(userAtom);
  
  return {
    can: (permission: string) => 
      user ? hasPermission(user.role, permission) : false,
    isAdmin: user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN,
    isUser: user?.role === Role.USER,
    role: user?.role,
  };
}
