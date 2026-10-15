import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: [
      "src/features/finance/components/**/*.tsx",
      "src/features/users/components/UserProfileLink/**/*.tsx",
      "src/components/molecules/DocumentInspector/**/*.tsx",
      "src/components/atoms/PlanProgress/**/*.tsx",
    ],
    ignores: ["**/*.test.tsx"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          group: ["**/api", "**/api/**", "**/axiosInstance", "axios", "@tanstack/react-query"],
          message: "Keep API requests and query/mutation setup in feature hooks and API modules.",
        }],
      }],
      "no-restricted-syntax": ["error", {
        selector: "CallExpression[callee.name='fetch']",
        message: "Move network requests into a feature API module and call it through a hook.",
      }],
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
