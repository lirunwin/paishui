import defaultSettings from '@/settings'

const title = defaultSettings.sysTitle

// 浏览器标题名称   title
export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle}`
  }
  return `${title}`
}
