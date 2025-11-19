<template>
  <el-form :model="product" ref="formRef" label-width="120px" class="product-form" :rules="formRules">
    <!-- 商品标签 -->
    <el-form-item label="商品标签" prop="tag">
      <el-checkbox-group v-model="product.tag">
        <el-checkbox 
          v-for="(tag, index) in tags" 
          :key="index" 
          :label="tag.value" 
          size="large">
          {{ tag.name }}
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>

<script>
import { defineComponent, ref, onMounted, defineExpose } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  props: { product: Object },
  setup(_, { expose }) { // ✅ 让父组件可以访问 formRef
    const formRef = ref(null)
    const tags = ref([])
    const store = useStore()
    // 定义表单验证规则
    const formRules = {
      tag: [{ required: true, message: '请选择商品标签', trigger: 'change' }]
    }

    // 请求获取商品标签
    const fetchTags = async () => {
      try {
        const response = await store.dispatch('product/fetchTags')
        tags.value = response // ✅ 假设后端返回的是标签数组
      } catch (error) {
        console.error('获取标签失败', error)
      }
    }

    // 组件挂载时获取标签
    onMounted(fetchTags)
    if (Array.isArray(_.product.tag) && typeof _.product.tag[0] === 'object') {
    _.product.tag = _.product.tag.map(tag => tag.id)
    }
    // ✅ 让父组件能够访问 validate 方法
    defineExpose({
      validate: () => formRef.value?.validate()
    })

    return { formRef, formRules, tags }
  }
})
</script>
