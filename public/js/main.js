import { router } from './router/index.js'
import appHeader from './cmps/app-header.cmp.js'
import userMsg from './cmps/user-msg.cmp.js'
import { userService } from './services/user-service.js'

const options = {
  template: `
    <app-header :user="user" @loggedOut="logOut"/>
    <user-msg />
    <router-view @updateUser="updateUser" :user="user"/>
    `,
  router,
  components: {
    appHeader,
    userMsg,
  },
  created() {
    this.user = userService.getLoggedInUser()
  },
  data() {
    return {
      user: null
    }
  },
  methods: {
    updateUser(user){
      this.user = user
    },
    logOut(){
      this.user = null
    }
  },
}

const app = Vue.createApp(options)
app.use(router)
app.mount('#app')
