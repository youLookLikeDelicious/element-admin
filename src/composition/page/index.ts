import type { AxiosResponse } from "axios"
import type { TableColumnCtx } from "element-plus"
import { ref } from "vue"

/**
 * 后端分页
 *
 * @return {Object} { currentPage, loading, listData, query, meta, handleSearch, handleReset, loadData, total, handleCurrentChange, handleSizeChange, expandSearchStatus }
 * @param api      请求的接口
 * @param initData 是否立即请求数据
 */
export const usePage = (api: (...args: any[]) => Promise<AxiosResponse<any, any>>, initData = true, isInfiniteList = false) => {

  const loading = ref(false)

  const total = ref(0)
  const currentPage = ref<undefined|number>(0)
  const query = ref<Record<string, any>>({})
  const meta = ref<Record<string, any>>()
  const infiniteDisabled = ref(false) // 是否禁用无限滚动

  // 数据列表
  const listData = ref<any[]>([])

  /**
   * 加载数据
   * @param params 
   * @param clearData 手机端, 是否清楚列表数据
   */
  const loadData = (params?: any, clearData = false) => {
    loading.value = true

    if (clearData) {
      listData.value = []
    }
    if (infiniteDisabled.value) return
    return api({ ...query.value, ...params})
      .then(res => {
        const data = res.data.data
        meta.value = res.data?.meta
        total.value = res.data?.meta?.total ?? 0
        currentPage.value = res.data?.meta?.current_page || data.current_page || undefined

        if (isInfiniteList) {
          listData.value = listData.value.concat(data)
          infiniteDisabled.value = listData.value.length >= total.value
        } else {
          listData.value = data.data || data
        }
        return res
      })
      .finally(() => {
        loading.value = false
      })
  }

  // 搜索
  const handleSearch = () => {
    query.value.page = 1
    infiniteDisabled.value = false
    listData.value = []
    loadData()
  }

  // 重置
  const handleReset = () => {
    query.value = { page: currentPage.value }
    loadData()
  }

  // 分页
  const handleCurrentChange = (page: number) => {
    query.value.page = page
    loadData()
  }

  // 分页大小
  const handleSizeChange = (size: number) => {
    query.value.per_page = size
    loadData()
  }

  /**
   * 排序
   */
  const handleSortChange = ({ prop, order }: { prop: string, order?: 'ascending' | 'descending' }) => {
    if (!query.value.sort) {
      query.value.sort = []
    }
    const index = query.value.sort.findIndex((item: any) => item.prop === prop)
    if (index === -1 && order) {
      query.value.sort.push({ prop, order })
    } else {
      if (order) {
        query.value.sort[index].order = order
      } else {
        query.value.sort.splice(index, 1)
      }
    }
    loadData()
  }

  /**
   * Header的样式,排序时用
   * @param param
   */
  const getHeaderRwoCellClassName = ({  column }: { row: any, rowIndex: number, column: TableColumnCtx<any>, columnIndex: number; }) => {
    if (!query.value.sort) {
      return 'no-sort'
    }
    
    const sort = query.value.sort.find((item: any) => item.prop === column.property)

    return sort?.order
  }

  /**
   * 手机端无限列表
   */
  const getNext = () => {
    query.value.page = query.value.page
      ? ++query.value.page
      : query.value.page = 2
    loadData()
  }



  if (initData) {
    loadData()
  }

  // 额外搜索项 展开/收起
  const expandSearchStatus = ref(false)

  return {
    currentPage,
    expandSearchStatus,
    infiniteDisabled,
    loading,
    listData,
    query,
    total,
    meta,
    getHeaderRwoCellClassName,
    handleSearch,
    handleReset,
    loadData,
    handleCurrentChange,
    handleSizeChange,
    handleSortChange,
    getNext,
  }
}
