
const fs = require('fs')

const Cryptr = require('cryptr')
const cryptr = new Cryptr('topSecret')

const users = require('../data/user.json')
const bugService = require('./bug.service')

module.exports = {
    checkLogin,
    signup,
    getLoginToken,
    validateToken,
    query,
    remove,
    getById
}

function signup({ fullname, username, password }) {
    var user = {
        _id: _makeId(),
        fullname,
        username,
        password,
        isAdmin: false
    }
    users.push(user)

    return _saveUsersToFile().then(() => {
        user = { ...user }
        delete user.password
        return user
    })
}

function checkLogin({ username, password }) {
    var user = users.find(user => user.username === username && user.password === password)
    if (user) {
        user = { ...user }
        delete user.password
    }
    return Promise.resolve(user)
}

function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

function query() {
    return Promise.resolve(users)
}

function getById(userId) {
    const user = users.find(user => user._id === userId)
    return user ? Promise.resolve(user) : Promise.reject()
}

function remove(userId, loggedinUser) {
    const idx = users.findIndex(user => user._id === userId)
    if (idx === -1) return Promise.reject('No such user')
    return bugService.query({ userId })
        .then(bugs => {
            if (bugs.length) return Promise.reject('user cannot be deleted')
            if (users[idx]._id === loggedinUser._id) {
                return Promise.reject('user cannot be deleted')
            }
            users.splice(idx, 1)
            return _saveUsersToFile()
        })
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const content = JSON.stringify(users, null, 2)
        fs.writeFile('./data/user.json', content, err => {
            if (err) {
                console.error(err)
                return reject(err)
            }
            resolve()
        })
    })
}

function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}