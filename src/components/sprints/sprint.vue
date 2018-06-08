<template>
  <v-layout>
    <v-flex xs12 sm10 offset-sm1 v-if="scrumMaster">
      <v-card style="min-height: 680px">
        <v-toolbar class="blue-grey darken-3" dark>
          <v-toolbar-title>{{ sprint.name.toUpperCase() }}</v-toolbar-title>
          <v-btn icon color="yellow--text" @click="editSprint">
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn icon color="red--text" @click="deleteDialog = true">
            <v-icon>delete</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn icon color="red" @click="$router.go(-1)">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container fluid>
            <v-layout row wrap>

              <v-flex xs12>
                <v-text-field class="input-group--focused" label="Nome do Sprint" v-model="sprint.name" required :readonly="!allowEdit"></v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-text-field class="input-group--focused" label="Produto" v-model="product.name" readonly></v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-select
                  class="input-group--focused"
                  :items="users"
                  v-model="sprint.scrum_master_id"
                  item-text="name"
                  item-value="id"
                  label="Scrum Master"
                  autocomplete
                  :disabled="!allowEdit"
                ></v-select>
              </v-flex>

              <v-flex xs12 sm5 offset-sm1>
                <v-menu lazy :close-on-content-click="true" v-model="started" transition="scale-transition" offset-y full-width :nudge-left="40" max-width="290px" :disabled="!allowEdit">
                  <v-text-field slot="activator" class="input-group--focused" label="Data inicio" v-model="sprint.started" prepend-icon="event" readonly required ></v-text-field>
                  <v-date-picker locale="pt-BR" v-model="sprint.started" no-title scrollable actions></v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex xs12 sm5>
                <v-menu lazy :close-on-content-click="true" v-model="ended" transition="scale-transition" offset-y full-width :nudge-left="40" max-width="290px" :disabled="!allowEdit">
                  <v-text-field slot="activator" class="input-group--focused" label="Data final" v-model="sprint.ended" prepend-icon="event" readonly required></v-text-field>
                  <v-date-picker locale="pt-BR" v-model="sprint.ended" no-title scrollable actions></v-date-picker>
                </v-menu>
              </v-flex>

              <v-expansion-panel>
                <v-expansion-panel-content class="blue darken-2">
                  <div slot="header">Backlogs ({{ sprintBacklogs.length }})</div>
                  <v-card>
                    <v-card-text
                      v-for="(backlog, index) in sprintBacklogs"
                      :key="index"
                    >
                      <v-layout wrap>
                        <v-flex xs10>
                          <v-text-field
                            class="input-group--focused"
                            :label="`${index+1}. Sprint Backlog`"
                            v-model="backlog.name"
                            required :readonly="!allowEdit"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                    <v-btn icon class="blue darken-2" @click="addBacklog" v-show="!!allowEdit">
                      <v-icon>add</v-icon>
                    </v-btn>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>

            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions v-show="allowEdit">
          <v-spacer></v-spacer>
          <v-btn round class="blue" @click="saveSprintAlterations">
            Confirmar Alterações
          </v-btn>
          <v-btn round class="red lighten-2" @click="cancelEdit">
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>

        <v-dialog v-model="deleteDialog" persistent max-width="350">
          <v-card>
            <v-card-title class="headline red">Você desistiu do sprint ?</v-card-title>
            <v-card-text>Tem certeza que quer deletar o Sprint: <br>{{ sprint.name }}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" round @click.native="deleteSprint">Sim</v-btn>
              <v-btn color="red darken-1" round @click.native="deleteDialog = false">Não</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  name: 'sprint',
  data () {
    return {
      allowEdit: false,
      deleteDialog: false,
      sprint: null,
      oldSprint: null,
      sprintBacklogs: null,
      oldSprintBacklogs: null,
      product: null,
      scrumMaster: null
    }
  },
  methods: {
    async deleteSprint () {
      try {
        await axios.delete(`/sprints/${this.sprint.id}`)
        this.$store.dispatch('GETSPRINTS')
        this.$router.go(-1)
      } catch (error) {
        console.log(error)
      }
    },
    async saveSprintAlterations () {
      await axios.put(`/sprints/${this.sprint.id}/`, this.sprint)
      this.$store.dispatch('GETPRODUCTS')
      this.sprintBacklogs.map(async backlog => {
        backlog.id
          ? await axios.put(`/sprints_backlog/${backlog.id}/`, backlog)
          : await axios.post('/sprints_backlog/', backlog)
      })
      this.allowEdit = false
    },
    editSprint () {
      this.oldSprint = {...this.sprint}
      this.oldSprintBacklogs = this.sprintBacklogs.map(backlog => ({...backlog}))
      this.allowEdit = true
    },
    cancelEdit () {
      this.sprint = this.oldSprint
      this.sprintBacklogs = this.oldSprintBacklogs
      this.allowEdit = false
    },
    addBacklog () {
      const newBacklog = {name: '', sprint_id: this.sprint.id}
      this.sprintBacklogs.push(newBacklog)
    },
    colorByStatus (status) {
      const colors = {1: 'yellow', 2: 'blue', 3: 'green', 4: 'red'}
      return colors[status]
    }
  },
  computed: {
    ...mapGetters({users: 'getUsers'})
  },
  async created () {
    const sprint = await axios.get(`/sprints/${this.$route.params.id}`)
    const sprintBacklogs = await axios.get(`/sprints_backlog/sprint_id/eq/${this.$route.params.id}`)
    const product = await axios.get(`/products/${sprint.data.product_id}`)
    const scrumMaster = await axios.get(`/users/${sprint.data.scrum_master_id}`)
    this.sprint = sprint.data
    this.sprintBacklogs = sprintBacklogs.data
    this.product = product.data
    this.scrumMaster = scrumMaster.data
  }
}
</script>
