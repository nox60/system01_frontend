/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chartsRouter = {
  path: '/bigdata',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Bigdatas',
  meta: {
    title: '航空公司运输指标',
    icon: 'chart'
  },
  children: [
    {
      path: 'bigdata11',
      component: () => import('@/views/bigdata/bigdata11'),
      name: 'bigdata11',
      meta: { title: '运输总周转量', noCache: true }
    },
    {
      path: 'bigdata12',
      component: () => import('@/views/bigdata/bigdata12'),
      name: 'bigdata12',
      meta: { title: '飞行小时', noCache: true }
    },
    {
      path: 'bigdata13',
      component: () => import('@/views/bigdata/bigdata13'),
      name: 'bigdata13',
      meta: { title: '飞行班次', noCache: true }
    },
    {
      path: 'bigdata14',
      component: () => import('@/views/bigdata/bigdata14'),
      name: 'bigdata14',
      meta: { title: '旅客运输量', noCache: true }
    },
    {
      path: 'bigdata15',
      component: () => import('@/views/bigdata/bigdata15'),
      name: 'bigdata15',
      meta: { title: '旅客周转量', noCache: true }
    },
    {
      path: 'bigdata16',
      component: () => import('@/views/bigdata/bigdata16'),
      name: 'bigdata16',
      meta: { title: '货邮运输量', noCache: true }
    },
    {
      path: 'bigdata17',
      component: () => import('@/views/bigdata/bigdata17'),
      name: 'bigdata17',
      meta: { title: '货邮周转量', noCache: true }
    },
  ]
}

export default chartsRouter
