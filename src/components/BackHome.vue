<template>
    <el-container class="home-content">
      <!-- 头部区域 -->
      <el-header>
        <div class="home-logo">
          <img src="../assets/logo.png" alt="">
          <span>后台管理系统</span>
        </div>
        <el-button type="primary" @click="logout" class="logout">退出</el-button></el-header>
      <!-- 页面主题 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCloseToggle ? '64px' : '200px'">
          <div class="toggle-button" @click="closeToggle">|||</div>
          <!-- 侧边栏菜单 -->
          <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :collapse="isCloseToggle"
          :collapse-transition="false"
          router
          :default-active="activePath"
          >
            <!-- 一级菜单 -->
            <el-submenu :index="val.id + ''" v-for="val in menuList" :key="val.id">
              <!-- 一级菜单模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <!-- <i class="el-icon-location"></i> -->
                <i :class="iconList[val.id]"></i>
                <span>{{val.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
              :index="'/'+childVal.path"
              v-for="childVal in val.children"
              :key="childVal.id"
              @click="saveNavState('/'+childVal.path)"
              >
                <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <span>{{childVal.authName}}</span>
              </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>
<script>
export default {
  name: 'backhome',
  data () {
    return {
      menuList: [],
      iconList: {
        125: 'iconfont icon-user1',
        103: 'iconfont icon-password',
        101: 'iconfont icon-shangpingouwudai2',
        102: 'iconfont icon-danju-tianchong',
        145: 'iconfont icon-user1'
      },
      isCloseToggle: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取菜单
    async getMenuList () {
      const { data: res } = await this.$axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error('res.meta.msg')
      this.menuList = res.data
      console.log(res)
    },
    closeToggle () {
      this.isCloseToggle = !this.isCloseToggle
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      // this.activePath = this.$route.path
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
  // watch: {
  //   // 监听路有变化，改变高亮
  //   $route: 'saveNavState'
  //   // deep: true
  // }
}
</script>

<style lang="scss" scoped>
.home-content{
  height: 100%;
}
.logout{
}
.el-header{
  display:flex;
  background: #373d41;
  justify-content: space-between;
  align-items: center;
  >div{
    color: #fff;
    font-size: 20px;
    display: flex;
    align-items: center;
    span{
      margin-left: 20px;
    }
    img{
      height: 50px;
      width: 50px;
    }
  }
}
.el-aside{
  background: #333744;
  height: 100%;
  .el-menu{
  border-right: 0;
}
}
.el-main{
  background: cadetblue;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button{
  background: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.3em;
  cursor: pointer;
}

</style>
