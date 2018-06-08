<template>
  <v-flex xs6 sm4 md3>
    <v-card :class="tabColor">
      <v-card-text class="text-xs-center black--text" >
        {{name}}
        <v-btn icon :color="`${tabColor} darken-2`" class="add-button" @click.native="createTask">
          <v-icon color="white">add</v-icon>
        </v-btn>
      </v-card-text>
      <v-layout row wrap style="display:block;" v-if="cardTasks">
        <draggable v-model="cardTasks" :options="{ group:'task' }"
          @add="onAdd" :move="onMove" @end="onEnd">
          <transition-group tag="div" class="dragArea">
            <div v-for="(task, index) in cardTasks" :key="index">
              <v-flex xs12 class="mb-1" >

                <v-card class="secondary ma-1 dark">
                  <v-card-title>
                    <span style="width: 100%; text-align:left;">{{task.name}}</span><br>
                    <span style="width: 100%; text-align:left;">
                      Inicio: {{ task.started }} Fim: {{ task.ended || 'Não informado'}}
                    </span>
                  </v-card-title>
                  <v-card-actions>
                    <v-btn icon @click="editTask(task.id)">
                      <v-icon dark color="yellow lighten-3">edit</v-icon>
                    </v-btn>
                    <v-btn icon @click="removeTask(task.id)">
                      <v-icon dark color="red lighten-2">delete</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>

              </v-flex>
            </div>
          </transition-group>
        </draggable>
      </v-layout>
    </v-card>

    <v-dialog v-model="createOrEditTask" persistent max-width="680">
      <create-or-edit-task ref="createOrEditTask" @close="createOrEditTask = false" :status="status"/>
    </v-dialog>

  </v-flex>
</template>

<script>
import axios from 'axios'
import draggable from 'vuedraggable'
import { mapGetters } from 'vuex'
import createOrEditTask from './create-or-edit-task'

export default {
  props: ['name', 'tabColor', 'status'],
  components: { draggable, createOrEditTask },
  data () {
    return {
      createOrEditTask: false,
      deleteDialog: false,
      cardTasks: []
    }
  },
  methods: {
    createTask () {
      this.createOrEditTask = true
    },
    async editTask (taskId) {
      try {
        const task = await axios.get(`tasks/${taskId}`)
        const backlogs = await axios.get(`sprints_backlog/sprint_id/eq/${task.data.sprint_id}/`)
        this.$refs.createOrEditTask.task = task.data
        this.$refs.createOrEditTask.sprintBacklogs = backlogs.data
        this.createOrEditTask = true
      } catch (error) {
        console.log(error)
      }
    },
    async removeTask (taskId) {
      try {
        await axios.delete(`tasks/${taskId}`)
        this.$store.dispatch('GETTASKS')
      } catch (error) {
        console.log(error)
      }
    },
    onMove (event, dragEvent) {
      if (event.draggedContext.element != null) {
        this.$store.commit('movedTask', event.draggedContext.element)
      }
    },
    onEnd (event) {
      this.$store.commit('clearMovedTask')
    },
    async onAdd (event) {
      try {
        const movedTask = {...this.$store.state.movedTask, status: this.status}
        await axios.put(`/tasks/${movedTask.id}`, movedTask)
        this.$store.dispatch('GETTASKS')
      } catch (error) {
        console.log(error)
      }
    }
  },
  computed: {
    ...mapGetters({
      tasks: 'getTasks'
    })
  },
  watch: {
    tasks () {
      this.cardTasks = this.tasks.filter(task => task.status === this.status)
    }
  },
  created () {
    this.cardTasks = this.tasks.filter(task => task.status === this.status)
  }
}
</script>

<style scoped>
.add-button {
  margin-top: -1%;
  margin-right: 10px;
  position: relative;
}
.dragArea {
  padding: 2px;
  min-height: 20px;
}
.sortable-ghost {
    animation-name: my-ghost;
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
}
@keyframes my-ghost {
  from {
    transform: scale(0.96);
    opacity: 0.5;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
