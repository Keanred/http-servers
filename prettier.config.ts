import { type Config } from 'prettier';

const config: Config = {
  trailingComma: 'all',
  tabWidth: 2,
  semi: true,
  printWidth: 120,
  singleQuote: true,
  bracketSpacing: true,
  endOfLine: 'lf',
  plugins: ['prettier-plugin-organize-imports'],
};

export default config;
