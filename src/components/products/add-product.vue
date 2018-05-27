<template>
  <v-card >
    <v-card-title class="blue darken-2" style="font-size: 20px; padding: 10px;">
      Novo Produto
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>

          <v-flex xs12>
            <v-text-field class="input-group--focused" label="Nome do Produto" v-model="product.name" required></v-text-field>
          </v-flex>

          <v-flex xs12>
            <v-select class="input-group--focused" label="Product Owner" autocomplete v-model="product.product_owner_id" :items="users" item-text="name" item-value="id" required></v-select>
          </v-flex>

          <v-flex xs12 sm5 offset-sm1>
            <v-menu lazy  :close-on-content-click="true"  v-model="started"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
              <v-text-field slot="activator" label="Data inicio" v-model="product.started" prepend-icon="event" readonly required ></v-text-field>
              <v-date-picker locale="pt-BR" v-model="product.started" no-title scrollable actions></v-date-picker>
            </v-menu>
          </v-flex>

          <v-flex xs12 sm5>
            <v-menu lazy  :close-on-content-click="true"  v-model="ended"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
              <v-text-field slot="activator" label="Data final" v-model="product.ended" prepend-icon="event" readonly required></v-text-field>
              <v-date-picker locale="pt-BR" v-model="product.ended" no-title scrollable actions></v-date-picker>
            </v-menu>
          </v-flex>
          
          <v-flex xs12 sm2>
            <v-btn icon color="blue darken-2" @click="addBacklogModal = true">
              <v-icon>add</v-icon>
            </v-btn>
          </v-flex>

          <v-dialog v-model="addBacklogModal" persistent max-width="580">
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
                <v-btn round class="red lighten-2" @click="addBacklogModal = false">
                  Cancelar
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card> 
          </v-dialog>

          <v-flex xs12 sm10>
            <v-expansion-panel>
              <v-expansion-panel-content class="blue darken-2">
                <div slot="header">Backlogs ({{ backlogs.length }})</div>

                <v-card>
                  <v-data-table :headers="backlogHeaders" :items="backlogs" rows-per-page-text="Backlogs por página:">

                    <template slot="items" slot-scope="props">
                      <td class="text-xs-left">{{ props.item.name }}</td>
                      <td class="text-xs-center">{{ props.item.importance }}</td>
                      <td class="text-xs-center">{{ props.item.status }}</td>
                    </template>

                    <template slot="no-data">
                      <v-alert :value="true" color="error" icon="warning">
                        Nenhum backlog ainda, adicione alguns.
                      </v-alert>
                    </template>

                    <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                      From {{ pageStart }} to {{ pageStop }}
                    </template>

                  </v-data-table>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-flex>

        </v-layout>
      </v-container>
      <small>*Campos requeridos</small>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn round class="blue" @click="create">
        Confirmar
      </v-btn>
      <v-btn round class="red lighten-2" @click="cancel">
        Cancelar
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  name: 'add-product',
  data () {
    return {
      pagination: {},
      product: {
        name: '',
        product_owner_id: null,
        started: '',
        ended: ''
      },
      backlog: {},
      status: [
        { name: 'A Fazer', statusNumber: 1 },
        { name: 'Fazendo', statusNumber: 2 },
        { name: 'Feito', statusNumber: 3 },
        { name: 'Pendente', statusNumber: 4 }
      ],
      backlogHeaders: [
        { text: 'Nome', align: 'left', sortable: false, value: 'name' },
        { text: 'Importância', align: 'center', sortable: false, value: 'importance' },
        { text: 'Status', align: 'center', sortable: false, value: 'status' }
      ],
      backlogs: [],
      addBacklogModal: false,
      started: false,
      ended: false
    }
  },
  methods: {
    addBacklog () {
      const backlog = {...this.backlog}
      this.backlogs.push(backlog)
      this.backlog = { name:'', importance: null, status: null }
      this.addBacklogModal = false
    },
    async create () {
      try {
        const product = await axios.post('/products', this.product)
        this.backlogs.map(async backlog => {
          backlog.product_id = product.data.id
          await axios.post('/products_backlog', backlog)
        })
        this.$store.dispatch('GETPRODUCTS')
        this.clearProductFields()
        this.$emit('cancel')
      } catch (error) {
        console.log(error)
      }
    },
    cancel () {
      this.$emit('cancel')
    },
    clearProductFields (){
      this.product = {
        name: '',
        product_owner_id: null,
        started: '',
        ended: ''
      }
    }
  },
  computed: {
    ...mapGetters({users: 'getUsers'})
  }
}
</script>