declare namespace apis
{
  export interface LoginResponse {
    token: string,
    user: {
      id: number,
      username: string,
      thumb: string,
    },
    menus: layout.Menus[]
  }

  export interface AllClassifyRequest {
    department_id: number
  }
}