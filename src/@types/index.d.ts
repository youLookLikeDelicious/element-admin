declare module 'vue' {
  interface ComponentCustomProperties {
    $upload_url: string,
    $cityList: any,
    $industryList: any,
    $departmentId?: number
  }
}
export {}