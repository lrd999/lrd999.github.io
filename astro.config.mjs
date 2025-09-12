// @ts-check
import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'
import starlight from '@astrojs/starlight'
import mdx from '@astrojs/mdx'
import rehypeExternalLinks from 'rehype-external-links'
import blogs from './src/content/docs/blogs.js'

// https://astro.build/config
export default defineConfig({
  site: 'https://lrd999.github.io',
  integrations: [
    starlight({
      title: 'zZ 的博客',
      favicon: '/favicon.svg',
      logo: { src: './src/assets/logo.svg' },
      // social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/lrd999' }],
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      sidebar: blogs,
    }),
    mdx(),
  ],
  vite: {
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  },
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['nofollow', 'noopener', 'noreferrer'],
          content: { type: 'text', value: ' 🔗' },
        },
      ],
    ],
  },
})
