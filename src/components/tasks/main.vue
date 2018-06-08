<template>
  <v-layout row wrap xs12 v-if="$store.state.tasks">

    <task-card
      tabColor="yellow"
      name="A fazer"
      :status="1">
    </task-card>

    <task-card
      tabColor="blue"
      name="Fazendo"
      :status="2">
    </task-card>

    <task-card
      tabColor="green"
      name="Feito"
      :status="3">
    </task-card>

    <task-card
      tabColor="red"
      name="Pendente"
      :status="4">
    </task-card>

  </v-layout>
</template>

<script>
import taskCard from './task-card'

export default {
  name: 'task',
  components: { taskCard },
  created () {
    this.$store.dispatch('GETTASKS')
  }
}
</script>
