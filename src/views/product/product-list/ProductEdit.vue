<template>
    <div class="center-container">
      <el-card class="box-card">
        <el-steps :active="activeStep" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品促销"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品详情"></el-step>
          <el-step title="确认"></el-step>
        </el-steps>
  
        <div class="form-container">
          <ProductStep1 v-if="activeStep === 0" v-model:product="product" ref="formStep1" />
          <ProductStep2 v-if="activeStep === 1" v-model:product="product" ref="formStep2" />
          <ProductStep3 v-if="activeStep === 2" v-model:product="product" ref="formStep3" 
          @update:photos="updatePhotos" @update:file_path="updateFilePath" />
          <ProductStep4 v-if="activeStep === 3" v-model:product="product" ref="formStep4"/>
          <ProductStep5 v-if="activeStep === 4" v-model:product="product" />
        </div>
  
        <StepNavigation
          :activeStep="activeStep"
          :totalSteps="5"
          @prev="prevStep"
          @next="nextStep"
          @submit="confirmSubmit"
        />
      </el-card>
    </div>
  </template>
  
  
  <script>
  import { useRoute,  useRouter} from 'vue-router'
  import { useStore } from 'vuex'
  import {ref, nextTick,onMounted } from 'vue'
  import { ElMessage,ElMessageBox  } from 'element-plus'
  import QuillEditorComponent from '@/components/Steps/QuillEditorComponent.vue'
  import ProductStep1 from '@/components/Steps/ProductStep1.vue'
  import ProductStep2 from '@/components/Steps/ProductStep2.vue'
  import ProductStep3 from '@/components/Steps/ProductStep3.vue'
  import ProductStep4 from '@/components/Steps/ProductStep4.vue'
  import ProductStep5 from '@/components/Steps/ProductStep5.vue'
  import StepNavigation from '@/components/Steps/StepNavigation.vue'
  export default {
  components: {
    QuillEditorComponent,  // 引入 QuillEditorComponent
    ProductStep1, ProductStep2, ProductStep3, ProductStep4, ProductStep5, StepNavigation
  },
  name: 'UpdateProduct',
  setup() {
    const activeStep = ref(0)
    const store = useStore()
    const formStep3 = ref(null)
    const formStep1 = ref(null)
    const formStep2 = ref(null)
    const formStep4 = ref(null)
    const route = useRoute() // 获取当前路由
    const router = useRouter()
    const productId = ref(null)
    const product = ref({
      name: '',         // 商品名称
      category: '',     // 商品分类
      description: '',  // 商品介绍
      price: 0,            // 默认商品价格为0
      marketPrice: 0,      // 默认市场价格为0
      inventory: 0,        // 默认库存为0
      photos: [],
      file_path: '',
      params: '',
      spec: '',
      details: '',
      tag: [],
      detailImages: [],
      detailFilePaths: [],
    })
    const checkList = ref([])  // 存储选中的标签
    const fileList = ref([])
    // 下一步方法
    const nextStep = async () => {
      await nextTick(); // 确保 DOM 更新完成
      let formComponent = null;
      if (activeStep.value === 0) {
        formComponent = formStep1.value;
      } else if (activeStep.value === 1) {
        formComponent = formStep2.value;
      } else if (activeStep.value === 2) {
        formComponent = formStep3.value;
      } else if (activeStep.value === 3) {
        formComponent = formStep4.value; // ✅ 添加 Step4
      }
      if (formComponent?.formRef?.validate) {
        // 正确调用 validate 方法
        formComponent.formRef.validate((valid, invalidFields) => {
          if (valid) {
            if (activeStep.value < 4) {
              activeStep.value++;
            }
          } else {
            console.error("表单验证失败", invalidFields);
          }
        });
      } else {
        console.error("无法找到表单实例，请检查子组件是否正确暴露 formRef");
      }
    }
    const prevStep = () => {
      // 跳到上一个步骤
      if (activeStep.value > 0) {
         activeStep.value--;
      }
    }
  // **方法：获取商品数据**
  const fetchProductData = async (productId) => {
      try {
        const productData = await store.dispatch('product/fetchProduct', productId)
        if (productData) {
          product.value = productData // 填充表单数据
        } else {
          ElMessage.error("获取商品数据失败productData不等于success");
        }
      } catch (error) {
        console.error("获取商品数据失败:", error);
        ElMessage.error("获取商品数据失败，请稍后重试");
      }
    }
    // 确认提交方法
    const confirmSubmit = () => {
      // 显示确认弹窗
      ElMessageBox.confirm('您确定要提交该商品信息吗？', '确认提交', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        // 用户点击确认，执行提交表单
        submitForm();
      })
      .catch(() => {
        // 用户点击取消，不执行任何操作
        ElMessage.info('提交已取消');
      });
    }
  
    const submitForm = async () => { 
      // 提交表单
      try{
        const response  = await store.dispatch('product/editProduct', { 
          productData: product.value
        })
        // 判断后端返回的 success 字段
        if (response.success) {
          // 成功处理
          ElMessage.success('商品编辑成功！')
          router.push({
            name: 'ProductList',
            query: { productId: product.id }
          }).catch((err) => {
            console.error("跳转失败:", err)
          })
        } else {
        // 如果 success 为 false，则显示失败信息
        ElMessage.error('商品编辑失败，请稍后重试！')
       }
      } catch (error) {
        // 失败处理
        console.error('编辑失败:', error);
        const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : '编辑失败，请稍后重试！'; // 如果没有返回具体错误信息，显示默认错误信息
        ElMessage.error(errorMessage)
      }
    }

      onMounted(() => {
      productId.value = route.query?.productId || null;
      if (productId.value) {
        fetchProductData(productId.value); // 只有在存在 ID 时才请求数据
      }
    });
    return {
      activeStep,
      product,
      nextStep,
      prevStep,
      confirmSubmit,
      submitForm,
      fileList,
      formStep1,
      formStep2,
      formStep3,
      formStep4,
      checkList,
      fetchProductData,
      productId
    }
  }
  }
  </script>
  
  <style scoped>
  .center-container {
    display: flex;
    justify-content: center; /* 水平居中 */
    height: 100vh; /* 填满整个屏幕 */
    padding: 20px;
  }
  
  .box-card {
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #dcdfe6;
    min-width: 900px;
    max-height: 80vh; 
    margin: 0 auto;
    overflow-y: auto;
  }
  .product-form {
  width: 100%;
  }
  
  .steps-wrapper {
  margin-bottom: 20px;
  }
  
  .form-container {
    margin-top: 20px;
  }
  .el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  }
  
  </style>
  