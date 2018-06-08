<template>
  <v-card v-if="sprints">
    <v-card-title class="blue darken-2" style="font-size: 20px; padding: 10px;">
      Novo Produto
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>

          <v-flex xs12>
            <v-text-field class="input-group--focused" label="Nome da Tarefa" v-model="task.name" required></v-text-field>
          </v-flex>

          <v-flex xs12>
            <v-select class="input-group--focused" label="Sprint" autocomplete v-model="task.sprint_id" :items="sprints" item-text="name" item-value="id" required @select="getBacklogs"></v-select>
          </v-flex>

          <v-flex xs12 v-if="task.sprint_id">
            <v-select class="input-group--focused" label="Backlog" autocomplete v-model="task.sprint_backlog_id" :items="sprintBacklogs" item-text="name" item-value="id" required></v-select>
          </v-flex>

          <v-flex xs12 sm5 offset-sm1>
            <v-menu lazy  :close-on-content-click="true"  v-model="started"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
              <v-text-field slot="activator" label="Data inicio" v-model="task.started" prepend-icon="event" readonly required ></v-text-field>
              <v-date-picker locale="pt-BR" v-model="task.started" no-title scrollable actions></v-date-picker>
            </v-menu>
          </v-flex>

          <v-flex xs12 sm5>
            <v-menu lazy  :close-on-content-click="true"  v-model="ended"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
              <v-text-field slot="activator" label="Data final" v-model="task.ended" prepend-icon="event" readonly required></v-text-field>
              <v-date-picker locale="pt-BR" v-model="task.ended" no-title scrollable actions></v-date-picker>
            </v-menu>
          </v-flex>

        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn round class="blue" @click="createOrEditTask">
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
  props: ['status'],
  name: 'create-or-edit-task',
  data () {
    return {
      task: {
        id: null,
        name: '',
        started: null,
        ended: null,
        sprint_id: null,
        status: this.status,
        sprint_backlog_id: null
      },
      sprintBacklogs: [],
      started: false,
      ended: false
    }
  },
  methods: {
    createOrEditTask () {
      this.task.id ? this.editTask() : this.createTask()
    },
    async createTask () {
      try {
        await axios.post('tasks/', this.task)
        this.$store.dispatch('GETTASKS')
        this.close()
      } catch (error) {
        console.log(error)
      }
    },
    async editTask () {
      try {
        await axios.put(`tasks/${this.task.id}`, this.task)
        this.$store.dispatch('GETTASKS')
        this.close()
      } catch (error) {
        console.log(error)
      }
    },
    close () {
      this.clearFields()
      this.$emit('close')
    },
    clearFields () {
      this.task = {
        id: null,
        name: '',
        started: null,
        ended: null,
        sprint_id: null,
        status: null,
        sprint_backlog_id: null
      }
    },
    async getBacklogs () {
      const backlogs = await axios.get(`sprints_backlog/sprint_id/eq/${this.task.sprint_id}/`)
      this.sprintBacklogs = backlogs.data
    }
  },
  computed: {
    ...mapGetters({
      sprints: 'getSprints'
    })
  },
  async created () {
    this.$store.dispatch('GETSPRINTS')
  }
}
</script>
