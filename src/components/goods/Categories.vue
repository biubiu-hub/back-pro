<template>
  <div>
    <h3>categories</h3>
  </div>
</template>

<script>
export default {
  name: 'categories',
  data () {
    return {}
  },
  created () {
    this.getSocketData()
  },
  methods: {
    getSocketData (symbol) {
      const data = { event: 'subscription', data: 'market.kline.' + symbol }
      this.sendMsg(data, (ev) => {
        console.log(JSON.parse(ev.data), 'K线相关数据')
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
