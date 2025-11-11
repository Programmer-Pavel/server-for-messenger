import { User } from './entities/user.entity';

export const createdUserFields = ['id', 'email', 'name'] as const;
export type CreatedUser = Pick<User, (typeof createdUserFields)[number]>;

export const findedUserFields = ['id', 'email', 'password', 'name'] as const;
export type FindedUser = Pick<User, (typeof findedUserFields)[number]>;
