<template>
  <v-layout>
    <v-flex xs12 sm8 offset-sm2>
      <v-card class="blue-grey darken-3 elevation-4">
        <v-card-title class=" headline orange black--text">
          Nova tarefa
          <v-spacer></v-spacer>
          <v-btn floating small class="red lighten-2" @click.native="cancel()">
            <v-icon light>cancel</v-icon>
          </v-btn>
          <v-btn floating small class="blue" @click.native="save()">
            <v-icon light>save</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-layout row wrap>

              <v-flex xs12>
                <v-text-field class="input-group--focused" label="Nome" v-model="task.name" required></v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-select class="input-group--focused" label="Responsável" autocomplete v-model="task.responsible" :items="usersList" item-text="name" @blur="responsibleId"></v-select>
              </v-flex>

              <v-flex xs12>
                <v-select class="input-group--focused" label="Projeto" autocomplete v-model="task.project" :items="projectsList" item-text="name" @blur="projectId"></v-select>
              </v-flex>

              <v-flex xs12>
                <v-select class="input-group--focused" label="Sprint" autocomplete v-model="task.sprint" :items="sprintsList" item-text="code" @blur="sprintId"></v-select>
              </v-flex>

              <v-flex xs12>
                <v-select class="input-group--focused" label="Status" autocomplete v-model="task.status" :items="status" item-value="id" item-text="status" @blur="sprintId"></v-select>
              </v-flex>

              <v-flex xs12 sm5 offset-sm1>
                <v-menu lazy  :close-on-content-click="true"  v-model="menu_start"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
                  <v-text-field slot="activator" label="Data inicio" v-model="task.started" prepend-icon="event" readonly required ></v-text-field>
                  <v-date-picker locale="pt-BR" v-model="task.started" no-title scrollable actions></v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex xs12 sm5>
                <v-menu lazy  :close-on-content-click="true"  v-model="menu_end"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
                  <v-text-field slot="activator" label="Data final" v-model="task.due" prepend-icon="event" readonly></v-text-field>
                  <v-date-picker locale="pt-BR" v-model="task.due" no-title scrollable actions></v-date-picker>
                </v-menu>
              </v-flex>
              
              <v-flex xs12>
                <v-text-field box class="input-group--focused" multi-line label="Descrição" v-model="task.description"></v-text-field>
              </v-flex>

            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios';
import store from '@/core';
import { mapActions, mapGetters } from 'vuex';
import { nameById } from '@/config'

export default {
  data () {
    return {
      tasksUrl: 'task-list/',
      sprintsUrl: 'sprint-list/',
      projectsUrl: 'project-list/',
      usersUrl: 'user-list/',
      task: {
        completed: null,
        description: "",
        due: null,
        id: null,
        impediments: [],
        name: "",
        order: null,
        project: null,
        responsible: "",
        sprint: null,
        started: null,
        status: ""
      },
      status:[
        {id:1, status:'A Fazer'},
        {id:2, status:'Fazendo'},
        {id:4, status:'Feito'},
        {id:3, status:'Pendente'}
      ],
      temp: {
        responsible:'',
        project:'',
        sprint:'',
        status:''
      },
      menu_start: false,
      menu_end: false
    }
  },

  methods:{

    ...mapActions({
      getTasks: 'GETTASKS'

    }),

    responsibleId () {
      this.temp.responsible = `${axios.defaults.baseURL}${this.usersUrl}${this.task.responsible.id}/`;
    },

    projectId () {
      this.temp.project = `${axios.defaults.baseURL}${this.projectsUrl}${this.task.project.id}/`;
    },

    sprintId () {
      this.temp.sprint = `${axios.defaults.baseURL}${this.sprintsUrl}${this.task.sprint.id}/`;
    },

    cancel(){
      this.$router.push('/tasks')
    },

    save (){
      if(typeof(this.task.responsible) === 'object') {

        this.responsibleId();
        this.task.responsible = this.temp.responsible;
      
      };

      if(typeof(this.task.project) === 'object') {

        this.projectId();
        this.task.project = this.temp.project;
      
      };

      if(typeof(this.task.sprint) === 'object') {

        this.sprintId();
        this.task.sprint = this.temp.sprint;
      
      };
      let url = `${this.tasksUrl}`;
      axios.post(url, this.task).then(res =>{
        this.getTasks();
        this.$router.push('/tasks')
      });

    },

   // nameById (url, list, getter = 'name') {
   //  let name = '';
    //  let id = url.split('/').reverse()[1];
    //  list.map( user => user.id == id ? name = user[getter] : null);
   //   return name;
   // },

  },

  computed:{
    ...mapGetters({
      tasksList: 'getTasksList',
      sprintsList:'getSprintsList',
      projectsList:'getProjectsList',
      usersList: 'getUsersList'
    })
  },

}

</script>

<style scoped>
.input-group--focused{
  color:orange !important;
}


</style>