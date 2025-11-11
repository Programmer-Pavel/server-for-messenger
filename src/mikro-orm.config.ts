import 'dotenv/config';
import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

export default defineConfig({
  clientUrl: process.env.DATABASE_URL ?? '',
  metadataProvider: TsMorphMetadataProvider,

  // Ищем сущности по соглашению *.entity.(ts|js)
  // Сканируем только сущности users, чтобы не цеплять старые *.entity.js из других модулей
  entities: ['dist/users/entities/*.entity.js'],
  entitiesTs: ['src/users/entities/*.entity.ts'],

  debug: process.env.NODE_ENV !== 'production',

  // Настройки миграций (генерация в TS в src/migrations)
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: 'src/migrations',
    glob: '!(*.d).{ts,js}',
    snapshot: true,
  },
});
