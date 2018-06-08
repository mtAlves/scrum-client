<template>
  <v-card v-if="$store.state.products">

    <v-dialog v-model="addBacklogModal" persistent max-width="580">
      <v-card>
        <v-card-title class="blue darken-2" style="font-size: 20px; padding: 10px;">
          Adicionar Backlog ao sprint
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field class="input-group--focused" label="Nome" v-model="backlog.name" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn round class="blue" @click="addBacklog">
            Adicionar
          </v-btn>
          <v-btn round class="red lighten-2" @click="closeAddBacklog">
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card-title class="blue darken-2" style="font-size: 20px; padding: 10px;">
      Novo Sprint
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>

          <v-flex xs12>
            <v-text-field class="input-group--focused" label="Nome do Sprint" v-model="sprint.name" required></v-text-field>
          </v-flex>

          <v-flex xs12>
            <v-select class="input-group--focused" label="Scrum Master" autocomplete v-model="sprint.scrum_master_id" :items="users" item-text="name" item-value="id" required></v-select>
          </v-flex>

          <v-flex xs12>
            <v-select class="input-group--focused" label="Produto" autocomplete v-model="sprint.product_id" :items="products" item-text="name" item-value="id" required></v-select>
          </v-flex>

          <v-flex xs12 sm5 offset-sm1>
            <v-menu lazy  :close-on-content-click="true"  v-model="started"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
              <v-text-field slot="activator" label="Data inicio" v-model="sprint.started" prepend-icon="event" readonly required ></v-text-field>
              <v-date-picker locale="pt-BR" v-model="sprint.started" no-title scrollable actions></v-date-picker>
            </v-menu>
          </v-flex>

          <v-flex xs12 sm5>
            <v-menu lazy  :close-on-content-click="true"  v-model="ended"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
              <v-text-field slot="activator" label="Data final" v-model="sprint.ended" prepend-icon="event" readonly required></v-text-field>
              <v-date-picker locale="pt-BR" v-model="sprint.ended" no-title scrollable actions></v-date-picker>
            </v-menu>
          </v-flex>

          <v-flex xs12 sm2>
            <v-btn icon color="blue darken-2" @click="addBacklogModal = true">
              <v-icon>add</v-icon>
            </v-btn>
          </v-flex>

          <v-flex xs12 sm10>
            <v-expansion-panel>
              <v-expansion-panel-content class="blue darken-2">
                <div slot="header">Backlogs ({{ backlogs.length }})</div>

                <v-card>
                  <v-list>
                    <v-list-tile v-for="backlogItem in backlogs" :key="backlogItem.name">
                      <v-list-tile-action>
                        <v-btn @click="removeBacklog(backlogItem)" icon>
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>{{ backlogItem.name }}</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-flex>

        </v-layout>
      </v-container>
      <small>*Campos requeridos</small>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn round class="blue" @click="create">
        Confirmar
      </v-btn>
      <v-btn round class="red lighten-2" @click="close">
        Cancelar
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  name: 'add-product',
  data () {
    return {
      pagination: {},
      sprint: {
        name: '',
        scrum_master_id: null,
        product_id: null,
        started: '',
        ended: ''
      },
      backlog: {
        name: ''
      },
      backlogs: [],
      addBacklogModal: false,
      started: false,
      ended: false
    }
  },
  methods: {
    addBacklog () {
      this.backlogs.push({...this.backlog})
      this.backlog.name = ''
      this.addBacklogModal = false
    },
    removeBacklog (backlog) {
      const backlogIndex = this.backlogs.indexOf(backlog)
      this.backlogs.splice(backlogIndex, 1)
    },
    async create () {
      try {
        const sprint = await axios.post('/sprints', this.sprint)
        this.backlogs.map(async backlog => {
          backlog.sprint_id = sprint.data.id
          await axios.post('/sprints_backlog', backlog)
        })
        this.$store.dispatch('GETSPRINTS')
        this.clearSprintFields()
        this.$emit('close')
      } catch (error) {
        console.log(error)
      }
    },
    close () {
      this.$emit('close')
    },
    closeAddBacklog () {
      this.backlog.name = ''
      this.addBacklogModal = false
    },
    clearSprintFields () {
      this.sprint = {
        name: '',
        scrum_master_id: null,
        product_id: null,
        started: '',
        ended: ''
      }
    }
  },
  computed: {
    ...mapGetters({users: 'getUsers', products: 'getProducts'})
  },
  created () {
    this.$store.dispatch('GETPRODUCTS')
  }
}
</script>
