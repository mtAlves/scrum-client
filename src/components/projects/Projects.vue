<template>
	<v-layout>
		<v-flex xs12 sm10 offset-sm1 >
			<v-card>
		        <v-toolbar class="blue-grey darken-3" dark>
				      <v-btn icon dark @click.native="addProject"> 
				      	<v-icon color="blue">add</v-icon>
				      </v-btn>
		          <v-spacer></v-spacer>
		          <v-text-field label="Pesquisar..."  class="blue--text mt-3" single-line  append-icon="search"  dark ></v-text-field>
		        </v-toolbar>
				<v-expansion-panel expand>
					<v-expansion-panel-content v-for="(project, index) in projects" :key="index" avatar @click="">
				  	<div slot="header">
							<v-btn icon @click.native="editItem(project.id)"><v-icon dark color="blue lighten-3">edit</v-icon></v-btn>
			          <v-btn icon @click.native="removeItem(project)"><v-icon dark color="red lighten-2">delete</v-icon></v-btn>	
				  		{{project.name}}
				  	</div>
				  		<v-card color="blue-grey lighten-1">
							 <v-container grid-list-md>
						      <v-layout row wrap>
					          <v-flex xs6>
					            <v-text-field v-if="project.administrative_responsible" class="input-group--focused" disabled box dark label="Responsável Administrativo" :value="nameById(project.administrative_responsible, usersList)"></v-text-field>
					            <v-text-field v-else class="input-group--focused" disabled box dark label="Responsável Administrativo" value="Não informado"></v-text-field>
					          </v-flex>
					          <v-flex xs6>
					            <v-text-field v-if="project.technical_responsible" class="input-group--focused" disabled box dark label="Responsável Técnico" :value="nameById(project.technical_responsible, usersList)"></v-text-field>
											<v-text-field v-else class="input-group--focused" disabled box dark label="Responsável Técnico" value="Não informado"></v-text-field>
					          </v-flex>
					          <v-flex xs12 sm5 offset-sm1>
				                <v-text-field v-if="project.start" class="input-group--focused"
				                  single-line :value="reverseDate(project.start)"
				                  append-icon="event" disabled> 
				                </v-text-field>
					              <v-text-field v-else class="input-group--focused"
					                single-line value="Data de inicio não informada"
					                append-icon="event" disabled> 
					              </v-text-field>
				              </v-flex>
				              <v-flex xs12 sm5>
				                <v-text-field v-if="project.end"
				                  single-line :value="reverseDate(project.end)"
				                  append-icon="event_available" disabled> 
				                </v-text-field>
				                <v-text-field v-else
				                  single-line value="Data final não informada"
				                  append-icon="event_busy" disabled> 
				                </v-text-field>
				              </v-flex>

				              <v-flex xs12 sm5 offset-sm1>
				                <v-list class="blue-grey lighten-1 ml-1">
				                  <v-list-group class="orange">
				                    <v-list-tile slot="item" @click="">
				                      <v-list-tile-action>
				                        <v-icon>fa-tasks</v-icon>
				                      </v-list-tile-action>
				                      <v-list-tile-content>
				                        <v-list-tile-title>Tarefas</v-list-tile-title>
				                      </v-list-tile-content>
				                      <v-list-tile-action>
				                        <v-icon color="blue-grey darken-4">keyboard_arrow_down</v-icon>
				                      </v-list-tile-action>
				                    </v-list-tile>
				                    <v-list-tile v-for="task in project.tasks" @click="" class="blue-grey darken-2">
				                      <v-list-tile-content>
				                      		<v-tooltip top>
				                        	<v-list-tile-title slot="activator">{{nameById(task, tasksList)}}</v-list-tile-title>      
				                        	<span>{{nameById(task, tasksList)}}</span>
																	</v-tooltip>
				                      </v-list-tile-content>
				                    </v-list-tile>
				                  </v-list-group>
				                </v-list>
				              </v-flex>

				              <v-flex xs12 sm5>
				                <v-list class="blue-grey lighten-1 ml-1">
				                  <v-list-group class="yellow darken-1">
				                    <v-list-tile slot="item" @click="">
				                      <v-list-tile-action>
				                        <v-icon>motorcycle</v-icon>
				                      </v-list-tile-action>
				                      <v-list-tile-content>
				                        <v-list-tile-title>Sprints</v-list-tile-title>
				                      </v-list-tile-content>
				                      <v-list-tile-action>
				                        <v-icon color="blue-grey darken-4">keyboard_arrow_down</v-icon>
				                      </v-list-tile-action>
				                    </v-list-tile>
				                    <v-list-tile v-for="sprint in project.sprints" @click="" class="blue-grey darken-2">
				                      <v-list-tile-content>
			                      		<v-tooltip top>
			                        	<v-list-tile-title slot="activator">{{nameById(sprint, sprintsList, 'code')}}</v-list-tile-title>      
			                        	<span>{{nameById(sprint, sprintsList, 'code')}}</span>
																</v-tooltip>
				                      </v-list-tile-content>
				                    </v-list-tile>
				                  </v-list-group>
				                </v-list>
				              </v-flex>
				              
									    <v-flex xs12 sm6 >
												<doughnut class="chart-content"
												:chartColors="['#FFD700', '#1E90FF', '#006400', '#B22222']"
												:chartLabels="['A Fazer','Fazendo', 'Feito', 'Pendente']"
												:chartData="tasksStatus(project.tasks)"
												:width="400"
									  		:height="200"
												></doughnut>
									    </v-flex>

									    <v-flex xs12 sm6>
												<doughnut class="chart-content"
												:chartColors="['#1E90FF', '#006400']"
												:chartLabels="['Em progresso', 'Finalizado']"
												:chartData="sprintStatus(project.sprints)"
												:width="400"
									  		:height="200"
												></doughnut>
									    </v-flex>
														
					          <v-flex xs12>
					            <v-text-field box class="input-group--focused" multi-line label="Descrição" disabled v-model="project.description"></v-text-field>
					          </v-flex>
					        </v-layout>
					      </v-container>
			  			</v-card>
					</v-expansion-panel-content>
				</v-expansion-panel>
	    </v-card>
		</v-flex>
	</v-layout>
