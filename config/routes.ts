export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: '分析页',
    icon: 'smile',
    path: '/welcome',
    component: './DashboardAnalysis',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './UserManage/index',
    routes: [
      {
        path: '/admin/sub-page',
        name: '用户管理',
        icon: 'smile',
        component: './UserManage/index',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
