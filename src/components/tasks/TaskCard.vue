<template>
<v-flex xs6 sm4 md3>
    <v-card :class="tabColor">

      <v-card-text class="text-xs-center black--text" >{{name}}
        <v-btn icon v-if='add' @click.native="addTask">
          <v-icon color="black">add</v-icon>
        </v-btn>
       <!-- <v-btn @click.native="teste">teste</v-btn> -->
      </v-card-text>

        <v-layout row wrap style="display:block;">

        <draggable v-model="tasks" :options="{group:'task'}" @add="changeStatus" :move="getElement">
        <transition-group tag="div" class="dragArea">  
        <div v-for="task in tasks" :key="name">
          <v-flex xs12 class="mb-1" >
            <v-card :color="cardColor" class="black--text" >
              <v-card-title>
                <h6>{{task.name}}</h6>
              </v-card-title>

              <v-flex xs12 offset-xs2>
              {{reverseDate(task.started)}}
                <v-tooltip top>
                  <v-btn icon slot="activator">
                    <v-icon color="grey darken-2">event</v-icon>
                  </v-btn>
                  <span>Data de Inicio</span>
                </v-tooltip>
                {{reverseDate(task.due)}}
                <v-tooltip top>
                  <v-btn icon slot="activator">
                    <v-icon v-if="task.due" color="grey darken-2">event_available</v-icon>
                    <v-icon v-else color="grey darken-2">event_busy</v-icon>
                  </v-btn>
                  <span>Data Final</span>
                </v-tooltip>
              </v-flex>

              <v-flex xs12 offset-xs2>
                <v-tooltip top>
                  <v-btn icon slot="activator">
                    <v-icon color="grey darken-2">person</v-icon>
                  </v-btn>
                  <span>Responsavel pela tarefa</span>
                </v-tooltip>
                <span v-if="task.responsible">{{userById(task.responsible)}}</span>
                <span v-else>Responsavel não informado</span>
              </v-flex>

              <v-flex xs12 offset-xs3>
              <v-tooltip top>
                  <v-btn icon slot="activator">
                    <v-icon color="grey darken-2">description</v-icon>
                  </v-btn>
                  <span v-if="task.description">{{task.description}}</span>
                  <span v-else>Sem descrição</span>
                </v-tooltip>

                <v-tooltip top>
                  <v-btn icon slot="activator">
                    <v-icon color="grey darken-2">assignment</v-icon>
                  </v-btn>
                  <span v-if="task.project">{{projectById(task.project)}}</span>
                  <span v-else>Nenhum projeto relacionado</span>
                </v-tooltip>

                <v-tooltip top>
                  <v-btn icon slot="activator">
                    <v-icon color="grey darken-2">motorcycle</v-icon>
                  </v-btn>
                  <span v-if="task.sprint">{{sprintById(task.sprint)}}</span>
                  <span v-else>Nenhum sprint relacionado</span>
                </v-tooltip>
              </v-flex>

              <v-card-actions>
                <v-btn icon @click.native="editTask(task.id)">
                  <v-icon color="grey darken-4">edit</v-icon>
                </v-btn>
                <v-btn icon @click.native="removeTask(task)">
                  <v-icon color="grey darken-4">delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </div>
        </transition-group>
        </draggable>
        </v-layout>
    </v-card>
</v-flex>
</template>

<script>
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';
import store from './store';
import draggable from 'vuedraggable';

export default {

  props:[
    'add',
  	'tabColor',
  	'name',
    'cardColor',
    'tasks'
  ],

  components:{ draggable },

  data: () => ({
    tasksUrl: 'task-list/',
    users: [],
    temp: {}
  }),

  methods: {
   //teste(){console.log(this.$store.state.tasks)},
    ...mapActions({
      getTasksList : 'GETTASKS'
    }),

    getElement(evt){
      this.$store.commit('setElement', evt.draggedContext.element)
    },

    changeStatus (evt){
      let url = `${this.tasksUrl}${this.$store.state.tasks.element.id}/`;
      this.name == 'A FAZER' ? this.$store.commit('setElementStatus', 1):
        this.name == 'FAZENDO' ? this.$store.commit('setElementStatus', 2):
          this.name == 'PENDENTE' ? this.$store.commit('setElementStatus', 3):
            this.name == 'FEITO' ? this.$store.commit('setElementStatus', 4) : console.log('STATUS INVALIDO');
      axios.put(url, this.$store.state.tasks.element).then(res => this.$store.commit('resetElement'))
    },

    userById (url) {
      let name = '';
      let id = url.split('/').reverse()[1];
      this.usersList.map( user => user.id == id ? name = user.name : null);
      return name;
    },

    projectById (url) {
      let name = '';
      let id = url.split('/').reverse()[1];
      this.projectsList.map( project => project.id == id ? name = project.name : null);
      return name;
    },

    sprintById (url) {
      let name = '';
      let id = url.split('/').reverse()[1];
      this.sprintsList.map( sprint => sprint.id == id ? name = sprint.code : null);
      return name;
    },

    reverseDate (date) {
      return date.split('-').reverse().join('/');
    },

    addTask(){
      this.$router.push('/add_task');
    },

    editTask(id){
      this.$router.push({name: 'EditTask', params: { id: id }})
    },

    removeTask(task){
      axios.delete(`${this.tasksUrl}${task.id}/`).then( res =>{
        this.getTasksList();
        this.$router.push({name:'Remove', params: {name: task.name}})
        })
        .catch(error => {
          console.log(error);
        });
    }
  },

  computed:{
    ...mapGetters({
      sprintsList:'getSprintsList',
      projectsList:'getProjectsList',
      usersList: 'getUsersList'
    })
  },

  created() {

  }

}
</script>

<style scoped>
.dragArea {
  min-height: 25px;
}
</style>