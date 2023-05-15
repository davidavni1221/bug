'use strict'

import { bugService } from '../services/bug-service.js'
import { eventBus } from '../services/eventBus-service.js'

export default {
  props: ['user'],
  template: `
    <section v-if="bug && user" class="bug-details">
        <h1>{{bug.title}}</h1>
        <p>Description: {{bug.description}}</p>
        <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
        <router-link to="/bug">Back</router-link>
    </section>
    `,
  data() {
    return {
      bug: null,
    }
  },
  created() {
    const { bugId } = this.$route.params
    if (bugId) {
      bugService.getById(bugId)
      .then((bug) => {this.bug = bug})
      .catch((err)=>{
        if (err.response.status === 401) {
          eventBus.emit('show-msg', { txt: 'You have reached your limit for now! try again later', type: 'error' })
          this.$router.push('/bug')
        };
      })
    }
  },
}
