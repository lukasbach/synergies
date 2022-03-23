# Typed React Package Starter

![Testing](https://github.com/lukasbach/chakra-ui-deepdive/workflows/Testing/badge.svg)
![Pretty](https://github.com/lukasbach/chakra-ui-deepdive/workflows/Pretty/badge.svg)
![Storybook Deployment](https://github.com/lukasbach/chakra-ui-deepdive/workflows/Storybook%20Deployment/badge.svg)

A template for repositories of custom React components and hooks, properly typed with Typescript, divided
into sub packages with Lerna and visually testable with Storybook. `packages/` includes two examples for
subpackages that you can build upon: `packages/component-package` with a sample implementation of a custom
react component, including a _spec_ test-file, a storybook story and a MDX-based storybook documentation; And
`packages/hook-package` with a sample implementation of a custom react hook, including a hook test implementation
and a storybook story.

It also automatically deploys the storybook to GitHub Pages. You can view the default storybook here:

https://lukasbach.github.io/chakra-ui-deepdive

## Setup

- Create a new repo based off this template by [by clicking here](https://github.com/lukasbach/chakra-ui-deepdive/generate)
- Deployment automatically happens. Initialize GitHub Pages by going to the Repo's settings, scrolling down to
  _GitHub Pages_, selecting the `gh-pages` branch and click on _Save_ (root directory is fine).
- Implement your components and hooks by copying the template packages. Make sure to adapt the package names, repository
  url and author in the respective `package.json` files.
- Make sure to remove the template packages if you don't need them anymore. You can always copy them from the original
  template repo again.

When developing locally, run in the root directory...

- `yarn` to install dependencies
- `yarn test` to run tests in all packages
- `yarn build` to build distributables and typings in `packages/{package}/out`
- `yarn storybook` to run a local storybook server
- `yarn build-storybook` to build the storybook
- [`npx lerna version`](https://github.com/lerna/lerna/tree/main/commands/version#readme) to interactively bump the
  packages versions. This automatically commits the version, tags the commit and pushes to git remote.
- [`npx lerna publish`](https://github.com/lerna/lerna/tree/main/commands/publish#readme) to publish all packages
  to NPM that have changed since the last release. This automatically bumps the versions interactively.
