
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'), // En-tête
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue'), meta: { requiresAuth: true }, name: '' }, // Dashboard
      { path: '/dashboard', component: () => import('pages/DashboardPage.vue'), meta: { requiresAuth: true }, name: 'dashboard' }, // Dashboard
      { path: '/historique', component: () => import('pages/HistoriqueMobilePage.vue'), meta: { requiresAuth: true }, name: 'historique' }, // Historique mobile
      { path: '/settings', component: () => import('pages/AdminPage.vue'), meta: { requiresAuth: true }, name: 'settings' } // Paramètres [admin]
    ]
  },
  { path: '/login', component: () => import('pages/LoginPage.vue'), meta: { requiresAuth: false } }, // Register/Login

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue') // Page inconnue [Ereur 404]
  }
]

export default routes
