import type { ExtendedUser } from '@/types/next-auth';
import type { Post, UserRole } from '@prisma/client';

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: ExtendedUser, data: Permissions[Key]['dataType']) => boolean);

type RolesWithPermissions = {
  [R in UserRole]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]['action']]: PermissionCheck<Key>;
    }>;
  }>;
};

type Permissions = {
  post: {
    dataType: Post;
    action: 'create' | 'update' | 'delete';
  };
};

const ROLES = {
  ADMIN: {
    post: {
      create: true,
      update: true,
      delete: true,
    },
  },
  USER: {},
} as const satisfies RolesWithPermissions;

export function hasPermission<Resource extends keyof Permissions>(
  user: ExtendedUser,
  resource: Resource,
  action: Permissions[Resource]['action'],
  data?: Permissions[Resource]['dataType'],
) {
  return user.role.some((role) => {
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[action];
    if (permission === null || permission === undefined) {
      return false;
    }

    if (typeof permission === 'boolean') {
      return permission;
    }
    return data ? permission(user, data) : false;
  });
}
