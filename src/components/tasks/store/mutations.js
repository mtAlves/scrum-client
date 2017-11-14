export default {

  setElement (state, element) {
    state.element = element
  },

  setElementStatus (state, statusId) {
  	state.element.status = statusId
  },

  resetElement (state) {
  	state.element = {}
  }
}