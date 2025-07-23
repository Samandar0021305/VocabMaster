import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LayerManagement from '@/views/LayerManagement.vue'
import WordManagement from '@/views/WordManagement.vue'
import GameSession from '@/views/GameSession.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/layers',
      name: 'layers',
      component: LayerManagement
    },
    {
      path: '/layer/:id/words',
      name: 'words',
      component: WordManagement
    },
    {
      path: '/game/:layerId',
      name: 'game',
      component: GameSession
    }
  ]
})

export default router