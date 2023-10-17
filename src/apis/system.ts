import request from '@/utils/axios'

/**
 * 获取菜单列表
 *
 * @param params 
 */
export function getMenus(params?: any) {
  return request.get('/menu', { params })
}

/**
 * 删除菜单
 *
 * @param id 
 */
export function deleteMenu(id: number) {
  return request.delete(`/menu/${id}`)
}

/**
 * 保存菜单
 * @param data 
 * @param id 
 */
export function saveMenu(data: any, id?: string | number) {
  if (id) {
    return request.put(`/menu/${id}`, data)
  }

  return request.post('/menu', data)
}

/*
|--------------------------------------------------------------------------
| 用户部分
|--------------------------------------------------------------------------
*/
export function getUserInfo(id: number) {
  return request.get(`/user/${id}`)
}


// 获取全部用
export function getAllUsers(params?: any) {
  return request.get('/user/all', { params })
}

// 获取用户列表
export function getUsers(params?: any) {
  return request.get('/user', { params })
}

// 保存用户
export function saveUser(data: any, id?: number) {
  if (id) {
    return request.put(`/user/${id}`, data)
  }

  return request.post('/user', data)
}

// 删除用户
export function deleteUser(id: number) {
  return request.delete(`/user/${id}`)
}

// 重置密码
export function resetpassword(id: number) {
  return request.put(`/user/password/reset/${id}`)
}

/*
|--------------------------------------------------------------------------
| 部门管理
|--------------------------------------------------------------------------
*/

/**
 * 获取部门列表
 *
 * @param any params 
 */
export function getDepartments(params?: any) {
  return request.get('/department', { params })
}

// 获取部门(列表结构)
export function getAllDepartment(params?: any) {
  return request.get('/department/all', { params })
}

// 保存部门
export function saveDepartment(data: any, id: number) {
  if (id) {
    return request.put(`/department/${id}`, data)
  }
  return request.post('/department', data)
}

// 删除部门
export function deleteDepartment(id: number) {
  return request.delete(`/department/${id}`)
}

/*
|--------------------------------------------------------------------------
| 角色管理
|--------------------------------------------------------------------------
*/
// 获取所有角色
export function getAllRoles() {
  return request.get('/role/all')
}

/**
 * 角色列表
 * @param param 
 */
export function getRoleList(params?: any) {
  return request.get('/role', { params })
}

/**
 * 获取角色详情
 * @param {number} id 
 */
export function getRoleInfo(id: number) {
  return request.get(`/role/${id}`)
}

/**
 * 保存角色
 * @param data 
 * @param id 
 */
export function saveRole(data: any, id?: number) {
  if (id) {
    return request.put(`/role/${id}`, data)
  }

  return request.post('/role', data)
}

/**
 * 删除角色
 * @param id 
 */
export function deleteRole(id: number) {
  return request.delete(`/role/${id}`)
}