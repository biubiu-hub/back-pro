<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/backhome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <!-- 搜索 -->
        <el-col :span="8">
          <el-input clearable @clear="getUserList" placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" ></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
            <!-- 状态 -->
            <template slot-scope="scope">
                <!-- 拿取一行的数据{{scope.row}} -->
                <el-switch  v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
                </el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
                <!-- 修改 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="checkUsers(scope.row.id)"></el-button>
                <!-- 删除 -->
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="delUserById(scope.row.id)"></el-button>
                <!-- 分配 -->
                 <el-tooltip effect="dark" content="角色分配" placement="top" :enterable="false">
                     <el-button type="success" icon="el-icon-setting" size="mini" circle @click="setRole(scope.row)"></el-button>
                </el-tooltip>
            </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!-- 添加用户的对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">
        <!-- 添加用户主体区域 -->
        <!-- 用户名 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
        <!-- 密码 -->
          <el-form-item label="密 码" prop="password">
            <el-input type="password" v-model="addForm.password"></el-input>
          </el-form-item>
        <!-- 邮箱 -->
          <el-form-item label="邮箱" prop="email">
            <el-input type="email" v-model="addForm.email"></el-input>
          </el-form-item>
        <!-- 手机号 -->
          <el-form-item label="手机号" prop="mobile">
            <el-input type="mobile" v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户对话框 -->
      <el-dialog
      title="修改用户"
      :visible.sync="checkDialogVisible"
      width="50%"
      @close="closeCheckDialogVisible">
        <el-form ref="checkListRef" :model="checkUserList" :rules="checkListRules" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="checkUserList.username" disabled></el-input>
          </el-form-item>
          <!-- 邮箱 -->
            <el-form-item label="邮箱" prop="email">
              <el-input type="email" v-model="checkUserList.email"></el-input>
            </el-form-item>
          <!-- 手机号 -->
            <el-form-item label="手机号" prop="mobile">
              <el-input type="email" v-model="checkUserList.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="checkDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCheckDialogVisible">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色 -->
       <el-dialog
        title="角色分配"
        :visible.sync="setRoleDialogVisible"
        width="50%"
        @close="closeSetRoleDialog">
        <div>
          <p>当前用户：{{userInfo.username}}</p>
          <p>用户角色：{{userInfo.role_name}}</p>
          <p>分配新角色：
            <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'users',
  data () {
    // 邮箱  正则验证
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 手机号  正则验证
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[3|4|5|7|8][0-9]{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显示几条
        pagesize: 5
      },
      userList: [],
      //  总条数
      total: 0,
      //   添加框 控制
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '123',
        password: '123456',
        email: '123@qq.com',
        mobile: '13212312345'
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // 邮箱正则验证
          { validator: checkEmail, message: '请输入包含‘@’的邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          // 手机号  正则验证
          { validator: checkMobile, message: '请输入符合要求的手机号', trigger: 'blur' }
        ]
      },
      // 控制修改对话框的显示隐藏
      checkDialogVisible: false,
      // 保存修改到的用户对象
      checkUserList: {},
      // 修改表单验证规则
      checkListRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // 邮箱正则验证
          { validator: checkEmail, message: '请输入包含‘@’的邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          // 手机号  正则验证
          { validator: checkMobile, message: '请输入符合要求的手机号', trigger: 'blur' }
        ]
      },
      // 控制分配角色对话框的显示隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色id值
      selectedRoleId: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户
    async getUserList () {
      const { data: res } = await this.$axios.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 监听 条数 改变的事件
    handleSizeChange (newSize) {
    //   console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码 改变
    handleCurrentChange (newPage) {
    //   console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听 state 状态开关
    async userStateChange (userState) {
      console.log(userState)
      const { data: res } = await this.$axios.put(`users/${userState.id}/state/${userState.mg_state}`)
      if (res.meta.status !== 200) {
        userState.mg_state = !userState.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 添加用户框  清空
    addDialogClosed () {
      // this.$refs.addFormRef.resetFields()
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 发起添加用户的网络请求
        const { data: res } = await this.$axios.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加成功')
        // 隐藏添加用户对话框
        this.addDialogVisible = false
        // 重新获取用户列表渲染
        this.getUserList()
      })
    },
    // 修改用户对话框
    async checkUsers (id) {
      this.checkDialogVisible = !this.checkDialogVisible
      // console.log(id)
      const { data: res } = await this.$axios.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('修改用户信息失败')
      this.checkUserList = res.data
      // console.log(this.checkUserList)
    },
    // 监听修改对话框的关闭
    closeCheckDialogVisible () {
      this.$refs.checkListRef.resetFields()
    },
    // 确定修改用户信息
    addCheckDialogVisible () {
      this.$refs.checkListRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 请求修改用户的接口
        const { data: res } = await this.$axios.put('users/' + this.checkUserList.id, {
          email: this.checkUserList.email,
          mobile: this.checkUserList.mobile
        })
        if (res.meta.status !== 200) return this.$message.error('更新用户失败')
        this.$message.success('修改成功')
        this.checkDialogVisible = false
        this.getUserList()
      })
    },
    // 根据id删除用户
    async delUserById (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      // console.log('取消删除')
      const { data: res } = await this.$axios.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.info('删除用户失败')
      this.$message.success('删除用户成功')
      // 删除页面最后一条刷新像前一个跳转
      const totalPage = Math.ceil((this.total - 1) / this.queryInfo.pagesize) // 总页数
      this.queryInfo.pagenum = this.queryInfo.pagenum > totalPage ? totalPage : this.queryInfo.pagenum
      this.queryInfo.pagenum = this.queryInfo.pagenum < 1 ? 1 : this.queryInfo.pagenum
      this.getUserList()
    },
    // 展示分配角色对话框
    async setRole (userInfo) {
      this.userInfo = userInfo
      // 展示对话框之前获取所有的角色列表
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    // 确定保存角色
    async saveRoleInfo () {
      if (!this.selectedRoleId) return this.$message.error('请选择角色')
      const { data: res } = await this.$axios.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectedRoleId
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('更新角色列表失败')
      this.$message.success('更新角色列表成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    // 关闭分配角色对话框
    closeSetRoleDialog () {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
