import SvgIcon from '@/components/SvgIcon/index.vue'

// 全局注册函数
export default function registerGlobalComponents(app) {
  // 注册 SvgIcon 组件
  app.component('SvgIcon', SvgIcon)

  // 动态加载所有 SVG 文件
  const req = require.context('@/icons/svg', false, /\.svg$/)
  const requireAll = requireContext => requireContext.keys().map(requireContext)
  requireAll(req)
}
