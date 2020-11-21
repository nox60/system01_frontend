/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const componentsRouter = {
  path: '/components',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ComponentDemo',
  meta: {
    title: '我的工作',
    icon: 'component'
  },
  children: [
    {
      path: 'works-record-table',
      component: () => import('@/views/myworks/works-record-table'),
      name: 'works-record-table',
      meta: { title: '工作记录' }
    },
    {
      path: 'task',
      component: () => import('@/views/myworks/task-table'),
      name: 'task',
      meta: { title: '排班安排' }
    },
    {
      path: 'device',
      component: () => import('@/views/myworks/device'),
      name: 'device',
      meta: { title: '设备维护' }
    },
    {
      path: 'split-pane',
      component: () => import('@/views/myworks/device'),
      name: 'SplitpaneDemo',
      meta: { title: 'FOD外来物管理' }
    },
    {
      path: 'avatar-upload',
      component: () => import('@/views/myworks/device'),
      name: 'AvatarUploadDemo',
      meta: { title: '步行巡视' }
    },
    {
      path: 'dropzone',
      component: () => import('@/views/myworks/device'),
      name: 'DropzoneDemo',
      meta: { title: '不停航施工' }
    }
  ]
}

export default componentsRouter
