# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev

# 启动服务报错缺少core-js   运行 
npm install core-js@2   

# 启动服务报错node-sass   运行 
cnpm install node-sass@latest

## 发布

# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix

# 构建测试环境
npm run build:stage

# 构建生产环境(服务器)
npm run build:prod

# 生成后如果遇到cpexcel.js问题解决
var cpt = require('./cpt' + 'able');
改成：
var cpt = cptable;