import { reactConfig } from '@astu/eslint-config';

export default [
  ...reactConfig,
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
];
