module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/jsx-runtime",
  ],
  ignorePatterns: ["dist", ".eslintrc.js", "node_modules", "*.backup.*"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react", "react-hooks", "react-refresh"],
  rules: {
    // React specific rules
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],

    // General code quality
    "no-console": ["warn", { allow: ["error", "warn"] }],
    "no-debugger": "error",
    "prefer-const": "error",
    "no-var": "error",
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        args: "after-used",
      },
    ],

    // Saudi/Arabic specific
    "max-lines-per-function": ["warn", { max: 50 }],
    complexity: ["error", { max: 15 }],
    "max-depth": ["error", { max: 4 }],
    "max-nested-callbacks": ["error", { max: 3 }],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
