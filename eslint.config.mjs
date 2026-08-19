import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Contenu scolaire : des modules de DONNÉES (un gros littéral exporté par
    // défaut), pas du code applicatif. La règle « nomme ton export par défaut »
    // n'y apporte rien, et leur validité est vérifiée autrement — le
    // générateur `scripts/seed-contenu.mjs` refuse de produire du SQL si une
    // leçon, une question ou un titre de chapitre est mal formé.
    "scripts/contenu/**",
    // Même nature, même raison : les sessions d'examen sont des DONNÉES, et
    // c'est `scripts/seed-annales.mjs` qui refuse de générer si une épreuve est
    // mal formée (puis `_ASSOCIE/sonde-annales.mjs` qui vérifie, en base, que
    // chaque chapitre cité existe bien).
    "scripts/annales/**",
  ]),
]);

export default eslintConfig;
