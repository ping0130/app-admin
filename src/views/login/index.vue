<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">用户登录</h2>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        label-width="0"
        class="login-form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            :type="passwordVisible ? 'text' : 'password'"
            v-model="loginForm.password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            size="large"
          >
          <template #suffix>
             <el-icon style="cursor: pointer;" @click="togglePassword">
                <component :is="passwordVisible ? View : Hide" />
             </el-icon>
          </template>
          </el-input>
        </el-form-item>

        <!-- 验证码：输入框 + 图片同一行 -->
        <el-form-item prop="captcha_code">
          <div class="captcha-wrapper">
            <!-- 验证码输入框 -->
            <el-input
              v-model="loginForm.captcha_text"
              placeholder="请输入验证码"
              clearable
              class="captcha-input"
              size="large"
            />
            <!-- 验证码图片 -->
            <img
              v-if="captchaData.captcha_img"
              :src="captchaData.captcha_img"
              class="captcha-img"
              @click="getCaptcha"
              alt="点击刷新验证码"
            />
            <span v-else>验证码获取失败,加载中...</span>
          </div>
        </el-form-item>

        <!-- 登录按钮 -->
        <el-form-item class="fixed-width-item">
          <el-button
            type="primary"
            block
            :loading="loading"
            @click="handleLogin"
            size="large"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { User, Lock, View, Hide } from '@element-plus/icons-vue'

export default {
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()
    // 登录表单
    const loginForm = reactive({
      username: '',
      password: '',
      captcha_id: '', 
      captcha_text: ''
    })



    // 校验规则
    const rules = {
      username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      captcha_text: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
    }

    const loginFormRef = ref(null)
    const loading = ref(false)

    // 密码可见性
    const passwordVisible = ref(false)
    const togglePassword = () => {
      passwordVisible.value = !passwordVisible.value
    }

    // 验证码数据
    const captchaData = reactive({
      captcha_id: '',
      captcha_img: ''
    })

    // 获取验证码接口
    const getCaptcha = async () => {
      try {
        const { data } = await axios.get('http://10.0.1.139:5000/admin/user/captcha')
        captchaData.captcha_id = data.captcha_id
        captchaData.captcha_img = data.captcha_img
        loginForm.captcha_id = data.captcha_id
      } catch (error) {
        console.error('获取验证码失败:', error)
        ElMessage.error('获取验证码失败，请稍后重试')
      }
    }

    onMounted(() => {
      getCaptcha()
    })

    // 登录逻辑
    const handleLogin = () => {
      if (!loginFormRef.value) return
      loginFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          try {
            // 封装好的 user/login action（需在 store/modules/user.js 实现）
            await store.dispatch('user/login', {
              username: loginForm.username,
              password: loginForm.password,
              captcha_text: loginForm.captcha_text,
              captcha_id: captchaData.captcha_id
            })
            ElMessage.success('登录成功！')
            router.push('/')
          } catch (err) {
            console.error('登录失败:', err)
            // 刷新验证码
            getCaptcha()
          } finally {
            loading.value = false
          }
        }
      })
    }

    return {
      loginForm,
      rules,
      captchaData,
      loginFormRef,
      loading,
      passwordVisible,
      togglePassword,
      getCaptcha,
      handleLogin,
      Lock,
      User,
      View,
      Hide
    }
  }
}
</script>
<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; // 全屏
  background-color: #fff; // 白色背景
}

.login-card {
  width: 650px;
  padding: 20px;
  box-sizing: border-box;
}

.login-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 30px;
  color: #333;
}

.login-form {
  .el-form-item {
    margin-bottom: 20px;
  }
}

/* 重点：让输入框和验证码图片在同一行 */
.captcha-wrapper {
  display: flex;           // 同行显示
  align-items: center;     // 垂直居中

  .captcha-input {
    width: 280px;          // 可根据需要调整输入框宽度
    margin-right: 10px;    // 与图片留出间距
  }

  .captcha-img {
    cursor: pointer;
    width: 120px;
    height: 38px;
    object-fit: cover;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,.1);
  }
}
.fixed-width-item {
  .el-form-item__content {
    width: 300px;  // 指定固定宽度
  }
  
  // 如果想让按钮也宽度 100%
  .el-button {
    width: 100%;
  }
}
</style>
