# ONI-geyser-calculator

Good Geyser Not Included

## 关于 i18n

本项目使用的 i18n 插件基于 https://github.com/ekoz/jquery-i18n 修改。

### 使用方法

- 在 HTML 文件中给需要翻译的文本包裹一个标签（或父级标签），将该标签设置一个 `lang-key` 属性作为资源，用于检索翻译文本。
- 在 JS 脚本中使用 `$.i18n.prop('xxx'[, param1, param2...])` 来获取资源；  
  关于参数传递，在文本中使用 `${0}`、 `${1}` 即可替换

> 需要注意的是，你不能在该标签中再添加任何子标签（如 `<p lang-key='xx'><img /></p>`），否则子标签将会被移除。

> `lang-key` 属性最好只包含字母、数字和下划线，否则可能会出现无法预知的问题。

文本库位于 `./lang/language.js`

当在文本库中没有检索到翻译时，将显示默认的文本。

> 文本库中 `title` 资源必须存在，因为其涉及页面标题翻译的问题

## 关于截图识别

接口存放在 `./api` 目录下，需要 nodejs 8+ 环境, 部署时需要在 `./api` 下创建一个 `.env` 的文件，用于保存百度AI OCR API的鉴权数据，其内容如下

``` ini
# ./api/.env
PORT = 3000 # node 服务运行端口
CLIENT_ID = xxx # Baidu API Client ID
CLIENT_SECRET = xxx # Baidu API Client Secret

```
### 启动接口服务

``` bash
cd api
npm install # 安装依赖
npm install -g pm2 # 安装 pm2 (一种可自动重启 node 脚本的服务, 注意不要使用 root 角色执行该命令，下同)
pm2 start index.js --name ONI --watch # 以 daemon 方式启动服务以防机器重启或进程挂掉
pm2 log ONI # 查看访问日志
```
