'use strict'
import { showSuccessMsg } from "../services/eventBus-service.js"
import { showErrorMsg } from "../services/eventBus-service.js"
import { userService } from "../services/user-service.js"
export default {
  props: ['user'],
  template: `

    <section v-if="user">
      <div v-if="user.isAdmin">
        <ul class="user-list" v-if="users">
          <li v-for="(user, index) in users" :key="index">
              <span @click="remove(user._id)">x</span>
              <span> {{user.fullname}}</span>
              <span> Admin: {{user.isAdmin}}</span>  
              
          </li>
        </ul>
        <span v-else class="bug-list">OMG! No Users</span>

      </div>
                           

      <div v-else>You are not autorized </div>
    </section>
     `,
     data() {
      return {
        users: null,
      }
     },

created() {
  userService.query().then(users => {
    this.users = users
  })
},
  methods: {
    remove(userId){
      userService.remove(userId)
      .then(()=> {
        showSuccessMsg(`user #${userId} deleted successfully`)
        userService.query().then(users => {
          this.users = users
        })
      })
      .catch(()=>{
        showErrorMsg(`cannot delete user`)
      })
    }
  },
  components: {
    
  },

}
