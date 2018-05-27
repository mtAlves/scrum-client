<template>
  <v-card>
    <v-card-title class="blue darken-2" style="font-size: 20px; padding: 10px;">
      Adicionar Backlog ao produto
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>

          <v-flex xs12>
            <v-text-field class="input-group--focused" label="Nome" v-model="backlog.name" required></v-text-field>
          </v-flex>

          <v-flex xs12 sm5 offset-sm1>
            <v-select class="input-group--focused" label="Importância" autocomplete v-model="backlog.importance" :items="[1, 2, 3, 4, 5]" required></v-select>
          </v-flex>

          <v-flex xs12 sm5>
            <v-select class="input-group--focused" label="Status" autocomplete v-model="backlog.status" :items="status" item-text="name" item-value="statusNumber" required></v-select>
          </v-flex>

        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn round class="blue" @click="addBacklog">
        Adicionar
      </v-btn>
      <v-btn round class="red lighten-2" @click="close">
        Cancelar
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'modal-add-backlog',
  data () {
    return {
      backlog: {
        name: null,
        importance: null,
        status: null
      },
      status: [
        { name: 'A Fazer', statusNumber: 1 },
        { name: 'Fazendo', statusNumber: 2 },
        { name: 'Feito', statusNumber: 3 },
        { name: 'Pendente', statusNumber: 4 }
      ]
    }
  },
  methods: {
    addBacklog () {
      this.$emit('addBacklog', this.backlog)
      this.clearField()
    },
    close () {
      this.$emit('close')
      this.clearField()
    },
    clearField () {
      this.backlog = {
        name: null,
        importance: null,
        status: null
      }
    }
  }
}
</script>
