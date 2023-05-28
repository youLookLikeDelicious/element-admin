import request from '@/utils/axios'

// 修改个人信息
export function updateProfile(data: Record<string, any>) {
  return request.post('/user/editPofile', data)
}

// 重置密码
export function resetPassword(data: Record<string, any>) {
  return request.post('/user/resetPassword', data)
}

// 获取部门列表
export function getDepartment(params?: any) {
  return request.get('/department', { params })
}

// 保存部门
export function saveDepartment(data: any, id?: number) {
  if (id) {
    return request.put(`/department/${id}`, data)
  }
  return request.post('/department', data)
}

// 删除部门
export function deleteDepartment(id: number) {
  return request.delete(`/department/${id}`)
}

// 获取用户列表
export function getAllUser(params?: { department_id?: number }) {
  return request.get('/user/all', { params })
}