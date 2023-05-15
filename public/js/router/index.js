import bugApp from '../pages/bug-app.cmp.js'
import bugEdit from '../pages/bug-edit.cmp.js'
import bugDetails from '../pages/bug-details.cmp.js'
import userLogin from '../cmps/user-login.cmp.js'
import userSignup from '../cmps/user-signup.cmp.js'
import userInfo from '../pages/user-info.cmp.js'
import userList from '../cmps/user-list.cmp.js'
const routes = [
  { path: '/', redirect: '/bug' },
  { path: '/login', component: userLogin },
  { path: '/signup', component: userSignup},
  { path: '/details/:userId', component: userInfo},
  { path: '/users', component: userList},
  { path: '/bug', component: bugApp },
  { path: '/bug/edit/:bugId?', component: bugEdit },
  { path: '/bug/:bugId', component: bugDetails },
]

export const router = VueRouter.createRouter({ history: VueRouter.createWebHashHistory(), routes })
