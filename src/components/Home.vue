<template>
  <div class="home-content">
      <p @click="logout">退出</p>
  </div>
</template>
<script>
export default {
  name: 'home',
  data () {
    return {
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
