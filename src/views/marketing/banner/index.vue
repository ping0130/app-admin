<template>
<div class="product-management">
  <CommonTable
  cardTitle="首页轮播图"
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
  @del="handleDelete"
  @edit="handleEdit"
  />
  <!-- 轮播图上传弹窗 -->
  <el-dialog v-model="centerDialogVisible" title="上传轮播图" width="500px" align-center >
    <el-form :model="form" ref="formRef" label-width="100px">
      <el-form-item label="图片上传">
        <el-upload
        class="upload-demo"
        ref="uploadRef"
        action="http://10.0.1.139:5000/upload"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-upload="beforeAvatarUpload"
        :show-file-list="false"
        :auto-upload="true"
        >
        <el-button type="primary">选择图片</el-button>
        </el-upload>
        <!-- 预览已上传图片 -->
        <div v-if="form.image_url">
          <img :src="form.image_url" alt="图片预览" style="width: 100px; margin-top: 10px;">
        </div>
      </el-form-item> 
      <!-- 轮播图描述 -->
      <el-form-item label="名称">
        <el-input v-model="form.name" placeholder="请输入轮播图名称"></el-input>
      </el-form-item> 
      <!-- 排序输入框 -->
      <el-form-item label="排序">
        <el-input-number v-model="form.sort_order" :min="0" label="排序"></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <!-- 只有当图片上传成功后，提交按钮才可点击 -->
         <el-button type="primary" :disabled="!form.image_url" @click="submitForm">提交</el-button>
      </div>
    </template>
  </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import CommonTable from '@/components/Table/CommonTable.vue'

const store = useStore()
const form = reactive({
  name: '',
  image_url: '', // 存储后端返回的图片URL
  file_path: '',
  sort_order: 0, // 默认排序值
  id: null
})
// 表格配置
const columns = [
  { label: 'ID', prop: 'id' },
  { label: '名称', prop: 'name' },
  { label: '图片', prop: 'image_url' },
  { label: '排序', prop: 'sort_order' },  
  ]
const tableData = computed(() => store.getters['banner/banners'])
const centerDialogVisible = ref(false)
const uploadRef = ref(null)
const total = ref(0)
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
// 获取轮播图列表
const fetchBanners = async () => {
  try {
    await store.dispatch('banner/fetchBanners')
  } catch (error) {
    ElMessage.error('获取轮播图失败')
  }
} 
// 选择文件前的校验
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
  }
  return isImage
} 
// 上传成功，获取图片 URL
const handleSuccess = (response) => {
  if (response.url) {
    form.image_url = response.url
    form.file_path = response.file_path
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error('上传失败，请重试')
  }
}  
// 上传失败
const handleError = () => {
  ElMessage.error('上传失败')
}
// 显示抽屉
const handleAdd = () => {
  //新增时清空表单
  Object.assign(form, {
    id: null,
    name: '',
    image_url: '',
    sort_order: 0
  })
  centerDialogVisible.value = true 
}  
// 提交轮播图数据
const submitForm = async () => {
  if (!form.image_url) {
    ElMessage.warning('请先上传图片')
    return;
  }
  try {
    let response;
    if (form.id) {
      response = await store.dispatch('banner/updateBanner', { id: form.id, data: form })
      ElMessage.success('轮播图修改成功')
    } else {
      // 添加操作，使用POST请求
      response = await store.dispatch('banner/addBanner', form)
      ElMessage.success('轮播图添加成功')
    }
    if (response?.success) {
      centerDialogVisible.value = false // 关闭弹窗
      // 清空表单
      form.image_url = ''
      form.name = ''
      form.sort_order = 0
      form.id = ''
      // 重新获取轮播图列表
      await fetchBanners()
    }
  } catch (error) {
    console.error('请求出错:', error)
    ElMessage.error(error.response?.data?.message || '添加轮播图失败')
  }
}  
// 编辑轮播图
const handleEdit = (banner) => {
  form.id = banner.id
  form.name = banner.name
  form.image_url = banner.image_url
  form.sort_order = banner.sort_order
  centerDialogVisible.value = true // 显示编辑弹窗
  }
// 删除轮播图
const handleDelete = async (row) => {
  const id = row.id
  try {
    const response = await store.dispatch('banner/deleteBanner', row.id)
    // 确保后端返回 success: true 才更新前端数据
    if (response?.success) {
      tableData.value = tableData.value.filter(banner => banner.id !== id);
      ElMessage.success('轮播图删除成功');
    } else {
      ElMessage.error(response.message || '删除失败');
    }
  } catch (error) {
    ElMessage.error('删除失败，请稍后重试');
  }
}
onMounted(fetchBanners)
</script>
  
<style scoped>
.product-management {
  padding: 20px;
}
</style>
  