module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    "prettier/prettier": "warn",
    "max-len": [0, 100, "error"],
    "no-console": "warn",
    "no-debugger": "warn",
    "boundaries/element-types": [
      2,
      {
        "default": "allow",
        "rules": [
          {
            "from": "pages",
            "disallow": [["pages", { "folder": "src" }]]
          },
          {
            "from": "components",
            "disallow": [["pages", { "folder": "src" }]]
          }
        ]
      }
    ],
    "import/default": "off",
    "import/no-cycle": "warn",
    "import/no-named-as-default-member": "off",
    "semi": "off",
    "@typescript-eslint/semi": "warn",
    "@typescript-eslint/ban-ts-comment": "warn",
    "react/jsx-filename-extension": [
      2,
      {
        "extensions": [".js", ".jsx", ".tsx"]
      }
    ],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/array-type": [
      "error",
      {
        "default": "array"
      }
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "enum",
        "format": ["StrictPascalCase"]
      },
      {
        "selector": "enumMember",
        "format": ["UPPER_CASE"]
      },
      {
        "selector": "interface",
        "format": ["PascalCase"]
      }
    ],
    "react/jsx-sort-props": [
      "warn",
      {
        "callbacksLast": false,
        "shorthandFirst": true,
        "shorthandLast": false,
        "ignoreCase": true,
        "noSortAlphabetically": true,
        "reservedFirst": true
      }
    ],
    "react/sort-comp": [
      "warn",
      {
        "order": [
          "static-variables",
          "static-methods",
          "instance-variables",
          "lifecycle",
          "everything-else",
          "rendering"
        ],
        "groups": {
          "lifecycle": [
            "displayName",
            "propTypes",
            "contextTypes",
            "childContextTypes",
            "mixins",
            "statics",
            "defaultProps",
            "constructor",
            "getDefaultProps",
            "getInitialState",
            "state",
            "getChildContext",
            "componentWillMount",
            "UNSAFE_componentWillMount",
            "componentDidMount",
            "componentWillReceiveProps",
            "UNSAFE_componentWillReceiveProps",
            "shouldComponentUpdate",
            "componentWillUpdate",
            "UNSAFE_componentWillUpdate",
            "componentDidUpdate",
            "componentWillUnmount"
          ],
          "rendering": ["/^render.+$/", "render"]
        }
      }
    ],
    "implicit-dependencies/no-implicit": ["error", { "peer": true, "dev": true, "optional": true }]
  },
}
