const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // ini biar 'any' tidak error
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
    },
  },
];
