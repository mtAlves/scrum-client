<template>
  <v-layout>
    <v-flex xs12 sm10 offset-sm1 v-if="sprints">
      <v-card style="min-height: 680px">
        <v-toolbar class="blue-grey darken-3" dark>
          <v-btn icon color="blue darken-2" @click="addSprint">
            <v-icon color="white">add</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field label="Pesquisar sprint..." class="blue--text mt-3" single-line  append-icon="search"></v-text-field>
        </v-toolbar>
        <v-list >
          <v-list-tile class="blue darken-2 mt-1" v-for="(sprint, index) in sprintsPerPage" :key="index" avatar @click="toSprintPage(sprint.id)">
            <v-list-tile-content>
              <v-list-tile-title>{{ sprint.name | upperCase }}</v-list-tile-title>
            </v-list-tile-content>
            <v-spacer/>
            <v-list-tile-content>
              <v-list-tile-title style="text-align: right">
                Início: {{ sprint.started | localeDate }} | Fim: {{ sprint.started | localeDate }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
      <div class="text-xs-center">
        <v-pagination v-model="page" :length="pages"></v-pagination>
      </div>
    </v-flex>
    <v-dialog v-model="addSprintModal" persistent max-width="680">
      <add-sprint @close="addSprintModal = false"></add-sprint>
    </v-dialog>
  </v-layout>
</template>

<script>
import addSprint from './add-sprint'
import { mapGetters } from 'vuex'

export default {
  name: 'sprints',
  components: { addSprint },
  data () {
    return {
      addSprintModal: false,
      page: 1
    }
  },
  methods: {
    addSprint () {
      this.addSprintModal = true
    },
    toSprintPage (id) {
      this.$router.push(`/sprint/${id}`)
    }
  },
  computed: {
    ...mapGetters({sprints: 'getSprints'}),
    pages () {
      return this.sprints.length > 10 ? Math.ceil(this.sprints.length / 10) : 0
    },
    sprintsPerPage () {
      const firstIndex = (this.page - 1) * 10
      const lastIndex = (this.page) * 10
      return this.sprints.slice(firstIndex, lastIndex)
    }
  },
  filters: {
    localeDate (value) {
      return value.split('-').reverse().join('/')
    },
    upperCase (value) {
      return value.toUpperCase()
    }
  },
  created () {
    if (this.$store.state.sprints === null) {
      this.$store.dispatch('GETSPRINTS')
    }
  }
}
</script>

<style>

</style>
