export default {
  productsList (state, productsList) {
    state.products = productsList
  },
  impedimentsList (state, impedimentsList) {
    state.impediments = impedimentsList
  },
  usersList (state, usersList) {
    state.users = usersList
  },
  sprintsList (state, sprintsList) {
    state.sprints = sprintsList
  },
  tasksList (state, tasksList) {
    state.tasks = tasksList
  },

  login (state, auth) {
    state.auth = auth
  },
  logout (state) {
    state.auth.idUser = null
    state.auth.username = null
    state.auth.token = null
  },

  movedTask (state, task) {
    state.movedTask = task
  },
  clearMovedTask (state) {
    state.movedTask = null
  }
}
