<template>
  <div class="user-management">
    <CommonTable
      cardTitle="用户列表"
      :columns="columns"
      :data="tableData"
      :total="total"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :searchFields="[
        { label: '名称', value: 'name' }
      ]"
      @add="openDrawer"
      @edit="editUser"
      @del="handleDelete"
      @status="onStatusChange"
      @update:current-page="handlePageChange"
      @update:page-size="handlePageSizeChange"
    />
    <AddUser ref="addUserRef" @submit-user="submitAddUser" />
    <EditUser ref="editUserRef" @update-user="submitEditUser" />
    <UserDetail :userData="selectedUser" :show="showDetail" @close="showDetail = false" @detail-user="detailUser"/>
    <DeleteUser ref="deleteUserRef" @user-deleted="fetchUsers" />

  </div>
</template>


<script>
import { computed, ref, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { ElMessageBox, ElMessage } from 'element-plus'
import AddUser from './AddUser.vue'
import EditUser from './EditUser.vue'
import UserDetail from './UserDetail.vue'
import DeleteUser from './UserDelete.vue'
import CommonTable from '@/components/Table/CommonTable.vue'
export default {
  name: 'UserList',
  components: {
    AddUser,
    EditUser,
    UserDetail,
    DeleteUser,
    CommonTable
  },
  setup() {
    const store = useStore()
    const tableData = computed(() => store.state.user.users)
    const total = computed(() => store.state.user.total)
    const columns = [
      { label: 'ID', prop: 'id', minWidth: 50 },
      { label: '名称', prop: 'username' },
      { label: '权限', prop: 'role' },
      { label: '邮箱', prop: 'email' },
      { label: '手机号码', prop: 'phone' },
      { label: '状态', prop: 'status' },
    ]
    const searchQuery = ref('')
    const searchField = ref('')
    const selectedUser = ref({})
    const showDetail = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const addUserRef = ref(null)
    const editUserRef = ref(null)
    const deleteUserRef = ref(null)
    const openDrawer = () => {
      if (addUserRef.value) {
        addUserRef.value.openDrawer()
      } else {
        console.warn('AddUser组件未挂载')
      }
    }

    // 请求用户列表
    const fetchUsers = async() => {
      const params = {
        page: currentPage.value,
        size: pageSize.value,
        searchField: searchField.value,
        searchQuery: searchQuery.value
      }
      try {
        await store.dispatch('user/userlist', params) // 触发 Vuex action
        //pagination.value.total = store.state.user.total // 更新分页总数
      } catch (error) {
        console.error('加载用户列表失败', error)
      }
    }

    // 修改用户状态
    const onStatusChange = async(user, newStatus) => {
      try {
        const confirm = await ElMessageBox.confirm(
          `确定将用户 ${user.username} 的状态更改为 ${newStatus === 'active' ? '启用' : '禁用'} 吗？`,
          '确认操作',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(() => false)

        if (!confirm) {
          return
        }

        await store.dispatch('user/updateStatus', { id: user.id, status: newStatus })
        fetchUsers();// 确保状态同步
      } catch (error) {
        console.error('状态更新失败:', error)
      }
    }

    const handleSearch = () => {
      if (!searchQuery.value.trim()) {
        ElMessage.warning('请输入搜索内容')
        return
      }
      currentPage.value = 1  // ✅ 改成这个，pagination 根本不存在
      fetchUsers()
    }

    const submitAddUser = async(userData) => {
      try {
        const response = await store.dispatch('user/register', userData)
        if (response.success) {
          ElMessage.success('用户创建成功')
          fetchUsers()
        } else {
          ElMessage.error('用户创建失败')
          console.warn('用户创建失败')
        }
      } catch (error) {
        ElMessage.error('用户创建失败，请稍后重试')
        console.error('用户创建失败', error)
      }
    }

    const editUser = (user) => {
      if (editUserRef.value) {
        editUserRef.value.openDrawer(user)
      } else {
        console.error('editUserRef 未正确赋值')
      }
    }

    const submitEditUser = async(user) => {
      try {
        if (!user) {
          ElMessage.error('用户数据不完整，无法更新')
          return
        }
        if (!user.id) {
          ElMessage.error('用户 ID 不能为空')
          return
        }
        await store.dispatch('user/update', {
          id: user.id,
          userData: user
        })
        ElMessage.success('用户信息更新成功')
        fetchUsers()
      } catch (error) {
        ElMessage.error(error.message || '操作失败，请稍后重试')
      }
    }
    const detailUser = (user) => {
      if (editUserRef.value) {
        editUserRef.value.openDrawer(user)
      } else {
        console.error('editUserRef 未正确赋值')
      }
    }
    const viewDetails = (user) => {
      selectedUser.value = { ...user }
      showDetail.value = true
    }
    const openDeleteDialog = async(user) => {
      await nextTick()
      if (deleteUserRef.value) {
        deleteUserRef.value.openDialog(user)
      } else {
        console.error('DeleteUser 组件尚未挂载')
      }
    }
    const handleDelete = (user) => {
      if (deleteUserRef.value) {
        // ✅ 调用 DeleteProduct 组件中的删除方法
        deleteUserRef.value.openDeleteDialog(user)
      } else {
        ElMessage.error('删除组件未加载')
      }
    }
    // 分页处理函数
    const handlePageChange = (newPag) => {
      currentPage.value = newPag
      fetchUsers()
    }

    const handlePageSizeChange = (newSize) => {
      pageSize.value = newSize
      fetchUsers()
    }

    onMounted(() => {
      fetchUsers()
    })

    return {
      searchQuery,
      searchField,
      tableData,
      handleSearch,
      addUserRef,
      fetchUsers,
      onStatusChange,
      openDrawer,
      submitAddUser,
      editUser,
      submitEditUser,
      editUserRef,
      detailUser,
      selectedUser,
      viewDetails,
      showDetail,
      openDeleteDialog,
      deleteUserRef,
      CommonTable,
      columns,
      handleDelete,
      total,
      handlePageChange,
      handlePageSizeChange,
      currentPage,
      pageSize
    }
  }
}
</script>

<style scoped>
.user-management {
  padding: 20px;
}
.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.search-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
.search-input {
  max-width: 300px;
  flex: 1;
}
.search-select {
  width: 150px;
}
.add-user-btn {
  margin-left: auto;
}
.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
