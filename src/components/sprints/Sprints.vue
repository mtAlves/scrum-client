<template>
	<v-layout>
		<v-flex xs12 sm10 offset-sm1 >
			<v-card>
		        <v-toolbar class="blue-grey darken-3" dark>
			      <v-btn icon dark @click.native="addSprint"> 
			      	<v-icon color="yellow">add</v-icon>
			      </v-btn>
		          <v-spacer></v-spacer>
		          <v-text-field label="Pesquisar..."  class="yellow--text mt-3" single-line  append-icon="search"  dark ></v-text-field>
		        </v-toolbar>
				<v-expansion-panel expand>
					<v-expansion-panel-content v-for="(sprint, index) in sprintsList" :key="index" avatar @click="">
				  		<div slot="header">
							<v-btn icon @click.native="editItem(sprint.id)"><v-icon dark color="yellow lighten-3">edit</v-icon></v-btn>
			                <v-btn icon @click.native="removeItem(sprint)"><v-icon dark color="red lighten-2">delete</v-icon></v-btn>	
				  		{{sprint.code}}
				  		</div>
				  			<v-card color="blue-grey lighten-1">
								 <v-container grid-list-md>
								        <v-layout row wrap>
								          <v-flex xs6>
								            <v-text-field v-if="sprint.responsible" class="input-group--focused" disabled box dark label="Responsável" :value="nameById(sprint.responsible, usersList)"></v-text-field>
								            <v-text-field v-else class="input-group--focused" disabled box dark label="Responsável" value="Não informado"></v-text-field>
								          </v-flex>
								          <v-flex xs6>
								            <v-text-field v-if="sprint.project" class="input-group--focused" disabled box dark label="Projeto" :value="nameById(sprint.project, projectsList)"></v-text-field>
								            <v-text-field v-else class="input-group--focused" disabled box dark label="Projeto" value="Não informado"></v-text-field>
								          </v-flex>
								          <v-flex xs6>
								            <v-text-field box v-if="sprint.impediments > 0" class="input-group--focused" multi-line label="Impedimentos" disabled v-model="sprint.impediments"></v-text-field>
								            <v-text-field v-else box class="input-group--focused" multi-line label="Impedimentos" disabled value="Não informado"></v-text-field>
								          </v-flex>
								          <v-flex xs6>
								            <v-text-field box v-if="sprint.tasks > 0" class="input-group--focused" multi-line label="Tarefas" disabled v-model="sprint.tasks"></v-text-field>
								            <v-text-field v-else box class="input-group--focused" multi-line label="Tarefas" disabled value="Não informado"></v-text-field>
								          </v-flex>
								          <v-flex xs12 sm5 offset-sm1>
							                <v-text-field v-if="sprint.start" class="input-group--focused"
							                  single-line :value="reverseDate(sprint.start)"
							                  append-icon="event" disabled> 
							                </v-text-field>
							                <v-text-field v-else class="input-group--focused"
							                  single-line value="Data de inicio não informada"
							                  append-icon="event" disabled> 
							                </v-text-field>
							              </v-flex>
							              <v-flex xs12 sm5>
							                <v-text-field v-if="sprint.end"
							                  single-line :value="reverseDate(sprint.end)"
							                  append-icon="event_available" disabled> 
							                </v-text-field>
							                <v-text-field v-else
							                  single-line value="Data final não informada"
							                  append-icon="event_busy" disabled> 
							                </v-text-field>
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

export default {
  data () {
    return {
    	sprintsUrl: 'sprint-list/'
    }
  },

  methods:{
    ...mapActions({
      getSprints: 'GETSPRINTS'

    }),

  	nameById (url, list) {
  		let nome = '';
  		let id = url.split('/').reverse()[1];
  		list.map( user => user.id == id ? nome = user.name : null);
  		return nome;
  	},

  	reverseDate (date) {
  		return date.split('-').reverse().join('/');
  	},

  	editItem (id){
  		this.$router.push({name: 'EditSprint', params: { id: id }})
  	},

  	addSprint () {
  		this.$router.push('/add_sprint')
  	},

  	removeItem (sprint){
  		axios.delete(`${this.sprintsUrl}${sprint.id}/`).then( res => {
  			this.getSprints();
  			this.$router.push({name:'Remove', params: {name: sprint.code}})
        })
        .catch(error => {
          console.log(error);
        });
  	}
  },

  computed:{
  	...mapGetters({
  		sprintsList:'getSprintsList',
  		usersList: 'getUsersList',
  		projectsList: 'getProjectsList',
  		tasksList: 'getTasksList'
  	})
  },

  created(){

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.input-group--focused{
	color:#FFD700 !important;
}

</style>