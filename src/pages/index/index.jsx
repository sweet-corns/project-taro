import Taro from '@tarojs/taro'
import { useState } from 'react'
import { Button, View } from '@tarojs/components'
import { Loading } from '../../components/loading'

import { useAsyncEffect } from '../../utils/index'

function Index() {
  const [loading, setLoading] = useState(true)

  useAsyncEffect(async () => {
    try {
      // 请求数据在这里
      setLoading(false)
    } catch (error) {
      setLoading(true)
    }
  }, [])
  // 在线预览PDF
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
  // 扫一扫功能
  const gotoScan = () => {
    Taro.navigateTo({
      url: '/pages/scanPage/index',
    })
  }

  const contentEl = loading ? <Loading />
    : (
      <View>
        <Button onClick={gotoPDF} >在线预览pdf</Button>
        <Button onClick={gotoScan} >扫一扫功能</Button>
      </View>

    )

  return (
    <View className='index'>
      {contentEl}
    </View>
  )
}

export default Index
