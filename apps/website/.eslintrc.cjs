/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/react-internal.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    // This setting is required to tell ESLint where to find the tsconfig.json
    // for your app.
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
};