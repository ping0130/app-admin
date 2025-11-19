// src/store/modules/product.js
import { ElMessage } from 'element-plus';
import { 
  addProduct, 
  fetchProductList, 
  updateProductTagStatus, 
  deleteProduct, 
  fetchProductById, 
  editProduct,
  fetchCategories,
  saveCategory,
  deleteCategory,
  updateCategory,
  fetchTags,
  fetchNewProducts,
  updateNewProducts,
  fetchSpec
} 
from '@/api/product'; // 引入请求函数

export default {
  namespaced: true,
  state: {
    products: [],
    total: 0,
    categories: [],
    categoryTotal: 0,
    tags: []
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
    setTotal(state, total) {
      state.total = total;
    },
    addProduct(state, product) {
      state.products.push(product);
    },
    setCategories(state, payload) {
      state.categories = payload.items;
      state.categoryTotal = payload.total;
    },
    setTags(state, tags) {
      state.tags = tags;
    },
    SET_NewProducts(state, products) {
      state.newProducts = products
    },
    UPDATE_PRODUCT_SORT(state, { id, sort_order }) {
      const target = state.newProducts.find(p => p.id === id)
      if (target) {
        target.sort_order = sort_order
      }
    },
    SET_SPECS(state, specs) {
      state.specs = specs
    },
    SET_PARAMS(state, params) {
      state.params = params
    }
  },
  actions: {
    async ProductList({ commit }, params) {
      try {
        const response = await fetchProductList(params)
        commit('setProducts', response.products)
        commit('setTotal', response.total)
      } catch (error) {
        console.error('获取商品列表失败:', error)
        ElMessage.error('获取商品列表失败')
      }
    },

    async addProduct({ commit }, productData) {
      try {
        const response = await addProduct(productData); // 调用 API
        // 统一返回对象，保证前端可以安全访问
        if (response.success) {
          commit('addProduct', response.product);
          return {
            success: true,
            message: response.message || '商品添加成功',
            product: response.product
          };
        } else {
          return {
            success: false,
            message: response.message || '商品添加失败'
          };
        }
      } catch (error) {
        console.error('添加商品失败:', error);
        return {
          success: false,
          message: error.response?.data?.message || '添加商品失败，请稍后再试'
        };
      }
    },

    async deleteProduct({ commit,state }, id) {
      try {
        const response = await deleteProduct(id);
        if (response.success) {
          ElMessage.success('商品删除成功');
          commit('setProducts', state.products.filter(product => product.id !== id));
        } else {
          ElMessage.error('商品删除失败');
        }
      } catch (error) {
        console.error('删除商品失败:', error);
        ElMessage.error('删除商品失败，请稍后再试');
      }
    },
    // 获取商品详情
    async fetchProduct({ commit }, productId) {
        try {
          const response = await fetchProductById(productId);
          if (response.success) {
            // 请求成功后，更新 Vuex 状态中的商品数据
            commit('setProducts', response.product);
            return response.product;
          } else {
            throw new Error('获取商品信息失败');
          }
        } catch (error) {
          console.error('获取商品信息失败:', error);
          throw error;
        }
      },
      async editProduct({ commit }, { productData }) {
        try {
            const response = await editProduct(productData)
            commit('setProducts', response.product);
            return response;  // 返回响应给调用者
        } catch (error) {
          throw error;  // 抛出错误，让组件处理
        }
      },
      async updateTagStatus({ commit }, payload) {
        try {
          const res = await updateProductTagStatus(payload)
          if (res.success) return res
          else throw new Error(res.message || '更新失败')
        } catch (err) {
          console.error('标签状态更新失败:', err)
          throw err
        }
      },
      async fetchCategories({ commit }) {
        try {
          // 调用 API 获取分类数据
          const res = await fetchCategories({});
      
          // 确保返回的数据结构正确
          if (res && res.items) {
            commit('setCategories', {
              items: res.items,  // 分类项
              total: res.total   // 分类总数
            });
            // 返回响应数据，供调用方使用
            return res;
          } else {
            throw new Error('获取分类数据失败');
          }
        } catch (error) {
          throw error; // 可以抛出错误以便组件捕获
        }
      },
      async saveCategory(_, payload) {
        const res = await saveCategory(payload)
        if (res.success) return res
      },
      async deleteCategory(_, id) {
        const res = await deleteCategory(id)
        if (res.success) return res
      },
      async editCategory(_, payload) {
        const res = await updateCategory(payload)
        if (res.success) return res
        else throw new Error(res.message || '更新失败')
      },
      async fetchTags({ commit }) {
        try {
          const res = await fetchTags();
          if (Array.isArray(res)) {
            commit('setTags', res);  // 直接提交后端返回的数组
            return res;
          }
          throw new Error('标签数据格式错误');
        } catch (error) {
          console.error('获取标签失败:', error);
          ElMessage.error('获取标签失败');
          throw error;
        }
      },
      async fetchNewProducts({ commit }) {
        try {
          const res = await fetchNewProducts() // 
          commit('SET_NewProducts', res.products)
        } catch (err) {
          console.error('获取新品推荐失败', err)
        }
      },
      async updateNewProducts({ commit }, payload) {
        try {
          await updateNewProducts(payload) // 后端 PUT 更新
          commit('UPDATE_PRODUCT_SORT', payload) //
        } catch (err) {
          console.error('更新排序失败', err)
          throw err
        }
      },
      async fetchNewProducts({ commit }) {
        try {
          const res = await fetchNewProducts() // 
          commit('SET_NewProducts', res.products)
        } catch (err) {
          console.error('获取新品推荐失败', err)
        }
      },
      async spec({ commit }) {
        try {
          const res = await fetchSpec()
          // 确认后端返回的数据结构
          commit('SET_SPECS', res)  
          return res
        } catch (err) {
          console.error('获取商品规格失败:', err)
          throw err
        }
      }
  },
  getters: {
    products: (state) => state.products,
    total: (state) => state.total,
  },
};
