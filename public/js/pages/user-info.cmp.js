'use strict'
import { bugService } from '../services/bug-service.js'
import bugList from '../cmps/bug-list.cmp.js'
import { userService } from '../services/user-service.js'

export default {
  // props: ['user'],
  template: `
    <section v-if="user" class="bug-app" >
        <div><router-link to="/bug">back</router-link></div>
        <h2>{{user.fullname}}'s bug list</h2>
        <bug-list v-if="userBugs" :bugs="userBugs" @removeBug="removeBug"></bug-list>
    </section>
    `,
  data() {
    return {
      userBugs: null,
      filterBy: {
        txt: null,
        pageIdx: 0,
        userId: null
      },
      user: null
    }
  },
  created() {
    const { userId } = this.$route.params
    userService.getById(userId)
      .then(user => {
        this.user = user
        this.loadBugs()
      })
  },
  methods: {
    loadBugs() {
      this.filterBy.userId = this.user._id
      bugService.query(this.filterBy).then((bugsToDisplay) => {
        this.userBugs = bugsToDisplay
      })
    },
    removeBug(bugId) {
      bugService.remove(bugId).then(() => this.loadBugs())
    },
  },
  computed: {
  },
  components: {
    bugList,
  },
}
