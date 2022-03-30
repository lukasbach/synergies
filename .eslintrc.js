module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  ignorePatterns: ["*.js", "*.d.ts"],
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "prettier/prettier": "error",
    indent: ["error", 2],
    "linebreak-style": "off",
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "react/prop-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off", // TODO
    "@typescript-eslint/ban-types": "off",
  },
};
