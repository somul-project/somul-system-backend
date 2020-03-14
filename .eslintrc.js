module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "extends": [
    "airbnb-base",
    "plugin:@typescript-eslint/eslint-recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "max-classes-per-file": 0,
    "no-unused-vars": 0,
    "import/no-unresolved": 0,
    "camelcase": 0,
    "class-methods-use-this": 0,
    "import/extensions": [0, "ignorePackages"],
  }
};
