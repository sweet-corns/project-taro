# 使用Taro开发项目中完成的功能demo:兼容H5端、微信小程序端，适配安卓、ios。
用Taro3 React开发的demo地址： <https://github.com/sweet-corns/project-taro>

拉取项目：git clone https://github.com/sweet-corns/project-taro.git

当前Taro版本：yarn global add @tarojs/cli3.2.5

安装依赖: yarn 或 cnpm install 或 npm install

启动项目：npm run dev:h5 或 npm run dev:weapp 

# 更新说明
1、v1.0.0  完成H5端、微信小程序端在线预览PDF。

2、v1.0.1  完成H5端、微信小程序端扫一扫功能。

# 学习资料
1、Taro: 一个开放式跨端跨框架解决方案 <https://taro.aotu.io/>

2、pdfh5: web/h5/移动端PDF预览插件 <https://github.com/gjTool/pdfh5>

3、weixin-js-sdk:微信公众号开发文档JS-SDK <https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html>

# 具体实现功能代码拉取demo，参考模仿着，如果遇到问题，可留言，乐意解答。

# H5端在线预览PDF编写代码步骤简要概述
1、H5端在线预览PDF

安装插件 npm i pdfh5

2、定义查看PDF的事件，点击触发将pdfUrl地址保存在缓存中，跳转页面pdfPage,做H5端的新开页面访问PDF

3、在新开页面pdfPage中按需加载pdfh5插件,因为直接引入pdfh5在小程序生成之后会报错，记得引入pdfh5.css
<pre><code>
import "pdfh5/css/pdfh5.css"

try {
  // 缓存中的pdfUrl
  let PDFurl = Taro.getStorageSync('pdfUrl')
  if (PDFurl) {
    if (process.env.TARO_ENV === 'h5') {
      // 因为小程序引入报错，所以按需加载 npm i pdfh5
      let Pdfh5 = require('pdfh5')
      //实例化
      this.pdfh5 = new Pdfh5("#Pdf", {
        pdfurl: PDFurl
      });
    }
  }

} catch (e) {
  // Do something when catch error
}

<View className='PdfCss' id="Pdf"></View>
</code></pre>


# 小程序端在线预览PDF编写代码简要概述
1、Taro.downloadFile :下载文件资源到本地,客户端直接发起一个 HTTPS GET 请求，返回文件的本地临时路径，单次下载允许的最大文件为 50MB。

2、Taro.openDocument 新开页面打开文档，支持格式"doc" | "docx" | "xls" | "xlsx" | "ppt" | "pptx" | "pdf" ，支持端weapp

3、定义查看PDF的事件，点击触发，通过内置环境变量process.env.TARO_ENV做好H5端及小程序端的代码区别

<pre><code>
const gotoPDF = () => {
    if (process.env.TARO_ENV === 'h5') {
      Taro.setStorageSync('pdfUrl', 'https://static.zje.com/1619076422102_.pdf')
      Taro.navigateTo({
        url: '/pages/pdfPage/index',
      })
    } else if (process.env.TARO_ENV === 'weapp') {
      Taro.downloadFile({
        url: 'https://static.zje.com/1619076422102_.pdf',
        success: function (res) {
          var filePath = res.tempFilePath
          // Taro.openDocument 新开页面打开文档，支持格式"doc" | "docx" | "xls" | "xlsx" | "ppt" | "pptx" | "pdf" ,支持端weapp
          Taro.openDocument({
            filePath: filePath,
            success: function (res) {
              console.log('打开文档成功')
            }
          })
        }
      })
    }
  }
</code></pre>

 
