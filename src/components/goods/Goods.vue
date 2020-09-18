<template>
  <div class="test">
    <button @click="sendMsg">点击</button>
  </div>
</template>
<script>
// const qwer = require('../../plugins/webscoket')
export default {
  name: 'test',
  data () {
    return {
      websock: null
    }
  },
  created () {
    this.initWebSocket()
    // this.websock = qwer.init('ws://10.34.29.99:8081/websocket', () => {
    //   console.log('链接成功')
    // }, () => {
    //   console.log('22222')
    // }, () => {
    //   console.log('close已经关闭连接关闭')
    // }, () => {
    //   console.log('链接失败')
    //   // qwer.init()
    // })
  },
  destroyed () {
    // this.websock.close()// 离开路由之后断开websocket连接
  },
  methods: {
    initWebSocket () {
      // 初始化weosocket  ws://10.34.29.99:58080/webSocket
      // 1.创建链接 socket
      // const ws = 'ws://127.0.0.1:8080'
      const ws = 'ws://10.34.29.99:8081/websocket'
      this.websock = new WebSocket(ws)
      // 2.链接服务器socket
      this.websock.onopen = this.websocketonopen
      // 接收服务器发来的消息
      this.websock.onmessage = this.websocketonmessage
      // 监听服务器异常
      this.websock.onerror = this.websocketonerror
      // 监听服务器关闭
      this.websock.onclose = this.websocketclose
    },
    // 连接建立之后执行send方法发送数据
    websocketonopen (e) {
      console.log('服务器链接成功')
      const actions = {
        username: window.sessionStorage.getItem('username')
      }
      this.websocketsend(JSON.stringify(actions))
      // this.websocketsend(actions)
      // this.sendMsg()

      console.log(actions)
    },
    // 连接建立失败重连
    websocketonerror () {
      this.initWebSocket()
    },
    // 数据接收
    websocketonmessage (e) {
      // const redata = JSON.parse(e.data)
      const redata = e.data
      console.log(redata)
      // document.getElementsByClassName('test').innerHtml += `<p>${data.data}</p>`
    },
    // 给服务端发送数据
    websocketsend (Data) {
      // 数据发送
      this.websock.send(Data)
    },
    // 服务器关闭
    websocketclose (err) {
      console.log('服务器关闭', err)
    },
    sendMsg () {
      // setTimeout(() => {
      //   this.websock.send('111')
      // }, 3000)
    }
  }
}
</script><style lang='less'>
</style>
