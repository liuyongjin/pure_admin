import request from '@/utils/request'

export function login(data) {
    return request({
      url: '/api/oauth/Login',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data
    })
}

export function logout() {
    return request({
        url: '/dev/api/oauth/Logout',
        method: 'post'
    })
}

export function getUserInfo(token) {
    return request({
        url: '/api/oauth/CurrentUser',
        method: 'get',
        params: { token }
    })
}

