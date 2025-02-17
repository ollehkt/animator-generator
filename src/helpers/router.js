import { createRouter, createWebHistory } from 'vue-router'

import {
  EditorView,
  PreviewView,
} from '@/views'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: MainView,
    // },
    {
      path: '/',
      name: 'editor',
      component: EditorView,
    },
    {
      path: '/preview',
      name: 'preview',
      component: PreviewView,
    },
  ],
})

router.beforeEach(async (to, from) => {
})
