import _ from 'lodash';

export default {

	projects_list (state, projectsList) {
	    state.projectsList = projectsList.sort(
	    	(a,b)=> a.id - b.id)
	},

	continuous_list (state, continuousList) {
	    state.continuousList = continuousList.sort(
	    	(a,b)=> a.id - b.id)
	},

	impediments_list (state, impedimentsList) {
		state.impedimentsList = impedimentsList.sort(
	    	(a,b)=> a.id - b.id)
	},

	users_list (state, usersList) {
	    state.usersList = usersList.sort(
	    	(a,b)=> a.id - b.id)
	},

	sprints_list (state, sprintsList) {
		state.sprintsList = sprintsList.sort(
	    	(a,b)=> a.id - b.id)
	},

	tasks_list (state, tasksList) {
		state.tasksList = tasksList.sort(
	    	(a,b)=> a.id - b.id)
	}
  
}
