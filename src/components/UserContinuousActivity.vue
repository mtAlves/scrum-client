<template>
  <v-flex xs12 >
    <v-card class="secondary ma-1 dark" v-for="item in continuousActivity" :key="item.id">
      <v-card-title>{{ item.name }}</v-card-title>
      <v-card-text>
				<v-icon>event</v-icon>
				{{ item.started.split('-').reverse().join('/')}}
				<div v-if="item.ended" style="display:inline;">
					<v-icon >event_available</v-icon>
					{{ item.ended.split('-').reverse().join('/')}}
				</div>
				<v-icon v-else>event_busy</v-icon>
      </v-card-text>
      <p class="user-continuous-activity"></p>
    </v-card>
    <div v-if="continuousActivity.length === 0">
      <v-flex xs12 class="mb-1" >
        <v-card class="secondary ma-1 dark" >
          <v-card-title>Nenhuma atividade contínua neste mês</v-card-title>
        </v-card >
      </v-flex>
    </div>
  </v-flex>
</template>
<script>
import axios from 'axios'

export default {
	name: 'UserContinuousActivity',
	props: ['continuousActivity'],
	data () {
		return {
			
		}
	}
}
</script>
<style scoped>
	.user-continuous-activity {
		min-width: 100% !important;
		border: 1px solid orange;
	}
</style>