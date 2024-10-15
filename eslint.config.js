import globals from 'globals';
import pluginJs from '@eslint/js';
// import babelParser from '@babel/eslint-parser';

export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
    },
  },
];
