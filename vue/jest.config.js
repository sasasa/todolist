module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  cache: false,
  verbose: true,
  transformIgnorePatterns: ['/node_modules/(?!vee-validate/dist/rules)'],
}
