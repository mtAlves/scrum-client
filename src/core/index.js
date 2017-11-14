import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate'

import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

import auth from '../auth/store';

import tasks from 'TASKS/store';

Vue.use(Vuex);

export default new Vuex.Store({
	plugins: [createPersistedState({ key:'kanban_auth', paths: ['auth'], storage: window.localStorage })],
    state,
    mutations,
    actions,
    getters,
    modules: {
    	auth,
    	tasks
    }
});