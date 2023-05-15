export const userService = {
  login,
  logout,
  signup,
  getLoggedInUser,
  query,
  remove,
  getById
}
const API = '/api/users/'
const STORAGE_KEY = "loggedinUser";

function login(credentials) {
  return axios.post('/api/login', credentials)
    .then(res => res.data)
    .then(user => {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      return user
    })

}

function signup(signupInfo) {
  return axios.post('/api/signup', signupInfo)
    .then(res => res.data)
    .then(user => {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      return user
    })

}

function logout() {
  return axios.post('/api/logout')
    .then(() => sessionStorage.removeItem(STORAGE_KEY))
    .catch(err => console.log(err))
}

function getLoggedInUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY))
}

function query() {
  return axios.get(API)
    .then(res => res.data)
}

function remove(userId) {
  console.log(API + userId);
  return axios.delete(API + userId)
    .then(res => res.data)
}

function getById(userId) {
  return axios.get(API + userId)
  .then (res => res.data)
}