<template>
  <v-layout>
    <v-flex xs12 sm8 offset-sm2>
      <v-card class="blue-grey darken-3 elevation-4">
        <v-card-title class="yellow black--text">
          {{sprint.code.toUpperCase()}}
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
                <v-text-field class="input-group--focused" dark label="Codigo do sprint" v-model="sprint.code"></v-text-field>
              </v-flex>

              <v-flex xs12 sm5 offset-sm1 class="mr-1">
              <v-text-field v-if="sprint.project" class="input-group--focused" disabled dark label="Projeto Atual" :value="getName(sprint.project, this.projectsList)"></v-text-field>
              <v-text-field v-else class="input-group--focused" disabled dark label="Responsável Administrativo Atual" value="Não informado"></v-text-field>
              </v-flex>

              <v-flex xs12 sm5>
                <v-select class="input-group--focused" label="Novo Projeto" autocomplete v-model="sprint.project" :items="projectsList" item-text="name"></v-select>
              </v-flex>

              <v-flex xs12 sm5 offset-sm1 class="mr-1">
              <v-text-field v-if="sprint.responsible" class="input-group--focused" disabled dark label="Responsável Atual" :value="getName(sprint.responsible, this.usersList)"></v-text-field>
              <v-text-field v-else class="input-group--focused" disabled dark label="Responsável Atual" value="Não informado"></v-text-field>
              </v-flex>

              <v-flex xs12 sm5>
                <v-select class="input-group--focused" label="Novo Responsável" autocomplete v-model="sprint.responsible" :items="usersList" item-text="name"></v-select>
              </v-flex>

              <v-flex xs12 sm5 offset-sm1>
                <v-menu lazy  :close-on-content-click="true"  v-model="menu_start"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
                  <v-text-field slot="activator" label="Data inicio" v-model="sprint.start" prepend-icon="event" readonly ></v-text-field>
                  <v-date-picker locale="pt-BR" v-model="sprint.start" no-title scrollable actions></v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex xs12 sm5>
                <v-menu lazy  :close-on-content-click="true"  v-model="menu_end"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
                  <v-text-field slot="activator" label="Data final" v-model="sprint.end" prepend-icon="event" readonly ></v-text-field>
                  <v-date-picker locale="pt-BR" v-model="sprint.end" no-title scrollable actions></v-date-picker>
                </v-menu>
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
      sprintsUrl: 'sprint-list/',
      projectsUrl: 'project-list/',
      usersUrl: 'user-list/',
      sprint: {
        code: "",
        start: null,
        end: null,
        id: null,
        impediments: [],
        project: null,
        responsible: null,
        tasks: []
      },
      temp: {
        responsible:'',
        project:''
      },
      menu_start: false,
      menu_end: false
    }
  },

  methods:{

    ...mapActions({
      getSprints: 'GETSPRINTS'

    }),

    responsibleId () {
      this.temp.responsible = `${axios.defaults.baseURL}${this.usersUrl}${this.sprint.responsible.id}/`;
    },

    projectId () {
      this.temp.project = `${axios.defaults.baseURL}${this.projectsUrl}${this.sprint.project.id}/`;
    },

    cancel(){
      this.$router.push('/sprints')
    },

    save (){
      if(typeof(this.sprint.responsible) === 'object') {

        this.responsibleId();
        this.sprint.responsible = this.temp.responsible;
      
      };

      if(typeof(this.sprint.project) === 'object') {

        this.projectId();
        this.sprint.project = this.temp.project;
      
      };
      let url = `${this.sprintsUrl}${this.sprint.id}/`;
      console.log(this.sprint);
      axios.put(url, this.sprint).then(res =>{
        this.getSprints();
        this.$router.push('/sprints')
      });

    },

    getSprint(){
      let sprint = this.sprintsList.find( sprint => sprint.id == this.$route.params.id);
      this.sprint = sprint;
    },

    getName(url, list, getter = 'name'){
      return nameById(url, list, getter)
    }


  },

  computed:{
    ...mapGetters({
      sprintsList:'getSprintsList',
      projectsList:'getProjectsList',
      usersList: 'getUsersList'
    })
  },

  created(){
    this.getSprint()
  }
}

</script>

<style scoped>
.input-group--focused{
  color:yellow !important;
}

</style>