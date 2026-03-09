import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "AI Know-How",
  tagline: "Comprehensive AI Training for Devs",
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],
  staticDirectories: ["static"],

  // Set the production url of your site here
  url: "https://cmartineztdl.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/ai-knowhow/",

  // GitHub pages deployment config.
  organizationName: "cmartineztdl",
  projectName: "ai-knowhow",
  deploymentBranch: "gh-pages",
  trailingSlash: false,

  onBrokenLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
        gtag: {
          trackingID: "G-89TB1HSVLW", // <--- Add your GA4 tracking ID here
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    metadata: [
      {
        name: "keywords",
        content:
          "AI, artificial intelligence, course, free, programming, software engineering, developer tools",
      },
      {
        name: "google-site-verification",
        content: "DlhRcafVGyGrd1NZ5UZ0RYKT8zF2oDzXXfWW7cFlKco",
      },
    ],
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "AI Know-How",
      logo: {
        alt: "AI Know-How Logo",
        src: "img/logo.webp",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Content",
        },
        {
          href: "https://github.com/cmartineztdl/ai-knowhow",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Content",
              to: "/docs/COURSE_OUTLINE",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/cmartineztdl/ai-knowhow",
            },
            {
              label: "☕ Buy Me a Coffee",
              href: "https://buymeacoffee.com/cmartineztdl",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AI Know-How. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
