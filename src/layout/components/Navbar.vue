<template>
  <div class="AppNavbar">
    <!-- 侧边栏按钮 -->
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <!-- 面包屑导航 -->
    <breadcrumb class="breadcrumb-container" />

    <!-- 右侧菜单 -->
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <div class="avatar-placeholder" v-if="usernameInitial" :style="{ backgroundColor: avatarColor }">
            {{ usernameInitial }}
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <el-dropdown-item @click="goToProfile">
              <span>个人中心</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click="logout">
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters({
      sidebar: 'sidebar',
      initial: 'user/initial'
    }),
    usernameInitial() {
      return this.initial && this.initial.trim() !== '' ? this.initial : 'A'
    },
    avatarColor() {
      return this.generateColor(this.usernameInitial) // 生成稳定的颜色
    }
  },
  methods: {
    /**
     * 通过用户名首字母生成稳定的颜色
     */
    generateColor(letter) {
      if (!letter) return '#007BFF' // 默认颜色
      const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#A833FF', '#007BFF', '#FF9900']
      const charCode = letter.charCodeAt(0) // 获取 Unicode 编码
      return colors[charCode % colors.length] // 取模获取固定颜色
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    goToProfile() {
      this.$router.push('/profile') // 跳转到个人中心
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      localStorage.clear() // 确保退出时清理存储
      sessionStorage.clear()
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.AppNavbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }

      .avatar-placeholder {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        color: #fff;
        font-size: 18px;
        font-weight: bold;
        text-transform: uppercase;
        background-color: #007BFF; /* 默认蓝色 */
      }
    }
  }
}
</style>
