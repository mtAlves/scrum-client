<template>
  <v-app dark id="app">

    <v-navigation-drawer clipped fixed v-model="drawer" app>
      <v-list dense>
        <v-list-tile v-for="item in navItems" :key="item.title" :to="item.route" exact>
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

    <v-toolbar  color="blue-grey darken-3" app fixed dense clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>

      <v-spacer></v-spacer>

      <div v-if="loggedUser" class="blue--text"> {{ loggedUser.toUpperCase() }} </div>

      <v-menu offset-x left absolute :nudge-width="100">
        <v-toolbar-title slot="activator">
          <v-btn icon>
            <v-icon>account_circle</v-icon>
          </v-btn>
        </v-toolbar-title>

        <v-list>
          <v-list-tile v-if="loggedUser" @click="logout">
            <v-list-tile-title class="red--text"> Logout </v-list-tile-title>
          </v-list-tile>

          <v-list-tile v-if="this.$route.name == 'login'" to="register">
            <v-list-tile-title class="blue--text"> Registrar </v-list-tile-title>
          </v-list-tile>

          <v-list-tile v-if="this.$route.name == 'register'" to="login">
            <v-list-tile-title class="blue--text"> Login </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>

    <main>
      <v-content>
        <v-layout justify-center style="padding: 20px">
          <router-view></router-view>
        </v-layout>
      </v-content>
    </main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  data () {
    return {
      drawer: true,
      navItems: [
        {title: 'Home', route: '/', icon: 'fas fa-home', color: 'white'},
        {title: 'Products', route: '/products', icon: 'fas fa-dolly', color: 'blue'},
        {title: 'Sprints', route: '/sprints', icon: 'fas fa-bicycle', color: 'yellow'},
        {title: 'Tarefas', route: '/tasks', icon: 'fas fa-tasks', color: 'green'},
        {title: 'Revisão', route: '/reviews', icon: 'fas fa-clipboard-list', color: 'orange'}
      ]
    }
  },
  methods: {
    logout () {
      this.$store.commit('logout')
      this.$router.push('/login')
    }
  },
  computed: {
    ...mapGetters(['loggedUser'])
  }

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
