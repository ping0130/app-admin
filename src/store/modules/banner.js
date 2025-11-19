// store/modules/banner.js
import { fetchBanners, addBanner, updateBanner, deleteBanner } from '@/api/banner'

const state = () => ({
  banners: []
})

const mutations = {
  SET_BANNERS(state, banners) {
    state.banners = banners
  }
}

const actions = {
  // 获取轮播图列表
  async fetchBanners({ commit }) {
    try {
      const res = await fetchBanners() // ✅ 使用封装的方法
      commit('SET_BANNERS', res)
    } catch (err) {
      console.error('获取轮播图失败', err)
    }
  },

  // 添加轮播图
  async addBanner({ dispatch }, payload) {
    try {
      const res = await addBanner(payload) // ✅ 使用封装的方法
      dispatch('fetchBanners')
      return res
    } catch (err) {
      console.error('添加失败', err)
    }
  },

  // 更新轮播图
  async updateBanner({ dispatch }, { id, data }) {
    try {
      const res = await updateBanner(id, data) // ✅ 使用封装的方法
      dispatch('fetchBanners')
      return res
    } catch (err) {
      console.error('更新失败', err)
    }
  },

  // 删除轮播图
  async deleteBanner({ dispatch }, id) {
    try {
      const res = await deleteBanner(id)
      dispatch('fetchBanners')
      return res
    } catch (err) {
      console.error('删除失败', err)
    }
  }
}

const getters = {
  banners: (state) => state.banners
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
