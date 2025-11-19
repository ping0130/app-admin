// hooks/useResizeHandler.js
import { onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'

export default function useResizeHandler() {
  const store = useStore()

  const resizeHandler = () => {
    if (window.innerWidth < 768) {
      store.dispatch('app/toggleDevice', 'mobile')
    } else {
      store.dispatch('app/toggleDevice', 'desktop')
    }
  }

  onMounted(() => {
    window.addEventListener('resize', resizeHandler)
    resizeHandler() // 初始化
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
  })
}
