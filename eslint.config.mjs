import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // ==========================================
  // BACKEND - COMMONJS
  // ==========================================
  // El backend de Express usa require/module.exports.
  // Permitimos require() únicamente dentro de /server.
  {
    files: ["server/**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // ==========================================
  // ARCHIVOS IGNORADOS
  // ==========================================
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;