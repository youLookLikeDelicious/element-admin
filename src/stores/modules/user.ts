import { useLocalStorage } from "@vueuse/core"
import { defineStore } from "pinia"

const defaultUser = {
  id: 0,
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
  username: string,
  thumb: string,
  name: string,
  mobile: string,
  type: number,
  type_text: string, // 员工类型
  sex: number, // 性别
  entry_time: string, // 入职时间
  department?: Department,
  sex_text: string,
  position_id: number,
  position?: Position,
  desc: string,
  manageDepartments: number[] // 负责的部门
}
export const useUserStore = defineStore('user', {
  state() {
    return {
      _token: useLocalStorage('_token', ''),
      userData: useLocalStorage<User>('user', {...defaultUser}),
      menus: useLocalStorage<layout.Menus[]>('menus', [])
    }
  },
  getters: {
    mobile(): string {
      return this.userData.mobile
    },
    name(): string {
      return this.userData.name
    },
    username(): string {
      return this.userData.username
    },
    thumb(): string {
      return this.userData.thumb
    },
    sex_text(): string {
      return this.userData.sex_text
    },
    department(): Department | undefined {
      return this.userData.department
    },
    type_text(): string {
      return this.userData.type_text
    },
    position(): Position | undefined {
      return this.userData.position
    },
    entry_time(): string {
      return this.userData.entry_time
    }
  },
  actions: {
    clear() {
      this._token = '',
      this.userData = { ...defaultUser }
      this.menus = []
    }
  }
})