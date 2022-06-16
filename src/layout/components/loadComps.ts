const resultComps = {}
const requireComponent = require.context(
  '@/views', // 在当前目录下查找
  true, // 不遍历子文件夹
  /\widget.vue$/ // 正则匹配 以 .vue结尾的文件
)
requireComponent.keys().forEach((fileName) => {
  const comp = requireComponent(fileName)
  const files = fileName.replace(/^\.\/(.*)\.\w+$/, '$1').split('/')
  if (['monitoring', 'business'].includes(files[0])) {
    const names = [...files]
    names.pop()
    resultComps[`/${names.join('/')}`] = comp.default
  } else {
    resultComps[files[files.length - 2]] = comp.default
  }
})
console.log(resultComps)
export default resultComps
