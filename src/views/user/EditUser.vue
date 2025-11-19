<template>
<!-- 抽屉框 -->
<el-drawer
v-model="drawerVisible"
title="编辑用户"
direction="rtl"
size="30%"
:before-close="handleDrawerClose"
class="user-drawer"
:with-header="false"
>
<el-form :model="userForm" :rules="rules" label-width="80px" class="drawer-form">
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="userForm.email" placeholder="请输入邮箱" />
  </el-form-item>
  <el-form-item label="用户名" prop="username">
    <el-input v-model="userForm.username" placeholder="请输入用户名" />
  </el-form-item>
  <el-form-item label="更新密码">
  <!-- 单选框选择是否修改密码 -->
  <el-checkbox v-model="showPasswordInput">设置新密码</el-checkbox>
</el-form-item>

<!-- 如果选择了 "设置新密码"，才显示输入框 -->
<el-form-item v-if="showPasswordInput" prop="password">
  <el-input
    v-model="userForm.password"
    :type="passwordVisible ? 'text' : 'password'"
    placeholder="请输入新密码"
    clearable
  >
    <template #suffix>
      <el-icon style="cursor: pointer;" @click="togglePasswordVisibility">
        <component :is="passwordVisible ? View : Hide" />
      </el-icon>
    </template>
  </el-input>
</el-form-item>

  <el-form-item label="手机号" prop="phone">
    <el-input v-model="userForm.phone" placeholder="请输入手机号" />
  </el-form-item>
  <el-form-item label="角色" prop="role">
    <el-select v-model="userForm.role" placeholder="请选择角色">
      <el-option label="管理员" value="admin" />
      <el-option label="普通用户" value="user" />
    </el-select>
  </el-form-item>
</el-form>
<div class="drawer-footer">
  <el-button style="width: 100px !important;" size="small" @click="handleDrawerClose">取消</el-button>
  <el-button style="width: 100px !important;" size="small" type="primary" @click="confirmSubmit">提交</el-button>
</div>
</el-drawer>
</template>
<script>
import { reactive, ref, toRaw, watch } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { View, Hide } from '@element-plus/icons-vue'
import { encryptPassword } from '@/utils/encrypt'
export default {
  name: 'EditUser',
  setup(_, { emit }) {
    const drawerVisible = ref(false)
    const passwordVisible = ref(false)
    const showPasswordInput = ref(false) // 复选框状态
    const userForm = reactive({
      email: '',
      username: '',
      phone: '',
      role: '',
      password: ''
    })
    const rules = reactive({
      username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度应为 3 至 20 个字符', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '邮箱不能为空', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
      ],
      phone: [
        { required: true, message: '手机号不能为空', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: ['blur', 'change'] }
      ],
      role: [{ required: true, message: '请选择角色', trigger: 'change' }]
    })
    const openDrawer = (user = null) => {
      if (user) {
        Object.assign(userForm, user) // 填充用户数据
        console.log('openDrawer 传入的用户:', user)
      } else {
        Object.assign(userForm, { id: '', email: '', username: '', phone: '', role: '' }) // 清空数据
      }
      showPasswordInput.value = false // 复选框默认不选中
      drawerVisible.value = true
    }

    const handleDrawerClose = () => {
      drawerVisible.value = false
    }
    // 监听 `passwordOption`，如果选择 "不修改密码"，清空密码
    watch(showPasswordInput, (newVal) => {
      if (newVal === '') {
        userForm.password = ''
      }
    })
    // 处理密码输入框的显示/隐藏
    const togglePasswordInput = () => {
      passwordOption.value = passwordOption.value === "set-password" ? "" : "set-password"
    }

    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value
    }


    const confirmSubmit = () => {
      ElMessageBox.confirm('您确定要提交用户信息吗？', '确认提交', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const userData = {...toRaw(userForm)}
          if (showPasswordInput.value && userForm.password) {
            const encrypted = encryptPassword(userForm.password)
            if (!encrypted) {
              ElMessage.error('密码加密失败，请检查公钥')
              return
           }
           userData.password = encrypted  // 覆盖 password 字段
         } else {
          delete userData.password  // 如果未勾选“设置新密码”，删除 password
         }
        emit('update-user', userData)
        handleDrawerClose()
        })
        .catch(() => {
          console.log('提交已取消')
        })
    }

    return {
      drawerVisible,
      passwordVisible,
      userForm,
      rules,
      openDrawer,
      handleDrawerClose,
      togglePasswordInput,
      togglePasswordVisibility,
      confirmSubmit,
      showPasswordInput,
      View,
      Hide
    }
  }
}

</script>

<style scoped>
.drawer-form {
  padding: 30px;
  max-width: 400px; /* 限制输入框宽度 */
  margin-left: 0; /* 靠左对齐 */
  overflow-y: auto; /* 如果内容超出视图，则支持滚动 */
  height: calc(100% - 60px); /* 留出按钮区域的空间 */
  box-sizing: border-box;
}

.drawer-form .el-form-item {
  margin-bottom: 30px; /* 设置底部间隔 */
}

.drawer-footer {
  display: flex;
  justify-content: center; /* 水平居中 */
  gap: 10px;
  margin-bottom: 20px;
}
</style>