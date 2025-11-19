
<template>
<el-card :header="cardTitle" class="common-table-card">
    <!-- 顶部工具栏 -->
    <el-row justify="space-between" class="toolbar">
        <el-col :span="18" class="left-bar">
            <!-- 搜索输入框 -->
             <el-input
             v-model="searchParams.keyword"
             placeholder="请输入关键字"
             clearable
             style="width: 200px; margin-right: 10px;"
             />
             <!-- 字段选择框 -->
              <el-select
              v-model="selectedField"
              placeholder="选择搜索字段"
              style="width: 150px; margin-right: 10px;"
              >
              <el-option
              v-for="field in searchFields"
              :key="field.value"
              :label="field.label"
              :value="field.value"
              />
            </el-select>
            <!-- 查询和重置按钮 -->
             <el-button type="primary" @click="handleSearch">查询</el-button>
             <el-button @click="handleReset">重置</el-button>
            </el-col>
            <!-- 右侧新增按钮 -->
             <el-col :span="6" class="right-bar" style="text-align: right;">
                <el-button type="success" @click="handleAdd">
                    + {{ addButtonText }}
                </el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
         <el-table
         v-loading="loading"
         :data="data"
         border
         style="width: 100%"
         @selection-change="handleSelectionChange"
        >
        <el-table-column v-if="showSelection" type="selection" width="45" />
        <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :align="col.align || 'center'"
        :min-width="col.minWidth || '100'"
        show-overflow-tooltip
        >
        <!-- 如果是图片列（如 image_url），则渲染为图片 -->
        <template #default="{ row }" v-if="['image_url', 'product_images'].includes(col.prop)">
            <img
            :src="row[col.prop]"
            alt="图片"
            style="max-width: 80px; max-height: 60px; object-fit: contain;"
            v-if="row[col.prop]"
            />
            <span v-else>无图片</span>
        </template>
        <template v-else-if="col.prop === 'tag'" #default="{ row }">
            <div v-for="(tag, index) in row.tag" :key="index" style="margin-bottom: 8px;">
              <div style="display: inline-flex; align-items: center; gap: 10px;">
              <span>{{ tag.name }}</span>
              <el-switch
                v-model="tag.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleTagChange(row, tag)"
              />
              </div>
            </div>
        </template>
         <template v-else-if="col.prop === 'status'" #default="{ row }">
            <el-switch
            v-model="row.status"
            :active-value="'active'"
            :inactive-value="'inactive'"
            @change="(val) => handleStatusChange(row, val)"
            />
        </template>
        </el-table-column>
  
        <el-table-column label="操作" width="180" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">{{ editButtonText }}</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPageLocal"
          v-model:page-size="pageSizeLocal"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </template>
  
<script setup>
import { ref } from 'vue'

const props = defineProps({
  columns: { type: Array, required: true },          // 表头配置
  data: { type: Array, required: true },             // 表格数据
  loading: { type: Boolean, default: false },        // 加载状态
  total: { type: Number, default: 0 },               // 总数据量
  pageSize: { type: Number, default: 10 },           // 每页数量
  currentPage: { type: Number, default: 1 },         // 当前页码
  showSelection: { type: Boolean, default: true },   // 是否显示多选
  showPagination: { type: Boolean, default: true },  // 是否显示分页
  cardTitle: { type: String, default: '' },          // 卡片标题
  queryParams: { type: Object, default: () => ({}) }, // 搜索参数
  searchFields: {                                    // 可搜索字段（父组件传入）
    type: Array,
    default: () => []
  },
  editButtonText: {
    type: String,
    default: '编辑'
  },
  addButtonText: {                                   // 添加按钮文字（父组件传入）
    type: String,
    default: '添加'
  }
})

const emit = defineEmits([
  'update:currentPage',
  'update:pageSize',
  'selectionChange',
  'edit',
  'delete',
  'search',
  'add',
  'del'
])

const selectedRows = ref([])
const searchParams = ref({ ...props.queryParams })   // 查询参数
const selectedField = ref(props.searchFields[0]?.value || '') // 默认选中第一个字段

// 分页
const currentPageLocal = ref(props.currentPage)
const pageSizeLocal = ref(props.pageSize)
const handleSizeChange = (val) => {
  emit('update:pageSize', val)
  emit('update:currentPage', 1)
  
}
const handleCurrentChange = (val) => {
  emit('update:currentPage', val)
}

// 多选
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
  emit('selectionChange', selection)
}

// 查询事件
const handleSearch = () => {
  emit('search', {
    field: selectedField.value,
    keyword: searchParams.value.keyword
  })
}

// 重置查询
const handleReset = () => {
  searchParams.value = { ...props.queryParams }
  selectedField.value = props.searchFields[0]?.value || ''
  emit('search', {
    field: selectedField.value,
    keyword: ''
  })
}

// 删除
const handleDelete = (row) => {
    emit('del', row)
}

// 编辑
const handleEdit = (row) => {
  emit('edit', row)
}

// 点击添加按钮
const handleAdd = () => {
  emit('add')
}

//tag事件
const handleTagChange = (row, tag) => {
  emit('tag', row, tag)
}
const handleStatusChange = (row, status) => {
  emit('status', row, status)
}
</script>

<style scoped>
.common-table-card {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
