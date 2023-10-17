import { getCurrentUser } from "@/apis/user"
import { useLocalStorage } from "@vueuse/core"
import { defineStore } from "pinia"

const defaultUser = {
  id: 0,
  is_super_admin: false,
  username: '',
  thumb: '',
  name: '',
  mobile: '',
  entry_time: '',
  sex: 0,
  sex_text: '',
  type: 0,
  type_text: '',
  position_id: 0,
  desc: '',
  manageDepartments: []
}

interface Department {
  id: number,
  title: string
}
interface Position {
  id: number,
  title: string
}

interface User {
  id: number,
  is_super_admin: boolean,
  username: string,
  thumb: string,
  name: string,
  mobile: string,
  type: number,
  department?: Department,
  sex_text: string,
  position_id: number,
  position?: Position,
  desc: string,
}
export const useUserStore = defineStore('user', {
  state() {
    return {
      _token: useLocalStorage('_token', ''),
      userData: useLocalStorage<User>('user', {...defaultUser}),
      menus: useLocalStorage<layout.Menus[]>('menus', []),
      permissions: useLocalStorage<string[]>('permissions', [])
    }
  },
  getters: {
    department(): Department | undefined {
      return this.userData.department
    },
    isSuperAdmin(): boolean {
      return this.userData.is_super_admin
    },
    mobile(): string {
      return this.userData.mobile
    },
    name(): string {
      return this.userData?.name
    },
    thumb(): string {
      return this.userData?.thumb
    },
  },
  actions: {
    clear() {
      this._token = '',
      this.userData = { ...defaultUser }
      this.menus = []
    },
    async fetchUser() {
      const { data } = await getCurrentUser()
      this.menus = data.data.menus
      this.permissions = data.data.permissions
      this.userData = data.data.user
    }
  }
})