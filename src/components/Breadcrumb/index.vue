<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { compile } from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      const matched = this.$route.matched.filter(
        item => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )

      if (!this.isDashboard(matched[0])) {
        matched.unshift({ path: '/dashboard', meta: { title: 'Dashboard' }})
      }

      this.levelList = matched
    },
    isDashboard(route) {
      return route?.name?.toLowerCase() === 'dashboard'
    },
    pathCompile(path) {
      const { params } = this.$route
      try {
        const toPath = compile(path, { encode: encodeURIComponent })
        return toPath(params)
      } catch (e) {
        console.error('Failed to compile path:', e)
        return path
      }
    },
    handleLink(item) {
      if (item.redirect) {
        this.$router.push(item.redirect)
      } else {
        this.$router.push(this.pathCompile(item.path))
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
