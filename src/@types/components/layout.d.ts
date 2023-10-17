declare namespace layout {
  export interface Menus {
    id: number,
    name: string,
    title: string,
    url: string,
    icon: string,
    children?: Menus[]
  }
}

declare interface Menus {
  id: number,
  name: string,
  title: string,
  url: string,
  icon: string,
  children?: Menus[]
}
