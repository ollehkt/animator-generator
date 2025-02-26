import { createRouter, createWebHistory } from 'vue-router'

import {
  EditorView,
  PreviewView,
  ProjectView,
  NotFoundView,
} from '@/views'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/project',
    },
    {
      path: '/project/:id',
      name: 'editor',
      component: EditorView,
    },
    {
      path: '/project',
      name: 'project',
      component: ProjectView,
    },
    {
      path: '/preview',
      name: 'preview',
      component: PreviewView,
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

router.beforeEach(async (to, from) => {
})
