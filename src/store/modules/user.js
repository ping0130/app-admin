import { login, logout, getInfo, registerUser, userList, updateUserStatus, updateUser, deleteUser } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { ElMessage } from 'element-plus';
import { encryptPassword } from '@/utils/encrypt'
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    users: [],
    total: 0,
    initial: ''
  }
}

const state = getDefaultState()

const getters = {
  initial: state => state.initial
}

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  // 定义 mutation
  SET_USERS(state, users) {
    if (Array.isArray(users)) {
      state.users = users
    } else {
      console.warn('SET_USERS 接收到非数组数据:', users)
      state.users = [] // 或者保持原值不变，看你需求
    }
  },
  SET_TOTAL(state, total) {
    state.total = total
  },
  SET_INITIAL: (state, initial) => {
    state.initial = initial
  },
  UPDATE_USER_STATUS(state, { id, status }) {
    const user = state.users.find((user) => user.id === id)
    if (user) {
      user.status = status
    }
  },
  REMOVE_USER(state, userId) {
    state.users = state.users.filter(user => user.id !== userId)
  },
  SET_ROLES(state, roles) {
    state.roles = roles;
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, captcha_id, captcha_text } = userInfo
    const encryptedPwd = encryptPassword(password)
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: encryptedPwd,captcha_id: captcha_id,captcha_text: captcha_text }).then(response => {
        const { token } = response.data
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }).catch(error => {
        // 提取后端返回的错误码和错误信息
        let errorMessage = '登录失败，请稍后再试'
        if (error.response) {
          // 如果有响应错误信息，获取错误码和错误信息
          const { code, message } = error.response.data
          errorMessage = `错误码: ${code}, 错误信息: ${message}`
        }
        // Reject 并传递错误信息
        reject(new Error(errorMessage))
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { name, avatar, roles, initial } = data
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLES', roles)
        commit('SET_INITIAL', initial)
        resolve(data)
      }).catch(error => {
        ElMessage.error(`Error: ${error.message || 'Something went wrong'}`);
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },
  // 用户注册
  register({ commit }, userData) {
    return new Promise(async (resolve, reject) => {
      try {
        // 调用注册接口
        const response = await registerUser(userData)
        // 确保接口返回的数据有效
        if (response && response.success) {
          //commit('SET_USERS', response) // 更新 Vuex 的 state
          console.log('注册成功:', response)
          resolve(response) // 成功时调用 resolve，返回完整的响应数据
        } else {
          reject(new Error('注册接口返回无效数据'))
        }
      } catch (error) {
        console.error('注册用户失败:', error)
        reject(new Error(error.response?.data?.message || '注册用户失败，请稍后重试')) // 捕获错误并调用 reject
      }
    })
  },
  // 用户编辑
  update: async ({ commit, state }, { id, userData }) => {
    try {
      const response = await updateUser(id, userData);
      if (!response) throw new Error('更新接口返回无效数据');
  
      // 只更新 Vuex 中对应的用户，而不是直接覆盖整个列表
      const updatedUsers = state.users.map(user =>
        user.id === id ? { ...user, ...response } : user
      );
      commit('SET_USERS', updatedUsers);
      return response; // 直接返回响应数据
    } catch (error) {
      console.error('更新用户失败:', error);
      throw error;
    }
  },
  
  //用户列表
  async userlist({ commit }, params) {
    try {
      const response = await userList(params)
      const { data, total } = response // 后端返回的数据结构
      commit('SET_USERS', data)
      commit('SET_TOTAL', total)
    } catch (error) {
      console.error('获取用户列表失败', error)
      commit('SET_USERS', []) // 设置为空数组，避免组件中访问未定义数据commit('SET_TOTAL', 0);  // 设置总数为 0
      throw new Error(error.response?.data?.message || '获取用户列表失败')
    }
  },

  async updateStatus({ commit }, { id, status }) {
    try {
      const response = await updateUserStatus(id, status)
      if (response.success) {
        commit('UPDATE_USER_STATUS', { id, status })
      } else {
        throw new Error(response.message || '状态更新失败')
      }
    } catch (error) {
      console.error('状态更新失败:', error)
      throw error
    }
  },
  async deleteUser({ commit }, { id }) {
    try {
      const response = await  deleteUser(id)
      if (response.status === 200) {
        commit('REMOVE_USER', id) // 从 Vuex 状态中移除用户
        return { success: true }
      } else {
        return { success: false, message: '删除失败' }
      }
    } catch (error) {
      return { success: false, message: error.message }
    }
    }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

