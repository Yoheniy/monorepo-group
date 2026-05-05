import { baseConfig } from '@astu/eslint-config';

export default [
  ...baseConfig,
  {
    ignores: ['node_modules/**', 'prisma/migrations/**'],
  },
];
