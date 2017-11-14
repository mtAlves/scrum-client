<template>
  <v-layout>
    <v-flex xs12 sm8 offset-sm2>
      <v-card class="blue-grey darken-3 elevation-4">
        <v-card-title class="green black--text">
          {{continuousActivity.name.toUpperCase()}}
          <v-spacer></v-spacer>
          <v-btn floating small class="red lighten-2" @click.native="cancel">
            <v-icon light>cancel</v-icon>
          </v-btn>
          <v-btn floating small class="blue" @click.native="save">
            <v-icon light>save</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-layout row wrap>

              <v-flex xs10 offset-xs1>
                <v-text-field class="input-group--focused" dark label="Nome da atividade contínua" v-model="continuousActivity.name"></v-text-field>
              </v-flex>

              <v-flex xs12 sm5 offset-sm1 class="mr-1">
              <v-text-field v-if="continuousActivity.responsible" class="input-group--focused" disabled dark label="Responsável Atual" :value="nameById(continuousActivity.responsible)"></v-text-field>
              <v-text-field v-else class="input-group--focused" disabled dark label="Responsável Atual" value="Não informado"></v-text-field>
              </v-flex>

              <v-flex xs12 sm5>
                <v-select class="input-group--focused" label="Novo Responsável" autocomplete v-model="continuousActivity.responsible" :items="usersList" item-text="name"></v-select>
              </v-flex>

              <v-flex xs12 sm5 offset-sm1 class="mr-1">
                <v-text-field v-if="continuousActivity.type == 1" class="input-group--focused" disabled dark label="Tipo" value="Comitê"></v-text-field>
                <v-text-field v-if="continuousActivity.type == 2" class="input-group--focused" disabled dark label="Tipo" value="Reunião"></v-text-field>
                <v-text-field v-if="continuousActivity.type == 3" class="input-group--focused" disabled dark label="Tipo" value="Trabalho colaborativo"></v-text-field>                 
              </v-flex>

              <v-flex xs12 sm5>
                <v-select class="input-group--focused" label="Novo tipo" autocomplete v-model="temp.type" :items="types" item-value="type" item-text="value"></v-select>
              </v-flex>

              <v-flex xs12 sm5 offset-sm1>
                <v-menu lazy  :close-on-content-click="true"  v-model="menu_start"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
                  <v-text-field slot="activator" label="Data inicio" v-model="continuousActivity.started" prepend-icon="event" readonly ></v-text-field>
                  <v-date-picker locale="pt-BR" v-model="continuousActivity.started" no-title scrollable actions></v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex xs12 sm5>
                <v-menu lazy  :close-on-content-click="true"  v-model="menu_end"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
                  <v-text-field slot="activator" label="Data final" v-model="continuousActivity.ended" prepend-icon="event" readonly ></v-text-field>
                  <v-date-picker locale="pt-BR" v-model="continuousActivity.ended" no-title scrollable actions></v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex xs12>
                  <v-text-field box class="input-group--focused" multi-line label="Descrição" v-model="continuousActivity.description"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
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
      continuousActivityUrl: 'continuous-activity-list/',
      usersUrl: 'user-list/',
      continuousActivity: {
        description: "",
        ended: null,
        id: null,
        name: "",
        responsible: "",
        started: null,
        type: null
      },
      types: [
        {type: 1, value: "Comitê"},
        {type: 2, value: "Reunião"},
        {type: 3, value: "Trabalho colaborativo"}
      ],
      temp: {
        responsible:'',
        type: null
      },
      menu_start: false,
      menu_end: false,
    }
  },

  methods:{
    
    ...mapActions({
      getContinuous: 'GETCONTINUOUS'

    }),

    responsibleId () {
      this.temp.responsible = `${axios.defaults.baseURL}${this.usersUrl}${this.continuousActivity.responsible.id}/`;
    },

    cancel(){
      this.$router.push('/continuous_activitys')
    },

    save (){
      if(typeof(this.continuousActivity.responsible) === 'object') {

        this.responsibleId();
        this.continuousActivity.responsible = this.temp.responsible;
      
      };
      this.continuousActivity.type = this.temp.type;
      console.log(this.continuousActivity)
      let url = `${this.continuousActivityUrl}${this.continuousActivity.id}/`;
      axios.put(url, this.continuousActivity).then(res =>{
        this.getContinuous();
        this.$router.push('/continuous_activitys')
      });

    },

    getContinuousList(){
      let continuousActivity = this.continuousList.find( continuousActivity => continuousActivity.id == this.$route.params.id);
      this.continuousActivity = continuousActivity;
    },

    nameById (url) {
      let name = '';
      let id = url.split('/').reverse()[1];
      this.usersList.map( user => user.id == id ? name = user.name : null);
      return name;
    },

  },

  computed:{
    ...mapGetters({
      continuousList:'getContinuousList',
      usersList: 'getUsersList'
    })
  },

  created(){
    this.getContinuousList()
  }
}

</script>

<style scoped>

.input-group--focused{
  color:green !important;
}


</style>