const fs = require('fs')
const bugs = require('../data/bugs.json')
const PAGE_SIZE = 3

module.exports = {
    query,
    getById,
    save,
    remove
}

function query(filterBy) {
    // Getting User Bugs
    if (filterBy.userId){
        let userBugs = bugs.filter(bug => bug.owner._id === filterBy.userId)
        console.log(userBugs);
        return Promise.resolve(userBugs)
    }
    // Filtering by text
	const regex = new RegExp(filterBy.txt, 'i')
	let filteredBugs = bugs.filter(bug => regex.test(bug.title) || regex.test(bug.description))
    // Pagination
    let totalPages = Math.floor(filteredBugs.length/PAGE_SIZE) 
    const startIdx = filterBy.pageIdx * PAGE_SIZE 
    filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE) 
    
    const bugsToDisplay = {bugs: filteredBugs, length: totalPages}
    return Promise.resolve(bugsToDisplay)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return bug ? Promise.resolve(bug) : Promise.reject()
}

function remove(bugId, loggedinUser) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('No such bug')
    if (bugs[idx].owner._id !== loggedinUser._id) {
        if(!loggedinUser.isAdmin) return Promise.reject('Not your bug')
    }  
    bugs.splice(idx, 1)
    return _saveBugToFile()
}

function save(bug,loggedinUser) {
    if (bug._id) {
        const idx = bugs.findIndex(existingBug => existingBug._id === bug._id)
        if (idx === -1) return Promise.reject('No such bug')
        if (bugs[idx].owner._id !== loggedinUser._id) {
            if(!loggedinUser.isAdmin) return Promise.reject('Not your bug')
            bug.owner = bugs[idx].owner
        } 
        bugs[idx] = bug
    } else {
        bug._id = _makeId()
        bugs.push(bug)        
    }
    return _saveBugToFile().then(() => bug)
}


function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveBugToFile() {
    return new Promise((resolve, reject) => {
        const content = JSON.stringify(bugs, null, 2)
        fs.writeFile('./data/bugs.json', content, err => {
            if (err) {
                console.error(err)
                return reject(err)
            }
            resolve()
        })
    })
}