<template>
    <el-form :model="product" ref="formRef" label-width="120px" class="product-form" :rules="formRules">
    <!-- 商品名称 -->
        <el-form-item label="商品名称"prop="name" >
            <el-input v-model="product.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <!-- 商品介绍 -->
        <el-form-item label="副标题" prop="description">
            <el-input v-model="product.description" placeholder="请输入副标题"></el-input>
        </el-form-item>
        <!-- 商品分类选择 -->
        <el-form-item label="商品分类" prop="category">
            <el-select v-model="product.category" placeholder="请选择商品分类">
                <el-option
                  v-for="item in categories"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
            </el-select>
        </el-form-item>
    </el-form>
</template>
  
  <script>
  import { defineComponent, ref, onMounted, defineExpose } from 'vue'
  import { useStore } from 'vuex'
  export default defineComponent({
    props: { product: Object },
    setup(props, { emit }) {
        const store = useStore()
        const formRef = ref(null)
        const formRules = {
            name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
            category: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
            description: [{ required: true, message: '请输入副标题', trigger: 'blur' }],
        }
        const categories = ref([])
        // 加载商品分类数据
        const fetchCategories = async () => {
            try {
                const response = await store.dispatch('product/fetchCategories')
                // 将后端数据格式映射为 el-select 所需格式
                const updatedCategories = response.items.map(item => ({
                    id: item.id,
                    name: item.name
                }))
                categories.value = updatedCategories
                // 通过 emit 向父组件传递更新后的分类数据
                emit('update:categories', categories.value)
            } catch (error) {
                console.error('加载商品分类失败:', error)
            }
        }
        onMounted(() => {
            fetchCategories()
        })
  
      // 让父组件能够访问 validate 方法
      defineExpose({
        validate: () => formRef.value?.validate()
      })
  
      return { formRef, formRules, fetchCategories,categories }
    }
  })
  </script>