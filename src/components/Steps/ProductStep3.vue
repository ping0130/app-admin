<template>
  <el-form :model="product" ref="formRef" label-width="120px" class="product-form" :rules="formRules">
    <!-- 商品规格 -->
    <el-form-item label="商品 SKU">
    <el-table
      :data="product.skus"
      border
      style="width: 100%"
    >
      <el-table-column label="规格名称" prop="spec_name">
        <template #default="{ row, $index }">
          <el-input
            v-model="row.spec_name"
            placeholder="请输入规格"
          />
        </template>
      </el-table-column>

      <el-table-column label="SKU编码" prop="sku_code">
        <template #default="{ row, $index }">
          <el-input
            v-model="row.sku_code"
            placeholder="请输入SKU编码"
          />
        </template>
      </el-table-column>

      <el-table-column label="价格" prop="price">
        <template #default="{ row, $index }">
          <el-input-number
            v-model.number="row.price"
            :min="0"
            placeholder="请输入价格"
          />
        </template>
      </el-table-column>

      <el-table-column label="库存" prop="stock">
        <template #default="{ row, $index }">
          <el-input-number
            v-model.number="row.stock"
            :min="0"
            placeholder="库存数量"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="{ row, $index }">
          <el-button type="danger" size="mini" @click="removeSku($index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-button type="primary" size="mini" @click="addSku" style="margin-top: 10px;">
      添加 SKU
    </el-button>
  </el-form-item>
    <!-- 商品参数 -->
    <el-form-item label="商品参数" prop="params" >
      <el-input v-model="product.params" placeholder="请输入商品参数"></el-input>
    </el-form-item>
    <!-- 商品相册 -->
    <el-form-item label="商品相册" prop="photos">
      <el-upload
      class="upload-image"
      action="http://10.0.1.139:5000/upload"
      list-type="picture-card"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :on-success="handleUploadSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
      :limit="1"
      >
      <el-icon  class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </el-form-item>
    </el-form>
    </template>
    
  <script>
  import { defineComponent, ref, defineExpose, watch, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useStore } from 'vuex'
  
  export default defineComponent({
    props: { product: Object },
    setup(props, { emit }) {
      const formRef = ref(null)
      const fileList = ref([]) // 用于绑定上传文件列表
      const specOptions = ref([])
      const paramOptions = ref([])
      const store = useStore()
      // 表单验证规则
      const formRules = {
        spec: [{ required: true, message: '请选择商品规格', trigger: 'change' }],
        params: [{ required: true, message: '请输入商品参数', trigger: 'blur' }],
        photos: [{ required: true, message: '请上传商品图片', trigger: 'blur' }]
      }
      const handleUploadSuccess = (response, file, fileList) => {
        const file_path  = response.file_path 
        const imageUrl = response.url
        if (!imageUrl || !file_path) {
           console.error('未能从后端响应中获取到 url 或 file_path')
          return
         }
        // 移除 fileList 中的 `blob` 类型文件
      const updatedFileList = fileList.filter(existingFile => {
        return existingFile.url && !existingFile.url.startsWith('blob:'); // 只保留非 blob 类型文件
        })
        updatedFileList.push({
          uid: file.uid,
          name: file.name,
          url: imageUrl,  // 使用后端返回的 URL
          file_path: file_path 
        })
        // 将新的文件添加到 fileList 中
        fileList.splice(0, fileList.length, ...updatedFileList)
        // 使用 emit 触发事件，将更新的 photos 传递给父组件
        emit('update:photos', updatedFileList.map(file => file.url)) 
        emit('update:file_path', updatedFileList.map(f => f.file_path))
      }
      // 监听 photos 变化，更新 fileList
      watch(() => props.product.photos, (newPhotos) => {
        // 将新的图片路径映射到 fileList
        fileList.value = newPhotos.map(url => ({
          name: url,
          url: url,
        }));
      }, { immediate: true })
  
      // 文件上传之前进行的检查
      const beforeUpload = (file) =>  {
        console.log('上传文件:', file);
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
          ElMessage.error('只能上传图片文件');
          return false; // 如果不是图片文件，则不允许上传
          }
        const isLt2M = file.size / 1024 / 1024 < 2;
         if (!isLt2M) {
          ElMessage.error('图片大小不能超过 2MB');
          return false; // 如果文件大于 2MB，则不允许上传
          }
          return isImage && isLt2M && true;
        }
      // 处理文件预览
      const handlePreview = (file) => {
         console.log('preview', file);
      }
      // 处理文件删除
      const handleRemove = (file, fileList) => {
        console.log('remove', file, fileList);
      }
      // 文件上传失败时的处理
      const handleError = (err, file, fileList) => {
        console.log('upload error', err, file, fileList);
      }

      
      const loadParamOptions = async () => {
        try {
          const response = await store.dispatch('product/param')
          paramOptions.value = response
        } catch (error) {
          console.error('加载商品参数失败:', error)
        }
      }
      const addSku = () => {
      if (!props.product.skus) props.product.skus = []
      props.product.skus.push({
        spec_name: '',
        sku_code: '',
        price: 0,
        stock: 0
      })
    }

    const removeSku = (index) => {
      props.product.skus.splice(index, 1)
    }
      onMounted(() => {
        loadParamOptions()
      })
      // 暴露 validate 方法给父组件
      defineExpose({
        validate: () => formRef.value?.validate()
      })
      
      return { formRef, formRules, fileList, handleUploadSuccess,
        beforeUpload, handlePreview, handleRemove, handleError, specOptions, paramOptions, addSku,
        removeSku}
      }
    })
    </script>
    