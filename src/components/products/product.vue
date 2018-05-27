<template>
  <v-layout>
    <v-flex xs12 sm10 offset-sm1 v-if="productOwner">
      <v-card style="min-height: 680px">
        <v-toolbar class="blue-grey darken-3" dark>
          <v-toolbar-title>{{ product.name.toUpperCase() }}</v-toolbar-title>
          <v-btn icon color="yellow--text" @click="editProduct">
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn icon color="red--text" @click="deleteDialog = true">
            <v-icon>delete</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn icon color="red" @click="$router.go(-1)">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container fluid>
            <v-layout row wrap>

              <v-flex xs12>
                <v-text-field class="input-group--focused" label="Nome do Produto" v-model="product.name" required :readonly="!allowEdit"></v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-select
                  class="input-group--focused"
                  :items="users"
                  v-model="product.product_owner_id"
                  item-text="name"
                  item-value="id"
                  label="Product Owner"
                  autocomplete
                  :disabled="!allowEdit"
                ></v-select>
              </v-flex>

              <v-flex xs12 sm5 offset-sm1>
                <v-menu lazy :close-on-content-click="true" v-model="started" transition="scale-transition" offset-y full-width :nudge-left="40" max-width="290px" :disabled="!allowEdit">
                  <v-text-field slot="activator" class="input-group--focused" label="Data inicio" v-model="product.started" prepend-icon="event" readonly required ></v-text-field>
                  <v-date-picker locale="pt-BR" v-model="product.started" no-title scrollable actions></v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex xs12 sm5>
                <v-menu lazy :close-on-content-click="true" v-model="ended" transition="scale-transition" offset-y full-width :nudge-left="40" max-width="290px" :disabled="!allowEdit">
                  <v-text-field slot="activator" class="input-group--focused" label="Data final" v-model="product.ended" prepend-icon="event" readonly required></v-text-field>
                  <v-date-picker locale="pt-BR" v-model="product.ended" no-title scrollable actions></v-date-picker>
                </v-menu>
              </v-flex>

              <v-expansion-panel>
                <v-expansion-panel-content class="blue darken-2">
                  <div slot="header">Backlogs ({{ productBacklogs.length }})</div>
                  <v-card>
                    <v-card-text
                      v-for="(backlog, index) in backlogsByImportance"
                      :key="index"
                    >
                      <v-layout wrap>
                        <v-flex xs8>
                          <v-text-field
                            :color="colorByStatus(backlog.status)"
                            class="input-group--focused"
                            :label="`${index+1}. Backlog`"
                            v-model="backlog.name"
                            required :readonly="!allowEdit"></v-text-field>
                        </v-flex>

                        <v-flex xs2>
                          <v-select
                            :color="colorByStatus(backlog.status)"
                            class="input-group--focused"
                            label="Importância" 
                            v-model="backlog.importance"
                            :items="[1, 2, 3, 4, 5]" 
                            :disabled="!allowEdit" required></v-select>
                        </v-flex>

                        <v-flex xs2>
                          <v-select
                            :color="colorByStatus(backlog.status)"
                            class="input-group--focused"
                            label="Status" 
                            v-model="backlog.status"
                            :items="status" item-text="name" item-value="statusNumber"
                            :disabled="!allowEdit" required></v-select>
                        </v-flex>

                      </v-layout>
                    </v-card-text>
                    <v-btn icon class="blue darken-2" @click="addBacklogModal = true" v-show="!!allowEdit">
                      <v-icon>add</v-icon>
                    </v-btn>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>

            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions v-show="allowEdit">
          <v-spacer></v-spacer>
          <v-btn round class="blue" @click="saveProductAlterations">
            Confirmar Alterações
          </v-btn>
          <v-btn round class="red lighten-2" @click="cancelEdit">
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>

        <v-dialog v-model="addBacklogModal" persistent max-width="580">
          <modal-add-backlog @addBacklog="addBacklog" @close="addBacklogModal = false"></modal-add-backlog>
        </v-dialog>

        <v-dialog v-model="deleteDialog" persistent max-width="350">
          <v-card>
            <v-card-title class="headline red">Você desistiu do produto ?</v-card-title>
            <v-card-text>Tem certeza que quer deletar o Produto: <br>{{ product.name }}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" round @click.native="deleteProduct">Sim</v-btn>
              <v-btn color="red darken-1" round @click.native="deleteDialog = false">Não</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'
import modalAddBacklog from './modal-add-backlog'
import { mapGetters } from 'vuex'

export default {
  name: 'product_page',
  components: { modalAddBacklog },
  data () {
    return {
      page: 1,
      allowEdit: false,
      started: false,
      ended: false,
      product: null,
      oldProduct: null,
      productBacklogs: null,
      oldProductBacklogs: null,
      productOwner: null,
      deleteDialog: false,
      addBacklogModal:false,
      status: [
        { name: 'A Fazer', statusNumber: 1 },
        { name: 'Fazendo', statusNumber: 2 },
        { name: 'Feito', statusNumber: 3 },
        { name: 'Pendente', statusNumber: 4 }
      ]
    }
  },
  methods: {
    async deleteProduct () {
      try {
        await axios.delete(`/products/${this.product.id}`)
        this.$store.dispatch('GETPRODUCTS')
        this.$router.go(-1)
      } catch (error) {
        console.log(error)
      }
    },
    async saveProductAlterations () {
      await axios.put(`/products/${this.product.id}/`, this.product)
      this.$store.dispatch('GETPRODUCTS')
      this.productBacklogs.map(async backlog => {
        backlog.id
          ? await axios.put(`/products_backlog/${backlog.id}/`, backlog)
          : await axios.post('/products_backlog/', backlog)
      })
      this.allowEdit = false
    },
    editProduct () {
      this.oldProduct = {...this.product}
      this.allowEdit = true
    },
    cancelEdit () {
      this.product = this.oldProduct
      this.allowEdit = false
    },
    addBacklog (backlog) {
      const newBacklog = { ...backlog, product_id: this.product.id }
      this.productBacklogs.push(newBacklog)
      this.addBacklogModal = false
    },
    colorByStatus (status) {
      const colors = {1: 'yellow', 2: 'blue', 3: 'green', 4: 'red'}
      return colors[status]
    }
  },
  computed: {
    ...mapGetters({users: 'getUsers'}),
    backlogsByImportance () {
      return this.productBacklogs.sort((a, b) => a.importance < b.importance ? 1 : -1)
    }
  },
  async created () {
    const product = await axios.get(`/products/${this.$route.params.id}`)
    const productBacklogs = await axios.get(`/products_backlog/product_id/eq/${this.$route.params.id}`)
    const productOwner = await axios.get(`/users/${product.data.product_owner_id}`)
    this.product = product.data
    this.productBacklogs = productBacklogs.data
    this.productOwner = productOwner.data
  }
}
</script>

<style scoped>

</style>
