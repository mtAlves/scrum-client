<template>
	<v-layout>
		<v-flex xs12 sm10 offset-sm1 >
			<v-card>
		        <v-toolbar class="blue-grey darken-3" dark>
			      <v-btn icon dark @click.native="addContinuousActivity"> 
			      	<v-icon color="green">add</v-icon>
			      </v-btn>
		          <v-spacer></v-spacer>
		          <v-text-field label="Pesquisar..."  class="green--text mt-3" single-line  append-icon="search"  dark ></v-text-field>
		        </v-toolbar>
				<v-expansion-panel expand>
					<v-expansion-panel-content v-for="(continuous, index) in continuousList" :key="index" avatar @click="">
				  		<div slot="header">
							<v-btn icon @click.native="editItem(continuous.id)"><v-icon dark color="green lighten-3">edit</v-icon></v-btn>
			                <v-btn icon @click.native="removeItem(continuous)"><v-icon dark color="red lighten-2">delete</v-icon></v-btn>	
				  		{{continuous.name}}
				  		</div>
				  			<v-card color="blue-grey lighten-1">
								 <v-container grid-list-md>
								        <v-layout row wrap>
								          <v-flex xs6>
								            <v-text-field class="input-group--focused" disabled box dark label="Responsável" :value="nameById(continuous.responsible)"></v-text-field>
								          </v-flex>
								          <v-flex xs6>
								            <v-text-field class="input-group--focused" disabled box dark label="Tipo" v-if="continuous.type == 1" value="Comitê"></v-text-field>
								            <v-text-field class="input-group--focused" disabled box dark label="Tipo" v-if="continuous.type == 2" value="Reunião"></v-text-field>
								            <v-text-field class="input-group--focused" disabled box dark label="Tipo" v-if="continuous.type == 3" value="Trabalho colaborativo"></v-text-field>
								          </v-flex>
								          <v-flex xs12 sm5 offset-sm1>
							                <v-text-field v-if="continuous.started" class="input-group--focused"
							                  single-line :value="reverseDate(continuous.started)"
							                  append-icon="event" disabled> 
							                </v-text-field>
							              </v-flex>
							              <v-flex xs12 sm5>
							                <v-text-field v-if="continuous.ended"
							                  single-line :value="reverseDate(continuous.ended)"
							                  append-icon="event_available" disabled> 
							                </v-text-field>
							                <v-text-field v-else
							                  single-line value="Data final não informada"
							                  append-icon="event_busy" disabled> 
							                </v-text-field>
							              </v-flex>
								          <v-flex xs12>
								            <v-text-field box class="input-group--focused" multi-line label="Descrição" disabled v-model="continuous.description"></v-text-field>
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
    	continuousActivityUrl: 'continuous-activity-list/'
    }
  },

  methods:{
    ...mapActions({
      getContinuousActivitysList: 'GETCONTINUOUS'

    }),

  	nameById (url) {
  		let nome = '';
  		let id = url.split('/').reverse()[1];
  		this.usersList.map( user => user.id == id ? nome = user.name : null);
  		return nome;
  	},

  	reverseDate (date) {
  		return date.split('-').reverse().join('/');
  	},

  	editItem (id) {
  		this.$router.push({name: 'EditContinuousActivity', params: { id: id }})
  	},
  	
  	addContinuousActivity () {
  		this.$router.push('/add_continuous_activity')
  	},

  	removeItem (continuousActivity){
  		axios.delete(`${this.continuousActivityUrl}${continuousActivity.id}/`).then( res =>{
  			this.getContinuousActivitysList();
  			this.$router.push({name:'Remove', params: {name: continuousActivity.name}})
        })
        .catch(error => {
          console.log(error);
        });
  	}
  },

  computed:{
  	...mapGetters({
  		continuousList:'getContinuousList',
  		usersList: 'getUsersList'
  	})
  },

  created(){

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.input-group--focused{
	color:#ADFF2F !important;
}

</style>
