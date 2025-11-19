<template>
    <div class="product-management">
    <CommonTable
      cardTitle="商品分类"
      :columns="columns"
      :data="tableData"
      :total="total"
      :loading="loading"
      v-model:currentPage="currentPage"
      v-model:pageSize="pageSize"
      :searchFields="[
        { label: '名称', value: 'name' }
      ]"
      @add="handleAdd"
      @delete="handleDelete"
      @edit="handleEdit"
    />
      <!-- 抽屉 -->
      <el-drawer 
      v-model="drawerVisible" 
      title="新增分类" 
      size="30%" 
      custom-class="custom-drawer" 
      :destroy-on-close="true" 
      >
      <el-form :model="formData" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="formData.name" />
        </el-form-item>
  
        <el-form-item label="描述">
          <el-input v-model="formData.desc" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseDrawer">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-drawer>
  </div>
</template>
  
<script setup>
import { ref, onMounted} from 'vue'
import CommonTable from '@/components/Table/CommonTable.vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
const loading = ref(false)
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const tableData = ref([])
const drawerVisible = ref(false)
const formData = ref({ name: '', desc: ''})

// 表格配置
const columns = [
  { label: 'ID', prop: 'id' },
  { label: '名称', prop: 'name' },
  { label: '描述', prop: 'desc' },
  
]

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    const { data } = await axios.get('http://10.0.1.139:5000/api/categories', {
      params: {
        page: currentPage.value,
        size: pageSize.value,
      }
    })
    tableData.value = data.items
    total.value = data.total
  } catch (error) {
    ElMessage.error('数据加载失败')
  } finally {
    loading.value = false
  }
}
// 显示抽屉
const handleAdd = () => {
  console.log('触发新增事件') 
  formData.value = { name: '', desc: '' }
  drawerVisible.value = true
}
// 显示编辑分类抽屉
const handleEdit = (category) => {
  formData.value = { id: category.id, name: category.name, desc: category.desc }
  drawerVisible.value = true
}
// 保存数据
const handleSave = async () => {
  if (!formData.value.name) {
    ElMessage.warning('分类名称不能为空')
    return
  }
  try {
    await axios.post('http://10.0.1.139:5000/api/categories', formData.value)
    ElMessage.success('分类新增成功')
    fetchData()  // 保存后刷新数据
    drawerVisible.value = false  // 保存后关闭抽屉
    formData.value = { name: '', desc: '' }  // 清空表单数据
  } catch (error) {
    ElMessage.error('新增失败，请稍后重试')
  }
}
// 删除分类
const handleDelete = async (category) => {
  try {
    const id = category.id 
    await axios.delete(`http://10.0.1.139:5000/api/categories/${id}`)
    ElMessage.success('分类删除成功')
    fetchData()  // 删除后刷新数据
  } catch (error) {
    ElMessage.error('删除失败，请稍后重试')
  }
}
const handleCloseDrawer = () => {
  drawerVisible.value = false // 关闭抽屉
  formData.value = { name: '', desc: '' } // 清空表单
}

onMounted(fetchData)
</script>
<style scoped>
.product-management {
  padding: 20px;
}
</style>