declare module 'vue' {
  interface ComponentCustomProperties {
    $upload_url: string,
    $cityList: any,
    $industryList: any,
    $departmentId?: number,
    isPermission: (permission?: string) => boolean,
    getShortStructs: (format: string, isRange: boolean = true) => {text: string, value: () => any}[]
  }
}

declare global {
  interface Navigator {
    msSaveBlob?: any
  }
}

export {}