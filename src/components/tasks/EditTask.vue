<template>
  <v-layout>
    <v-flex xs12 sm8 offset-sm2>
      <v-card class="blue-grey darken-3 elevation-4">
        <v-card-title class="orange black--text">
          {{task.name.toUpperCase()}}
          <v-spacer></v-spacer>
          <v-btn floating small class="red lighten-2" @click.native="cancel">
            <v-icon light>cancel</v-icon>
          </v-btn>
          <v-btn floating small class="blue" @click.native="save">
            <v-icon light>save</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-layout row wrap>

              <v-flex xs10 offset-xs1>
                <v-text-field class="input-group--focused" dark label="Nome da tarefa" v-model="task.name"></v-text-field>
              </v-flex>

              <v-flex xs12 sm5 offset-sm1 class="mr-1">
                <v-text-field v-if="task.project" class="input-group--focused" disabled dark label="Projeto Atual" :value="nameById(task.project, this.projectsList)"></v-text-field>
                <v-text-field v-else class="input-group--focused" disabled dark label="Projeto Atual" value="Não informado"></v-text-field>
              </v-flex>

              <v-flex xs12 sm5>
                <v-select class="input-group--focused" label="Novo Projeto" autocomplete v-model="task.project" :items="projectsList" item-text="name"></v-select>
              </v-flex>

              <v-flex xs12 sm5 offset-sm1 class="mr-1">
                <v-text-field v-if="task.sprint" class="input-group--focused" disabled dark label="Sprint Atual" :value="nameById(task.sprint, this.sprintsList)"></v-text-field>
                <v-text-field v-else class="input-group--focused" disabled dark label="Sprint Atual" value="Não informado"></v-text-field>
              </v-flex>

              <v-flex xs12 sm5>
                <v-select class="input-group--focused" label="Novo Sprint" autocomplete v-model="task.sprint" :items="sprintsList" item-text="code"></v-select>
              </v-flex>

              <v-flex xs12 sm5 offset-sm1 class="mr-1">
              <v-text-field v-if="task.responsible" class="input-group--focused" disabled dark label="Responsável Atual" :value="nameById(task.responsible, this.usersList)"></v-text-field>
              <v-text-field v-else class="input-group--focused" disabled dark label="Responsável Atual" value="Não informado"></v-text-field>
              </v-flex>

              <v-flex xs12 sm5>
                <v-select class="input-group--focused" label="Novo Responsável" autocomplete v-model="task.responsible" :items="usersList" item-text="name"></v-select>
              </v-flex>

              <v-flex xs12 sm5 offset-sm1 class="mr-1">
                <v-text-field v-if="task.status == 1" class="input-group--focused" disabled dark label="Status Atual" value="A Fazer"></v-text-field>
                <v-text-field v-if="task.status == 2" class="input-group--focused" disabled dark label="Status Atual" value="Fazendo"></v-text-field>
                <v-text-field v-if="task.status == 3" class="input-group--focused" disabled dark label="Status Atual" value="Pendente"></v-text-field>
                <v-text-field v-if="task.status == 4" class="input-group--focused" disabled dark label="Status Atual" value="Feito"></v-text-field>
              </v-flex>

              <v-flex xs12 sm5>
                <v-select class="input-group--focused" label="Novo Status" autocomplete v-model="task.status" :items="status" item-text="status" item-value="id"></v-select>
              </v-flex>

              <v-flex xs12 sm5 offset-sm1>
                <v-menu lazy  :close-on-content-click="true"  v-model="menu_start"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
                  <v-text-field slot="activator" label="Data inicio" v-model="task.started" prepend-icon="event" readonly ></v-text-field>
                  <v-date-picker locale="pt-BR" v-model="task.started" no-title scrollable actions></v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex xs12 sm5>
                <v-menu lazy  :close-on-content-click="true"  v-model="menu_end"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
                  <v-text-field slot="activator" label="Data final" v-model="task.due" prepend-icon="event" readonly ></v-text-field>
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
      let url = `${this.tasksUrl}${this.task.id}/`;
      console.log(this.task);
      axios.put(url, this.task).then(res =>{
        this.getTasks();
        this.$router.push('/tasks')
      });

    },

    getTask(){
      let task = this.tasksList.find( task => task.id == this.$route.params.id);
      this.task = task;
      console.log(task);
    },

    nameById (url, list, getter = 'name') {
      let name = '';
      let id = url.split('/').reverse()[1];
      list.map( user => user.id == id ? name = user[getter] : null);
      return name;
    },

  },

  computed:{
    ...mapGetters({
      tasksList: 'getTasksList',
      sprintsList:'getSprintsList',
      projectsList:'getProjectsList',
      usersList: 'getUsersList'
    })
  },

  created(){
    this.getTask()
  }
}

</script>

<style scoped>
.input-group--focused{
  color:orange !important;
}


</style>