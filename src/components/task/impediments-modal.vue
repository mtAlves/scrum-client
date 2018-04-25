<template>
  <v-card v-if="impediments">
    <v-card-title class="red lighten-2 white--text">
      <div>
        <div class="headline">{{ task.name }}</div>
        <span class="white--text subheading">Inicio: {{ task.started }} / Fim: {{ task.due || 'Não informado'}}</span>
      </div>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-expansion-panel expand>
            <v-expansion-panel-content v-for="(impediment, index) in impediments" :key="index" value="1" :class="impediment.resolution_date <= currentDate ? 'green darken-1 mb-1' : 'red darken-4 mb-1'">
              <div slot="header">{{ impediment.name }}</div>
              <v-card class="blue-grey darken-3">
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>

                      <v-flex xs12>
                        <v-text-field label="Nome" required v-model="impediment.name"></v-text-field>
                      </v-flex>

                      <v-flex xs12>
                        <v-text-field label="Descrição" required v-model="impediment.description"></v-text-field>
                      </v-flex>

                      <v-flex xs12 sm5 offset-sm1>
                        <v-menu lazy  :close-on-content-click="true"  v-model="menu_created"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
                          <v-text-field slot="activator" label="Data do impedimento" v-model="impediment.created_date" prepend-icon="event" readonly></v-text-field>
                          <v-date-picker  v-model="impediment.created_date" no-title scrollable actions>
                          </v-date-picker>
                        </v-menu>
                      </v-flex>

                      <v-flex xs12 sm5>
                        <v-menu lazy  :close-on-content-click="true"  v-model="menu_resolution"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
                          <v-text-field slot="activator" label="Data da solução" v-model="impediment.resolution_date" prepend-icon="event" readonly></v-text-field>
                          <v-date-picker v-model="impediment.resolution_date" no-title scrollable actions>
                          </v-date-picker>
                        </v-menu>
                      </v-flex>

                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn round class="blue" @click="editImpediment(impediment)">
                    Confirmar
                  </v-btn>
                  <v-btn round class="red lighten-2" @click="cancel">
                    Cancelar
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'impediments-modal',
  props: ['currentDate'],
  data () {
    return {
      task: {
        impediments: [],
        id: null,
        name: '',
        description: null,
        status: '',
        order: null,
        started: null,
        due: null,
        completed: null,
        sprint: null,
        responsible: null,
        typeContinuousActivity: null,
        project: null
      },
      impediments: [],
      menu_created: false,
      menu_resolution: false
    }
  },
  methods: {
    editImpediment (impediment) {
      axios.put(`impediment-list/${impediment.id}/`, impediment)
    },
    cancel () {
      this.$emit('close')
    }
  }
}
</script>
<style scoped>
</style>
