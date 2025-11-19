<template>
  <div class="user-management">
    <el-card>
      <!-- 搜索栏 -->
      <div class="search-bar">
        <div class="search-controls">
          <el-input
            v-model="searchQuery"
            placeholder="请输入搜索内容"
            class="search-input"
            clearable
            @keyup.enter="handleSearch"
          />
          <el-select v-model="searchField" placeholder="选择搜索字段" class="search-select">
            <el-option label="ID" value="id" />
            <el-option label="用户名" value="name" />
            <el-option label="角色" value="role" />
            <el-option label="状态" value="status" />
          </el-select>
          <el-button type="primary" class="search-btn" @click="handleSearch">查询</el-button>
        </div>
        <el-button type="success" class="add-user-btn" @click="openDrawer">添加用户</el-button>
      </div>

      <!-- 用户表格 -->
      <el-table :data="users" border stripe style="width: 100%">
        <el-table-column prop="id" label="ID" :min-width="80" />
        <el-table-column prop="username" label="用户名" :min-width="100" />
        <el-table-column prop="email" label="邮箱" :min-width="200" />
        <el-table-column prop="phone" label="手机号" :min-width="150" />
        <el-table-column label="状态" width="120">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="'active'"
              :inactive-value="'inactive'"
              @change="(newStatus) => handleStatusChange(scope.row, newStatus)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" :min-width="100" />
        <el-table-column prop="created_at" label="创建时间"  :min-width="150"/>
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewDetails(scope.row)">详情</el-button>
            <el-button type="warning" size="small" @click="editUser(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="openDeleteDialog(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        :current-page="pagination.page"
        :page-size="pagination.size"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handlePageSizeChange"
      />
    </el-card>
    <AddUser ref="addUserRef" @submit-user="submitAddUser" />
    <EditUser ref="editUserRef" @update-user="submitEditUser" />
    <UserDetail :userData="selectedUser" :show="showDetail" @close="showDetail = false" @detail-user="detailUser"/>
    <DeleteUser ref="deleteUserRef" @user-deleted="fetchUsers" />
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { ElMessageBox, ElMessage } from 'element-plus'
import AddUser from './AddUser.vue'
import EditUser from './EditUser.vue'
import UserDetail from './UserDetail.vue'
import DeleteUser from './UserDelete.vue'
export default {
  name: 'UserList',
  components: {
    AddUser,
    EditUser,
    UserDetail,
    DeleteUser
  },
  setup() {
    const store = useStore()
    const users = ref([]) // 用户数据
    const searchQuery = ref('')
    const searchField = ref('')
    const selectedUser = ref({})
    const showDetail = ref(false)
    const pagination = ref({
      page: 1,
      size: 10,
      total: 0
    })
    const addUserRef = ref(null)
    const editUserRef = ref(null)
    const deleteUserRef = ref(null)
    const openDrawer = () => {
      addUserRef.value.openDrawer()
    }
    // 请求用户列表
    const fetchUsers = async() => {
      const params = {
        page: pagination.value.page,
        size: pagination.value.size,
        searchField: searchField.value,
        searchQuery: searchQuery.value
      }
      try {
        await store.dispatch('user/userlist', params) // 触发 Vuex action
        users.value = store.state.user.users // 获取 Vuex store 中的用户列表
        console.log('用户数据:', users.value)
        pagination.value.total = store.state.user.total // 更新分页总数
      } catch (error) {
        console.error('加载用户列表失败', error)
      }
    }

    // 修改用户状态
    const handleStatusChange = async(user, newStatus) => {
      try {
        const confirm = await ElMessageBox.confirm(
          `确定将用户 ${user.name} 的状态更改为 ${newStatus === 'active' ? '启用' : '禁用'} 吗？`,
          '确认操作',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(() => false)

        if (!confirm) {
          user.status = user.status === 'active' ? 'inactive' : 'active' // 恢复原状态
          return
        }

        await store.dispatch('user/updateStatus', { id: user.id, status: newStatus })
        user.status = newStatus // 确保状态同步
        console.log(`用户 ${user.name} 的状态已更新为 ${newStatus}`)
      } catch (error) {
        console.error('状态更新失败:', error)
        user.status = user.status === 'active' ? 'inactive' : 'active' // 恢复状态
      }
    }

    // 分页处理函数
    const handlePageChange = (newPage) => {
      pagination.value.page = newPage
      fetchUsers()
    }

    const handleSearch = () => {
      if (!searchQuery.value.trim()) {
        ElMessage.warning('请输入搜索内容')
        return
      }
      pagination.page = 1
      fetchUsers()
    }

    const handlePageSizeChange = (newSize) => {
      pagination.value.size = newSize
      pagination.value.page = 1
      fetchUsers()
    }

    const submitAddUser = async(userData) => {
      try {
        const response = await store.dispatch('user/register', userData)
        if (response.success) {
          console.log('用户创建成功')
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
    onMounted(() => {
      fetchUsers()
    })
    return {
      searchQuery,
      searchField,
      users,
      pagination,
      handleSearch,
      handlePageSizeChange,
      handlePageChange,
      addUserRef,
      fetchUsers,
      handleStatusChange,
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
      deleteUserRef
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
