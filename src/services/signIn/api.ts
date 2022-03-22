// @ts-ignore
import { request } from 'umi';

// 查询签到信息列表
export async function getSignInInfoList(
  params: {
    endTime?: number;
    stratTime?: number;
    userId?: number;
    page: number;
    size: number;
  },
  options?: { [key: string]: any },
) {
  return request('/api/face/reg-info', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

// 查询用户签到信息
export async function getUserSignInInfo(
  params: {
    startTime: number;
    endTime: number;
    granularity: number;
    userId: number;
  },
  options?: { [key: string]: any },
) {
  return request(`/api/face/reg-info/statistics`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
