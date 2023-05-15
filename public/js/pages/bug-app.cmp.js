'use strict'
import { bugService } from '../services/bug-service.js'
import { showSuccessMsg } from "../services/eventBus-service.js"
import { showErrorMsg } from "../services/eventBus-service.js"
import bugList from '../cmps/bug-list.cmp.js'
import bugFilter from '../cmps/bug-filter.cmp.js'

export default {
  props: ['user'],
  template: `
    <section v-if="user" class="bug-app">
        <div class="subheader">
          <bug-filter @setFilterBy="setFilterBy"></bug-filter> ||
          <router-link to="/bug/edit">Add New Bug</router-link> 
        </div>
        <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
        <div class="actions">
            <button :disabled="filterBy.pageIdx <= 0" @click="onSetPage(-1)">Prev</button>
            <button :disabled="filterBy.pageIdx === lastPageIdx" @click="onSetPage(1)">Next</button>
        </div>
    </section>
    <div v-else>
        <img class="bug-image" src="img/bug.jpg"  />
      </div>
    `,
  data() {
    return {
      

      bugs: null,
      lastPageIdx: null,
      filterBy: {
        txt: null,
        pageIdx: 0,
      },
    }
  },
  created() {
    this.loadBugs()
  },
  methods: {
    loadBugs() {
      bugService.query(this.filterBy).then((bugsToDisplay) => {
        const {bugs, length} = bugsToDisplay
        this.lastPageIdx = length
        this.bugs = bugs
      })
    },
    setFilterBy(filterBy) {
      const {txt} = filterBy
      this.filterBy.txt = txt
      this.loadBugs()
    },
    removeBug(bugId) {
      bugService.remove(bugId)
      .then(() => {
        showSuccessMsg('bug removed')
        this.loadBugs()
      })
      .catch(()=>{
        showErrorMsg('cannot remove bug')
      })
    },
    onSetPage(dir) {
      // if (this.filterBy.pageIdx === 0 && dir < 0) return;
      // //DONE get all cars length from Backend
      // if (this.filterBy.pageIdx === this.lastPageIdx && dir > 0 ) return
      console.log(this.lastPageIdx, this.filterBy.pageIdx);
      this.filterBy.pageIdx += dir;
      this.loadBugs()
    },
  },
  computed: {
    // bugsToDisplay() {
    //   if (!this.filterBy?.title) return this.bugs
    //   return this.bugs.filter((bug) => bug.title.includes(this.filterBy.title))
    // },
  },
  components: {
    bugList,
    bugFilter,
    
  },
}
