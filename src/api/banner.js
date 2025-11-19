// src/api/product.js
import request from '@/utils/request'

// 获取轮播图列表
export function fetchBanners() {
  return request({
    url: '/api/banners',
    method: 'get',
  })
}

// 添加轮播图
export function addBanner(data) {
  return request({
    url: '/api/banners',
    method: 'post',
    data,
  })
}

// 更新轮播图
export function updateBanner(id, data) {
  return request({
    url: `/api/banners/${id}`,
    method: 'put',
    data,
  })
}

// 删除轮播图
export function deleteBanner(id) {
  return request({
    url: `/api/banners/${id}`,
    method: 'delete',
  })
}
