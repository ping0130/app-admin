// src/api/product.js
import request from '@/utils/request';  // 假设你有一个封装的 request 函数

// 获取商品列表
export function fetchProductList(data) {
  return request({
    url: '/api/product/list',
    method: 'POST',
    data,
  });
}

// 添加商品
export function addProduct(data) {
  return request({
    url: '/api/product/add',
    method: 'POST',
    data,
  });
}

// 获取指定商品
export function fetchProductById(id) {
  return request({
    url: `/api/products/${id}`,
    method: 'GET',
  });
}

// 删除商品
export function deleteProduct(id) {
  return request({
    url: `/api/products/${id}`,
    method: 'DELETE',
  });
}
//  编辑商品
export function editProduct(productData) {
    return request({
      url: `/api/products/${productData.id}`,
      method: 'PUT',
      data: productData
    });
  }
//  管理标签
export function updateProductTagStatus (data) {
  return request({
    url: `/api/tags`,
    method: 'PUT',
    data
  });
}

//规格管理
export function fetchSpec (params) {
  return request({
    url: `/api/product/spec`,
    method: 'GET',
    params
  });
}

//参数管理
export function fetchParam (params) {
  return request({
    url: `/api/product/param`,
    method: 'GET',
    params
  });
}

//分类管理
export function fetchCategories (params) {
  return request({
    url: `/api/categories`,
    method: 'GET',
    params
  });
}
export function saveCategory (data) {
  return request({
    url: `/api/categories`,
    method: 'POST',
    data
  });
}
export function deleteCategory (id) {
  return request({
    url: `/api/categories/${id}`,
    method: 'delete',
  });
}
export function updateCategory(data) {
  return request({
    url: `/api/categories/${data.id}`,
    method: 'put',
    data,
  });
}
//tag
export function fetchTags (params) {
  return request({
    url: `/api/tags`,
    method: 'GET',
    params
  });
}
export function fetchNewProducts (params) {
  return request({
    url: `/api/new-products`,
    method: 'GET',
    params
  });
}
export function updateNewProducts (data) {
  return request({
    url: `/api/new-products`,
    method: 'put',
    data
  });
}