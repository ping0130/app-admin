<template>
    <el-drawer v-model="visible" title="用户详情" size="30%" @close="handleClose">
      <el-descriptions column="1" border v-if="selectedUser.username">
        <el-descriptions-item label="用户名">{{ selectedUser.username }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ selectedUser.email }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ selectedUser.phone }}</el-descriptions-item>
        <el-descriptions-item label="角色">
          <el-tag :type="selectedUser.role === 'admin' ? 'danger' : 'info'">
            {{ selectedUser.role === 'admin' ? '管理员' : '普通用户' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ selectedUser.created_at }}</el-descriptions-item>
      </el-descriptions>
      <el-empty v-else description="无用户数据" />
    </el-drawer>
  </template>
<script>
import { ref, watch } from 'vue'
export default {
  name: 'UserDetail',
  props: {
    userData: Object,
    show: Boolean
  },
  setup(props, { emit }) {
    const visible = ref(false)
    const selectedUser = ref({})
    // 监听 props.userData 变化，确保数据正确更新
    watch(
      () => props.userData,
      (newData) => {
        selectedUser.value = newData ? { ...newData } : {}
      },
      { deep: true, immediate: true }
    )
    watch(
      () => props.show,
      (newVal) => {
        visible.value = newVal
      }
    )
    const detailUser = () => {
      emit('detail-user', { ...selectedUser.value }) // 传递选中的用户数据
      visible.value = false // 关闭详情弹窗
    }
    const handleClose = () => {
      visible.value = false
      emit('close')
    }
    return {
      visible,
      selectedUser,
      handleClose,
      detailUser
    }
  }
}
</script>

