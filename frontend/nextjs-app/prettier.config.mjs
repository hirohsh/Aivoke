// prettier.config.mjs
/** @type {import("prettier").Config} */
const config = {
  // コード整形ルール
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 100,
  endOfLine: 'lf',

  // Tailwind CSS クラスソート用プラグイン
  plugins: ['prettier-plugin-tailwindcss'],

  // CSSファースト（v4）向けのエントリポイント指定
  tailwindStylesheet: './src/styles/globals.css',
};

export default config;
