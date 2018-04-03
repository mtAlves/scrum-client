<template>
    <v-layout row wrap>
      <v-flex>
        <v-expansion-panel popout>
          <v-expansion-panel-content v-for="(user,i) in users" :key="i">
            <div slot="header">{{ user.name.toUpperCase() }}</div>
            <v-card>
						  <v-tabs centered :scrollable="false" mobile-break-point="1000">
						    <v-tabs-bar dark color="cyan">
						      <v-tabs-slider color="yellow"></v-tabs-slider>
						      <v-tabs-item v-for="month in months" :key="month.name" :href="month.name">
						        {{ month.name }}
						      </v-tabs-item>
						    </v-tabs-bar>

						    <v-tabs-items>
						      <v-tabs-content v-for="month in months" :key="month.name" :id="month.name">
                    <v-expansion-panel inset class="blue-grey darken-3">
                      <v-expansion-panel-content class="blue-grey darken-4">
                        <div slot="header" class="green--text">Tarefas</div>
                        <v-card flat>
                          <v-layout row wrap xs12>

  <user-tasks tabColor="yellow darken-2" name="A fazer" :tasks="filterTasks(user.id, month.monthId, '1')"/>

  <user-tasks tabColor="blue" name="Fazendo" :tasks="filterTasks(user.id, month.monthId, '2')"/>

  <user-tasks tabColor="green" name="Feito" :tasks="filterTasks(user.id, month.monthId, '4')"/>

  <user-tasks tabColor="red" name="Pendente" :tasks="filterTasks(user.id, month.monthId, '3')"/>

                          </v-layout>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>

                    <v-expansion-panel inset class="blue-grey darken-3">
                      <v-expansion-panel-content class="blue-grey darken-4">
                        <div slot="header" class="orange--text">Atividades contínuas</div>
                        <v-card flat>
                          <v-layout row wrap xs12>
                            <user-continuous-activity :continuousActivity="filterContinuousActivity(user.id, month.monthId)"/>
                          </v-layout>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>

						      </v-tabs-content>
						    </v-tabs-items>
						  </v-tabs>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
</template>

<script>
import UserContinuousActivity from './UserContinuousActivity'
import UserTasks from './UserTasks'

import axios from 'axios'
  export default {
  	name: 'usuarios',
  	components: { UserContinuousActivity, UserTasks },
    data () {
      return {
        continuousActivity: [],
      	users: [],
      	months:[
	      	{ name: 'JAN', monthId: '01' },
	      	{ name: 'FEV', monthId: '02' },
	      	{ name: 'MAR', monthId: '03' },
	      	{ name: 'ABR', monthId: '04' },
	      	{ name: 'MAI', monthId: '05' },
	      	{ name: 'JUN', monthId: '06' },
	      	{ name: 'JUL', monthId: '07' },
	      	{ name: 'AGO', monthId: '08' },
	      	{ name: 'SET', monthId: '09' },
	      	{ name: 'OUT', monthId: '10' },
	      	{ name: 'NOV', monthId: '11' }, 
	      	{ name: 'DEZ', monthId: '12' }
      	],
      	tasks: [],
      	text: 'hahahsh',
      }
    },
    methods: {
      filterContinuousActivity (user, month) {
        const continuousActivity = this.continuousActivity.filter(ca => 
          user === this.findUserId(ca.responsible) &&
          month === this.findMonthId(ca.started)
        )
        return continuousActivity
      },
    	filterTasks (user, month, status) {
				const tasks = this.tasks.filter(t => 
					user === this.findUserId(t.responsible) && 
					status === t.status && 
					month === this.findMonthId(t.started)
				)
				return tasks
    	},
    	findMonthId (date) {
    		if (date){
    			return date.split('-')[1]
    		}
    		return false
    	},
    	findUserId (user) {
    		if (user) {
    		  return parseInt(user.split('/').reverse()[1])
    		}
    		return false
    	},
      getContinuousActivity () {
        axios.get('continuous-activity-list/').then(res => this.continuousActivity = res.data)
      },
    	getUsers () {
    		axios.get('user-list/').then(res => {
    			this.users = res.data
					this.users.sort((a, b) =>  a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1 )
    		})
    	},
    	getTasks () {
    		axios.get('task-list/').then(res => this.tasks = res.data)
    	}
    },
    created () {
    	this.getUsers()
    	this.getTasks()
      this.getContinuousActivity()
    }
  }
</script>

<style scoped>
	
</style>