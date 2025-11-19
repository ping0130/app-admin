import Cookies from 'js-cookie'

const SIDEBAR_STATUS = 'sidebarStatus'

function getSidebarStatus() {
  return Cookies.get(SIDEBAR_STATUS) === '1'
}

function setSidebarStatus(status) {
  Cookies.set(SIDEBAR_STATUS, status ? '1' : '0')
}

const state = {
  sidebar: {
    opened: getSidebarStatus(),
    withoutAnimation: false
  },
  device: 'desktop'
}

const mutations = {
  TOGGLE_SIDEBAR(state) {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    setSidebarStatus(state.sidebar.opened)
  },
  CLOSE_SIDEBAR(state, withoutAnimation) {
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
    setSidebarStatus(false)
  },
  TOGGLE_DEVICE(state, device) {
    if (['desktop', 'mobile'].includes(device)) {
      state.device = device
    }
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation = false }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
