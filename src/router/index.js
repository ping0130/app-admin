import { createRouter, createWebHistory } from 'vue-router'

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  // 新增商品管理菜单
  {
    path: '/product-management',
    component: Layout,
    redirect: '/product-management/product-list',
    name: 'ProductManagement',
    meta: { title: '商品管理', icon: 'productManagement' }, // 一级菜单
    children: [
      {
        path: 'product-list',
        name: 'ProductList',
        component: () => import('@/views/product/product-list'), // 假设你有这个视图
        meta: { title: '商品列表', icon: 'productList' } // 二级菜单
      },
      {
        path: 'add-product',
        name: 'AddProduct',
        component: () => import('@/views/product/add-product'), // 假设你有这个视图
        meta: { title: '添加商品', icon: 'addProduct' } // 二级菜单
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/views/product/product-categories/index.vue'), // 假设你有这个视图
        meta: { title: '商品分类', icon: 'categories' } // 二级菜单
      },
      {
        path: 'edit-product',
        name: 'edit-product',
        hidden: true,
        component: () => import('@/views/product/product-list/ProductEdit.vue'), // 假设你有这个视图
        meta: { title: '编辑商品', icon: 'banner' } // 二级菜单
      },
    ]
  },
  {
    path: '/user-management',
    component: Layout,
    redirect: '/user-management',
    name: 'UserManagement',
    meta: { title: '系统管理', icon: 'system' }, // 一级菜单
    children: [
      {
        path: 'user-list',
        name: 'UserList',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'user' } // 二级菜单
      },
      {
        path: 'add-user',
        name: 'AddUser',
        component: () => import('@/views/user/index'),
        meta: { title: '角色管理', icon: 'user-role' } // 二级菜单
      }
    ]
  },

  {
    path: '/marketing',
    component: Layout,
    redirect: '/marketing',
    name: 'marketing',
    meta: { title: '营销', icon: 'marketing' }, // 一级菜单
    children: [
      {
        path: 'banner',
        name: 'Banner',
        component: () => import('@/views/marketing/banner/index'), // 假设你有这个视图
        meta: { title: '首页轮播图', icon: 'banner' } // 二级菜单
      },
      {
        path: 'NewProducts',
        name: 'NewProducts',
        component: () => import('@/views/marketing/NewProducts.vue'), // 假设你有这个视图
        meta: { title: '新品推荐', icon: 'NewProducts' } // 二级菜单
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '/:pathMatch(.*)*', redirect: '/404', hidden: true }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
})

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// 重置路由，用于权限管理中动态添加路由
export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHistory(),
    routes: constantRoutes
  })
  router.options.routes = newRouter.options.routes
}

export default router
