const os = require('os')
const totalMem = os.totalmem()

const percentage = 0.5

module.exports = (config) => {
  config.plugin('fork-ts-checker').tap((args) => {
    args[0].memoryLimit = Math.floor((totalMem / 1024 / 1024) * percentage)
    return args
  })
}
