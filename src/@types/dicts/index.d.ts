// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace dict {
  // 微信
  export interface wechat {
    id: number,
    wechat: string
  }

  // 客户来源
  export interface Source {
    id: number,
    title: string
  }

  // 项目类型
  export interface Classify {
    id: number,
    title: string
  }

  export type Grade = Classify

  export type Industry = Classify

  // 支付方式
  export interface Payment {
    payment: string,
    id: number,
    need_bind_card: 1 | 2 // 1 需要绑定银行卡 2 不需要
  }

  export interface Unit {
    id: number,
    name: string
  }

  export type Supplier = Unit
  export type Customer = Unit

  export interface Waybill {
    waybill_name: string,
    id: number
  }

  export interface Contact {
    id: number,
    city_name: string,
    province_name: string,
    area_name: string,
    address: string,
    name: string,
    mobile: string,
    label: string
  }

  interface DepartmentItem {
    id: number,
    title: string
  }

  export type Department = DepartmentItem & { children?: DepartmentItem[] }

  // 收款账户
  export interface Account {
    id: number,
    account_no: string,
    carderUser: {
      id: number,
      name: string
    }
  }

  // 用户
  export interface User {
    id: number,
    name: string
  }
}
