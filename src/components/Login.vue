<template>
  <div class="login-content">
    <div class="login-box">
      <!-- 头像 -->
      <div class="login-avatar">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单 -->
      <el-form label-width="0px" class="login-input" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="密码" prefix-icon="iconfont icon-password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="loginBtn">登录</el-button>
          <el-button type="info" @click="loginInputReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'login',
  data () {
    return {
    //   表单数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      //   表单验证规则
      loginFormRules: {
        // 验证用户名
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        // 验证密码
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置文本输入框
    loginInputReset () {
      //  console.log(this.loginForm.username, this.loginForm.password)
      //  错误重置
      this.$refs.loginFormRef.resetFields()
      //  清空文本框
      this.loginForm.username = this.loginForm.password = ''
    },
    // 点击进行登录
    loginBtn () {
      // 预验证
      this.$refs.loginFormRef.validate(async (val) => {
        if (!val) return
        const { data: res } = await this.$axios.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败，请检查你的用户名或者密码')
        this.$message.success('登录成功')
        console.log(res)
        // 存token
        window.sessionStorage.setItem('token', res.data.token)
        // 存username
        window.sessionStorage.setItem('username', res.data.username)
        // // 登录跳转
        this.$router.push('/backhome')
      })
    }
  },
  created () {
    // 按下回车执行登录按钮点击事件
    var _self = this
    document.onkeydown = function (e) {
      var key = window.event.keyCode
      if (key == 13) {
        _self.loginBtn()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.login-content {
  background: skyblue;
  height: 100%;
}
.login-box {
  height: 300px;
  width: 450px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .login-avatar {
    height: 130px;
    width: 130px;
    border-radius: 50%;
    background: #fff;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px #ddd;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      border: 1px solid #ccc;
    }
  }
}
.login-input {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
