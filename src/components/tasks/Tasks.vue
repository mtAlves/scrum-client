<template>

	<v-layout row wrap xs12>


		<card
		tabColor="yellow darken-2"
		name="A FAZER"
    :add="true"
		cardColor="yellow lighten-2"
		:tasks="todo"
		>
    </card>

		<card
		tabColor="blue"
		name="FAZENDO"
		cardColor="blue lighten-2"
		:tasks="doing"
		>
    </card>

		<card
		tabColor="green"
		name="FEITO"
		cardColor="green lighten-2"
		:tasks="done"
		>
      
    </card>

		<card
		tabColor="red"
		name="PENDENTE"
		cardColor="red lighten-2"
		:tasks="pending"
		>
      
    </card>

	</v-layout>
</template>

<script>
import card from './TaskCard'
import draggable from 'vuedraggable'
import { mapActions, mapGetters } from 'vuex'

export default {
	components:{
		card, draggable
	},
  data () {
    return {
    	todo: [],
    	doing: [],
    	done: [],
    	pending: []
    }
  },
  methods: {
  	teste() {console.log(this.todo, this.doing,this.done,this.pending)},
  	...mapActions({
  		getTasks: 'GETTASKS'
  	}),

  	getTodo(){  
  		setTimeout(()=>{
  		  this.getTasksList.map(task => task.status == 1 ? this.todo.push(task) : null)	
  		}, 200)
  	},
  	getDoing(){  
  		setTimeout(()=>{
  		  this.getTasksList.map(task => task.status == 2 ? this.doing.push(task) : null)	
  		}, 200)
  	},
  	getDone(){  
  		setTimeout(()=>{
  		  this.getTasksList.map(task => task.status == 4 ? this.done.push(task) : null)	
  		}, 200)
  	},
  	getPending(){  
  		setTimeout(()=>{
  		  this.getTasksList.map(task => task.status == 3 ? this.pending.push(task) : null)	
  		}, 200)
  	},
  },

  computed: {
  	...mapGetters([
  		'getTasksList'
  	])
  },

  created(){
  	this.getTasks(),
  	this.getTodo(), this.getDoing(), this.getDone(), this.getPending()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
