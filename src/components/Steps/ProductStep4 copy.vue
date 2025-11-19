<template>
  <el-form
    :model="product"
    ref="formRef"
    label-width="120px"
    class="product-form"
    :rules="formRules"
  >
    <!-- 商品相册 -->
    <el-form-item label="商品详情轮播图" prop="detailImages">
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
        multiple
      >
        <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </el-form-item>

    <!-- 商品详情 -->
    <el-form-item label="商品详情" prop="details">
      <QuillEditorComponent v-model:content="product.details" />
    </el-form-item>
  </el-form>
</template>

<script>
import { defineComponent, ref, watch, defineExpose } from 'vue'
import QuillEditorComponent from './QuillEditorComponent.vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'

export default defineComponent({
  components: { QuillEditorComponent },
  props: { product: Object },
  setup(props, { emit }) {
    const formRef = ref(null)
    const fileList = ref([])
    const store = useStore()

    const formRules = {
      detailImages: [{ required: true, message: '请上传商品图片', trigger: 'blur' }],
      details: [{ required: true, message: '请输入商品详情', trigger: 'blur' }]
    }

    // 上传成功
    const handleUploadSuccess = (response, file) => {
      const file_path = response.file_path
      const imageUrl = response.url
      if (!file_path || !imageUrl) {
        console.error('未能从后端响应中获取到 url 或 file_path')
        return
      }
       // 移除 fileList 中的 blob 文件
       const validFiles = fileList.value.filter(f => f.url && !f.url.startsWith('blob:'))
       // 添加当前上传成功的文件
       const newFile = {
        uid: file.uid,
        name: file.name,
        url: imageUrl,
        file_path: file_path
        }
      if (!validFiles.find(f => f.file_path === newFile.file_path)) {
         validFiles.push(newFile)
      }
      // 替换 fileList
      fileList.value.splice(0, fileList.value.length, ...validFiles)
      // 更新 props.product
      props.product.detailImages = fileList.value.map(f => f.url)
      props.product.detailFilePaths = fileList.value.map(f => f.file_path)

      emit('update:detailImages', props.product.detailImages)
      emit('update:detailFilePaths', props.product.detailFilePaths)
    }

    // 上传前检查
    const beforeUpload = file => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        ElMessage.error('只能上传图片文件')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        ElMessage.error('图片大小不能超过 2MB')
        return false
      }
      return true
    }

    // 删除文件
    const handleRemove = (file, currentFileList) => {
      fileList.value = currentFileList
      props.product.detailImages = fileList.value.map(f => f.url)
      props.product.detailFilePaths = fileList.value.map(f => f.file_path)

      emit('update:detailImages', props.product.detailImages)
      emit('update:detailFilePaths', props.product.detailFilePaths)
    }

    const handlePreview = file => {
      console.log('preview', file)
    }

    const handleError = (err, file, fileList) => {
      console.error('上传失败', err, file)
    }

    // 监听 props.product.detailImages，保持 fileList 同步
    watch(
      () => props.product.detailImages,
      newImages => {
        fileList.value = newImages.map((url, index) => {
          const existing = fileList.value.find(f => f.url === url) || {}
          return {
            name: existing.name || `file-${index}`,
            url,
            file_path: existing.file_path || url,
            uid: existing.uid || `uid-${Date.now()}-${index}`
          }
        })
      },
      { immediate: true }
    )

    // 暴露 validate 给父组件
    defineExpose({
      validate: () => formRef.value?.validate()
    })

    return {
      formRef,
      fileList,
      formRules,
      handleUploadSuccess,
      beforeUpload,
      handlePreview,
      handleRemove,
      handleError
    }
  }
})
</script>
