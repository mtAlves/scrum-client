export default {

  setUser (state, user) {
    state.user = user
  },
  setToken (state, token) {
    state.token = token
  },
  setUserInfo (state, userInfo) {
    state.userInfo = userInfo
  },

  logout (state) {
    state.user = null;
    state.token = null;
    state.userInfo = null;
  }
  
}