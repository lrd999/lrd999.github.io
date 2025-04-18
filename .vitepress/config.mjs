import fe from '../fe'
import demo from '../demo'

export default {
  title: 'zZ的博客', //站点标题
  lang: 'zh-CN',
  markdown: {
    // lineNumbers: true,// 代码块的行号
  },
  themeConfig: {
    siteTitle: 'zZ的博客', // 导航栏文字
    logo: '/logo.png', // 网站 logo
    // 社交账户链接
    socialLinks: [{ icon: 'github', link: 'https://github.com/lrd999' }],
    // 添加 favicon
    head: [['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]],
    // 导航栏配置
    nav: [
      { text: '前端', link: '/fe/browser/dom' },
      // { text: 'demo', link: '/demo' },
    ],
    // 左侧边栏配置
    sidebar: {
      '/fe/': fe,
      '/demo/': demo,
    },
    // 右侧大纲
    outline: {
      level: 'deep', // 显示的目录层级
      label: '目录', // 显示在 outline 上的标题
    },
    sidebarMenuLabel: '文章列表', // 移动端 左侧边栏收起时，显示的文本
    returnToTopLabel: '回顶部 ↑', // 移动端 点击大纲时，回顶部按钮的文本
    docFooter: {
      prev: '上一篇', // 文字末尾 上篇文章按钮的文本
      next: '下一篇', // 文字末尾 上篇文章按钮的文本
    },
    // 开启本地搜索
    search: { provider: 'local' },
  },
  externalLinkIcon: true, // 外部链接旁显示图标
  ignoreDeadLinks: 'localhostLinks', // 忽略为localhost类型的无效连接
}
