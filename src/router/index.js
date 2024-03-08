import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/Layout'

Vue.use(Router)
/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in sub-menu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
    affix: true                  if true, the tag will affix in the tags-view
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'cus/delivery',
    // children: [
    //   {
    //     path: 'delivery',
    //     component: () => import('@/views/dashboard/index'),
    //     name: 'Dashboard',
    //     meta: { title: 'dashboard', icon: 'dashboard', noCache: true, affix: true }
    //   }
    // ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  }

]
export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [{
  path: '/cus',
  component: Layout,
  redirect: 'noredirect',
  name: 'cusname',
  meta: {
    title: 'cusname',
    icon: 'component'
  },
  children: [
    {
      path: 'delivery',
      component: () => import('@/views/delivery/'),
      name: 'delivery',
      meta: { title: 'delivery', noCache: true , icon: 'excel'}
    },
    {
      path: 'receipt',
      component: () => import('@/views/receipt/'),
      name: 'receipt',
      meta: { title: 'receipt', noCache: true , icon: 'clipboard'}
    },
  ]
},

{ path: '*', redirect: '/404', hidden: true }
]