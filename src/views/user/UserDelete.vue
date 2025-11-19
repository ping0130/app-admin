<template>
    <el-dialog v-model="visible" title="删除用户" width="400px">
      <p>确定要删除用户 "{{ user.username }}" 吗？</p>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="danger" @click="confirmDelete">删除</el-button>
      </template>
    </el-dialog>
</template>
<script>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
export default {
  name: 'DeleteUser',
  setup(_, { emit }) {
    const store = useStore()
    const visible = ref(false)
    const user = ref({})
    const openDeleteDialog = (selectedUser) => {
      console.log('打开删除弹窗', selectedUser)
      user.value = { ...selectedUser }
      visible.value = true
    }
    const confirmDelete = async() => {
      try {
        await store.dispatch('user/deleteUser', { id: user.value.id })
        ElMessage.success('用户删除成功')
        emit('user-deleted')
        visible.value = false
      } catch (error) {
        ElMessage.error('删除失败，请稍后重试')
      }
    }
    return {
      visible,
      user,
      openDeleteDialog,
      confirmDelete
    }
  }
}
</script>

