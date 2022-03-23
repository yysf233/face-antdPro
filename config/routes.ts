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
    routes: [
      {
        path: '/admin/sub-page',
        name: '用户管理',
        icon: 'smile',
        component: './UserManage/index',
      },
      {
        path: '/admin/signIn',
        name: '签到信息',
        icon: 'smile',
        component: './SignInManage/index',
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
