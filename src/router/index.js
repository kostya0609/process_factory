import { createRouter, createWebHistory } from 'vue-router'

import MyProcess from '@/pages/my_process'
import AllProcess from '@/pages/all_process'
import AddProcess from '@/pages/all_process/add'
import DetailProcess from '@/pages/all_process/detail'
import ListStatus from '@/pages/status'
import listApprovalRoutes from '@/pages/approval_routes'
import detailApprovalRoutes from '@/pages/approval_routes/detail'

const routes = [
  {
    path      : '/business-process/my-process/',
    children : [
      {
        path      : 'list',
        name      : 'myProcess',
        component : MyProcess,
        meta      : {
          name         : 'Мои процессы',
          full_access  : false,
          order        : 1,
          right_button : {
            show  : false,
            // label : '',
            // path  : '/business-process/my-process/add',
          }
        }
      },
    ],
  },
  {
    path      : '/business-process/all-process/',
    children : [
      {
        path      : 'list',
        name      : 'allProcess',
        component : AllProcess,
        meta      : {
          name         : 'Все процессы',
          full_access  : true,
          order        : 2,
          right_button : {
            show  : true,
            label : 'процесс',
            path  : '/business-process/all-process/add',
          }
        }
      },
      {
        path: 'add',
        name: 'addProcess',
        component: AddProcess,
      },
      {
        path: 'detail/:id',
        name: 'detailProcess',
        component: DetailProcess,
      },
    ],
  },
  {
    path      : '/business-process/status/',
    children : [
      {
        path      : 'list',
        name      : 'listStatus',
        component : ListStatus,
        meta      : {
          name         : 'Статусы',
          full_access  : true,
          order        : 3,
          right_button : {
            show  : false,
            // label : 'статус',
            // path  : '/business-process/status/add',
          }
        }
      },
    ],
  },
  {
    path      : '/business-process/approval-routes/',
    children : [
      {
        path      : 'list',
        name      : 'listApprovalRoutes',
        component : listApprovalRoutes,
        meta      : {
          name         : 'Маршруты',
          full_access  : true,
          order        : 4,
          right_button : {
            show  : false,
            // label : 'статус',
            // path  : '/business-process/status/add',
          }
        }
      },
      {
        path: 'detail/:id',
        name: 'detailApprovalRoutes',
        component: detailApprovalRoutes,
      },

    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  previous : null,
})

router.beforeEach((to, from, next) => {
  router.previous = from.name;
  !router.getRoutes().find(el => {return el.name === to.name}) ? router.push({name : 'myProcess'}) : '';
  next();
})

export default router
