const config = {
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
  overrides: [
    {
      files: ['*.yml', '*.yaml'],
      options: {
        singleQuote: false,
      },
    },
  ],
  importOrder: ['^@/(.*)$', '^\\.\\.(?!/?$)', '^\\./(?!.*\\.css$)[^.].*$', '^.*?.css$'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

export default config;