'use strict'
import { userService } from "../services/user-service.js"
export default {
    props: ['user'],
    template: `
        <header>
            <h1>Miss Bug</h1>  
            <div v-if="user" class="user-info">
                <span>Hello {{user.fullname}}</span> <a @click="logout">Logout</a>
                <span> | </span> 
                <router-link v-if="!user.isAdmin" :to="'/details/'+user._id">Details</router-link> 
                <router-link v-if="user.isAdmin" to="/users">users</router-link> 
            </div>
            <div v-if="!user">
                <router-link to="/signup">SignUp</router-link> 
                <span> | </span>
                <router-link to="/login">login</router-link> 
            </div>
      
        </header>
    `,
    data(){
    return{
    }
},
    methods: {
        logout() {
            userService.logout()
                .then(() => {
                    this.$emit('loggedOut')
                })
                .catch(err => {
                    console.log('Cannot logout', err)
                })
        }
    },
    

}
