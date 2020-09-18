<template>
  <div>
   <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/backhome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 白色框区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-button type="primary" @click="addRolesDialogVisible = true">添加角色</el-button>
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 行 -->
            <el-row v-for="(item1,i1) in scope.row.children" :key="i1" :class="['bdb', i1 === 0 ? 'bdt': '', 'v-center'] ">
              <!-- 列 一级权限-->
              <el-col :span="5">
                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染 二级 和 三级 -->
              <el-col :span="19">
                <!-- 二级 -->
                <el-row :class="[ i2 === 0 ? '' : 'bdt', 'v-center']" v-for="(item2,i2) in item1.children" :key="i2">
                  <el-col :span="6">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="13">
                    <el-tag v-for="(item3,i3) in item2.children" :key="i3" type="danger" closable @close="removeRolesById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#" ></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
                <!-- 修改 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="checkUsers(scope.row.id)">编辑</el-button>
                <!-- 删除 -->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUserById(scope.row.id)">删除</el-button>
                <!-- 分配 -->
                 <el-tooltip effect="dark" content="角色分配" placement="top" :enterable="false">
                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDiglog(scope.row)">分配角色</el-button>
                </el-tooltip>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 修改角色对话框 -->
      <el-dialog
      title="修改用户"
      :visible.sync="checkDialogVisible"
      width="40%"
      @close="closeCheckDialogVisible">
        <el-form ref="checkRolesListRef" :model="checkRolesList" :rules="checkRolesListRules" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="checkRolesList.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="checkRolesList.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="checkDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="CheckDialogVisible" >确 定</el-button>
        </span>
      </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      width="40%"
      @close="addDialogClosed">
        <el-form ref="addFormRef" :model="addForm" :rules="checkRolesListRules" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDialogVisible" >确 定</el-button>
        </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配用户角色权限"
      :visible.sync="setRightDiglogVisible"
      width="50%"
      @close="closeSetRightDialog">
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defaultKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDiglogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'roles',
  data () {
    return {
      roleName: '',
      roleDesc: '',
      rolesList: [],
      // 控制修改对话框的显示隐藏
      checkDialogVisible: false,
      // 添加框 控制
      addRolesDialogVisible: false,
      // 添加角色用户控制表单数据
      addForm: {
        roleName: '123',
        roleDesc: 'qwer'
      },
      // 存储修改后的对象
      checkRolesList: {},
      // 验证添加框规则
      checkRolesListRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
        ]
      },
      // 设置权限弹出层
      setRightDiglogVisible: false,
      // 存储权限裂变
      rightsList: [],
      // 树形控件的属性绑定
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点ID值数组
      defaultKeys: [],
      // 当前即将分配权限的角色id
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.$axios.get('roles')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.$message.success('获取角色列表成功')
      this.rolesList = res.data
    },
    // 修改用户对话框
    async checkUsers (id) {
      this.checkDialogVisible = !this.checkDialogVisible
      // console.log(id)
      const { data: res } = await this.$axios.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('修改用户信息失败')
      this.checkRolesList = res.data
      // console.log(this.checkRolesList)
    },
    // 监听修改对话框的关闭
    closeCheckDialogVisible () {
      this.$refs.checkRolesListRef.resetFields()
    },
    // 确定修改角色信息
    CheckDialogVisible () {
      this.$refs.checkRolesListRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 请求修改用户的接口
        const { data: res } = await this.$axios.put('roles/' + this.checkRolesList.roleId, {
          roleName: this.checkRolesList.roleName,
          roleDesc: this.checkRolesList.roleDesc
        })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('更新用户失败')
        this.$message.success('修改成功')
        this.checkDialogVisible = false
        this.getRolesList()
      })
    },
    // 添加角色
    addDialogVisible () {
      // console.log('添加角色')
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 发起添加用户的网络请求
        const { data: res } = await this.$axios.post('roles', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加成功')
        // 隐藏添加用户对话框
        this.addRolesDialogVisible = false
        // 重新获取用户列表渲染
        this.getRolesList()
      })
    },
    // 关闭添加角色提示框 清空
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 根据id删除 角色
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
      const { data: res } = await this.$axios.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.info('删除用户失败')
      this.$message.success('删除用户成功')
      this.getRolesList()
    },
    // 根据id删除 权限
    async removeRolesById (role, rightId) {
      const confirmResult = await this.$confirm('确定删除该权限么', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$axios.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.info('删除用户权限失败')
      this.$message.success('删除用户权限成功')
      // 重新赋值
      role.children = res.data
    },
    // 展示权限弹出层
    async showSetRightDiglog (role) {
      this.roleId = role.id
      // 获取所有权限列表
      const { data: res } = await this.$axios.get('rights/tree')
      this.rightsList = res.data
      console.log(this.rightsList)
      // 递归获取三级节点的ID
      this.getLeafKeys(role, this.defaultKeys)
      this.setRightDiglogVisible = true
    },
    // 通过递归形式，获取角色下所有三级权限的id，板寸到defaultKeys中
    // node 节点，arr 数组保存
    getLeafKeys (node, arr) {
      // 若当前node不包含children 属性，是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 分配权限对话框关闭
    closeSetRightDialog () {
      this.defaultKeys = []
    },
    // 点击确定为角色分配权限
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys)
      // 拼接id
      const idStr = keys.join(',')
      const { data: res } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.danger('分配权限失败')
      }
      this.$message.success('分配成功')
      this.getRolesList()
      this.setRightDiglogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.el-tag{
  margin: 10px;
}
.bdt{
  border-top: 1px solid #ccc
}
.bdb{
  border-bottom: 1px solid #ccc
}
.v-center{
  display: flex;
  align-items: center;
}
</style>
