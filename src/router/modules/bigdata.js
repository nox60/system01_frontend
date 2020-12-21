/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chartsRouter = {
  path: '/bigdata',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Bigdatas',
  meta: {
    title: '运输指标汇总',
    icon: 'chart'
  },
  children: [
    {
      path: 'bigdata1',
      component: () => import('@/views/bigdata/bigdata1'),
      name: 'bigdata1',
      meta: { title: '旅客运输量', noCache: true }
    },
    {
      path: 'bigdata2',
      component: () => import('@/views/bigdata/bigdata2'),
      name: 'bigdata2',
      meta: { title: '旅客周转量', noCache: true }
    },
    {
      path: 'bigdata3',
      component: () => import('@/views/bigdata/bigdata3'),
      name: 'bigdata3',
      meta: { title: '货邮运输量', noCache: true }
    },
    {
      path: 'bigdata4',
      component: () => import('@/views/bigdata/bigdata4'),
      name: 'bigdata4',
      meta: { title: '货邮周转量', noCache: true }
    },
    {
      path: 'bigdata5',
      component: () => import('@/views/bigdata/bigdata5'),
      name: 'bigdata5',
      meta: { title: '运输周转量', noCache: true }
    }

  ]
}

export default chartsRouter
