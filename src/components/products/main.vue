<template>
  <v-layout>
    <v-flex xs12 sm10 offset-sm1 v-if="products">
      <v-card style="min-height: 680px">
        <v-toolbar class="blue-grey darken-3" dark>
          <v-btn icon color="blue darken-2" @click="addProduct">
            <v-icon color="white">add</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field label="Pesquisar produto..." class="blue--text mt-3" single-line  append-icon="search"></v-text-field>
        </v-toolbar>
        <v-list >
          <v-list-tile class="blue darken-2 mt-1" v-for="(product, index) in productsPerPage" :key="index" avatar @click="toProductPage(product.id)">
            <v-list-tile-content>
              <v-list-tile-title>{{ product.name | upperCase }}</v-list-tile-title>
            </v-list-tile-content>
            <v-spacer/>
            <v-list-tile-content>
              <v-list-tile-title style="text-align: right">
                Início: {{ product.started | localeDate }} | Fim: {{ product.started | localeDate }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
      <div class="text-xs-center">
        <v-pagination v-model="page" :length="pages"></v-pagination>
      </div>
    </v-flex>
    <v-dialog v-model="addProductModal" persistent max-width="680">
      <add-product @cancel="addProductModal = false"></add-product>
    </v-dialog>
  </v-layout>
</template>

<script>
import axios from 'axios'
import addProduct from './add-product'
import { mapGetters } from 'vuex'

export default {
  name: 'products',
  components: { addProduct },
  data () {
    return {
      addProductModal: false,
      page: 1
    }
  },
  methods: {
    addProduct () {
      this.addProductModal = true
    },
    toProductPage (id) {
      this.$router.push(`/product/${id}`)
    }
  },
  computed: {
    ...mapGetters({products: 'getProducts'}),
    pages () {
      return this.products.length > 10 ? Math.ceil(this.products.length / 10) : 0
    },
    productsPerPage () {
      const firstIndex = (this.page - 1) * 10
      const lastIndex = (this.page) * 10
      return this.products.slice(firstIndex, lastIndex)
    }
  },
  filters: {
    localeDate (value) {
      return value.split('-').reverse().join('/')
    },
    upperCase (value) {
      return value.toUpperCase()
    }
  },
  created () {
    if (this.$store.state.products === null) {
      this.$store.dispatch('GETPRODUCTS')
    }
  }
}
</script>

<style>

</style>
