import { ref } from 'vue'

/**
 * 前端分页
 */
export const usePage = () => {

  const total = ref(0)
  const query = ref<Record<string, any>>({})

  // 数据列表
  let wholeData: any[] = []

  const listData = ref<any[]>([])
  
  const setWholeData = (data: any[]) => {
    wholeData = data
    total.value = data.length
    loadData()
  }

  // 加载数据
  const loadData = () => {
    const limit = query.value.per_page || 10
    const start = (query.value.page || 0) * limit
    listData.value = wholeData.slice(start, start + limit)
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


  // 额外搜索项 展开/收起
  const expandSearchStatus = ref(false)

  return { listData, query, handleSearch, handleReset, loadData, total, handleCurrentChange, handleSizeChange, expandSearchStatus, setWholeData }
}