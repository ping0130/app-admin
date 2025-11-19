<template>
      <!-- 删除确认弹窗 -->
  <el-dialog v-model="visible" title="确认删除" width="400px">
    <p>确定要删除商品 <strong>{{  product?.name}}</strong> 吗？</p>
    <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="danger" @click="deleteProduct">确定删除</el-button>
    </template>
  </el-dialog>
</template>
<script>
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useStore } from 'vuex'

  export default {
    name: 'DeleteProduct',
    setup(_, { emit }) {
      const store = useStore()
      const visible = ref(false)
      const product = ref({})
// 打开删除弹窗
    const openDeleteDialog = (selectedProduct) => {
        product.value = { ...selectedProduct }
        visible.value = true
    };

    // 删除商品
    const deleteProduct = async () => {
      try {
        await store.dispatch("product/deleteProduct", product.value.id )
        // 重新获取商品列表
        emit('product-deleted')
        visible.value = false
      } catch (error) {
        ElMessage.error("删除失败：" + (error.response?.message || "未知错误"))
      }
    }
    return {
        visible,
        product,
        deleteProduct,
        openDeleteDialog
    }
  }
}
</script>