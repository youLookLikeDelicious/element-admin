import type { CascaderProps } from "element-plus"
import { type FunctionalComponent, ref } from "vue"
import { getDepartments } from '@/apis/system'

type value = number | string

interface Department {
  id: number,
  name: string,
  parent_id: value
}

interface Props {
  modelValue: any,
  multiple?: boolean,
  placeholder?: string
}

type Events = {
  'update:modelValue': (value: any) => void,
  change: (value: any) => void
}

export function useDepartmentPicker() {
  const departmentList = ref<Department[]>([])
  const loadDepartment = () => {
    getDepartments()
      .then(res => {
        departmentList.value = res.data.data
      })
  }
  const DepartmentPicker: FunctionalComponent<Props, Events> = (props, { emit }) => {
    const cascader: CascaderProps = {
      expandTrigger: 'hover',
      emitPath: false,
      checkStrictly: true,
      label: 'name',
      value: 'id',
      multiple: props.multiple
    }
    return (
      <el-cascader
        model-value={props.modelValue}
        clearable
        placeholder={props.placeholder || '部门'}
        collapse-tags
        collapse-tags-tooltip
        onUpdate:modelValue={(value: any) => emit('update:modelValue', value)}
        onChange={(value: any) => emit('change', value)}
        props={cascader}
        class="w-100"></el-cascader>
    )
  }

  return { loadDepartment, departmentList, DepartmentPicker }
}