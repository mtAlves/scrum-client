<template>
  <v-app dark id="inspire" >
    <v-navigation-drawer persistent clipped enable-resize-watcher v-model="drawer" app>
      <v-list dense>
        <v-list-tile v-for="item in item_components_drawer()" :key="item.title" @click="selectedItem(item)">
          <v-list-tile-action>
            <v-icon :color="item.color">{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="blue-grey darken-3" dense fixed clipped-left app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-spacer></v-spacer>
        <v-speed-dial v-model="fab" direction="bottom" v-if="this.$store.state.current_component_name == 'tarefas'">
          <v-btn slot="activator" hover v-model="fab" @click="getProjectsAndUsers">
            Filtrar tarefas <v-icon>find_in_page</v-icon>
          </v-btn>

          <v-list class="grey darken-3 filter-buttons">
            <v-menu open-on-hover left offset-x>
              <v-list-tile slot="activator" class="text-xs-left">
                <v-list-tile-action>
                  <v-icon>keyboard_arrow_left</v-icon>
                </v-list-tile-action>
                <v-list-tile-title class="text-xs-center">Usuarios</v-list-tile-title>
              </v-list-tile>
            <v-list class="grey darken-4">
              <v-list-tile v-for="user in users" :key="user.id" @click="filterTasksByUser(user.id)">
                <v-list-tile-title class="text-xs-left">{{ user.name }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
            </v-menu>
            <v-list-tile v-for="project in projects" :key="project.id" @click="filterTasksByProject(project.id)">
              <v-list-tile-title class="text-xs-left projects-name">{{ project.name }}</v-list-tile-title>
            </v-list-tile>
          </v-list>

        </v-speed-dial>
      <v-spacer></v-spacer>
      <div v-if="this.$store.state.user" class="blue--text"> {{this.$store.state.user.user_name}} </div>
      <v-menu :nudge-width="100">
          <v-toolbar-title slot="activator">
            <v-btn icon>
                <v-icon>account_circle</v-icon>
            </v-btn>
          </v-toolbar-title>
          <v-list>
            <v-list-tile v-for="user_action in activeItems"  :key="user_action.title" @click="selectedAction(user_action)">
              <v-list-tile-title>{{ user_action.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
    </v-toolbar>
    <main>
      <v-content>
      <v-container class="containerFullWidth" fill-height>
        <v-layout justify-center>

          <component :is="this.$store.state.current_component_name"></component>

        </v-layout>
      </v-container>
    </v-content>
    </main>
    <v-footer app fixed>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios'
import Home from './home'
import Tasks from './tasks'
import Task from './task'
import TasksByUsers from './TasksByUsers'
import Project from './project'
import ContinuousActivity from './continuousActivity'
import TypeContinuousActivity from './typecontinuousActivity'
import Sprint from './sprint'
import Login from './login'
import Register from './register'
import Logout from './logout'
import MyAccount from './myAccount'
export default {
  name: 'Main',
  components: {
    'home': Home,
    'tarefas': Tasks,
    'tarefa': Task,
    'projeto': Project,
    'atividade_continua_extra': ContinuousActivity,
    'tipo_atividade_continua_extra': TypeContinuousActivity,
    'sprint': Sprint,
    'login': Login,
    'register': Register,
    'logout': Logout,
    'tarefas_por_usuarios': TasksByUsers,
    'my_account': MyAccount
  },
  data () {
    return {
      fab: false,
      drawer: true,
      has_token: false,
      user_actions: [],
      item_components: [],
      projects: [],
      users: []
    }
  },
  methods: {
    getProjectsAndUsers () {
      axios.get('project-list/').then(res => this.projects = res.data);
      axios.get('user-list/').then(res => this.users = res.data)
    },
    filterTasksByUser (userId) {
      this.$store.state.tasks_filter = `user/${userId}`
    },
    filterTasksByProject (projectId) {
      this.$store.state.tasks_filter = `project/${projectId}`
    },
    selectedAction (userAction) {
      return this.execute_action(userAction.action)
    },
    selectedItem (anUserAction) {
      if (this.$store.state.token === null) {
        this.$store.commit('set_current_component_name', 'login')
      } else {
        this.$store.commit('set_current_component_name', anUserAction.component_name)
      }
    },
    item_components_drawer () {
      return this.item_components.filter(anItem => ['home', 'projeto', 'tarefas', 'sprint', 'atividade_continua_extra', 'tipo_atividade_continua_extra', 'tarefas_por_usuarios'].includes(anItem.component_name))
    },
    user_actions_menu () {
      const actions = this.user_actions.filter(action => action.enabled === true)
      return actions
    },
    logout () {
      this.$store.commit('set_token', null)
      this.$store.commit('set_user', null)
      this.$store.commit('set_current_component_name', 'login')
    },
    register () {
      this.$store.commit('set_current_component_name', 'register')
    },
    login (value) {
      this.$store.commit('set_current_component_name', 'login')
    },
    myAccount () {
      this.$store.commit('set_current_component_name', 'my_account')
    },
    dinamic_method_for_action () {
      return {'login': this.login, 'register': this.register, 'logout': this.logout, 'myAccount': this.myAccount}
    },
    execute_action (anActionName) {
      let dinMethods = this.dinamic_method_for_action()
      for (const [key, value] of Object.entries(dinMethods)) {
        if (key === anActionName) {
          return value()
        }
      }
      return null
    }
  },
  computed: {
    activeItems () {
      const logged = this.$store.state.token
      if (logged) {
        this.user_actions[0].enabled = false
        this.user_actions[1].enabled = false
        this.user_actions[2].enabled = true
        this.user_actions[3].enabled = true
      } else {
        this.user_actions[0].enabled = true
        this.user_actions[1].enabled = true
        this.user_actions[2].enabled = false
        this.user_actions[3].enabled = false
      }
      const actions = this.user_actions.filter(action => action.enabled === true)
      return actions
    }
  },
  created: function () {
    this.item_components = [
      {title: 'Gestão de atividades', icon: 'home', color: 'white', component_name: 'home', enabled: this.$store.getters.has_token},
      {title: 'Projetos', icon: 'format_list_numbered', color: 'blue', component_name: 'projeto', enabled: this.$store.getters.has_token},
      {title: 'Tarefas', icon: 'list', color: 'green', component_name: 'tarefas', enabled: this.$store.getters.has_token},
      {title: 'Sprints', icon: 'motorcycle', color: 'yellow', component_name: 'sprint', enabled: this.$store.getters.has_token},
      {title: 'Tipo atividade contínua/extra etc', color: 'orange', icon: 'assignment', component_name: 'tipo_atividade_continua_extra', enabled: this.$store.getters.has_token},
      {title: 'Minhas atividades contínuas/extras etc', color: 'white', icon: 'assignment', component_name: 'atividade_continua_extra', enabled: this.$store.getters.has_token},
      {title: 'Tarefas por usuarios', icon: 'account_box', color: 'teal lighten-4', component_name: 'tarefas_por_usuarios', enabled: this.$store.getters.has_token}
    ]
    this.user_actions = [
      {title: 'Login', icon: 'account_box', color: 'white', action: 'login', enabled: true},
      {title: 'Registrar', icon: 'face', color: 'gray', action: 'register', enabled: true},
      {title: 'Logout', icon: 'not_interested', color: 'gray', action: 'logout', enabled: false},
      {title: 'Minha Conta', icon: 'not_interested', color: 'gray', action: 'myAccount', enabled: false}
    ]
  }
}
</script>
<style>
  .containerFullWidth {
    max-width: 100% !important
  }
  .projects-name {
    text-overflow: initial !important;
  }
  .filter-buttons {
    text-align: left !important;
  }
</style>
