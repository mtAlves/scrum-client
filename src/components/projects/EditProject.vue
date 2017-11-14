<template>
  <v-layout>
    <v-flex xs12 sm8 offset-sm2>
      <v-card class="blue-grey darken-3 elevation-4">
        <v-card-title class="blue black--text">
          {{project.name.toUpperCase()}}
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
                <v-text-field class="input-group--focused" dark label="Nome do projeto" v-model="project.name"></v-text-field>
              </v-flex>

              <v-flex xs12 sm5 offset-sm1 class="mr-1">
              <v-text-field v-if="project.administrative_responsible" class="input-group--focused" disabled dark label="Responsável Administrativo Atual" :value="nameById(project.administrative_responsible)"></v-text-field>
              <v-text-field v-else class="input-group--focused" disabled dark label="Responsável Administrativo Atual" value="Não informado"></v-text-field>
              </v-flex>

              <v-flex xs12 sm5>
                <v-select class="input-group--focused" label="Novo Responsável Administrativo" autocomplete v-model="project.administrative_responsible" :items="usersList" item-text="name"></v-select>
              </v-flex>

              <v-flex xs12 sm5 offset-sm1 class="mr-1">
              <v-text-field v-if="project.technical_responsible" class="input-group--focused" disabled dark label="Responsável Técnico Atual" :value="nameById(project.technical_responsible)"></v-text-field>
              <v-text-field v-else class="input-group--focused" disabled dark label="Responsável Técnico Atual" value="Não informado"></v-text-field>
              </v-flex>

              <v-flex xs12 sm5>
                <v-select class="input-group--focused" label="Novo Responsável Técnico" autocomplete v-model="project.technical_responsible" :items="usersList" item-text="name"></v-select>
              </v-flex>

              <v-flex xs12 sm5 offset-sm1>
                <v-menu lazy  :close-on-content-click="true"  v-model="menu_start"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
                  <v-text-field slot="activator" label="Data inicio" v-model="project.start" prepend-icon="event" readonly ></v-text-field>
                  <v-date-picker locale="pt-BR" v-model="project.start" no-title scrollable actions></v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex xs12 sm5>
                <v-menu lazy  :close-on-content-click="true"  v-model="menu_end"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
                  <v-text-field slot="activator" label="Data final" v-model="project.end" prepend-icon="event" readonly ></v-text-field>
                  <v-date-picker locale="pt-BR" v-model="project.end" no-title scrollable actions></v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex xs12>
                  <v-text-field box class="input-group--focused" multi-line label="Descrição" v-model="project.description"></v-text-field>
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
      projectsUrl: 'project-list/',
      usersUrl: 'user-list/',
      project: {
        administrative_responsible:"",
        description:"",
        end:"",
        id:null,
        name:"",
        sprints:[],
        start:"",
        tasks:[],
        technical_responsible:""
      },
      temp: {
        adm:'',
        tech:''
      },
      menu_start: false,
      menu_end: false,
    }
  },

  methods:{
    
    ...mapActions({
      getProjects: 'GETPROJECTS'

    }),

    administrativeId () {
      this.temp.adm = `${axios.defaults.baseURL}${this.usersUrl}${this.project.administrative_responsible.id}/`;
    },

    technicalID (){
      this.temp.tech = `${axios.defaults.baseURL}${this.usersUrl}${this.project.technical_responsible.id}/`;
    },

  	cancel(){
      this.$router.push('/projects')
    },

    save (){
      if(typeof(this.project.administrative_responsible) === 'object') {

        this.administrativeId();
        this.project.administrative_responsible = this.temp.adm;
      
      };

      if(typeof(this.project.technical_responsible) === 'object') {

        this.technicalID();
        this.project.technical_responsible = this.temp.tech;
      
      };
      let url = `${this.projectsUrl}${this.project.id}/`;
      axios.put(url, this.project).then(res =>{
        this.getProjects();
        this.$router.push('/projects')
      });

    },

    getProject(){
      let project = this.projectsList.find( project => project.id == this.$route.params.id);
      this.project = project;
    },

    nameById (url) {
      let name = '';
      let id = url.split('/').reverse()[1];
      this.usersList.map( user => user.id == id ? name = user.name : null);
      return name;
    },

  },

  computed:{
  	...mapGetters({
  		projectsList:'getProjectsList',
  		usersList: 'getUsersList'
  	})
  },

  created(){
    this.getProject()
  }
}

</script>

<style>
	

</style>