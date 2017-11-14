import axios from 'axios'

export default {

    GETPROJECTS ({ commit }) {
		axios.get(`project-list/`)
		.then(res => { commit ('projects_list', res.data) })
    },

    GETCONTINUOUS ({ commit }) {
		axios.get(`continuous-activity-list/`)
		.then(res => { commit ('continuous_list', res.data) })
    },

    GETIMPEDIMENTS ({ commit }) {
		axios.get(`impediment-list/`)
		.then(res => { commit ('impediments_list', res.data) })
    },
    
    GETUSERS ({ commit }) {
		axios.get(`user-list/`)
		.then(res => { commit ('users_list', res.data) })
    },
    
    GETSPRINTS ({ commit }) {
		axios.get(`sprint-list/`)
		.then(res => { commit ('sprints_list', res.data) })
    },
    
    GETTASKS ({ commit }) {
		axios.get(`task-list/`)
		.then(res => { commit ('tasks_list', res.data) })
    },
    

}

	