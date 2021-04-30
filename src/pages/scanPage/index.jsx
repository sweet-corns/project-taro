import Taro from '@tarojs/taro'
import { useState } from 'react'
import { Button, View } from '@tarojs/components'
import { useAsyncEffect } from '../../utils/index'
import wx from 'weixin-js-sdk'

function Scan() {
  const [loading, setLoading] = useState(true)

  useAsyncEffect(async () => {
    try {
      // 请求数据在这里
      setLoading(false)
    } catch (error) {
      setLoading(true)
    }
  }, [])

  const onScanFun = () => {
    if (loading) {
      return //防止二次点击
    }
    setLoading(true)
    Taro.showLoading({
      title: '加载中',
    })
    if (process.env.TARO_ENV === 'h5') {
      // 走微信公众号扫一扫
      // onScanCodeWx() demo中得后台接口是模拟得，写入项目中放开这个方法
    } else {
      // 小程序扫码
      Taro.scanCode({
        success: (data) => {
          if (data) {
            // 获取二维码中的参数，调后台接口
            let newObj = JSON.parse(data.result)
            console.log(newObj)
            // 扫码成功以后跳到签到成功页面、释放加载按钮
            setLoading(false)
            Taro.hideLoading()
          }
        },
        fail: (err) => {
          // 扫码签到失败后跳转到失败页面、释放加载按钮
          setLoading(false)
          Taro.hideLoading()
        }
      })
    }
  }

  const onScanCodeWx = () => {
    let tokenUrl = location.href;
    Taro.getSystemInfo({
      success: res => {
        // 1、注意ios调不起扫一扫：把微信JSSDk js 的资源路径换成 https，可能是 iOS 系统自身安全性的原因，生产环境只能引用 https 开头的路径。
        // 2、因为ios上有兼容的问题，微信公众号调取jssdk扫一扫功能，ios第一次进入页面调取失败（需刷新页面才能调取成功，Android正常）的解决方法：
        // 注意：ios第一次进入页面调取失败的原因主要在于传入的path路径，所以ios跟安卓区别了一下 location.href.split('#')[0]，解决了问题。
        if (res && res.system == "iOS") {
          tokenUrl = location.href.split('#')[0]
        } else {
          tokenUrl = location.href;
        }
        let params = {
          appid: '你的appid',
          tokenUrl: tokenUrl
        }
        // 调后台得接口，获取签名
        Taro.request({
          url: 'test/utl', //仅为示例，并非真实的接口地址
          data: params,
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res.data)
            if (res) {
              let perData = res.data
              //获得签名之后传入配置中进行配置
              wxConfig(perData.appId, perData.timestamp, perData.nonceStr, perData.signature);
            }
          },
          fail: function (err) {
            console.log(err)
            Taro.hideLoading()
            setLoading(false)
          }
        })
      }
    })
  }
  const wxConfig = (_appId, _timestamp, _nonceStr, _signature) => {
    wx.config({
      debug: false,// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: _appId,// 必填，公众号的唯一标识
      timestamp: _timestamp,// 必填，生成签名的时间戳
      nonceStr: _nonceStr,// 必填，生成签名的随机串
      signature: _signature,// 必填，签名，见附录1
      jsApiList: ['checkJsApi', 'scanQRCode'],
      // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    })
    wx.ready(function () {
      Taro.hideLoading()
      if (process.env.TARO_ENV === 'h5') {
        onScanCodeWxFun()
      }
    })
    wx.error(function () {
      // 扫码签到失败后跳转到失败页面、释放扫一扫按钮
      Taro.hideLoading()
      setLoading(false)
    })
  }
  const onScanCodeWxFun = () => {
    wx.scanQRCode({
      needResult: 1,
      scanType: ["qrCode", "barCode"],
      desc: 'scanQRCode desc',
      success: function (data) {
        let newObj = JSON.parse(data.resultStr)
        console.log(newObj)
        // 调取签到接口
        Taro.hideLoading()
        // 扫码签到失败后跳转到失败页面、释放扫一扫按钮
        setLoading(false)
      }, error: function (res) {
        Taro.hideLoading()
        // 扫码签到失败后跳转到失败页面、释放扫一扫按钮
        setLoading(false)
      }
    });
  }

  return (
    <View className='index'>
      <Button loading={loading} onClick={onScanFun} >点击扫一扫</Button>
    </View>
  )
}

export default Scan
