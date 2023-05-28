declare namespace layout {
  interface Menus {
    id: number,
    name: string,
    title: string,
    src: string,
    icon: string,
    list?: Menus[]
  }
}