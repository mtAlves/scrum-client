import axios from 'axios'

export default {

  GETPRODUCTS ({ commit }) {
    axios.get('products/')
      .then(res => commit('productsList', res.data))
  },

  GETIMPEDIMENTS ({ commit }) {
    axios.get('impediments/')
      .then(res => commit('impedimentsList', res.data))
  },

  GETUSERS ({ commit }) {
    axios.get('users/')
      .then(res => commit('usersList', res.data))
  },

  GETSPRINTS ({ commit }) {
    axios.get('sprints/')
      .then(res => commit('sprintsList', res.data))
  },

  GETTASKS ({ commit }) {
    axios.get('tasks/')
      .then(res => commit('tasksList', res.data))
  }

}
