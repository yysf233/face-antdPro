// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

// 根据ID获取图片列表
export async function getPicsById(
  params: {
    id: number
  },
  options?: { [key: string]: any },
) {
  return request('/api/face/reg-face-file', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

// 根据图片名删除图片
export async function deletePicById(
    params: {
      name: string
    },
    options?: { [key: string]: any },
  ) {
    return request(`/api/face/reg-face-file?name=${params.name}`, {
      method: 'DELETE',
      ...(options || {}),
    });
  }