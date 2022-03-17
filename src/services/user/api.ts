// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

// 获取人员列表
export async function getUsers(
  params: {
    page: number;
    size: number;
  },
  options?: { [key: string]: any },
) {
  return request('/api/face/reg-user', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

// 添加人员
export async function regUser(
  data: {
    id: number;
    name: string;
    phoneNumber: string;
  },
  options?: { [key: string]: any },
) {
  return request('/api/face/reg-user', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

// 更新人员
export async function updateUser(
  data: {
    id: number;
    name: string;
    phoneNumber: string;
  },
  options?: { [key: string]: any },
) {
  return request('/api/face/reg-user', {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

// 删除人员
export async function deleteUser(
  params: {
    id: number;
  },
  options?: { [key: string]: any },
) {
  console.log('params', params);

  return request(`/api/face/reg-user?id=${params.id}`, {
    method: 'DELETE',
    // params,
    ...(options || {}),
  });
}
