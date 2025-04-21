// root/eslint.config.cjs
module.exports = {
    env: {
      browser: true,
      node: true,
      es2022: true
    },
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    settings: {
      react: { version: "detect" }
    },
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "prettier"
    ],
    plugins: ["react"],
    rules: {
      // ใส่กฎเพิ่มเติมถ้าต้องการ
    }
  };
  