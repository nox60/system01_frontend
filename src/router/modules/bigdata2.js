/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chartsRouter = {
  path: '/bigdata',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Bigdatas',
  meta: {
    title: '机场运输指标',
    icon: 'chart'
  },
  children: [
    {
      path: 'bigdata6',
      component: () => import('@/views/bigdata/bigdata6'),
      name: 'bigdata6',
      meta: { title: '起降架次', noCache: true }
    },
    {
      path: 'bigdata7',
      component: () => import('@/views/bigdata/bigdata7'),
      name: 'bigdata7',
      meta: { title: '旅客运输量', noCache: true }
    },
    {
      path: 'bigdata8',
      component: () => import('@/views/bigdata/bigdata8'),
      name: 'bigdata8',
      meta: { title: '货物运输量', noCache: true }
    },
    {
      path: 'bigdata9',
      component: () => import('@/views/bigdata/bigdata9'),
      name: 'bigdata9',
      meta: { title: '邮件运输量', noCache: true }
    },
    {
      path: 'bigdata10',
      component: () => import('@/views/bigdata/bigdata10'),
      name: 'bigdata10',
      meta: { title: '货邮运输量', noCache: true }
    }
  ]
}

export default chartsRouter
