<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="isMobile && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { computed, ref,onMounted, onUnmounted} from 'vue'
import { useStore } from 'vuex'
import { Navbar, Sidebar, AppMain } from './components'
import useResizeHandler from './hooks/useResizeHandler' // 将 ResizeMixin 重构为 Composition API

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  setup() {
    const store = useStore()

    // Vuex 状态
    const sidebar = computed(() => store.state.app.sidebar)
    const device = computed(() => store.state.app.device)
    const fixedHeader = computed(() => store.state.settings.fixedHeader)

    const isMobile = ref(false)
        // 监听窗口大小变化
    const updateDevice = () => {
      const width = window.innerWidth
      isMobile.value = width <= 768 // 假设768px以下为移动端
    }

    onMounted(() => {
      updateDevice() // 初始化时判断一次设备类型
      window.addEventListener('resize', updateDevice)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', updateDevice)
    })

    // 计算类名
    const classObj = computed(() => ({
      hideSidebar: !sidebar.value.opened,
      openSidebar: sidebar.value.opened,
      withoutAnimation: sidebar.value.withoutAnimation,
      mobile: device.value === 'mobile'
    }))

    // 处理背景点击
    const handleClickOutside = () => {
      store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }

    // 添加窗口大小监听
    useResizeHandler()

    return {
      sidebar,
      device,
      fixedHeader,
      classObj,
      handleClickOutside,
      isMobile
    }
  }
}
</script>

<style lang="scss" scoped>
@use "../styles/mixin.scss" as *;
@use "../styles/variables.scss" as *;

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
    overflow: hidden; // 防止移动端滚动穿透
  }
}

.drawer-bg {
  background: rgba(0, 0, 0, 0.5); // 增加透明度，提升视觉对比度
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s ease;

  // 隐藏侧边栏时的样式
  .hideSidebar & {
    width: calc(100% - 54px);
  }

  // 移动端样式
  .mobile & {
    width: 100%;
  }
}
</style>
