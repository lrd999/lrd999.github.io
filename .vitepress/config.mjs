import { defineConfig } from 'vitepress'
import SidebarDocs from '../docs'
import SidebarCesium from '../cesium'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'zZ 的博客',
  description: '记录技术博客，让学到的知识更系统化，不容易遗忘。',
  lang: 'zh-CN',
  head: [['link', { rel: 'icon', href: '/logo.svg' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',
    // socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
    search: { provider: 'local' },
    docFooter: { prev: '上一页', next: '下一页' },
    returnToTopLabel: '回顶部',
    externalLinkIcon: true,
    nav: [
      { text: '首页', link: '/' },
      { text: '前端笔记', link: '/docs/utils' },
      { text: 'Cesium 笔记', link: '/cesium/coordinate' },
    ],
    outline: { label: '目录', level: 'deep' },
    sidebar: {
      '/docs/': SidebarDocs,
      '/cesium/': SidebarCesium,
    },
  },
})
