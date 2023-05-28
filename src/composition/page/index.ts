import type { AxiosResponse } from "axios"
import { ref } from "vue"

export const usePage = (api: (...args: any[]) => Promise<AxiosResponse<any, any>>, initData = true) => {

  const loading = ref(false)

  const total = ref(0)
  const query = ref<Record<string, any>>({})

  // 数据列表
  const listData = ref<Record<any, any>>([])

  // 加载数据
  const loadData = () => {
    loading.value = true
    api(query.value)
      .then(res => {
        const data = res.data.data
        listData.value = data.data || data
        total.value = data.total
      })
      .finally(() => {
        loading.value = false
      })
  }

  // 搜索
  const handleSearch = () => {
    query.value.page = 1
    loadData()
  }

  // 重置
  const handleReset = () => {
    query.value = {}
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

  if (initData) {
    loadData()
  }
  return { loading, listData, query, handleSearch, handleReset, loadData, total, handleCurrentChange, handleSizeChange }
}