</template>

<script>
import axios from 'axios';
import store from '@/core';
import { mapActions, mapGetters } from 'vuex';
import Doughnut from '../chart/Doughnut';

export default {
	components:{Doughnut},
  data () {
    return {
    	projectsUrl: 'project-list/'
    }
  },

  methods:{

  	...mapActions({
      getProjects:'GETPROJECTS',
    }),

  	addProject () {
  		this.$router.push('/add_project')
  	},
  	nameById (url, list, getter = "name") {
  		let name = '';
  		let id = url.split('/').reverse()[1];
  		list.map( user => user.id == id ? name = user[getter] : null);
  		return name;
  	},

  	reverseDate (date) {
  		return date.split('-').reverse().join('/');
  	},
  	
  	editItem (id){
  		this.$router.push({name: 'EditProject', params: { id: id }})
  	},

  	removeItem (project){
  		axios.delete(`${this.projectsUrl}${project.id}/`).then( res =>{
  			this.getProjects();
  			this.$router.push({name:'Remove', params: {name: project.name}})
        })
        .catch(error => {
          console.log(error);
        });
  	},

  	tasksStatus (tasks){
  		let tasksId = tasks.map( task => task.split('/').reverse()[1] );
  		let status = [];
  		tasksId.map( taskId => this.tasksList.map( task => task.id == taskId ? status.push(task.status) : null) )
  		let todo = 0, doing = 0, done = 0, pending = 0;
  		status.map( status => {
  			status == 1 ? todo += 1 :
  			status == 2 ? doing += 1 :
  			status == 3 ? pending += 1 :
  			status == 4 ? done += 1 : null
  		});
  		return [todo, doing, done, pending];
  	},

  	sprintStatus (sprints){
  		let sprintsId = sprints.map( sprint => sprint.split('/').reverse()[1] );
  		let status = [];
  		sprintsId.map( sprintId => this.sprintsList.map( sprint => 
  			sprint.id == sprintId ? status.push(sprint) : null ));
  		let doing = 0, done = 0;
  		let today = new Date().toDateString();
  		status.map( status => status.end == null ? doing += 1 : done += 1 );
  		return [doing, done];
  	}

  },

  computed: {
	...mapGetters({
		projects: 'getProjectsList',
		usersList: 'getUsersList',
		tasksList: 'getTasksList',
		sprintsList: 'getSprintsList'
	})

  },

  created(){
  	this.getProjects();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.input-group--focused{
	color:#00FFFF !important;
}
.chart-content{
	min-height: 200px !important;
}
</style>
