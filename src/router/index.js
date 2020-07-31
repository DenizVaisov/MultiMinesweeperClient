import Vue from 'vue'
import Router from 'vue-router'
import Game from '@/views/Game'
import Lobby from'@/views/Lobby'
import Results from '@/views/Results'
import Records from '@/views/Records'
import Vue2TouchEvents from 'vue2-touch-events'

Vue.use(Vue2TouchEvents)
Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
      {                                                                         
        path: '/',
        name: 'Lobby',
        component: Lobby
      },
      {
        path: '/results',
        name: 'Results',
        component: Results
      },
      {
        path: '/records',
        name: 'Records',
        component: Records
      },
      {
        path: '/game',
        name: 'Game',
        component: Game
      }
    ]
  })