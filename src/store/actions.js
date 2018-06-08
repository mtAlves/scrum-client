import axios from 'axios'

export default {

  async GETPRODUCTS ({ commit }) {
    try {
      const products = await axios.get('products/')
      commit('productsList', products.data)
    } catch (error) {
      console.log(error)
    }
  },

  async GETIMPEDIMENTS ({ commit }) {
    try {
      const impediments = await axios.get('impediments/')
      commit('impedimentsList', impediments.data)
    } catch (error) {
      console.log(error)
    }
  },

  async GETUSERS ({ commit }) {
    try {
      const users = await axios.get('users/')
      commit('usersList', users.data)
    } catch (error) {
      console.log(error)
    }
  },

  async GETSPRINTS ({ commit }) {
    try {
      const sprints = await axios.get('sprints/')
      commit('sprintsList', sprints.data)
    } catch (error) {
      console.log(error)
    }
  },

  async GETTASKS ({ commit }) {
    try {
      const tasks = await axios.get('tasks/')
      commit('tasksList', tasks.data)
    } catch (error) {
      console.log(error)
    }
  }

}
