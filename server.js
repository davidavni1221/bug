const express = require('express')
const cookieParser = require('cookie-parser')

const bugService = require('./services/bug.service')
const userService = require("./services/user.service");
const { log } = require('console')
const port = 3030
const app = express()


// Express App Configuration:
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))


// API/BUG
// LIST
app.get('/api/bug', (req, res) => {
  const { txt, pageIdx, userId } = req.query

  const filterBy = {
    txt,
    pageIdx,
    userId
  }

  bugService.query(filterBy)
    .then(bugs => res.send(bugs))
    .catch((err) => res.status(500).send('Cannot get bugs'))
})

// CREATE
app.post('/api/bug', (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Cannot add bug')

  const bug = {
    title: req.body.title,
    severity: +req.body.severity,
    description: req.body.description || 'hello I\'m new here',
    createdAt: Date.now(),
    owner: loggedinUser
  }
  bugService.save(bug)
    .then(savedBug => {
      res.send(savedBug)
      console.log('saved', savedBug);
    })
    .catch(err => res.status(500).send('Cannot create bug'))
})

// UPDATE
app.put('/api/bug/:bugId', (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Cannot update bug')
  const bug = {
    _id: req.body._id,
    title: req.body.title,
    severity: +req.body.severity,
    description: req.body.description,
    createdAt: +req.body.severity,
    owner: loggedinUser
  }
  bugService.save(bug, loggedinUser)
    .then(savedBug => {
      res.send(savedBug)
    })
    .catch(err => res.status(500).send('Cannot update bug'))
})

// READ
app.get('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params
  let visitedBugs = JSON.parse(req.cookies.visitedBugs || '[]')
  if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)
  console.log('User visited the following bugs: ', visitedBugs)
  res.cookie('visitedBugs', JSON.stringify(visitedBugs), { maxAge: 1000 * 7 })
  if (visitedBugs.length > 3) {
    return res.status(401).send('limit reached')
  }
  bugService.getById(bugId)
    .then(bug => res.send(bug))
    .catch(err => res.status(500).send('Cannot read bug'))
})

// DELETE
app.delete('/api/bug/:bugId', (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Cannot delete car')
  const { bugId } = req.params
  bugService.remove(bugId, loggedinUser)
    .then(bug => res.send('remove'))
    .catch(err => res.status(500).send('Cannot delete bug'))

})


//API/LOGIN
// SIGNUP
app.post('/api/signup', (req, res) => {
  const signupInfo = {
    fullname: req.body.fullname,
    username: req.body.username,
    password: req.body.password
  }

  userService.signup(signupInfo)
    .then(user => {
      const loginToken = userService.getLoginToken(user)
      res.cookie('loginToken', loginToken)
      res.send(user)
    })
})

//LOGIN
app.post('/api/login', (req, res) => {
  const credentials = {
    username: req.body.username,
    password: req.body.password
  }

  userService.checkLogin(credentials)
    .then(user => {
      if (user) {
        const loginToken = userService.getLoginToken(user)
        res.cookie('loginToken', loginToken)
        res.send(user)
      } else {
        res.status(401).send('Invalid credentials')
      }
    })
})

//LOGOUT
app.post('/api/logout', (req, res) => {
  res.clearCookie('loginToken')
  // res.send('Logged out')
  res.end()
})

// API/USERS

//LIST
app.get('/api/users', (req, res) => {
  userService.query()
    .then(users => res.send(users))
    .catch((err) => res.status(500).send('Cannot get bugs'))
})

// DELETE
app.delete('/api/users/:userId', (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser.isAdmin) return res.status(401).send('Not Autorized')
  const { userId } = req.params
  userService.remove(userId, loggedinUser)
    .then(user => res.send('remove'))
    .catch(err => res.status(500).send('Cannot delete user'))
})

//READ
app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params
  userService.getById(userId)
    .then(user => res.send(user))
    .catch(err => res.status(500).send('Cannot read user'))
})


app.listen(port, () => console.log('Server ready at port: http://localhost:' + port))
