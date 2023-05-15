import { showSuccessMsg } from "../services/eventBus-service.js"
import { userService } from "../services/user-service.js"
export default {
    emits:['updateUser'],
    template: `
            <section >
                <pre>{{user}}</pre>
                <form  @submit.prevent="login">
                    <h2>Login</h2>
                    <input type="text" v-model="credentials.username" placeholder="Username" />
                    <input type="password" v-model="credentials.password" placeholder="Password" />
                    <button>Login</button>
                </form>
            </section>  
      `,
    data() {
        return {
            user: null,
            credentials: {
                username: '',
                password: ''
            },
        }
    },

    created() {
        this.user = userService.getLoggedInUser()
    },

    methods: {
        login() {
            userService.login(this.credentials)
                .then(user => {
                    this.user = user
                    showSuccessMsg(`Welcome ${user.fullname}`)
                    this.$emit('updateUser', user)
                    this.$router.push({ path: '/bug'})
                })
                .catch(err => {
                    console.log('Cannot login', err)
                })
        },
    }
}
