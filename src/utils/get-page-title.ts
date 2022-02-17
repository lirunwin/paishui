import defaultSettings from '@/settings'

const title = defaultSettings.title || '智慧水务信息化系统'

// 浏览器标题名称   title
export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle}`
  }
  return `${title}`
}
