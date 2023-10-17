export interface Tree {
  children?: Tree[],
  id: number,
  name: string,
  disabled?: boolean,
  parent_id: number
}


function convertChildTrace (data: Tree, disableIds: number[]) {
  if (!data.children || !data.children.length) {
    data.children = undefined
    return
  }

  data.children.forEach(item => {
    if (disableIds.includes(item.parent_id)) {
      disableIds.push(item.id)
    }
    if (disableIds.includes(item.id)) {
      item.disabled = true
    }
    convertChildTrace(item, disableIds)
  })
}

/**
 * 对树形结构的空数组 children 转为 undefined(一般api会处理)
 * 禁用指定的元素
 * 
 * @param {Array} data
 * @param {Array} disableIds 禁用的id
 * @return {Array}
 */
export function convertChild (data: Tree[], disableIds?: number | number[]) {
  if (disableIds && !Array.isArray(disableIds)) {
    disableIds = [disableIds]
  }
  
  data.forEach(item => {
    if (disableIds && (disableIds as number[]).includes(item.id)) {
      item.disabled = true
    } else {
      item.disabled = false
    }
    convertChildTrace(item, (disableIds || []) as [])
  })
}

/**
 * 将树形结构转为列表
 * 
 * @param {Tress[]} data 
 * @return Array
 */
export function convertTreeToList(data: Tree[]) {
  const arr: Tree[] = []

  const convertTrace = (trees: Tree[]) => {
    for (let i = 0, len = trees.length; i < len; i++) {
      arr.push(trees[i])
      if (trees[i].children?.length) {
        convertTrace(trees[i].children || [])
      }
    }
  }

  convertTrace(data)
  return arr
}
