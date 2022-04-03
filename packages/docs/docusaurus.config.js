// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Synergies',
  tagline: 'Synergyze your state!',
  url: 'https://lukasbach.github.io/', // TODO
  baseUrl: '/synergies/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'lukasbach', // Usually your GitHub org/user name.
  projectName: 'synergies', // Usually your repo name.

  plugins: [
    [
      'docusaurus-plugin-typedoc',

      // Plugin / TypeDoc options
      {
        entryPoints: ['../synergies/src/index.ts'],
        tsconfig: '../synergies/tsconfig.json',
        sidebar: {
          categoryLabel: 'API',
          position: 3,
          fullNames: true,
        },
      },
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/lukasbach/synergies/tree/main/packages/docs/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/lukasbach/synergies/tree/main/packages/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Synergies',
        logo: {
          alt: 'Synergies Logo',
          srcDark: 'img/logo.svg',
          src: 'img/logo-dark.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'getstarted',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://synergies.js.org',
            label: 'Storybook',
            position: 'left',
          },
          // {to: '/blog', label: 'Blog', position: 'left'},
          {
            label: 'Community',
            href: "https://github.com/lukasbach/synergies/discussions/1",
            position: 'right',
          },
          {
            href: 'https://github.com/lukasbach/synergies',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Get Started',
                to: '/docs/getstarted',
              },
              {
                label: 'API Docs',
                to: '/docs/api',
              },
            ],
          },
          {
            title: 'Project',
            items: [
              {
                label: 'GitHub',
                href: "https://github.com/lukasbach/synergies",
              },
              {
                label: 'Community',
                href: "https://github.com/lukasbach/synergies/discussions/1",
              },
              {
                label: 'Storybook',
                to: "https://synergies.js.org",
              },
            ],
          },
          {
            title: 'More from me',
            items: [
              {
                label: 'My GitHub profile',
                href: 'https://github.com/lukasbach',
              },
              {
                label: 'My personal homepage',
                href: 'https://lukasbach.com',
              },
              {
                label: 'Yana',
                href: 'https://yana.js.org',
              },
              {
                label: 'DevSession',
                href: 'https://devsession.js.org',
              },
              {
                label: 'React Complex Tree',
                href: 'https://rct.lukasbach.com',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} <a href="https://lukasbach.com" target="_blank">Lukas Bach</a>. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
