import type { ExtendedUser } from '@/types/next-auth';
import type { Prisma, UserRole } from '@prisma/client';

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: ExtendedUser) => Permissions[Key]['prismaWhereInput']);

type RolesWithPermissions = {
  [R in UserRole]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]['action']]: PermissionCheck<Key>;
    }>;
  }>;
};

export type Permissions = {
  post: {
    prismaWhereInput: Prisma.PostWhereInput;
    action: 'create' | 'update' | 'delete' | 'read';
  };
  users: {
    prismaWhereInput: Prisma.UserWhereInput;
    action: 'list';
  };
  messages: {
    prismaWhereInput: Prisma.MessageWhereInput;
    action: 'list';
  };
};

const ROLES = {
  ADMIN: {
    post: {
      create: true,
      update: (user: ExtendedUser) => {
        return { authorId: user.id };
      },
      delete: (user: ExtendedUser) => {
        return { authorId: user.id };
      },
      read: true,
    },
    users: {
      list: true,
    },
    messages: {
      list: true,
    },
  },
  USER: {},
} as const satisfies RolesWithPermissions;

export function withPermission<Resource extends keyof Permissions>(
  user: ExtendedUser,
  resource: Resource,
  action: Permissions[Resource]['action'],
): { hasPermission: boolean; whereInput?: Permissions[Resource]['prismaWhereInput'] | undefined } {
  let resultWhereInput: Permissions[Resource]['prismaWhereInput'] | undefined;
  let directPermission = false;

  user.role.forEach((role) => {
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[action];
    if (permission === null || permission === undefined) {
      return;
    }
    if (typeof permission === 'boolean') {
      if (permission === true) {
        directPermission = true;
      }
    } else if (typeof permission === 'function') {
      const whereInput = permission(user);
      if (!resultWhereInput) {
        resultWhereInput = whereInput;
      }
    }
  });

  return {
    hasPermission: directPermission,
    whereInput: resultWhereInput,
  };
}
