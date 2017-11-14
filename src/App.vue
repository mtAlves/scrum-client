<template>
  <v-app dark id="inspire">

    <v-navigation-drawer persistent clipped enable-resize-watcher v-model="drawer" app>
      <v-list dense>
        <v-list-tile v-for="item in items" :key="item.title" :to="item.link" exact>
          <v-list-tile-action>
            <v-icon :color="item.color">{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.title }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar color="blue-grey darken-3" dense fixed clipped-left app>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <div v-if="getUser" class="blue--text"> {{getUser.toUpperCase()}} </div>  

      <v-menu offset-x left absolute :nudge-width="100">
        <v-toolbar-title slot="activator">
          <v-btn icon>
            <v-icon>account_circle</v-icon>
          </v-btn>
        </v-toolbar-title>
        
        <v-list>
          <v-list-tile v-if="getToken" @click="logout">
            <v-list-tile-title class="red--text"> Logout </v-list-tile-title>
          </v-list-tile>

          <v-list-tile v-if="this.$route.name == 'Login'" @click="register">
            <v-list-tile-title class="blue--text"> Registrar </v-list-tile-title>
          </v-list-tile>

          <v-list-tile v-if="this.$route.name == 'Register'" @click="login">
            <v-list-tile-title class="blue--text"> Login </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>

    <main>
      <v-content>
        <v-container class="containerFullWidth" fill-height>
          <v-layout justify-center>
            <router-view></router-view>
          </v-layout>
        </v-container>
      </v-content>
    </main>
  </v-app>
</template>

<script>
import axios from 'axios';
import store from '@/core';
import { mapGetters } from 'vuex'

  export default {
    data: () => ({

      drawer: true,
      items: [
        { title: 'Gestão de atividades', icon: 'home',  link: '/', color: 'white' }, 
        { title: 'Projetos', icon: 'assignment',  link: '/projects', color: 'blue' },
        { title: 'Tarefas', icon: 'fa-tasks',  link: '/tasks', color: 'orange' }, 
        { title: 'Sprints', icon: 'motorcycle',  link: '/sprints', color: 'yellow' }, 
        { title: 'Atividades contínuas', icon: 'fa-spinner',  link: '/continuous_activitys', color: 'green' }
      ]

    }),

    methods: {
      login (){
        this.$router.push('/login');
      },
      logout (){
        store.commit('logout');
        axios.defaults.headers.common['Authorization'] = null;
        this.$router.push('/login');
      },

      register () {
        this.$router.push('/register');
      }

    },

    computed: {
      ...mapGetters ([
        'getToken',
        'getUser'

      ])

    },

    created() {

    }

  }
</script>

<style>
  .containerFullWidth {
    max-width: 100% !important
  }
</style>