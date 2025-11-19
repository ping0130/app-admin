import { createStore } from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import product from './modules/product'
import banner from './modules/banner'
const store = createStore({
  modules: {
    app,
    settings,
    user,
    product,
    banner
  },
  getters
})

export default store
