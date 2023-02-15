import { login, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import md5 from 'js-md5';
import qs from 'qs'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    // SET_SETTING: (state, setting) => {
    //   state.setting = setting
    // },
    // SET_STATUS: (state, status) => {
    //   state.status = status
    // },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const { account, password } = userInfo

      return new Promise((resolve, reject) => {
        login(qs.stringify({
          account: account.trim(),
          password: md5(password),
          client_id: 'admin',
          client_secret: '123456',
          scope: 'all',
          grant_type: 'password'
        })).then(response => {
          const { data } = response.data
          const layoutList = ['classic', 'functional', 'plain', 'blend']
          let layoutType = data.theme && layoutList.indexOf(data.theme) > -1 ? data.theme : 'classic'
          commit('SET_TOKEN', data.token)
          // console.log(data);
          setToken(data.token);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          // 由于mockjs 不支持自定义状态码只能这样hack

          if (!response.data) {
            reject('Verification failed, please login again.')
          }
          const data = response.data.data

          if (data.permissionList && data.permissionList.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.permissionList)
          } else {
            reject('getInfo: roles must be a non-null array!')
          }

          commit('SET_NAME', data.userInfo.userAccount)
          commit('SET_AVATAR', data.userInfo.headIcon)
          commit('SET_INTRODUCTION', data.userInfo.organizeName)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },


    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          console.log('11111111111111',response.data);
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', '')
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user
