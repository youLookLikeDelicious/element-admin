import request from '@/utils/axios'

// 获取验证码
export function getCaptcha(params?: any): Promise<{ data: { key: string, img: string } }> {
  return request.get('/captcha/math', { params })
}

// 获取菜单
export function getMenus() {
  return request.get('/menus')
}

// 登录
export function login(data: any) {
  return request.post('/login', data)
}