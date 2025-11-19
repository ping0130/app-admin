<template>
  <div class="new-products-wrapper">
    <div class="new-product">
    <CommonTable
      cardTitle="新品推荐"
      :columns="columns"
      :data="tableData"
      :total="total"
      :loading="loading"
      v-model:currentPage="currentPage"
      v-model:pageSize="pageSize"
      :searchFields="[
        { label: '名称', value: 'name' }
      ]"
      addButtonText="选择商品"
      editButtonText="设置排序"
      @add="handleAdd"
      @del="handleDelete"
      @edit="handleEdit"
    />
  </div>
  <el-dialog v-model="sortDialogVisible" title="设置排序" width="30%" align-center>
  <el-form :model="sortForm">
    <el-form-item label="排序值">
      <el-input v-model="sortForm.sort_order" placeholder="请输入排序值" />
    </el-form-item>
  </el-form>
  <template #footer>
    <el-button @click="sortDialogVisible = false">取消</el-button>
    <el-button type="primary" @click="submitSortOrder">保存</el-button>
  </template>
</el-dialog>
</div>
</template>
<script setup>
import CommonTable from '@/components/Table/CommonTable.vue'
import {ref, computed} from 'vue'
import { useStore } from 'vuex'
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'
const store = useStore()
const total = ref(0)
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const columns = [
        { label: 'ID', prop: 'id' },
        { label: '名称', prop: 'name' },
        { label: '排序', prop: 'sort_order' },  
      ]
//定义弹窗状态和表单
const sortDialogVisible = ref(false)
const sortForm = ref({ id: null, sort_order: null })
// 表格数据
const tableData = computed(() => store.state.product.newProducts || [])
// 获取新品列表
const fetchNewProducts = async () => {
  try {
    await store.dispatch('product/fetchNewProducts')
  } catch (error) {
    ElMessage.error('获取新品推荐失败')
  }
}
const handleAdd = () => {
  console.log('添加新品')
}

const handleEdit = (row) => {
  sortForm.value = { id: row.id, sort_order: row.sort_order }
  sortDialogVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await store.dispatch('product/delNewProducts', row.id)
    ElMessage.success('删除成功')
    fetchNewProducts()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 提交排序值
const submitSortOrder = async () => {
  try {
    await store.dispatch('product/updateNewProducts', sortForm.value)
    ElMessage.success('排序更新成功')
    sortDialogVisible.value = false
    fetchNewProducts()
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

onMounted(() => {
  fetchNewProducts()
})

</script>