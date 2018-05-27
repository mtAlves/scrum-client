export default {

  getProducts (state) {
    return state.products
  },
  getImpediments (state) {
    return state.impediments
  },
  getUsers (state) {
    return state.users
  },
  getSprints (state) {
    return state.sprints
  },
  getTasks (state) {
    return state.tasks
  },
  getMovedTask (state) {
    return state.movedTask
  },
  loggedUser (state) {
    return state.auth.username
  }
}
