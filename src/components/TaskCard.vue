<template>
<v-flex xs6 sm4 md3>
    <v-card :class="tabColor">
      <v-card-text class="text-xs-center black--text" >{{name}}
        <v-btn icon color="blue darken-2" class="add-button" v-if='add' @click.native="addTask">
          <v-icon color="white">add</v-icon>
        </v-btn>
      </v-card-text>
        <v-layout row wrap style="display:block;" v-if="card_tasks.length > 0">
        <draggable v-model="card_tasks" :options="{group:'task'}" @add="onAdd" :move="onMove" @end="onEnd">
          <transition-group tag="div" class="dragArea">
            <div v-for="(item, index) in card_tasks" :key="index">
              <v-flex xs12 class="mb-1" >
                <v-card class="secondary ma-1 dark" >
                  <v-card-title>
                      <span style="width: 100%; text-align:left;">{{item.name}}</span><br>
                      <span style="width: 100%; text-align:left;">Inicio: {{item.started}} Fim: {{ item.due || 'Não informado'}}</span>
                      <span style="width: 100%; text-align:left;">Responsável: {{item.responsible | responsavel}}</span>
                  </v-card-title>
                  <v-card-actions>
                    <v-btn icon  @click="itemEditClicked(item)">
                          <v-icon dark color="yellow lighten-3">edit</v-icon>
                    </v-btn>
                    <v-btn icon  @click="removeTask(item)">
                          <v-icon dark color="red lighten-2">delete</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card >
              </v-flex>
            </div>
          </transition-group>
        </draggable>
        </v-layout>
    </v-card>
</v-flex>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import draggable from 'vuedraggable';

let users = [];
let list_name = null;
let a_task = null;

export default {

  props: [
    'add',
    'tabColor',
    'name',
    'cardColor',
    'status'
  ],

  components: {
    'draggable': draggable
  },

  data: () => ({
    fab: false,
    tasksUrl: 'task-list/',
    card_tasks: [],
    projects: [],
    responsavel: ''
  }),

  methods: {
    getId() {
      const id = this.$store.state.tasks_filter
      axios.get(`task-list/filter/project/eq/${id}/`).then(response => this.$store.state.tasks = response.data)
    },
    onMove (evt, originalEvent) {
      if(evt.draggedContext.element != null)
        a_task = evt.draggedContext.element;

      return true;
    },
    onEnd (/**Event*/evt) {
      if (a_task == null)
        return True;
      let url = `${this.tasksUrl}${a_task.id}/`;
      let  local_status = ['A fazer', 'Fazendo', 'Pendente', 'Feito'].indexOf(list_name) + 1;
      a_task.status = local_status;
      axios.put(url, a_task).then(res => {
      //this.$store.commit('clear_current_task')
      })
	   },
     onAdd(evt) {
       // elemento dropado em novo grupo
       list_name = this.name;   
     },
     filter () {
       const filteredTasks = this.tasks.filter(aTask => (parseInt(aTask.status) === parseInt(this.status)))
       return filteredTasks.sort((a, b) => a.started < b.started ? 1 : -1)
     },
    userById (url) {
      let name = '';
      let id = parseInt(url.split('/').reverse()[1]);
      this.usersList.map(user => {
        if (user.id === id) {
          name = user.name
        }
      })
      return name
    },

    projectById (url) {
      let name = ''
      let id = parseInt(url.split('/').reverse()[1])
      this.projectsList.map(project => {
        if (project.id === id) {
          name = project.name
        }
      })
      return name
    },

    sprintById (url) {
      let name = ''
      let id = parseInt(url.split('/').reverse()[1])
      this.sprintsList.map(sprint => {
        if (sprint.id === id) {
          name = sprint.code
        }
      })
      return name
    },

    reverseDate (date) {
      return date.split('-').reverse().join('/')
    },
    addTask () {
      this.$store.commit('set_current_task', {})
      this.$store.commit('set_current_component_name', 'tarefa')
    },
    itemEditClicked (task) {
      this.$store.commit('set_current_task', task)
      this.$store.commit('set_current_component_name', 'tarefa')
    },
    removeTask (task) {
      axios.delete(`${this.tasksUrl}${task.id}/`).then(res => {
        console.log(`removed id: ${task.id} `);
        let idx = this.card_tasks.indexOf(task);
        this.card_tasks.splice(idx, 1);
        this.$store.commit('set_current_component_name', 'tarefas');
      })
      .catch(error => console.log(error))
    }
  },

  computed: {
    ...mapGetters({
      temp_task: 'task',
      tasks: 'tasks',
      tasks_filter: 'tasks_filter'
    })
  },
  watch: {
    tasks_filter () {
      const filterBy = this.tasks_filter.split('/')[0];
      const filterId = this.tasks_filter.split('/')[1];
      if (filterBy == 'user') {
        axios.get(`task-list/filter/responsible/eq/${filterId}/`).then(res => {
          this.$store.state.tasks = res.data;
          this.card_tasks = this.filter();
        })
      } else if (filterBy == 'project'){
          axios.get(`task-list/filter/project/eq/${filterId}/`).then(res => {
            this.$store.state.tasks = res.data;
            this.card_tasks = this.filter();
          })
        }
    }
  },
  created () {
    const actualUserId = this.$store.state.user.id
    if (this.filter().length >= 0) {
      axios.get(`task-list/filter/responsible/eq/${actualUserId}/`).then(response => {
        let items = response.data;
        this.$store.state.tasks = items;
        this.card_tasks = this.filter();
      })
      .catch(error => {
        console.log(error)
      })
      axios.get('user-list/').then(res => (users = res.data))
      .catch(error => console.log(error))
    }
    else {
      this.card_tasks = this.filter();
    }
    axios.get('project-list/').then(res => this.projects = res.data)
  },
  filters: {
    responsavel (url) {
      const idResponsavel = parseInt(url.split('/').reverse()[1])
      const responsavel = users.find(user => user.id === idResponsavel)
      return responsavel ? responsavel.name : 'Não foi possivel informar'
    }
  }
}
</script>

<style scoped>
.add-button {
  margin-top: -1%;
  margin-right: 10px;
  position: relative;
}
.filter-button {
  z-index: 3;
  display: inline-flex !important;
  float: left;
  margin-top: -5%;
  position: absolute;
}
.project-button {
  width: 190px !important;
  justify-content: left !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dragArea {
  min-height: 25px;
}
.icon:before {
  font-family: sans-serif;
}
.sortable-ghost {
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-name: my-ghost;
}

@keyframes my-ghost {
  25% {
    transform: rotate(1deg);
    opacity: 0.5;
    margin-left: 5px;
  }
  50% {
    transform: rotate(0deg);
    opacity: 0.3;
    margin-left: 0px;
  }
  75% {
    transform: rotate(-1deg);
    opacity: 0.5;
    margin-right: 5px;
  }
  100% {
    transform: rotate(0deg);
    opacity: 0.3;
    margin-right: 0px;
  }
}
</style>
