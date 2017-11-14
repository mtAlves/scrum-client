<template>
      <v-parallax class="background" src="../../static/KanbanBoard.png">
        <v-layout column align-center justify-center>
          <h1 class="white--text"></h1>
          <h4 class="blue-grey--text">Visualize seus projetos, tarefas etc!<br><h6> Versão 1.0 </h6></h4>
        </v-layout>
      </v-parallax>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  data () {
    return {
      
    }
  },

  methods: {
    ...mapActions({
      getProjects:'GETPROJECTS',
      getContinuous: 'GETCONTINUOUS',
      getImpediments: 'GETIMPEDIMENTS',
      getUsers: 'GETUSERS',
      getSprints: 'GETSPRINTS',
      getTasks: 'GETTASKS'

    })

  },

  created() {
  	this.getProjects(),
    this.getContinuous(),
    this.getImpediments(),
    this.getUsers(),
    this.getSprints(),
    this.getTasks()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .background {
    min-height: 100%;
    width: 1600px;
    margin: auto;
  }
</style>
