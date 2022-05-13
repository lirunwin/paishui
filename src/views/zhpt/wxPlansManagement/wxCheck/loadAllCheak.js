const resultComps = {}
const requireComponent = require.context('./component', true, /\.vue$/)
requireComponent.keys().forEach(fileName => {
  const comp = requireComponent(fileName)
  const files = fileName.replace(/^\.\/(.*)\.\w+$/, '$1').split('/')
  resultComps[files[files.length - 1]] = comp.default
})
export default resultComps
