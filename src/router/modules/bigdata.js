/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chartsRouter = {
  path: '/bigdata',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Bigdatas',
  meta: {
    title: '大数据分析',
    icon: 'chart'
  },
  children: [
    {
      path: 'bigdata1',
      component: () => import('@/views/charts/bigdata1'),
      name: 'bigdata1',
      meta: { title: '大数据表1', noCache: true }
    },
    {
      path: 'bigdata2',
      component: () => import('@/views/charts/bigdata2'),
      name: 'bigdata2',
      meta: { title: '大数据表2', noCache: true }
    }
  ]
}

export default chartsRouter
