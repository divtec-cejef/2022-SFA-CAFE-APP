
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue'), meta: { requiresAuth: true }, name: 'dashboard' },
      { path: '/dashboard', component: () => import('pages/DashboardPage.vue'), meta: { requiresAuth: true }, name: 'dashboard' },
      { path: '/historique', component: () => import('pages/HistoriqueMobilePage.vue'), meta: { requiresAuth: true }, name: 'historique' }
    ]
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
    meta: { requiresAuth: false }
  },
  // {
  //   path: '/dashboard',
  //   component: () => import('pages/DashboardPage.vue'),
  //   meta: { requiresAuth: true }
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
