<template>
  <v-layout>
    <v-flex xs12 sm8 offset-sm2>
      <v-card class="blue-grey darken-3 elevation-4">
        <v-card-title class=" headline yellow black--text">
          Novo sprint
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
                <v-text-field class="input-group--focused" label="código" v-model="sprint.code" required></v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-select class="input-group--focused" label="Responsável" autocomplete v-model="sprint.responsible" :items="usersList" item-text="name" @blur="responsibleId"></v-select>
              </v-flex>

              <v-flex xs12>
                <v-select class="input-group--focused" label="Projeto" autocomplete v-model="sprint.project" :items="projectsList" item-text="name" @blur="projectId"></v-select>
              </v-flex>

              <v-flex xs12 sm5 offset-sm1>
                <v-menu lazy  :close-on-content-click="true"  v-model="menu_start"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
                  <v-text-field slot="activator" label="Data inicio" v-model="sprint.start" prepend-icon="event" readonly required ></v-text-field>
                  <v-date-picker locale="pt-BR" v-model="sprint.start" no-title scrollable actions></v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex xs12 sm5>
                <v-menu lazy  :close-on-content-click="true"  v-model="menu_end"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
                  <v-text-field slot="activator" label="Data final" v-model="sprint.end" prepend-icon="event" readonly></v-text-field>
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

    cancel (){
      this.$router.push('/sprints')
    },

    save (){
      this.sprint.responsible = this.temp.responsible;
      this.sprint.project = this.temp.project;
      console.log(this.sprint);
      axios.post(this.sprintsUrl, this.sprint).then(res =>{
        this.getSprints();
        this.$router.push('/sprints')
     });
    }

  },

  computed:{
    ...mapGetters({
      usersList: 'getUsersList',
      projectsList: 'getProjectsList'
    })
  }
}

</script>

<style scoped>
.input-group--focused{
  color:yellow !important;
}

</style>