const os = require('os')
const totalMem = os.totalmem()

const percentage = 0.5

module.exports = (config) => {
  config.plugin('fork-ts-checker').tap((args) => {
    console.log(args[0])
    const allowUseMem = Math.floor((totalMem / 1024 / 1024) * percentage)
    args[0].memoryLimit = allowUseMem
    return args
  })
}
