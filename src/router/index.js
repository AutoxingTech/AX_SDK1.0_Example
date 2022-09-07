import Vue from 'vue'
import Router from 'vue-router'
import init from '@/page/init'
import connect from '@/page/connect'
import rocker from '@/page/motion/rocker'
import step from '@/page/motion/step'
import mapto from '@/page/motion/mapto'
import showmap from '@/page/map/showmap'
import relocation from '@/page/map/relocation'
import changemap from '@/page/map/changemap'
import updatemap from '@/page/map/updatemap'
import realpose from '@/page/map/realpose'
import poito from '@/page/motion/poito'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'init',
      component: init
    },
    {
      path: '/connect',
      name: 'connect',
      component: connect
    },
    {
      path: '/rocker',
      name: 'rocker',
      component: rocker
    },
    {
      path: '/step',
      name: 'step',
      component: step
    },
    {
      path: '/mapto',
      name: 'mapto',
      component: mapto
    },
    {
      path: '/showmap',
      name: 'showmap',
      component: showmap
    },
    {
      path: '/relocation',
      name: 'relocation',
      component: relocation
    },
    {
      path: '/changemap',
      name: 'changemap',
      component: changemap
    },
    {
      path: '/updatemap',
      name: 'updatemap',
      component: updatemap
    },
    {
      path: '/realpose',
      name: 'realpose',
      component: realpose
    },
    {
      path: '/poito',
      name: 'poito',
      component: poito
    }
  ]
})
