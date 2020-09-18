<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/backhome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 白色卡片区域 -->
    <el-card>
      <!-- 列表 -->
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" ></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">标签一</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">标签二</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level === '2'">标签三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'roles',
  data () {
    return {
      // 权限列表
      rightsList: []
    }
  },
  methods: {
    // 获取权限列表
    async getRightsList () {
      const { data: res } = await this.$axios.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.$message.success('获取权限列表成功')
      this.rightsList = res.data
    }
  },
  created () {
    this.getRightsList()
  }
}
</script>
<style lang="scss" scoped>
</style>
