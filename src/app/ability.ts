import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';

export interface User {
  id: number;
  role: string;
  permissions: string[];
}

export type AppAbility = MongoAbility;

export function defineAbilityFor(user: User) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  if (user.role === 'admin') {
    can('manage', 'all');
  } else {
    can('read', 'all');
  }

  user.permissions.forEach(permission => {
    const [action, subject] = permission.split(':');
    if (action && subject) {
      can(action, subject);
    }
  });

  return build();
}


