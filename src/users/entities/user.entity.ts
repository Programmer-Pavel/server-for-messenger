import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'User' })
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  email!: string;

  @Property()
  password!: string;

  @Property()
  name!: string;

  @Property({ default: false })
  isOnline: boolean = false;

  @Property({ defaultRaw: 'now()' })
  lastSeen!: Date;
}
