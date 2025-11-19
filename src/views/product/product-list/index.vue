<template>
  <div class="product-management">
    <CommonTable
      cardTitle="商品列表"
      :columns="columns"
      :data="tableData"
      :total="total"
      :currentPage="currentPage"
      :pageSize="pageSize"
      v-model:currentPage="currentPage"
      v-model:pageSize="pageSize"
      :searchFields="[
        { label: '名称', value: 'name' }
      ]"
      @add="handleAdd"
      @delete="handleDelete"
      @edit="handleEdit"
      @tag="handleTagChange"
      @del="handleDelete"
      @update:current-page="handlePageChange"
      @update:page-size="handlePageSizeChange"
    />
    <DeleteProduct ref="deleteProductRef" @product-deleted="fetchProducts" />

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick,computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessageBox, ElMessage } from 'element-plus'
import DeleteProduct from './ProductDelete.vue'
import { useRouter } from 'vue-router'
import CommonTable from '@/components/Table/CommonTable.vue'
const router = useRouter()
const store = useStore()
const products = ref([]) // 商品数据
const searchQuery = ref('')
const searchField = ref('')
const selectedProduct = ref({}) // 选中的商品
const deleteDialogVisible = ref(false); // 控制删除弹框显示
const deleteProductRef = ref(null)
const showDetail = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => store.state.product.total)
// 表格配置
const columns = [
  { label: 'ID', prop: 'id', minWidth: 50 },
  { label: '名称', prop: 'name' },
  { label: '图片', prop: 'product_images' },
  { label: '价格', prop: 'price' }, 
  { label: '规格', prop: 'specs' }, 
  { label: '库存', prop: 'inventory' },
  { label: '标签', prop: 'tag' },
  ]
const tableData = ref([])
const openDrawer = () => {
  addProductRef.value.openDrawer()
}
// 请求商品列表
const fetchProducts = async() => {
  const params = {
    page: currentPage.value,
    size: pageSize.value,
    searchField: searchField.value,
    searchQuery: searchQuery.value
  }
  try {
    await store.dispatch('product/ProductList', params) // 触发 Vuex action
    tableData.value = store.state.product.products.map(p => ({
      ...p,
      price: p.skus && p.skus.length ? p.skus[0].price : 0,
      inventory: p.skus && p.skus.length ? p.skus[0].stock : 0,
      specs: p.skus && p.skus.length ? p.skus[0].spec_name : '-'
    }))
    } catch (error) {
      console.error('加载商品列表失败', error)
    }
  }
// 修改标签状态
const handleTagChange = async (product, tag) => {
  const newStatus = tag.status === 1 ? 0 : 1
  try {
    const confirm = await ElMessageBox.confirm(
      `确定将标签 "${tag.name}" 的状态更改为 ${newStatus  === 1 ? '开启' : '关闭'} 吗？`,
      '确认操作',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).catch(() => false)
    if (!confirm) return
    // 发送请求更新标签状态
    await store.dispatch('product/updateTagStatus', {
      product_id: product.id,
      tag_id: tag.id,
      tag_status: tag.status
      })
      // 手动更新标签状态（页面同步）
      tag.status = newStatus
      //刷新商品列表
      fetchProducts()
      ElMessage.success(`标签 "${tag.name}" 状态已更新`)
    } catch (error) {
      console.error('更新标签状态失败:', error)
    }
  }
const handleAdd = async() => {
  router.push({ name: 'AddProduct' })
}
// 编辑商品
const handleEdit = async (product) => {
  try {
    // 调用 Vuex 的 fetchProduct action 获取商品数据
    const productData = await store.dispatch('product/fetchProduct', product.id)
    if (productData) {
      store.commit('product/setProducts', productData);// 保存商品数据到 Vuex
      // 跳转到商品编辑页面并传递商品数据
      router.push({
        name: 'edit-product',
        query: { productId: product.id }
      }).catch((err) => {
        console.error("跳转失败:", err);
      })
    } else {
      ElMessage.error('获取商品信息失败');
    }
  } catch (error) {
    console.error('获取商品信息失败:', error);
    ElMessage.error('获取商品信息失败，请稍后重试');
  }
}
const detailProduct = (product) => {
  selectedProduct.value = { ...product }
  showDetail.value = true
}
const openDeleteDialog = async (product) => {
  await nextTick() // 确保组件已加载
  console.log("deleteProductRef:", deleteProductRef.value)
  if (deleteProductRef.value) {
    console.log("调用 openDialog", product)
    deleteProductRef.value.openDeleteDialog(product)
  } else {
    console.error('DeleteUser 组件尚未挂载')
  }
}
// 删除商品
const handleDelete = (product) => {
  if (deleteProductRef.value) {
    // ✅ 调用 DeleteProduct 组件中的删除方法
    deleteProductRef.value.openDeleteDialog(product)
  } else {
    ElMessage.error('删除组件未加载')
  }
}
// 分页处理函数
const handlePageChange = (newPag) => {
  currentPage.value = newPag
  fetchProducts()
}
const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize
  fetchProducts()
}
onMounted(() => {
  fetchProducts()
// 防抖处理 ResizeObserver
const debounce = (fn, delay = 200) => {
  let timer = null
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
nextTick(() => {
  const ro = new ResizeObserver(debounce(() => {}, 200))
    ro.observe(document.body)
  })
})
</script>

<style scoped>
.product-management {
  padding: 20px;
}
.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.search-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
.search-input {
  max-width: 300px;
  flex: 1;
}
.search-select {
  width: 150px;
}
.add-user-btn {
  margin-left: auto;
}
.pagination {
  margin-top: 20px;
  text-align: right;
}


</style>
