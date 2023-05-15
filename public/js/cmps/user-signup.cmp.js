import { showSuccessMsg } from "../services/eventBus-service.js"
import { userService } from "../services/user-service.js"
export default {
    emits:['updateUser'],
    template: `
            <section >
                <h2>Signup</h2>
                <pre>{{user}}</pre>
                    <form  @submit.prevent="signup">
                        <input type="text" v-model="signupInfo.fullname" placeholder="Full name" />
                        <input type="text" v-model="signupInfo.username" placeholder="Username" />
                        <input type="password" v-model="signupInfo.password" placeholder="Password" />
                        <button>Signup</button>
                     </form>
            </section>  
      `,
    data() {
        return {
            user: null,
            signupInfo: {
                fullname: '',
                username: '',
                password: ''
            }
        }
    },

    created() {
        this.user = userService.getLoggedInUser()
    },

    methods: {
        signup() {
            userService.signup(this.signupInfo)
                .then(user => {
                    showSuccessMsg(`Welcome ${user.fullname}`)
                    this.$emit('updateUser', user)
                    this.$router.push({ path: '/bug'})
                })
                .catch(err => {
                    console.log('Cannot signup', err)
                })
        },
    }
}