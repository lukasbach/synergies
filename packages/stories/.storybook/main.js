const path = require("path")

const toPath = (_path) => path.join(process.cwd(), _path)

module.exports = {
  stories: ['../**/*.stories.@(js|jsx|mdx|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-actions', '@storybook/addon-links'],
  refs: () => ({}),
  typescript: {
    check: true,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
        module: 'CommonJS',
      },
    },
  },
};
