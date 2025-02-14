import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'yoks',
  description: 'A simple cross-framework state management solution',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documents', link: '/documents' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/getting-start' },
          { text: 'Update State', link: '/update-state' },
        ],
      },
      {
        text: 'Advanced',
        items: [{}],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/jingegebuguai/yoks' }],
  },
});
